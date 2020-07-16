<template>
  <div class="app-container">
    <div class="n_group_content">
      <div class="n_dapengL">
        <drop-down :options="{list: videoList, cur: showName}" @chooseFun="chooseQyCck"></drop-down>
        <div class="n_newGroup">
          <el-form :model="formObject.model" :ref="formObject.model" class="formClass">
            <el-form-item v-for="item in formObject.arr" :key="item.index" :label="item.tit + ' :'">
              <el-select v-if="item.select && !item.list" v-model="showType" :placeholder="item.tit">
                <el-option
                  v-for="item in [{value: '0',label: '单点'},{value: '1',label: '行程'}]"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  @click.native="chooseTypeClk(item.value)">
                </el-option>
              </el-select>
              <el-input v-if="!item.select &&!item.list" v-model="formObject.model[item.prop]"
                        :placeholder="item.tit"></el-input>
              <el-row v-if="item.list" class="list-shebei">
                <el-col v-for="esnItem in esnIdsList" :key="esnItem.id">{{esnItem.name}}</el-col>
                <!--<el-col>1#风机</el-col>-->
              </el-row>
            </el-form-item>
            <el-form-item class="btn-form-item">
              <el-button type="primary" @click="addClear">清除</el-button>
              <el-button v-show="id!=''" type="primary" @click="deleteClk" >删除分组</el-button>
              <el-button type="primary" @click="saveClk">保存</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="n_dapeng_status">
        <div class="n_dapeng_statusbox">
          <el-row>
            <el-col v-for="items in esnList" :key="items.id" @click.native="chooseGroupEsnClk(items.id,items.name)"
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
            <!--<el-col class="n_status_icon n_status_run">-->
            <!--<i class="icon-ylql"></i><p>1号点</p>-->
            <!--</el-col>-->
            <!--<el-col class="n_status_icon n_status_danger">-->
            <!--<i class="icon-ylql"></i><p>2号点</p>-->
            <!--</el-col>-->
            <!--<el-col class="n_status_icon n_status_close">-->
            <!--<i class="icon-ylql"></i><p>3号点</p>-->
            <!--</el-col>-->
          </el-row>
        </div>
      </div>
      <div class="n_plan">
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
  </div>
</template>

<script>
  import dropDown from '@/components/DropDown'

  export default {
    data() {
      return {
        showType: '1',
        showName: '1区',
        id:'',
        showNameId: '',
        esnList: [],
        groupList:[],
        esnIdsList: [
          // {id: '1', name: '01#内遮阳'},
          // {id: '2', name: '01#左天窗'},
          // {id: '3', name: '03#右天窗'},
        ],
        videoList: [
          {
            id: '1',
            name: '1区'
          },
          {
            id: '2',
            name: '2区'
          },
          {
            id: '3',
            name: '3区'
          },
          {
            id: '4',
            name: '4区'
          }
        ],
        formObject: {
          model: {
            name: '',
            type: '1',
            description: '',
            esnIds: ''
          },
          arr: [
            {
              prop: 'name',
              tit: '设备编组'
            },
            {
              prop: 'type',
              tit: '编组类型',
              select: true
            },
            {
              prop: 'description',
              tit: '详情备注'
            },
            {
              prop: 'esnIds',
              tit: '所属设备',
              list: true
            }
          ],
          oFun: [
            {
              name: '新增编组',
              event: 'addClear'
            },
            {
              name: '保存',
              event: 'edit'
            }
          ]
        }
      };
    },
    components: {
      dropDown
    },
    created() {
      // this.queryInfoList()
      this.queryUserAreaList()
    },
    computed: {
      UID() {
        return this.$store.getters.userid
      }
    },
    methods: {
      queryInfoList() {
        var that = this;
        this.$http.post('/group/getGroupList', {
          userAreaId: that.showNameId
        }, function(res) {
          const obj = res.data
          that.groupList = obj
        })
      },
      getEsnListByEsnIds(esnIds) {
        var that = this;
        this.$http.post('/group/getEsnListByEsnIds', {
          esnIds: esnIds
        }, function(res) {
          const obj = res.data
          that.esnIdsList = obj
        })
      },
      deleteClk(){
        var that=this
        this.$http.post('/group/delete', {
          id: that.id
        }, function(res) {
          if (res.success) {
            that.$message({
              message: "删除成功",
              type: 'success'
            })
            that.addClear()
            that.queryInfoList()
          }
        })
      },
      handelTapBtn(val) {
        this.btnActive = val
      },
      queryUserEsnListByUserAreaId(userAreaId) {
        var that = this;
        var esnType = 'PLC行程手动控制器'
        if (that.showType == '0') {
          esnType = 'PLC单点控制器'
        }
        this.$http.post('/group/getUserEsnByUserAreaIdAndType', {
          type: esnType,
          userAreaId: userAreaId,
        }, function (res) {
          const obj = res.data
          if (obj.length != 0) {
            that.esnList = obj;
          }
        })
      },
      chooseQyCck(val) {
        console.log(val.id)
        this.esnList = []
        this.showName = val.name
        this.showNameId = val.id
        this.queryInfoList()
        this.queryUserEsnListByUserAreaId(val.id)
      },
      chooseTypeClk(value) {
        this.esnList = []
        this.addClear()
        this.showType=value;
        this.queryUserEsnListByUserAreaId(this.showNameId)
      },
      chooseGroupEsnClk(id, name) {
        // alert("选择设备id：" + id + "选择设备名称：" + name)
        let videoList = this.esnIdsList
        let flag = true
        for (let i = 0; i < videoList.length; i++) {
          if (videoList[i].id == id) {
            videoList.splice(i, 1)
            flag = false
          }
        }
        if (flag) {
          videoList.push({id: id, name: name})
        }
      },
      addClear() {//新增编组
        this.showType = '1'
        this.esnIdsList = []
        this.formObject.model.name=''
        this.formObject.model.description=''
        this.id=''
      },
      saveClk(){
        if(this.id==''){
          this.save()
        }else {
          this.update()
        }
      },
      showGroupInfo(index){//回显编组信息
      // alert("index:"+index)
        var that=this
        that.formObject.model.name=that.groupList[index].name
        that.formObject.model.description=that.groupList[index].description
        that.showType=that.groupList[index].type
        that.esnIdsList=[]
        that.getEsnListByEsnIds(that.groupList[index].esnIds)
        that.id=that.groupList[index].id
      },
      save() {//保存
        var that=this
        var name = this.formObject.model.name;
        if (name == "") {
          this.$message({
            message: "请输入编组名称",
            type: 'error'
          })
          return
        }
        if (this.esnIdsList.length == 0) {
          this.$message({
            message: "请选择所属设备",
            type: 'error'
          })
          return
        }
        var esnIds = ""
        for (let i = 0; i < this.esnIdsList.length; i++) {
          esnIds += this.esnIdsList[i].id + ";"
        }
        this.$http.post('/group/add', {
          userAreaId: this.showNameId,
          name: name,
          type: this.showType,
          description: this.formObject.model.description,
          esnIds: esnIds,
        }, function (res) {
          if (res.success) {
            that.$message({
              message: "保存成功",
              type: 'success'
            })
            that.addClear()
            that.queryInfoList()
          }
        })
      },
      update() {//更新
        var that=this
        var name = this.formObject.model.name;
        if (name == "") {
          this.$message({
            message: "请输入编组名称",
            type: 'error'
          })
          return
        }
        if (this.esnIdsList.length == 0) {
          this.$message({
            message: "请选择所属设备",
            type: 'error'
          })
          return
        }
        var esnIds = ""
        for (let i = 0; i < this.esnIdsList.length; i++) {
          esnIds += this.esnIdsList[i].id + ";"
        }
        this.$http.post('/group/update', {
          userAreaId: this.showNameId,
          name: name,
          id:that.id,
          type: this.showType,
          description: this.formObject.model.description,
          esnIds: esnIds,
        }, function (res) {
          if (res.success) {
            that.$message({
              message: "编辑成功",
              type: 'success'
            })
            that.addClear()
            that.queryInfoList()
          }
        })
      },
      queryUserAreaList() {
        var that = this;
        this.$http.post('/group/getUserAreaByUserId', {
          userId: that.UID,
        }, function (res) {
          const obj = res.data
          if (obj.length != 0) {
            that.videoList = obj
            that.chooseQyCck(obj[0])
          }
        })
      },
    }
  };
</script>
