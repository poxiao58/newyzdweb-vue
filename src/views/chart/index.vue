<template>
  <div class="app-container">
    <div class="form-filter" v-show="false">
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
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane :lazy="true">
          <pie-chart :chartOption="chartOption" :chartData="chartData" v-loading="chartLoading"></pie-chart>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
  import pieChart from '@/components/PieChart'
  import dropDown from '@/components/DropDown'

  export default {
    data() {
      return {
        activeName: '',
        userAreaId: '',
        showAreaName: '选择',
        cip: '',
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
          tit: '前一天设备打印图片',
          unit: '张'
        },
        chartData: {},
        videoList: [],
        chartLoading: false
      }
    },
    components: {
      pieChart,
      dropDown
    },
    computed: {
      UID() {
        return this.$store.getters.userid
      }
    },
    created() {
      this.queryInfoList()
    },
    methods: {
      queryInfoList() {
        var that = this
        that.chartLoading = true
        that.chartData = {}
        this.$http.post('/esn/getPreEsnPrintImageList', {}, function (res) {
          var $data = res.data
          console.log("得到数据信息：", $data)
          if ($data.length > 0) {
            var allData = {
              xData: [],
              zData: []
            }
            for (let i = 0; i < $data.length; i++) {
              allData.xData.push($data[i].name)
              allData.zData.push($data[i].count_)
            }
            that.chartData = allData
            console.log("得到chartData数据信息：", that.chartData)
          } else {
            that.chartData = {}
          }
        })
      },
    }
  }
</script>
