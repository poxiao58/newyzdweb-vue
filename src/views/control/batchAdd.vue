<template>
  <el-dialog class="dialogClass" title="设备选择" :visible.sync="dialogShebeiVisible" :close-on-click-modal="false" width="550px">
    <div class="list-tabs-show">
      <el-tabs v-model="activeName" type="card" @tab-click="esnTabClk()">
        <el-tab-pane :lazy="true" v-for="item in tabList" :label="item.name" :name="item.ip" :key="item.ip">
          <div class="n_kuang">
            <div class="n_status_icon n_status_normal" v-for="cgqEsnItem in userCgqEsnList" :key="cgqEsnItem.id" @click="chooseCgqClk(cgqEsnItem)">
              <i class="icon-gufengji"></i><p>{{cgqEsnItem.name}}</p>
            </div>
            <!--<div class="n_status_icon n_status_normal">-->
              <!--<i class="icon-gufengji"></i><p>1234</p>-->
            <!--</div>-->
            <!--<div class="n_status_icon n_status_normal">-->
              <!--<i class="icon-gufengji"></i><p>1234</p>-->
            <!--</div>-->
          </div>
        </el-tab-pane>
      </el-tabs>
      <div class="n_xuan_tit">选中项目</div>
      <div class="n_xuan">
        <div class="n_status_icon n_status_normal" v-for="checkItem in checkCgqList" :key="checkItem.id">
          <i class="icon-gufengji"></i><p>{{checkItem.name}}</p>
        </div>
        <!--<div class="n_status_icon n_status_normal">-->
          <!--<i class="icon-gufengji"></i><p>1234</p>-->
        <!--</div>-->
        <!--<div class="n_status_icon n_status_normal">-->
          <!--<i class="icon-gufengji"></i><p>1234</p>-->
        <!--</div>-->
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogShebeiVisible = false">取 消</el-button>
      <el-button type="primary" @click="saveShebeiSubmitInfo">保 存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { Message } from 'element-ui'
export default {
  data() {
    return {
      dialogShebeiVisible: false,
      activeName: '1',
      index:0,//选择设备的序号
      userAreaId:'',
      showName:'',
      userColEsnList:[],
      userCgqEsnList:[],
      checkCgqList:[],
      tabList: [
        {
          ip: '1',
          name: '展示区'
        }
      ]
    };
  },
  computed: {
    UID() {
      return this.$store.getters.userid
    }
  },
  created() {
  },
  methods: {
    openShebeiDiag(userAreaId,showName,userColEsnList,userCgqEsnList,index) {
      var that = this
      that.userAreaId=userAreaId
      that.showName=showName
      that.$set(that.tabList,0,{ip:1,name:that.showName})
      that.userColEsnList=userColEsnList
      that.userCgqEsnList=userCgqEsnList
      that.index=index
      that.checkCgqList=[]
      setTimeout(() => {
        that.dialogShebeiVisible = true
      }, 1)
    },
    saveShebeiSubmitInfo() {
      var that = this
      if(that.checkCgqList.length!=1){
        Message.error("请选择设备")
      }else{
        that.dialogShebeiVisible = false
        that.$emit("checkCgqEvent",that.checkCgqList,that.index)
      }
    },
    chooseCgqClk(item){
      this.$set(this.checkCgqList,0,{})
      this.$set(this.checkCgqList,0,item)
    }
  }
};
</script>
<style lang="scss">
  .n_kuang, .n_xuan{
    border: 1px solid $--color-primary;
    overflow: hidden;
    height: 5rem;
    padding: 0.5rem;
    .n_status_icon{
      float: left;
    }
  }
  .n_xuan_tit{
    margin: 1rem 0 0.25rem;
  }
</style>
