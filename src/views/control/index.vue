<template>
  <div class="app-container">
    <div class="n_group_content">
      <div class="n_dapengL" style="width:3.2rem">
        <drop-down :options="{list: videoList, cur: showName}" :width="'96px'" @chooseFun="chooseQyCck"></drop-down>
        <div class="n_plan n_left_plan">
          <div class="n_planbox">
            <h3>编组信息</h3>
            <div v-show="groupList.length==0" class="n_jiaoshui no-groupright"><!--  <div class="n_jiaoshuibox"></div>--></div>
            <div v-show="groupList.length!=0" class="n_jiaoshui">
              <el-button v-for="(groupItem,index) in groupList" :key="groupItem.id" type="primary" @click="showGroupInfo(index)">{{groupItem.name}}</el-button>
              <!--<el-button type="primary" @click="save">保存</el-button>-->
            </div>
          </div>
        </div>
      </div>
      <div class="n_dapeng_status n_dapeng_status_contol">
        <div class="n_dapeng_switch">
          <div class="n_left">
            <div class="n_light_color normal_color">正常</div>
            <div class="n_light_color run_color">运行</div>
            <div class="n_light_color close_color">断开</div>
            <div class="n_light_color danger_color">预警</div>
          </div>
          <div class="n_right">
            <span>远程控制</span>
            <el-switch v-model="lightSwitch" active-text="开" inactive-text="关"></el-switch>
          </div>
        </div>
        <div class="n_dapeng_statusbox">
          <div class="n_left">
            <el-row>
              <el-col class="n_status_icon n_status_normal" v-for="cgqEsnItem in userCgqEsnList" :key="cgqEsnItem.id">
                <i class="icon-gufengji"></i><p>{{cgqEsnItem.name}}</p>
              </el-col>
              <!--<el-col class="eq-status-discon">-->
                <!--<i class="icon-status1 guangzhao"></i>-->
                <!--<div class="status-txt">-->
                  <!--<p>光照</p>-->
                  <!--<p>4Lux</p>-->
                <!--</div>-->
              <!--</el-col>-->
              <!--<el-col class="eq-status-discon">-->
                <!--<i class="icon-status2 tuwen"></i>-->
                <!--<div class="status-txt">-->
                  <!--<p>土温</p>-->
                  <!--<p>17.1 ℃</p>-->
                <!--</div>-->
              <!--</el-col>-->
            </el-row>
          </div>
          <div class="n_right">
            <el-row>
              <el-col v-for="items in userColEsnList" :key="items.id" @click.native="chooseGroupEsnClk(items.id,items.name)"
                      class="n_status_icon n_status_normal">
                <i v-show="items.cgData=='鼓风机'" class="icon-gufengji"></i>
                <i v-show="items.cgData=='水泵'" class="icon-shuibeng"></i>
                <i v-show="items.cgData=='内遮阳'" class="icon-neizheyang"></i>
                <i v-show="items.cgData=='天窗'" class="icon-tianchuang"></i>
                <i v-show="items.cgData=='外遮阳'" class="icon-waizheyang"></i>
                <i v-show="items.cgData=='雨量清零'" class="icon-ylql"></i>
                <i v-show="items.cgData=='远程控制开关'" class="icon-yckz"></i>
                <p>{{items.name}}</p>
              </el-col>
              <!--<el-col class="n_status_icon n_status_normal">-->
                <!--<i class="icon-gufengji"></i><p>1#风机</p>-->
              <!--</el-col>-->
              <!--<el-col class="n_status_icon n_status_run">-->
                <!--<i class="icon-ylql"></i><p>1号点</p>-->
              <!--</el-col>-->
            </el-row>
          </div>
        </div>
      </div>
      <div class="n_plan n_right_plan">
        <div class="n_mouse_move"></div>
        <div class="n_planbox">
          <h3 class="n_planbox_btn" @click="ExecutionScheme()"></h3>
          <div class="addpan" @click="addPlan()"></div>
          <div class="n_playShow">
            <div class="planlist">
              <el-popover placement="left" width="300" trigger="hover">
                <el-row class="runninglist_li">
                  <el-col class="n_status_icon n_status_normal">
                    <i class="icon-gufengji"></i><p>1#风机</p>
                  </el-col>
                  <el-col class="n_status_icon n_status_normal">
                    <i class="icon-gufengji"></i><p>1#风机</p>
                  </el-col>
                  <el-col class="n_status_icon n_status_normal">
                    <i class="icon-gufengji"></i><p>1#风机</p>
                  </el-col>
                  <el-col class="n_status_icon n_status_normal">
                    <i class="icon-gufengji"></i><p>1#风机</p>
                  </el-col>
                </el-row>
                <div class="planlist_li" slot="reference">
                  <div class="n_planIcon">
                    <span class="activePlan"></span>
                    <span class="character360"></span>
                    <span></span>   <!--:click="Copy(ap)" -->
                    <span></span>  <!--:click="Show(ap)"  -->
                  </div>
                  <div class="n_planTitle">test</div>
                  <div class="n_planTerm"><span>条件</span><i>1</i></div>
                  <div class="n_planlight">
                      <span class="zhi">智</span>
                      <i>1</i>
                      <span class="bao">保</span>
                      <i>0</i>
                      <span class="jing">警</span>
                      <i>0</i>
                  </div>
                  <p class="eq-status-normal"><i>有 效 期：永久有效</i></p>
                  <p>上次执行：04-08 11:01</p>
                </div>
              </el-popover>
            </div>
          </div>
        </div>
      </div>
    </div>
    <add-ways ref="addRunWaysDialog"></add-ways>
  </div>
</template>

<script>
import dropDown from '@/components/DropDown'
import addWays from './addWays'
export default {
  data() {
    return {
      lightSwitch: true,
      showName: '1区',
      userAreaId:'',
      groupList:[],//编组列表
      userCgqEsnList:[],//传感器设备列表
      userColEsnList:[],//控制设备列表
      userPlanList:[],//执行方案列表
      videoList: [],
      formObject: {
        model: {
          Logs_Date: '',
          Control_Type: ''
        },
        arr: [
          {
            prop: 'Logs_Date',
            tit: '设备名称',
            date: true,
          },
          {
            prop: 'Control_Type',
            tit: '所属企业'
          }
        ],
        oFun: [
          {
            name: '新增',
            event: 'editOpenDialogFun'
          },
          {
            name: '查询',
            event: 'edit'
          }
        ]
      }
    };
  },
  components: {
    dropDown,
    addWays
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
    queryUserAreaList(){//用户区域列表
      var that = this;
      this.$http.post('/esnController/getUserAreaByUserId', {
        userId: that.UID,
      }, function (res) {
        const obj = res.data
        if (obj.length != 0) {
          that.videoList = obj
          that.chooseQyCck(obj[0])
        }
      })
    },
    queryUserGroupList(){//用户编组列表
      var that = this;
      this.$http.post('/esnController/getGroupList', {
        userAreaId: that.userAreaId,
      }, function (res) {
        const obj = res.data
        that.groupList=[]
        if (obj.length != 0) {
          that.groupList = obj
        }
      })
    },
    queryUserCgqEsnList(){//获取用户传感器设备
      var that = this;
      this.$http.post('/esnController/getUserEsnByUserAreaId', {
        userAreaId: that.userAreaId,
        type:'NTT无线传感器',
      }, function (res) {
        const obj = res.data
        that.userCgqEsnList=[]
        if (obj.length != 0) {
          that.userCgqEsnList = obj
        }
      })
    },
    queryUserColEsnList(){//获取用户控制设备
      var that = this;
      this.$http.post('/esnController/getUserEsnByUserAreaId', {
        userAreaId: that.userAreaId,
        type:'PLC行程手动控制器;PLC单点控制器',
      }, function (res) {
        const obj = res.data
        that.userColEsnList =[]
        if (obj.length != 0) {
          that.userColEsnList = obj
        }
      })
    },
    queryUserPlanList(){//获取区域执行方案
      var that = this;
      this.$http.post('/esnController/getUserPlanListByUserAreaId', {
        userAreaId: that.userAreaId
      }, function (res) {
        const obj = res.data
        if (obj.length != 0) {
          that.userPlanList = obj
        }
      })
    },
    chooseQyCck(val) {
      this.showName = val.name
      this.userAreaId = val.id
      this.queryUserGroupList()
      this.queryUserCgqEsnList()
      this.queryUserColEsnList()
      this.queryUserPlanList()
      // this.queryUserEsnListByUserAreaId(val.id)
    },
    handelTapBtn(val) {
      this.btnActive = val
    },
    ExecutionScheme() {

    },
    addPlan() {
      this.$refs.addRunWaysDialog.openDiag(this.userAreaId,this.showName,this.userColEsnList,this.userCgqEsnList)
    }
  }
};
</script>
