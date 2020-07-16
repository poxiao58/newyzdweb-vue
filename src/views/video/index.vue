<template>
  <div class="app-container">
    <div class="ntt_videoL">
      <div class="ntt_videoNumbox">
        <el-menu class="el-menu-vertical" unique-opened>
          <el-submenu :index="'m-' + mIndex" v-for="(menu, mIndex) in videoList" :key="'m-' + mIndex">
            <template slot="title"><i class="el-icon-caret-right"></i>{{menu.type}}</template>
            <el-menu-item v-for="(sub, sIndex) in menu.item" :key="'s-'+mIndex+'-'+sIndex" :index="'s-'+mIndex+'-'+sIndex"><i class="el-icon-caret-right"></i>{{sub.IE_Name}}</el-menu-item>
          </el-submenu>
        </el-menu>
      </div>
      <div class="ntt_videoCtrolbox">
        <div class="ntt_ctrolPanel">
          <span class="up-video"></span>
          <span class="down-video"></span>
          <span class="prev-video"></span>
          <span class="next-video"></span>
          <em class="middle-video"></em>
        </div>
        <div class="ntt_voice">
          <div class="ntt_upper"></div>
          <div class="ntt_lower"></div>
        </div>
      </div>
    </div>
    <div class="ntt_videoR">
      <el-row class="ntt_videoshow" :gutter="20">
        <el-col :span="8">
          <div class="videoFace"></div>
          <div class="videoCheck">
            <el-radio v-model="radioChecked" label="1">展示区视频一</el-radio>
          </div>
        </el-col>
      </el-row>
      <div class="ntt_videoOption">
        <span v-for="item in optionBtn" :key="item.index" :class="('btn-'+item) + (btnActive===item?' active':'')" @click="handelTapBtn(item)"></span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      radioChecked: '1',
      btnActive: 'one',
      optionBtn: ['one', 'four', 'nine'],
      videoList: [],
      defaultProps: {
        label: 'type',
        children: 'item'
      }
    };
  },
  computed: {
    spanColVal() {
      let ac = this.btnActive
      let val = '24'
      switch(ac) {
        case 'one':
          val = '24'
          break
        case 'four':
          val = '12'
          break
        case 'nine':
          val = '8'
          break
      }
      return val
    }
  },
  created() {
    this.queryInfoList()
  },
  methods: {
    queryInfoList() {
      var that = this;
      // this.$http.get(
      //   "/static/json/video.txt?t=" + new Date().getTime(),
      //   {},
      //   function(res) {
      //     var $data = res.rows;
      //     that.videoList = $data;
      //   }
      // );
    },
    handelTapBtn(val) {
      this.btnActive = val
    }
  }
};
</script>

<style lang="scss">
.ntt_videoL {
  position: absolute;
  left: 1rem;
  width: 5.4rem;
  height: 100%;
  .ntt_videoNumbox {
    width: 100%;
    height: 10rem;
    border: 2px solid $--color-primary;
    border-radius: .2rem;
    padding: .125rem .05rem 0 .125rem;
    overflow-y: auto;
    .el-menu{
      border:none;
      background: none;
      width: 100%;
      overflow: hidden;
      .el-submenu{
        width:100%;
        background-color: rgba(255,255,255,.8);
        border-radius: .075rem;
        margin: 2px;
        .el-submenu__title{
          font-size: .45rem;
          line-height: .8rem;
          height: auto;
          box-sizing: border-box;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .el-submenu__icon-arrow{
          right: 10px;
        }
        .el-icon-caret-right{
          color:#fff;
          background: $--color-primary;
          border-radius: 4px;
          margin-left: -12px;
          width: auto;
        }
        &:hover{
          .el-submenu__title{
            border-radius: .075rem;
          }
        }
        .el-menu-item{
          font-size: .45rem;
          line-height: .8rem;
          height: auto;
          box-sizing: border-box;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          &.is-active{
            color:#fff;
            background: $--color-primary;
          }
          .el-icon-caret-right{
            margin-left: -20px;
          }
        }
      }
    }
  }
  .ntt_videoCtrolbox {
    width: 100%;
    height: 5.6rem;
    border: 2px solid $--color-primary;
    border-radius: .2rem;
    margin-top: .25rem;
    overflow: hidden;
    .ntt_ctrolPanel {
      margin: 0 auto;
      width: 4.1rem;
      height: 4.1rem;
      background: url('/static/img/video-ctrol-bg.png') 0 0 no-repeat;
      background-size: 100%;
      position: relative;
      span {
        width: 1rem;
        height: 1rem;
        position: absolute;
        cursor: pointer;
        background: url('/static/img/video-ctrol.png') 0 0 no-repeat;
        background-size: 100%;
        border-radius: 50%;
        &.up-video{
          top: .375rem;
          left: 50%;
          transform: translateX(-50%);
          background-position: 0 -4.1rem;
          &.active{
            background-position: 0 0;
          }
        }
        &.down-video{
          bottom: .375rem;
          left: 50%;
          transform: translateX(-50%);
          background-position: 0 -7.15rem;
          &.active{
            background-position: 0 -3.125rem;
          }
        }
        &.prev-video{
          top: 50%;
          left: .375rem;
          transform: translateY(-50%);
          background-position: 0 -6.075rem;
          &.active{
            background-position: 0 -2.05rem;
          }
        }
        &.next-video{
          top: 50%;
          right: .375rem;
          transform: translateY(-50%);
          background-position: 0 -5.05rem;
          &.active{
            background-position: 0 -1rem;
          }
        }
      }
      .middle-video {
        width: .95rem;
        height: .95rem;
        border-radius: 50%;
        position: absolute;
        cursor: pointer;
        background: url('/static/img/video-scale.png') 0 0 no-repeat;
        background-size: 100%;
        top: 50%;
        left: 50%;
        transform: translateY(-50%) translateX(-50%);
        background-position: 0 -2.925rem;
      }
    }
    .ntt_voice {
      display: inline-block;
      margin: 0 auto;
      padding: .2rem .125rem 0;
      .ntt_upper, .ntt_lower {
        width: 2.25rem;
        height: .875rem;
        border-radius: .125rem;
        background-color: #fff;
        display: inline-block;
        position: relative;
        cursor: pointer;
        &:before {
            content: ' ';
            width: .675rem;
            height: .15rem;
            background-color: #ff8019;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translateX(-50%) translateY(-50%);
        }
      }
      .ntt_upper:after{
          width: .15rem;
          height: .675rem;
          content: ' ';
          background-color: #ff8019;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translateX(-50%) translateY(-50%);
      }
    }
  }
}

.ntt_videoR {
  width: 76%;
  height: 17rem;
  border: 2px solid $--color-primary;
  position: relative;
  margin-left: 6.4rem;
  box-sizing: border-box;
  .ntt_videoshow{
    height: 100%;
    .videoFace {
      width: 93%;
      height: 100%;
      float: left;
    }
    .videoCheck {
      float: left;
      width: 7%;
    }
  }
  .ntt_videoOption {
    position: absolute;
    right: -1.875rem;
    bottom: 0;
    width: 1.5rem;
    span {
      display: inline-block;
      width: 1.15rem;
      height: .85rem;
      background: url('/static/img/video-option.png') no-repeat;
      background-size: auto 100%;
      margin-right: .125rem;
      cursor: pointer;
      margin-top: .375rem;
      &.btn-one{
        background-position: 0 0;
        &.active{
          background-position: -3.525rem 0;
        }
      }
      &.btn-four{
        background-position: -1.175rem 0;
        &.active{
          background-position: -4.7rem 0;
        }
      }
      &.btn-nine{
        background-position: -2.35rem 0;
        &.active{
          background-position: -5.875rem 0;
        }
      }
    }
  }
}
</style>
