<template>
  <div>
    <div class="article-left">
      <div class="n-datas">
        <div class="n-datamodel">
          <ul>
            <li>
              <div class="n-dataimg img4" title="点击设置为已读" @click="readingSetting"></div>
              <div class="n-datanum">新增任务<span>{{num}}</span></div>
            </li>
            <li>
              <div class="n-dataimg img3"></div>
              <div class="n-datanum">总待处理<span>{{count}}</span></div>
            </li>
            <li>
              <div class="n-dataimg img2" title="点击设置状态" @click="statusSetting"></div>
              <div class="n-datanum">当前状态<span>{{status}}</span></div>
            </li>

            <!--<li>-->
            <!--<div class="n-dataimg img2"></div>-->
            <!--<div class="n-datanum">传感器数<span>92</span></div>-->
            <!--</li>-->
          </ul>
        </div>
        <!--<audio id="audio" src="/static/mp3/ts.mp3" controls style="height: inherit;"/>-->
        <audio id="audio" src="http://www.zzfset.com/yzd/fileImg/mp3/ts.mp3" controls autoplay style="height: inherit;" />
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        num: 0,
        count: 0,
        status: "上班"
      };
    },
    created() {
      this.queryInfoList()
      setTimeout(() => {
        this.setTimer()
      }, 1000)
    },
    mounted() {
      clearInterval(this.timer)
    },
    methods: {
      setTimer() {
        this.timer = setInterval( () => {
          console.log('首页定时器')
          this.queryInfoList(true)
        }, 10000)

      },
      queryInfoList() {
        var that = this
        this.$http.post('/imageManager/newTaskByMsg', {}, function (res) {
          const obj = res.data
          that.num = obj.num
          that.count = obj.count
          if (obj.status=="3"){
            that.status="下班"
          } else{
            that.status="上班"
          }
          if (that.num!=0){
            const audio = document.getElementById('audio')
            audio.play()
          }

        })
      },
      readingSetting() {
        var that = this
        this.$http.post('/imageManager/newTaskByReading', {}, function (res) {
          if (res.success) {
            that.$message({
              message: "操作成功",
              type: 'success'
            })
            that.queryInfoList()
          }

        })
      },
      statusSetting() {
        var that = this
        this.$http.post('/imageManager/statusSettings', {}, function (res) {
          if (res.success) {
            that.$message({
              message: "操作成功",
              type: 'success'
            })
            that.queryInfoList()
          }

        })
      }
    },
    beforeDestroy() {
      console.log('离开首页')
      clearInterval(this.timer)
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .article-left {
    position: fixed;
    .n-datas {
      margin-top: 0.875rem;
      width: 3.3rem;
      height: 14.05rem;
      border-radius: 0.125rem;
      margin-left: 0.9rem;
      border: 1px solid $--color-primary;
      .n-datamodel {
        width: 2.95rem;
        height: 13.675rem;
        border-radius: 0.125rem;
        margin: 0.175rem auto;
        background: rgba(255, 255, 255, 0.3);
        ul {
          padding-top: 0.35rem;
          li {
            cursor: pointer;
            list-style: none;
            margin-top: 0.375rem;
            &:first-child {
              margin-top: 0;
            }
            .n-dataimg {
              margin: 0 auto;
              width: 1.5rem;
              height: 1.5rem;
              background-size: 100%;
              &.img4 {
                background-image: url("/yzd/static/img/data-1.png");
              }
              &.img3 {
                background-image: url("/yzd/static/img/data-3.png");
              }
              &.img2 {
                background-image: url("/yzd/static/img/data-2.png");
              }
              &.img1 {
                background-image: url("/yzd/static/img/data-1.png");
              }
            }
            .n-datanum {
              margin: 0.55rem auto 0;
              width: 2.55rem;
              height: 0.95rem;
              background: url("/yzd/static/img/data-bg.png");
              background-size: 100%;
              line-height: 1rem;
              text-align: center;
              position: relative;
              font-size: 0.4rem;
              span {
                position: absolute;
                font-size: 0.55rem;
                left: 50%;
                transform: translateX(-50%);
                top: -0.45rem;
                font-weight: bold;
              }
            }
            /*&:hover {*/
              /*.img3 {*/
                /*background-image: url("/yzd/static/img/data-33.gif");*/
              /*}*/
              /*.img2 {*/
                /*background-image: url("/yzd/static/img/data-22.gif");*/
              /*}*/
              /*.img1 {*/
                /*background-image: url("/yzd/static/img/data-11.gif");*/
              /*}*/
            /*}*/
          }
        }
      }
    }
  }

  .swiper-carousel {
    position: fixed;
    overflow: hidden;
    width: 12rem;
    height: 9rem;
    right: 0.5rem;
    top: 0.5rem;
    box-sizing: border-box;
    .map-con {
      width: 100%;
      height: 100%;
    }
    .el-carousel {
      width: 100%;
      height: 100%;
      overflow: hidden;
      box-sizing: border-box;
      .el-carousel__container {
        width: 100%;
        height: 90%;
        .el-carousel__item {
          border: 1px solid $--color-primary;
          padding: 0.25rem;
        }
      }
      .el-carousel__indicator {
        height: 10%;
        .el-carousel__button {
          width: 0.5rem;
          height: 0.5rem;
          border-radius: 50%;
          background: $--color-primary;
        }
      }
    }

  }

  .operate-right {
    position: fixed;
    right: 10px;
    top: 50%;
    transform: translate(-50%);
    .n_icon {
      .n-i {
        .el-button {
          background: none;
          padding: 0;
          border: none;
          line-height: 0;
        }
        .svg-icon {
          margin-bottom: 0.5rem;
          background: rgba(0, 0, 0, .4);
          border: 2px solid $--color-primary;
          border-radius: 50%;
          color: $--color-primary;
          padding: 0.25rem;
          width: 1.5rem;
          height: 1.5rem;
          font-weight: bold;
          cursor: pointer;
          &:hover {
            background: $--color-primary;
            color: #fff;
          }
        }
      }
    }
  }

  .n_content {
    // position: relative;
    // z-index: 2;
    // padding: 0rem 6rem 0rem;
    // .farm-lang-img {
    //   width: 80%;
    //   padding: 0.25rem;
    //   border-radius: 0.2rem;
    //   border: 1px solid $--color-primary;
    //   box-shadow: 1px 1px 10px rgba(0,0,0,0.8);
    // }
    .n_fieldNum {
      .n_fielditem {
        left: 32rem;
        top: 11.9rem;
        width: 1.175rem;
        height: 1.975rem;
        position: absolute;
        cursor: pointer;
        z-index: 1000;
        .fieldnum {
          background: url('/yzd/static/img/farm-icon.png') 0 0 no-repeat;
          background-size: 100%;
          height: 100%;
          position: relative;
          &.el-button {
            border: none;
            line-height: 0;
          }
          em {
            font-style: normal;
            color: $--color-primary;
            font-size: .5rem;
            font-weight: bold;
            top: .5rem;
            left: 50%;
            transform: translateX(-50%);
            position: absolute;
          }
        }
        .n-numtxt {
          height: .85rem;
          position: absolute;
          line-height: .85rem;
          text-align: center;
          left: -4.125rem;
          font-size: .45rem;
          padding: 0 .5rem 0 .6rem;
          border-radius: .425rem;
          background-color: rgba(255, 255, 255, .75);
        }
      }
    }
  }

  .el-popover {
    .swiper-video-nav {
      .swiper-wrapper {
        .swiper-slide {
          line-height: 0.75rem;
          font-size: 0.45rem;
          padding: 0 0.1rem;
          color: $--color-primary;
          border: 1px solid $--color-primary;
          cursor: pointer;
        }
      }
      .swiper-button-prev, .swiper-button-next {
        background: none;
        width: auto;
        height: 0.8rem;
        top: 0;
        font-size: 0.35rem;
        line-height: 1rem;
        margin-top: 0;
        box-shadow: 1px 1px 10px rgba(255, 255, 255, 0.4);
        background: $--color-sub;
        box-sizing: border-box;
        z-index: 100;
        .svg-icon {
          width: 0.6rem;
          height: 0.6rem;
          color: #fff;
          cursor: pointer;
        }
      }
      .swiper-button-prev {
        left: 0.05rem;
      }
      .swiper-button-next {
        right: 0.05rem;
      }
    }
    .n-video-show {
      height: 200px;
    }
  }

  .fog__img--first {
    -webkit-animation: marqueeOut 3s ease-in 1 forwards;
    animation: marqueeOut 3s ease-in 1 forwards;
  }

  .fog__img--second {
    -webkit-animation: marqueeOut2 3s ease-in 1 forwards;
    animation: marqueeOut2 3s ease-in 1 forwards;
  }
</style>
