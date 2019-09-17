<template>
  <div class="project">
    <el-row class="project-nav">
      <el-col :span="18">
        <div class="title-font">{{$t('project.projectList')}}
          <!-- <el-tooltip effect="dark" :content="$t('source.dataSourceDescribe')" placement="right">
            <i class="icon-alert_1"></i>
          </el-tooltip> -->
          <!-- <span>{{$t('source.dataSourceDescribe')}}</span> -->
        </div>
      </el-col>
      <el-col :span="6">
        <!-- <div class="project-nav-close" @click="close()">
          {{$t('dict.closeManagement')}}
          <i class="icon-close"></i>
        </div> -->
      </el-col>
    </el-row>
    <el-row class="project-header">
      <el-col :span="18">
        <el-button type="primary" @click="handlePush(0)" plain icon="icon-add">{{$t('project.project')}}</el-button>
      </el-col>
      <el-col :span="6">
        <el-input :placeholder="$t('source.inputName')" v-model="search" prefix-icon="el-icon-search">
        </el-input>
      </el-col>
    </el-row>
    <el-row class="project-cont">
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
    <el-row class="project-footer">
      <el-col :span="24">
        <el-pagination @current-change="pageNumberChange" :current-page="page" :page-sizes="[10]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="this.listData.totalRow">
        </el-pagination>
      </el-col>
    </el-row>
    <el-dialog :is-dragable="this.$global.dialogDragable" :append-to-body="true" :title="isEdit === '0' ? $t('project.createProject') : $t('project.editProject')" :visible.sync="modalVisible" width="660px">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" :key="modalVisible">
        <el-form-item :label="$t('source.name')" prop="name">
          <el-input v-model="ruleForm.name" :placeholder="$t('source.name')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('project.describe')" prop="describe">
          <el-input v-model="ruleForm.desc" type="textarea" :rows="2" :placeholder="$t('project.describe')"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancleModal()">{{$t('source.cancle')}}</el-button>
        <el-button type="primary" @click="confirmModal()">{{$t('source.confirm')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>