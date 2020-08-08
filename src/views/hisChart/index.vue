<template>
  <div class="app-container">
    <div class="form-filter">
      <div class="chart-filter formClass">
        <drop-down class="float-l" :options="{list: videoList, cur: showAreaName}" @chooseFun="chooseQyCck"></drop-down>
        <el-date-picker v-show="false" class="float-r"
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
      <el-tabs v-model="activeName" type="card" >
        <el-tab-pane :lazy="true" >
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
      this.queryUserEsnList()
    },
    methods: {
      queryInfoList() {
        var that = this
        that.chartLoading = true
        that.chartData = {}
        this.$http.post('/esn/getHisEsnPrintImageListByEsnName', {
          id: that.showAreaName,
        }, function(res) {
          var $data = res.data
          console.log("得到数据信息：",$data)
          if ($data.length > 0) {
            var allData = {
              xData: [],
              zData: []
            }
            for (let i = $data.length-1; i >=0; i--) {
              allData.xData.push($data[i].updateTime)
              allData.zData.push($data[i].count_)
            }
            that.chartData = allData
            console.log("得到chartData数据信息：",that.chartData)
          } else {
            that.chartData = {}
          }
        })
      },
      queryUserEsnList() {
        var that = this;
        this.$http.post('/esn/getEsnList', {
        }, function (res) {
          const obj = res.data
          if (obj.length != 0) {
            that.videoList = obj
            that.chooseQyCck(obj[0])
          }
        })
      },
      chooseQyCck(val) {
        this.showAreaName = val.name
        this.chartOption.tit=val.name
        this.chartOption.unit='张'
        console.log("当前设备名称："+this.showAreaName )
        this.queryInfoList()
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
