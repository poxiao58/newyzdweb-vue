<template>
  <div id="rose-chart">
    <div class="rose-chart-title">4G设备分布地图</div>
    <baidu-map class="map" :center="centerPosition" :zoom="15" :scroll-wheel-zoom="true" >
      <bm-marker v-for="(item,index) in esnList" :key="index" :position="item.position" animation="BMAP_ANIMATION_BOUNCE" :dragging="false" @click="infoWindowOpen(index)">
        <bm-info-window :width="width" :show="show[index]" @close="infoWindowClose(index)" @open="infoWindowOpen(index)">
          <ul>
            <li><strong>名称：</strong>{{item.name}}</li>
            <li><strong>IMEI：</strong>{{item.imei}}</li>
            <li><strong>物联网卡号：</strong>{{item.iccid}}</li>
            <li><strong>位置：</strong>{{item.city}}</li>
          </ul>
        </bm-info-window>
      </bm-marker>
    </baidu-map>
  </div>
</template>

<script>

  export default {
    name: 'RoseChart',
    data() {
      return {
        show: [],
        width:280,
        //地图中心位置
        centerPosition:{},
        esnList:[],
        chartOption: {
          tit: '',
          unit: ''
        },
        chartData: {},
        xDataZoom: false,
        tabList: [],
        videoList: [],
        index: 0,
        //开始时间
        startTime: '',
        //结束时间
        endTime: '',
      }
    },
    components: {
    },
    computed: {
      UID() {
        return this.$store.getters.userid
      }
    },
    created() {
      this.queryMapInfoList()
    },
    methods: {
      queryMapInfoList() {
        var that = this
        var whereObj = {'userId': that.UID}
        this.$http.post('/esn/getUserEsnList', {
          where: whereObj,
          curpage: 0,
          pagesize: 1000
        }, function (res) {
          const obj = res.data.rows
          const objData=[]
          for (let i = 0; i < obj.length; ++i) {
            if (obj[i].name !== '无'&&obj[i].address!==null&&obj[i].address!=='') {
              that.show[i] = false
              let posStr = obj[i].address
              let posArr = posStr.split(";")
              let position = {lng: posArr[0], lat: posArr[1]}
              obj[i].position = position
              objData.push(obj[i])
            }
          }
          // console.log("设备地图信息obj：",objData)
          if (objData.length!==0){
            that.centerPosition=objData[0].position
          }
          that.esnList=objData
          // console.log("设备地图信息：",that.esnList)
        })
      },
      infoWindowClose(index) {
        this.$set(this.show,index,false)
      },
      infoWindowOpen(index) {
       var that=this
        this.$http.post('/test/getPoisitionInfo', {
          jd: this.esnList[index].position.lng,
          wd:this.esnList[index].position.lat
        }, function (res) {
          var city=res.msg
          that.esnList.forEach((value, key) => {
            if (value.id===that.esnList[index].id) {
              // console.log("得到值：",value.name)
              that.esnList[index].city=city
            }
          })
        })
        // console.log("得到转换后的数组：",this.esnList)
        this.$set(this.show,index,true)
      }


    }

  }
</script>

<style lang="less">
  #rose-chart {
    width: 80%;
    height: 190%;
    background-color: rgba(6, 30, 93, 0.5);
    border-top: 2px solid rgba(1, 153, 209, .5);
    box-sizing: border-box;

    .rose-chart-title {
      height: 50px;
      font-weight: bold;
      text-indent: 20px;
      font-size: 20px;
      display: flex;
      align-items: center;
    }

    .dv-charts-container {
      height: calc(~"100% - 50px");
    }
    .map {
      width: 100%;
      height: 95%;
    }
  }
</style>
