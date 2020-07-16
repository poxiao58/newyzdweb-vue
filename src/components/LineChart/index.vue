<template>
  <div :style="{height:height,width:width}" :class="className" ref="chartContent"></div> 
</template>
<script>
import echarts from 'echarts'
require('echarts/theme/macarons')
import { debounce, dateFormat } from '@/utils'
export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    chartData: {
      type: Object
    },
    chartOption: {
      type: Object
    }
  },
  data() {
    return {
      chart: null,
      mainColor: '#ff8019',
      height: '10rem'
    }
  },
  mounted() {
    var that = this
    this.height = (window.innerHeight - this.$refs.chartContent.offsetTop - 150) * 0.025 + 'rem'
    setTimeout(() => {
      that.initChart()
    }, 0)
    this.__resizeHanlder = debounce(() => {
      if (this.chart) {
        this.chart.resize()
        this.height = (window.innerHeight - this.$refs.chartContent.offsetTop - 150) * 0.025 + 'rem';
      }
    }, 100)
    window.addEventListener('resize', this.__resizeHanlder)
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    window.removeEventListener('resize', this.__resizeHanlder)
    this.chart.dispose()
    this.chart = null
  },
  watch: {
    chartData(val) {
      this.chart.dispose()
      this.chart = null
      this.initChart(val)
    }
  },
  methods: {
    setOptions(datastr, options) {
      var mainColor = this.mainColor
      if (JSON.stringify(datastr) === '{}') {
        this.$refs.chartContent.innerHTML = '<span class="nochart-data">无数据显示</span>'
        return
      }
      this.chart.setOption({
        title: {
          text: options.tit + '走势图',
          textStyle: {
            fontSize: '100%'
          },
          subtext: '数据来自公司',
          subtextStyle: {
            fontSize: '100%'
          },
          textAlign: 'center',
          left: 'center'
        },
        xAxis: {
          boundaryGap: false,
          data: datastr.xData,
          axisLabel: {
            interval: 0,
            rotate: -30,
            fontSize: '96%'
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: [mainColor],
              width: 1,
              type: 'solid'
            }
          }
        },
        yAxis: {
          type: 'value',
          name: '单位(' + options.unit + ')',
          axisLabel: {
            fontSize: '100%'
          },
          nameTextStyle: {
            fontSize: '100%'
          }
        },
        series: [
          {
            type: 'line',
            name: options.tit + '(' + options.unit + ')',
            data: datastr.zData,
            label: {
              show: true,
              fontSize: '100%',
              formatter: '{c}'+ options.unit
            }
          }
        ],
        toolbox: {
          show: true,
          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            },
            dataView: { readOnly: false },
            magicType: {
              type: ['line', 'bar']
            },
            restore: {},
            saveAsImage: {}
          },
          itemSize: 12
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          textStyle: {
            fontSize: '100%'
          }
        },
        grid: {
          left: '3%',
          bottom: '18%',
          y2: '20%'
        }
      })
    },
    initChart() {
      var that = this
      that.chart = echarts.init(that.$el, 'macarons')
      setTimeout(function() {
        that.setOptions(that.chartData, that.chartOption)
      }, 50)
    }
  }
}
</script>

<style>
  .nochart-data{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    color: #666;
  }
</style>
