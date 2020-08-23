<template>
  <div class="dict">
    <el-row class="dict-cont" v-loading="fullscreenLoading">
      <el-col :span="4" class="dict-cont-left">
        <div class="dict-cont-left-btn flex-row">
          <div class="dict-cont-left-btn-title title-font">{{$t('home.dataSource')}}</div>
          <div class="dict-cont-left-btn-icon flex-row">
            <el-tooltip effect="dark" :content="$t('dict.tableSearch')" placement="top">
              <div class="dict-cont-left-btn-icon-bg" :style="{background :isShowBox ? '#e5e5e5' : '',color: isShowBox ? '#7f7f7f' : '',marginRight:'5px' }">
                <i class="icon-search" @click="() => { this.isShowBox = !this.isShowBox;}"></i>
              </div>
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('source.sourceManagement')" placement="top">
              <div class="dict-cont-left-btn-icon-bg" :style="{background :isShowSourceTable ? '#e5e5e5' : '',color: isShowSourceTable ? '#7f7f7f' : '' }">
                <i class="icon-setting" @click="() => { this.isShowSourceTable = !this.isShowSourceTable; this.columnDiffShow = false}"></i>
              </div>
            </el-tooltip>
          </div>
        </div>
        <div class="dict-cont-left-list" v-show="!isShowSourceTable">
          <div class="dict-cont-left-list-search" v-if="dataSourceInner.length > 0">
            <el-input :placeholder="$t('source.searchSource1')" v-model="filterInnerText" prefix-icon="el-icon-search"> </el-input>
          </div>
          <div class="dict-cont-left-list-empty" v-if="dataSourceInner.length === 0">
            <i class="icon-sample"></i>
            <p>{{$t('migration.noData')}}</p>
          </div>
          <div class="dict-cont-left-list-tree">
            <el-tree node-key="uuid" v-if="dataSourceInner.length > 0 && !isAddTable" :data="dataSourceInner" :props="treeProps" :default-expanded-keys="innerExpandedKeys" :render-content="renderContent" ref="sourceInnerTree"  :filter-node-method="filterNode" @node-click="clickInnerNode">
            </el-tree>
          </div>
        </div>
      </el-col>
      <el-col :span="20" class="dict-cont-right">
        <div class="dict-cont-right-header flex-row">
          <span v-if="selectedTableName.length">{{$t('dict.tableName')}}：{{ ' ' + selectedTableName}}</span>
        </div>
        <div class="dict-cont-right-table">
          <el-tabs v-model="activeName" @tab-click="tabClick">
            <el-tab-pane :label="$t('source.column')" name="table" style="padding:0 20px 20px 20px;">
              <el-row style="width:100%;margin-bottom:15px;">
                <el-col :span="18" style="padding-top: 8px;padding-right: 10px;">
                  <div v-show="this.selectedNode.changed">
                    <div class="column-diff-intro-title">
                      {{$t('dict.updatedColumn')}}
                    </div>
                    <div class="column-diff-intro-color change-diff">
                    </div>
                    <div class="column-diff-intro-title">
                      {{$t('dict.deletedColumn')}}
                    </div>
                    <div class="column-diff-intro-color delete-column">
                    </div>
                  </div>
                </el-col>
                <el-col :span="6">
                  <el-input :placeholder="$t('source.pleaseInput') +  $t('map.columnName')" v-model="tableText" prefix-icon="el-icon-search">
                  </el-input>
                </el-col>
              </el-row>
              <el-table v-if="activeName === 'table' && !columnDiffShow" :data="tableListSearch" style="width: 100%" border max-height="500" :empty-text="$t('home.noData')" :row-class-name="getRowClass" :cell-class-name="getCellClass" @expand-change="(row) => expandChange(row)">
                <el-table-column type="expand">
                  <template slot-scope="scope">
                    <div class="column-map">
                      <div class="column-map-cont" :id="scope.row.id + 'column-map'" :style="{transform: `scale(${scope.row.rate})`, transformOrigin: '50% 50%'}">
                        <component :is="mapTable" :id="item.key + ''" :diffType="scope.row.diffType" :style="{left : item.left,top : item.top}" :table="item" v-for="(item) in scope.row.dataTableList" :key="item.key"></component>
                      </div>
                      <div class="action-op flex-column">
                        <i @click="handleLarge(scope.row)" class="action-op-large icon-enlarge"></i>
                        <i @click="handleSmall(scope.row)" class="action-op-small icon-shrink"></i>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column :prop="item.field" :label="item.title" v-for="(item,index) in tableColumns" :key="index" align="left" :width="item.width">
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane :label="$t('source.extend')" name="extend" style="padding:0 20px 20px 20px;">
              <extendInfo :properties="tableInfo.properties"></extendInfo>
            </el-tab-pane>
            <el-tab-pane :label="$t('home.dataMap')" name="tableMap" style="padding:0 20px 20px 20px;">
              <div class="table-total" v-if="activeName === 'tableMap'">
                <div class="table-map" id="table-map" :style="{transform: `scale(${tableLineage.rate})`, transformOrigin: '50% 50%'}">
                  <div v-if="tableLineage.dataTableList.length === 0" class="blank flex-column">
                    <i class="icon-sample"></i>
                    <p>{{$t('map.noRelation')}}</p>
                  </div>
                  <component :is="tableMap" :id="item.key + ''" :style="{left : item.left,top : item.top}" :table="item" v-for="(item) in tableLineage.dataTableList" :key="item.key"></component>
                </div>
                <div class="table-op flex-column">
                  <i @click="handleLarge(tableLineage)" class="table-op-large icon-enlarge"></i>
                  <i @click="handleSmall(tableLineage)" class="table-op-small icon-shrink"></i>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
          <el-button class="dict-cont-right-table-sync" type="primary" plain v-if="selectedTableName.length > 0 && this.selectedNode.changed" @click="showSyncTable">{{$t('dict.dataSyncCompare')}}</el-button>
          <el-button class="dict-cont-right-table-unload" plain v-if="selectedTableName.length > 0" @click="deleteTable">{{$t('dict.unload')}} </el-button>
        </div>
        <transition :name="!isBoxDismiss ? 'slide' : 'el-fade-in-linear'">
          <div class="dict-cont-right-box flex-row" v-show="isShowBox">
            <div class="dict-cont-right-box-op flex-row" @click="isShowBox = false">
              {{$t('dict.closeSearch')}}
              <i class="icon-close"></i>
            </div>
            <el-select v-model="boxSearchText" clearable style="width:100%;" value-key="id" filterable remote :remote-method="remoteMethod" :loading="searchLoading" :placeholder="$t('dict.tableSearch')" @change="handleAutoSelect">
              <el-option-group v-for="group in searchResult" :key="group.label" :label="group.label">
                <el-option v-for="item in group.options" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-option-group>
            </el-select>
          </div>
        </transition>
        <transition name="slide">
          <div class="changed" v-if="isShowSourceTable">
            <el-tabs v-model="syncTabModal">
              <el-tab-pane :label="$t('home.dataSourceManagement')" name="one">
                <dataSource @close="isShowSourceTable = false" @update="handleSourceUpdate()"></dataSource>
              </el-tab-pane>
              <el-tab-pane :label="$t('dict.dataTableManagement')" name="two">
                <el-row style="height:500px;overflow: auto;margin-top:20px;">
                  <el-col :span="24" style="height:100%;overflow: auto;width:400px;margin-left:10px;">
                    <div class="steps-content-card-body-left" style="height:100%;padding: 10px;border: 1px solid #ccc;">
                      <el-input :placeholder="$t('map.filter') +  $t('map.data')" v-model="filterText" prefix-icon="el-icon-search">
                      </el-input>
                      <div style="width:100%;height:35px;padding-top:10px;">
                        <el-checkbox v-model="allSelected">{{$t('dict.seletedAll')}}</el-checkbox>
                        <el-checkbox v-show="selectedTableNode.length > 0" v-model="inverseSelected">{{$t('dict.selectInvert')}}</el-checkbox>
                        <el-checkbox v-model="onlyShowChange">{{$t('dict.onlyShowChange')}}</el-checkbox>
                      </div>
                      <div class="steps-content-card-body-left-tree">
                        <el-tree node-key="uuid" v-if="extDataSource.length > 0" :props="treeProps" :data="extDataSource" show-checkbox :default-expanded-keys="extExpandedKeys"  :render-content="renderContent" ref="sourceTree" :filter-node-method="filterNode" @check-change="extCheckChange">
                        </el-tree>
                      </div>
                    </div>
                  </el-col>
                </el-row>
                <el-row style="width:400px;margin-left:10px;margin-top:10px;">
                  <el-col :offset="8" :span="16">
                    <el-button type="primary" @click="syncTables(true)">{{$t('dict.onlyShowChange') + $t('dict.sync')}}</el-button>
                    <el-button @click="handleTable(false)">{{$t('source.cancle')}}</el-button>
                    <el-button type="primary" :disabled="selectedTableNode.length <= 0" @click="handleTable(true)">{{$t('source.confirm')}}</el-button>
                  </el-col>
                </el-row>
              </el-tab-pane>
              <el-tab-pane :label="$t('dict.tableChangedManagement')" name="three">
                <div style="padding:10px;">
                  <el-table :data="listData.list" style="width: 100%;margin-top:10px;" border max-height="500" :empty-text="$t('home.noData')" :row-class-name="getRowClass" :cell-class-name="getCellDiffClass">
                    <el-table-column :prop="item.field" :label="item.title" v-for="(item,index) in syncHistoryColumn" :key="index" align="left" :width="item.width">
                    </el-table-column>
                  </el-table>
                </div>
                <el-row class="task-footer">
                  <el-col :span="24" style="text-align: center; margin-top: 20px;">
                    <el-pagination @current-change="pageNumberChange" :current-page="page" :page-sizes="[10]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="this.listData.totalRow">
                    </el-pagination>
                  </el-col>
                </el-row>
              </el-tab-pane>
            </el-tabs>
          </div>
        </transition>
        <transition name="slide">
          <div class="column-diff" v-if="columnDiffShow">
            $t('aaa')
            <div class="column-diff-head">
              <div class="column-diff-head-name">{{$t('dict.tableName')}}：{{ ' ' + selectedTableName}}</div>
              <div class="column-diff-head-time">{{$t('dict.lastUpdateTime')}}：2019-05-20 15:03:28 GMT+8</div>
              <div class="column-diff-head-close" @click="columnDiffShow = false">
                {{$t('dict.closeSync')}}
                <i class="icon-close"></i>
              </div>
            </div>
            <div class="column-diff-intro">
              <div class="column-diff-intro-title">
                {{$t('dict.updatedColumn')}}
              </div>
              <div class="column-diff-intro-color change-diff">
              </div>

              <div class="column-diff-intro-title">
                {{$t('dict.addColumn')}}
              </div>
              <div class="column-diff-intro-color add-column">
              </div>

              <div class="column-diff-intro-title">
                {{$t('dict.deletedColumn')}}
              </div>
              <div class="column-diff-intro-color delete-column">
              </div>
            </div>
            <el-row class="column-diff-one" :gutter="20" v-if="columnDiffStep === 0">
              <el-col :span="12">
                <span>{{$t('dict.syncBefore')}}</span>
                <el-table :data="getCurrentColumns" style="width: 100%;margin-top:10px;" border max-height="500" :empty-text="$t('home.noData')" :row-class-name="getRowClass" :cell-class-name="getCellDiffClass">
                  <el-table-column :prop="item.field" :label="item.title" v-for="(item,index) in tableColumns" :key="index" align="left" :width="item.width">
                  </el-table-column>
                </el-table>
              </el-col>
              <el-col :span="12">
                <span>{{$t('dict.syncAfter')}}</span>
                <el-table :data="getOriginColumns" style="width: 100%;margin-top:10px;" border max-height="500" :empty-text="$t('home.noData')" :row-class-name="getRowClass" :cell-class-name="getCellDiffClass">
                  <el-table-column :prop="item.field" :label="item.title" v-for="(item,index) in tableColumns" :key="index" align="left" :width="item.width">
                  </el-table-column>
                </el-table>
              </el-col>
            </el-row>
            <!-- <el-row class="column-diff-two" v-if="columnDiffStep === 1">
              <el-table :data="getCurrentColumns" style="width: 100%" border max-height="500" :empty-text="$t('home.noData')" :row-class-name="getRowClass" :cell-class-name="getCellClass" @expand-change="(row) => expandChange(row)">
                <el-table-column type="expand">
                  <template slot-scope="scope">
                    <div class="column-map">
                      <div class="column-map-cont" :id="scope.row.id  + 'column-map'" :style="{transform: `scale(${scope.row.rate})`, transformOrigin: '50% 50%'}">
                        <component :is="mapTable" :id="item.key + ''" :diffType="scope.row.diffType" :style="{left : item.left,top : item.top}" :table="item" v-for="(item) in scope.row.dataTableList" :key="item.key"></component>
                      </div>
                      <div class="action-op flex-column">
                        <i @click="handleLarge(scope.row)" class="action-op-large icon-enlarge"></i>
                        <i @click="handleSmall(scope.row)" class="action-op-small icon-shrink"></i>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column :prop="item.field" :label="item.title" v-for="(item,index) in tableColumns" :key="index" align="left" :width="item.width">
                </el-table-column>
              </el-table>
            </el-row>
            <div class="column-diff-footer flex-row">
              <el-button class="steps-footer-up" type="default" @click="columnDiffShow = false">{{$t('dict.cancle')}}</el-button>
              <el-button class="steps-footer-next" type="primary" @click="columnDiffStep = 1" v-show="this.columnDiffStep === 0"> {{ $t('dict.next') }}</el-button>
              <el-button class="steps-footer-next" type="primary" @click="columnDiffStep = 0" v-show="this.columnDiffStep === 1"> {{ $t('dict.up')}}</el-button>
              <el-button class="steps-footer-next" type="primary" :loading="syncLoad" @click="syncTable" v-show="this.columnDiffStep === 1"> {{ $t('dict.sync') }}</el-button>
            </div> -->
          </div>
        </transition>
      </el-col>
    </el-row>
    <el-dialog :title="$t('dict.syncDataSource') + '：' + selectedSourceName" :visible.sync="modalVisible" width="660px">
      <el-row style="height:500px;overflow: auto;">
        <el-col :span="24" style="height:100%;overflow: auto;">
          <div class="steps-content-card-body-left" style="height:100%;">
            <el-input :placeholder="$t('map.filter') +  $t('map.data')" v-model="filterText" prefix-icon="el-icon-search">
            </el-input>
            <div style="width:100%;height:35px;padding-top:10px;">
              <el-checkbox v-model="allSelected">{{$t('dict.seletedAll')}}</el-checkbox>
              <el-checkbox v-show="selectedTableNode.length > 0" v-model="inverseSelected">{{$t('dict.selectInvert')}}</el-checkbox>
              <!-- <el-checkbox v-model="onlyShowChange">{{$t('dict.onlyShowChange')}}</el-checkbox> -->
            </div>
            <div class="steps-content-card-body-left-tree">
              <el-tree node-key="uuid" v-if="dataSourceList.length > 0" :props="treeProps" :data="dataSourceList" show-checkbox :default-expanded-keys="extExpandedKeys"  :render-content="renderContent" ref="sourceTree" :filter-node-method="filterNode" @check-change="extCheckChange">
              </el-tree>
            </div>
          </div>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleTable(false)">{{$t('source.cancle')}}</el-button>
        <el-button type="primary" @click="handleTable(true)">{{$t('source.confirm')}}</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="$t('dict.syncResult')" :is-dragable="this.$global.dialogDragable" :visible.sync="syncResultVisible" width="440x" :close-on-click-modal="false" @close="handleClose()">
      <el-alert :title="syncResult === 0 ? $t('dict.syncSuccess') : $t('dict.syncFail')  " :type="syncResult === 0 ? 'success' : 'error'" :closable="false" show-icon>
      </el-alert>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" plain @click="handleClose()">{{$t('dict.confirm')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
