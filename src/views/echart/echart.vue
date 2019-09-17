<template>
  <div class="dashboard">
    <div class="dashboard-head flex-row">
      <div class="dashboard-head-item" @click="handlePush(0)">
        <div class="dashboard-head-item-top">{{$t('home.task')}}</div>
        <div class="dashboard-head-item-bottom">{{metricsMap.action}} </div>
      </div>
      <div class="dashboard-head-item" @click="handlePush(1)">
        <div class="dashboard-head-item-top">{{$t('home.workFlow')}}</div>
        <div class="dashboard-head-item-bottom">{{metricsMap.workflow}}</div>
      </div>
      <div class="dashboard-head-item" @click="handlePush(2)">
        <div class="dashboard-head-item-top">{{$t('home.dataSource')}}</div>
        <div class="dashboard-head-item-bottom">{{metricsMap.source}}</div>
      </div>
      <div class="dashboard-head-item" @click="handlePush(3)">
        <div class="dashboard-head-item-top">{{$t('home.dataTable')}}</div>
        <div class="dashboard-head-item-bottom">{{metricsMap.table}}</div>
      </div>
      <div class="dashboard-head-item" @click="handlePush(4)">
        <div class="dashboard-head-item-top">{{$t('home.dataModel')}}</div>
        <div class="dashboard-head-item-bottom">{{metricsMap.model}}</div>
      </div>
    </div>
    <div class="dashboard-line"></div>
    <div class="dashboard-time">
      <span>{{$t('home.date')}}</span>
      <el-date-picker style="margin-left:10px;width:226px;" type="daterange" size="small" v-model="chooseDate" unlink-panels start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" :picker-options="pickerOptions"></el-date-picker>
    </div>
    <div class="dashboard-card flex-row">
      <div :class="['dashboard-card-item',0 === activeIndex ? 'item-active' : '']" @click="handleActiveIndex(0)">
        <div :class="[0 === activeIndex ? 'index-active' : '']">
          <div class="dashboard-card-item-top">
            {{$t('home.dataLoadNumber')}}
          </div>
          <div class="dashboard-card-item-bottom">
            {{queryByDate.data_count_summary}}
          </div>
        </div>
      </div>
      <div :class="['dashboard-card-item',1 === activeIndex ? 'item-active' : '']" @click="handleActiveIndex(1)">
        <div :class="[1 === activeIndex ? 'index-active' : '']">
          <div class="dashboard-card-item-top">
            {{$t('home.dataLoadVolume')}}
          </div>
          <div class="dashboard-card-item-bottom">
            {{queryByDate.data_volume_summary}}
          </div>
        </div>
      </div>
      <div :class="['dashboard-card-item',2 === activeIndex ? 'item-active' : '']" @click="handleActiveIndex(2)">
        <div :class="[2 === activeIndex ? 'index-active' : '']">
          <div class="dashboard-card-item-top">
            {{$t('home.workFlowAvgTime')}}
          </div>
          <div class="dashboard-card-item-bottom">
            {{queryByDate.avg_time_summary}}
          </div>
        </div>
      </div>
      <div :class="['dashboard-card-item',3 === activeIndex ? 'item-active' : '']" @click="handleActiveIndex(3)">
        <div :class="[3 === activeIndex ? 'index-active' : '']">
          <div class="dashboard-card-item-top">
            {{$t('home.workFlowStatus')}}
          </div>
          <div class="dashboard-card-item-bottom error-text">
            {{queryByDate.error_task_percent}}
          </div>
        </div>
      </div>
    </div>
    <div class="dashboard-echart flex-row">
      <div class="dashboard-echart-left">
        <transition name="el-zoom-in-center">
          <div v-show="activeIndex !== 3" class="dashboard-echart-left-bar" id="echart-bar"> </div>
        </transition>
        <transition name="el-zoom-in-center">
          <div v-show="activeIndex === 3 " class="dashboard-echart-left-bar" id="echart-pie"> </div>
        </transition>
        <div v-if="(activeIndex === 0 && queryByDate.data_count_top_ten.length === 0) || (activeIndex === 1 && queryByDate.data_volume_top_ten.length === 0) || (activeIndex === 2 && queryByDate.avg_time_top_ten.length === 0) || (activeIndex === 3 && isZero)  " class="dashboard-echart-left-empty flex-column">{{$t('home.noData')}}</div>
        <div class="dashboard-echart-left-title">{{$t('home.groupByIndex')}}</div>
      </div>
      <div class="dashboard-echart-right">
        <div class="dashboard-echart-right-line" id="echart-line"> </div>
        <div class="dashboard-echart-right-title">{{$t('home.groupByDay')}}</div>
        <!-- <div class="dashboard-echart-right-title">{{'按' + this.queryType + '查询'}}</div> -->
        <!-- <div class="dashboard-echart-right-type">
          <el-select v-model="queryType" clearable placeholder="请选择">
            <el-option label="天" value="天">
            </el-option>
            <el-option label="周" value="周">
            </el-option>
            <el-option label="月" value="月">
            </el-option>
          </el-select>
        </div> -->
      </div>
    </div>
  </div>
</template>