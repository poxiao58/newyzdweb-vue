<template>
  <div>
    <el-dialog class="dialogClass" title="添加执行方案" :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="90%">
      <el-form :model="formObject.model" :ref="formObject.ref" :rules="formObject.rules" label-width="3.8rem">
        <el-row>
          <!--<div class="planInfor">-->
            <!--<i class="icon_planInfor"></i>-->
            <!--<div class="planInforItem">-->
                <!--<span>方案创建人</span>: <i>超级管理员</i>-->
            <!--</div>-->
            <!--<div class="planInforItem">-->
                <!--<span>方案创建时间</span>: <i>2019-04-02 14:53</i>-->
            <!--</div>-->
            <!--<div class="planInforItem">-->
                <!--<span>最后编辑人 </span>: <i>超级管理员</i>-->
            <!--</div>-->
            <!--<div class="planInforItem">-->
                <!--<span>最后编辑时间</span>: <i>2019-04-02 14:53</i>-->
            <!--</div>-->
            <!--<div class="planInforItem">-->
                <!--<span>最后运行时间</span>: <i>2019-04-02 14:53</i>-->
            <!--</div>-->
            <!--<div class="planInforItem">-->
                <!--<span>最后关闭时间</span>: <i>2019-04-02 14:53</i>-->
            <!--</div>-->
          <!--</div>-->
          <el-col :span="16">
            <el-form-item class="split-con">
              <div class="split-tit"><span>方案基本信息</span></div>
            </el-form-item>
            <el-form-item label="执行方案名称：" prop="name">
              <el-input v-model="formObject.model.name"></el-input>
            </el-form-item>
            <el-form-item label="方案启用：" prop="switch">
              <el-switch v-model="formObject.model.switch" active-color="#13ce66"
                inactive-color="#ff4949" active-text="启用" inactive-text="停用"></el-switch>
            </el-form-item>
            <el-form-item label="运行状态：" prop="state">
              <el-tag type="success">运行中</el-tag>
              <el-tag type="info">未运行</el-tag>
              <el-tag type="danger">报警</el-tag>
            </el-form-item>
            <el-form-item prop="checked">
              <el-checkbox v-model="formObject.model.checked">仅有限期内执行</el-checkbox>
              <el-date-picker v-show="formObject.model.checked" v-model="formObject.model.validTime" type="date" placeholder="选择日期"> </el-date-picker>
            </el-form-item>
            <!--<el-form-item label="执行确认时间：" prop="time">-->
              <!--<el-input-number v-model="formObject.model.time" :min="0" @change="handleTimeChange"></el-input-number> 分钟-->
            <!--</el-form-item>-->
          </el-col>
          <el-col :span="24">
            <el-form-item class="split-con">
              <div class="split-tit clearfix">
                <span class="float-l">方案执行条件</span>
                <div class="float-r right-btn">
                  <el-button @click.native="addClk">添加</el-button>
                  <!--<el-button @click.native="batchAddShebei">批量添加</el-button>-->
                </div>
              </div>
              <div class="split-con-show" v-show="formObject.model.show[index]" v-for="(item,index) in formObject.model.type" :key="index">
                <div class="con-list-li clearfix">
                  <span class="svg-container margin-right-10 float-l" @click="OperDelete(index)">
                    <svg-icon icon-class="delete"/>
                  </span>
                  <el-radio-group class="float-l margin-right-10" v-model="formObject.model.type[index]" @change="changeTjClk(index)">
                    <el-radio-button label="0">按时间</el-radio-button>
                    <el-radio-button label="1">按条件</el-radio-button>
                  </el-radio-group>
                  <div class="plan_condition margin-right-10 float-l">
                    <template v-if="formObject.model.tabOneSelect[index]=='0'">
                      <el-checkbox class="float-l margin-right-10" :indeterminate="formObject.model.isIndeterminate[index]" v-model="formObject.model.checkAll[index]" @change="handleCheckAllChange(index)">全选</el-checkbox>
                      <el-checkbox-group class="float-l margin-right-10" v-model="formObject.model.checkedWeeks[index]" @change="handleCheckedWeeksChange(index)">
                        <el-checkbox v-for="item in weekdays" :label="item" :key="item">{{item.name}}</el-checkbox>
                      </el-checkbox-group>
                      <el-time-picker class="float-l" is-range v-model="formObject.model.planTime[index]" range-separator="至" start-placeholder="启动时间"
                        end-placeholder="停止时间" placeholder="选择时间范围">
                      </el-time-picker>
                    </template>
                    <template v-if="formObject.model.tabOneSelect[index]=='1'">
                      <div class="n_status_icon n_status_normal float-l" @click="batchAddShebei(index)"><i class="icon-shebei"></i><p>{{formObject.model.checkCgqList[index].name}}</p></div>
                      <el-select class="float-l margin-right-10" style="width: 120px" v-model="formObject.model.planEsnLogic[index]">
                        <el-option
                          v-for="op in [{value: '>=',label: '>='},{value: '<=',label: '<='}]"
                          :key="op.value" :label="op.label" :value="op.value" @click.native="chooseTypeClk">
                        </el-option>
                      </el-select>
                      <el-input v-model="formObject.model.planEsnValue[index]" class="float-l margin-right-10" style="width: 120px"></el-input>
                      <div class="float-l margin-right-10"><span class="fontSiz">滞回值：</span><el-input v-model="formObject.model.planEsnHysValue[index]"  style="width: 120px"></el-input></div>
                    </template>
                  </div>
                </div>
              </div>
              <div class="def-tip" v-show="formObject.model.showFlag">暂无执行条件，请添加</div>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item class="split-con">
              <div class="split-tit clearfix">
                <span class="float-l">方案执行内容</span>
                <div class="float-r right-btn">
                  <el-button>添加</el-button>
                  <!--<el-button>批量添加</el-button>-->
                </div>
              </div>
              <div class="split-con-show">
                <div class="con-list-li clearfix">
                  <span class="svg-container margin-right-10 float-l" @click="OperDelete">
                    <svg-icon icon-class="delete"/>
                  </span>
                  <el-radio-group class="float-l margin-right-10" v-model="tabTwoSelect">
                    <el-radio-button label="1">智控</el-radio-button>
                    <el-radio-button label="2">保护</el-radio-button>
                    <el-radio-button label="3">预警</el-radio-button>
                  </el-radio-group>
                  <div class="plan_condition margin-right-10 float-l">
                    <template v-if="tabTwoSelect==='1'">
                      <div class="n_status_icon n_status_normal float-l" @click="batchAddShebei"><i class="icon-shebei"></i><p>请选择设备</p></div>
                      <el-select class="float-l margin-right-10" style="width: 120px" v-model="showType">
                        <el-option
                          v-for="op in [{value: '0',label: '正常开启'},{value: '1',label: '间歇开启'}]"
                          :key="op.value" :label="op.label" :value="op.value" @click.native="chooseTypeClk">
                        </el-option>
                      </el-select>
                      <div class="eq_plan_statusIcon float-l margin-right-10" :class="delayshow?'active':''">
                        <i class="i-delay float-l" @click="OperDelay"></i>
                        <div v-show="delayshow" class="float-l eq_plan_statusIconTxt">延迟
                          <el-input-number v-model="delayTime" :min="0"></el-input-number> 分钟 后执行
                        </div>
                      </div>
                    </template>
                    <template v-if="tabTwoSelect==='2'">
                      <div class="n_status_icon n_status_normal float-l" @click="batchAddShebei"><i class="icon-shebei"></i><p>请选择设备</p></div>
                      <el-select class="float-l margin-right-10" style="width: 120px" v-model="showType">
                        <el-option
                          v-for="op in [{value: '0',label: '正常开启'},{value: '1',label: '间歇开启'}]"
                          :key="op.value" :label="op.label" :value="op.value" @click.native="chooseTypeClk">
                        </el-option>
                      </el-select>
                      <div class="eq_plan_statusIcon float-l margin-right-10" :class="delayshow?'active':''">
                        <i class="i-delay float-l" @click="OperDelay"></i>
                        <div v-show="delayshow" class="float-l eq_plan_statusIconTxt">延迟
                          <el-input-number v-model="delayTime" :min="0"></el-input-number> 分钟 后执行
                        </div>
                      </div>
                    </template>
                    <template v-if="tabTwoSelect==='3'">
                      <el-select class="float-l margin-right-10" style="width: 120px" v-model="showType">
                        <el-option
                          v-for="op in [{value: '0',label: '正常开启'},{value: '1',label: '间歇开启'}]"
                          :key="op.value" :label="op.label" :value="op.value" @click.native="chooseTypeClk">
                        </el-option>
                      </el-select>
                      <div class="float-l margin-right-10"><span class="fontSiz">预警文本：</span>
                        <el-input type="textarea" :rows="2" :maxlength="30" style="width: 160px"></el-input>
                      </div>
                      <div class="eq_plan_statusIcon float-l margin-right-10" :class="delayshow?'active':''">
                        <i class="i-delay float-l" @click="OperDelay"></i>
                        <div v-show="delayshow" class="float-l eq_plan_statusIconTxt">延迟
                          <el-input-number v-model="delayTime" :min="0"></el-input-number> 分钟 后执行
                        </div>
                      </div>
                    </template>
                  </div>
                </div>
                <div class="def-tip">暂无执行条件，请添加</div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button @click="saveToDraft">存为草稿</el-button>
        <el-button type="primary" @click="saveSubmitInfo">保存并应用</el-button>
      </div>
    </el-dialog>
    <batch-add ref="batchAddDialog" v-on:checkCgqEvent="checkCgqEvent"></batch-add>
  </div>
</template>

<script>
import batchAdd from './batchAdd'
export default {
  data() {
    return {
      timeRanger: '',
      checkAll: false,
      userAreaId:'',
      showName:'',
      userColEsnList:[],
      userCgqEsnList:[],
      checkedWeeks: [],
      // weekdays: ['日', '一', '二', '三', '四', '五', '六'],
      weekdays: [
        {id:1,name:'日'},
        {id:64,name:'一'},
        {id:32,name:'二'},
        {id:16,name:'三'},
        {id:8,name:'四'},
        {id:4,name:'五'},
        {id:2,name:'六'},
        ],
      isIndeterminate: true,
      tabOneSelect: '1',
      tabTwoSelect: '1',
      showType: '1',
      delayTime: '',
      delayshow: false,
      dialogFormVisible: false,
      formObject: {
        ref: 'formName',
        model: {
          name: '',
          state: '',
          type:[],
          show:[],
          showFlag:true,
          isIndeterminate:[],
          checkAll:[],//周全选
          checkedWeeks:[],//选择周
          planTime:[],//开始结束时间
          planEsnLogic:[],
          planEsnValue:[],
          planEsnHysValue:[],
          tabOneSelect:[],
          checkCgqList:[],

          switch: false,
          checked: false,
          time: '',
          validTime:'2099-12-31 00:00:00'
        },
        rules: {

        }
      }
    };
  },
  computed: {
    UID() {
      return this.$store.getters.userid
    }
  },
  components: {
    batchAdd
  },
  created() {
  },
  methods: {
    openDiag(userAreaId,userAreaName,userColEsnList,userCgqEsnList) {
      this.userAreaId=userAreaId
      this.showName=userAreaName
      this.userColEsnList=userColEsnList
      this.userCgqEsnList=userCgqEsnList
      var that = this
      setTimeout(() => {
        that.dialogFormVisible = true
      }, 1)
    },
    saveSubmitInfo() {
      var that = this
      // this.$refs[that.formObject.ref].validate(valid => {
      //   if (valid) {
      //     const paramsData = {
      //       userId: that.UID,
      //       name: that.formObject.model.name,
      //       ip: that.formObject.model.ip,
      //       type: that.formObject.model.type,
      //       address: that.formObject.model.address,
      //       company: that.formObject.model.company,
      //       cgData: that.formObject.model.cgData,
      //       unit: that.formObject.model.unit,
      //       owner: that.formObject.model.owner
      //     }
      //     that.$http.post('/esn/add', paramsData, function(res) {
      //       if (res.success) {
      //         that.$message({
      //           message: '信息保存成功',
      //           type: 'success'
      //         })
      //         that.closeDialog()
      //         that.$parent.resetInfo()
      //       }
      //     })
      //   }
      // })
    },
    saveToDraft() {

    },
    OperDelete(index) {
      // this.formObject.model.show[index]=false;
      this.$set(this.formObject.model.show,index,false)
      let vflag=true
      for(let i=0;i<this.formObject.model.show.length;i++){
          if(this.formObject.model.show[i]==true){
           vflag=false
          }
      }
      if(vflag){
        this.formObject.model.showFlag==true
      }else {
        this.formObject.model.showFlag==false
      }
    },
    OperDelay() {
      this.delayshow = !this.delayshow
    },
    closeDialog() {
      this.$refs[this.formObject.ref].resetFields()
      this.dialogFormVisible = false
    },
    handleTimeChange(val) {
      console.log(val)
    },
    handleCheckAllChange(index) {
      // this.checkedWeeks = val ? this.weekdays : [];
      // this.isIndeterminate = false;
    },
    handleCheckedWeeksChange(index) {
      let value=this.formObject.model.checkedWeeks[index]
      // alert(value.length)
      if(value.length==7){
        this.$set(this.formObject.model.checkAll,index,true)
        this.$set(this.formObject.model.isIndeterminate,index,false)
      }else{
        this.$set(this.formObject.model.checkAll,index,false)
        this.$set(this.formObject.model.isIndeterminate,index,true)
      }
    },
    chooseTypeClk(val) {
      console.log(val)
    },
    batchAddShebei(index) {
      this.$refs.batchAddDialog.openShebeiDiag(this.userAreaId,this.showName,this.userColEsnList,this.userCgqEsnList,index)
    },
    addClk(){
      this.formObject.model.type.push(0)
      this.formObject.model.tabOneSelect.push(0)
      this.formObject.model.planEsnLogic.push(">=")
      this.formObject.model.checkAll.push(false)
      this.formObject.model.isIndeterminate.push(false)
      this.formObject.model.checkedWeeks.push([])
      this.formObject.model.checkCgqList.push({id:'1',name:"请选择设备"}),
      this.formObject.model.show.push(true)
    },
    changeTjClk(index){
      let val=this.formObject.model.type[index]
      this.$set(this.formObject.model.tabOneSelect,index,val)
    },
    checkCgqEvent(checkCgqList,index){
      this.$set(this. formObject.model.checkCgqList,index,checkCgqList[0])
    }
  }
};
</script>
