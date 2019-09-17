<template>
  <div class="total">
    <el-row class="total-nav">
      <el-col :span="18">
        <div class="title-font">{{$t('home.dataSourceManagement')}}
          <el-tooltip effect="dark" :content="$t('source.dataSourceDescribe')" placement="right">
            <i class="icon-alert_1"></i>
          </el-tooltip>
          <!-- <span>{{$t('source.dataSourceDescribe')}}</span> -->
        </div>
      </el-col>
      <el-col :span="6">
        <div class="total-nav-close" @click="close()">
          {{$t('dict.closeManagement')}}
          <i class="icon-close"></i>
        </div>
      </el-col>
    </el-row>
    <el-row class="total-header">
      <el-col :span="18">
        <el-button type="primary" @click="handlePush(0)" plain><i class="icon-add_data_source" style="margin-right:8px;"></i>{{$t('source.createDataSource')}}</el-button>
      </el-col>
      <el-col :span="6">
        <!-- <el-input :placeholder="$t('source.inputName')" v-model="search" prefix-icon="el-icon-search">
        </el-input> -->
      </el-col>
    </el-row>
    <el-row class="total-cont">
      <el-col :span="24">
        <el-table :data="listData.list" style="width: 100%" border max-height="600">
          <el-table-column :prop="item.field" :label="item.title" v-for="(item,index) in columns" :key="index" align="left" :width="item.width">
          </el-table-column>
          <el-table-column :label="$t('source.action')" width="200" align="left">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" :content="$t('source.edit')" placement="top">
                <i class="el-icon-edit" @click="handlePush(2,scope.$index)"></i>
                <!-- <el-button type="success" size="small" icon="el-icon-edit" @click="handlePush(2,scope.$index)" circle></el-button> -->
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="$t('source.delete')" placement="top">
                <i class="icon-table_delete" @click="handlePush(1,scope.$index)"></i>
                <!-- <el-button type="danger" size="small" icon="el-icon-delete"  @click="handlePush(1,scope.$index)" circle></el-button> -->
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row class="total-footer">
      <el-col :span="24">
        <el-pagination @current-change="pageNumberChange" :current-page="page" :page-sizes="[10]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="this.listData.totalRow">
        </el-pagination>
      </el-col>
    </el-row>
    <el-dialog :is-dragable="this.$global.dialogDragable" :append-to-body="true" :title="isEdit === '0' ? $t('dict.createDataSource') : $t('source.edit')" :visible.sync="modalVisible" width="660px">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" :key="modalVisible">
        <el-form-item :label="$t('source.name')" prop="name">
          <el-input v-model="ruleForm.name" :placeholder="$t('source.inputName')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('source.type')" prop="type">
          <el-select v-model="ruleForm.type" :placeholder="$t('source.type')" style="width:100%;" @change="() => { this.testErrorInfo = '' }">
            <el-option label="mysql" value="mysql"></el-option>
            <el-option label="kyligence" value="kyligence"></el-option>
            <el-option label="csv" value="csv"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('source.hiveSource')" prop="parameter_ext" v-if="ruleForm.type === 'kyligence'">
          <el-select v-model="ruleForm.parameter_ext" placeholder="" style="width:100%;">
            <el-option :label="item.name" :value="item.id" v-for="(item,index) in hiveList" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('source.parameter')" prop="parameter">
          <span slot="label" class="slot-parameter">{{$t('source.parameter')}}
            <el-tooltip effect="dark" v-show="placeholderParameter[ruleForm.type]" :content="placeholderParameter[ruleForm.type]" placement="right">
              <i class="icon-alert_1"></i>
            </el-tooltip>
          </span>
          <el-input v-model="ruleForm.parameter" :placeholder="placeholderParameter[ruleForm.type]"></el-input>
        </el-form-item>
        <el-form-item :label="$t('source.username')" prop="username" v-show="ruleForm.type === ''|| ruleForm.type === 'mysql' || ruleForm.type === 'kyligence'">
          <el-input v-model="ruleForm.username"></el-input>
        </el-form-item>
        <el-form-item :label="$t('source.password')" prop="password" v-show="ruleForm.type === ''|| ruleForm.type === 'mysql' || ruleForm.type === 'kyligence'">
          <el-input v-model="ruleForm.password"></el-input>
        </el-form-item>
      </el-form>
      <div class="link">
        <el-button :type="canTest ? '' : 'primary'" :disabled="canTest" :loading="testLoading" @click="handleLinkTest">{{$t('source.linkTest')}}</el-button>
        <div class="link-cont flex-row" v-if="testErrorInfo !== ''">
          <i class="icon-error_01"></i>
          <div class="link-cont-right">
            <div class="link-cont-right-title">{{$t('source.testError')}}</div>
            <div class="link-cont-right-info">{{testErrorInfo}}</div>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancleModal()">{{$t('source.cancle')}}</el-button>
        <el-button type="primary" @click="confirmModal()">{{$t('source.confirm')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
