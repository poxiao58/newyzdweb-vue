<template>
  <div class="app-container">
    <div class="form-filter">
      <div class="chart-filter formClass">
        <drop-down class="float-l" :options="{list: videoList, cur: showAreaName}" @chooseFun="chooseQyCck"></drop-down>
        <el-date-picker class="float-r"
          v-model="dateRangerVal"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions">
        </el-date-picker>
      </div>
    </div>
    <div class="list-tabs-show chart-tabs-show">
      <el-tabs v-model="activeName" type="card" @tab-click="esnTabClk()">
        <el-tab-pane :lazy="true" v-for="item in tabList" :label="item.name" :name="item.ip" :key="item.ip">
          <line-chart :chartOption="chartOption" :chartData="chartData" v-loading="chartLoading"></line-chart>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
  import lineChart from '@/components/LineChart'
  import dropDown from '@/components/DropDown'

  export default {
    data() {
      return {
        activeName: '',
        userAreaId: '',
        showAreaName: '选择',
        cip:'',
        pickerOptions: {
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime());
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        dateRangerVal: '',
        tabList: [],
        chartOption: {
          tit: '',
          unit: ''
        },
        chartData: {},
        videoList: [],
        chartLoading: false
      }
    },
    components: {
      lineChart,
      dropDown
    },
    computed: {
      UID() {
        return this.$store.getters.userid
      }
    },
    created() {
      this.queryUserAreaList()
    },
    methods: {
      queryInfoList() {
        var that = this
        that.chartLoading = true
        that.chartData = {}
        var whereObj={'ip': that.activeName,cip:that.cip}
        this.$http.post('/chart/getEsnCgqDataList', {
          where: whereObj,
          curpage: 1,
          sortField:'createTime',
          orderBy:'desc',
          pagesize: 20
        }, function(res) {
          var $data = res.data.rows
          if ($data.length > 0) {
            var allData = {
              xData: [],
              zData: []
            }
            for (let i = $data.length-1; i >=0; i--) {
              allData.xData.push($data[i].createTime)
              allData.zData.push($data[i].value)
            }
            that.chartData = allData
          } else {
            that.chartData = {}
          }
          setTimeout(res => {
            that.chartLoading = false
          }, 1000)
        })
      },
      queryUserAreaList() {
        var that = this;
        this.$http.post('/chart/getUserAreaByUserId', {
          userId: that.UID,
        }, function (res) {
          const obj = res.data
          if (obj.length != 0) {
            that.videoList = obj
            that.chooseQyCck(obj[0])
          }
        })
      },
      queryUserEsnListByUserAreaId(userAreaId) {
        var that = this;
        this.$http.post('/chart/getUserEsnByUserAreaId', {
          type: 'NTT无线传感器',
          userAreaId: userAreaId,
        }, function (res) {
          const obj = res.data
          that.tabList = obj
          that.activeName = obj[0].ip
          that.findActiveInfo()
        })
      },
      chooseQyCck(val) {
        this.showAreaName = val.name
        this.queryUserEsnListByUserAreaId(val.id)
      },
      esnTabClk() {
        this.findActiveInfo()
      },
      findActiveInfo() {
        var activeIndex = this.tabList.find(item => {
          return item.ip === this.activeName
        })
        this.chartOption.tit = activeIndex.cgData
        this.chartOption.unit = activeIndex.unit
        this.cip=activeIndex.cip
        this.queryInfoList()
      }
    }
  }
</script>
