<template>
  <div class="app-container">
    <div class="form-filter">
      <filter-form v-show="activeName==='1'" :formObject="formObjectFirst" @addOpenDialogFun="addOpenDialogFun" @search="search"></filter-form>
    </div>
    <div class="list-tabs-show">
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="设备列表明细" name="1">
          <complex-table v-loading="tableLoading"
                         :tableObject="tableObjectFirst"
                         @pageCurFun="currentPageChangeFirst"
                         @pageSizeFun="pageSizeChangeFirst"
                         @deleteFun="deleteFun"
                         @startFun="startFunClk"
                         @stopFun="stopFunClk"
                         @refreshFun="refreshFunClk"
                         @binUploadFun="binUploadFun"
                         @editOpenDialogFun="editOpenDialogFun"></complex-table>
        </el-tab-pane>
      </el-tabs>
    </div>
    <add-device ref="openUserEsnDialog"></add-device>
    <update-device ref="openUserEsnUpdateDialog"></update-device>
    <upload-bin-dialog ref="openBinDialog"></upload-bin-dialog>
    <check-dialog ref="checkDialog"></check-dialog>

  </div>
</template>

<script>
  import { dateFormat } from '@/utils'
  import filterForm from '@/components/FilterForm'
  import complexTable from '@/components/ComplexTable'
  import addDevice from './addDevice'
  import updateDevice from './updateDevice'
  import checkDialog from "./checkDialog"
  import uploadBinDialog from "./uploadBinDialog";

  export default {
    data() {
      return {
        timer:null,
        activeName: '1',
        tableLoading: false,
        tableObjectFirst: {
          el: 'tableDevice',
          data: [],
          pageNo: 1,
          total: 0,
          pageSize: 10,
          arr: [
            {
              prop: 'name',
              tit: '设备名称'
            },
            {
              prop: 'imei',
              tit: '设备IMEI号'
            },
            {
              prop: 'city',
              tit: '设备位置'
            },
            {
              prop: 'status',
              tit: '设备状态',
              esnColor:true
            },
            {
              prop: 'rssi',
              tit: '信号强度'
            },
            {
              prop: 'iccid',
              tit: '物联网卡号'
            },
            {
              prop: 'dataPlan',
              tit: '套餐大小(M)'
            },
            {
              prop: 'dataUsage',
              tit: '当月用量(M)'
            },
            {
              prop: 'dataBalance',
              tit: '剩余流量(M)'
            },
            {
              prop: 'expiryDate',
              tit: '计费结束日期'
            },
            {
              prop: 'printNum',
              tit: '打印次数'
            },
            {
              prop: 'nowVersion',
              tit: '固件版本号'
            },
            {
              prop: 'binDescription',
              tit: '固件备注'
            },
            {
              prop: 'updateTime',
              tit: '更新时间'
            },
            {
              prop: 'createTime',
              tit: '创建时间'
            },
            {
              operate: 'edit',
              tit: '操作',
              width: '100'
            }
          ],
          oFun: [
            {
              icon: 'open',
              title:'授权',
              event: 'startFun'
            },
            {
              icon: 'close',
              title:'关闭',
              event: 'stopFun'
            },
            {
              title:'重启',
              icon: 'refresh',
              event: 'refreshFun'
            },
            {
              icon: 'edit',
              title:'编辑',
              event: 'editOpenDialogFun'
            },
            {
              icon: 'delete',
              title:'删除',
              event: 'deleteFun'
            },
            {
              show:false,
              title:'上传文件',
              icon: 'logs',
              event: 'binUploadFun'
            },

          ]
        },
        formObjectFirst: {
          ref: 'first',
          model: {
            name: '',
            imei: ''
          },
          arr: [
            {
              prop: 'name',
              tit: '设备名称',
            },
            {
              prop: 'imei',
              tit: '设备IMEI号'
            }
          ],
          oFun: [
            {
              name: '新增',
              event: 'addOpenDialogFun'
            },
            {
              name: '查询',
              event: 'search'
            }
          ]
        }
      }
    },
    components: {
      filterForm,
      complexTable,
      addDevice,
      updateDevice,
      checkDialog,
      uploadBinDialog
    },
    computed: {
      UID() {
        return this.$store.getters.userid
      },

    },
    created() {
      this.queryInfoList()
      // setTimeout(() => {
      //   this.setTimer()
      // }, 1000)
    },
    mounted() {

      clearInterval(this.timer)

    },
    destroyed: function () {
      console.log('离开页面')
      clearInterval(this.timer)
    },
    //
    methods: {
      setTimer() {

        this.timer = setInterval( () => {
          console.log('定时器')
          this.queryInfoList(true)
        }, 3000)

      },
      queryInfoList(ds) {
        var that = this
        if (!ds)
        that.tableLoading = true
        var whereObj={}
        // var whereObj={'userId': that.UID}
        if(this.formObjectFirst.model.name!=''){
          whereObj.name=this.formObjectFirst.model.name
        }
        if(this.formObjectFirst.model.imei!=''){
          whereObj.imei=this.formObjectFirst.model.imei
        }
        this.$http.post('/esn/getUserEsnList', {
          where: whereObj,
          curpage: that.tableObjectFirst.pageNo,
          pagesize: that.tableObjectFirst.pageSize
        }, function(res) {
          that.tableLoading = false
          const obj = res.data.rows
          for(let i = 0; i < obj.length; ++i) {
            if(obj[i].status=='0'){
              obj[i].status='空闲'
            }else if(obj[i].status=='1'){
              obj[i].status='正在工作'
            }else if(obj[i].status=='2'){
              obj[i].status='设备故障'
            }else if(obj[i].status=='3'){
              obj[i].status='停机'
            }else if(obj[i].status=='4'){
              obj[i].status='未获取'
            }else if(obj[i].status=='5'){
              obj[i].status='离线'
            }
          }
          that.tableObjectFirst.data = obj
          that.tableObjectFirst.total = res.data.sumcount

        })
      },
      search(){
        this.resetInfo()
      },
      deleteFun(val){
        var that=this
        this.$http.post('/esn/delete', {
          id: val.id
        }, function(res) {
          if (res.success) {
            that.$message({
              message: "删除成功",
              type: 'success'
            })
            that.$parent.qureyInfoList()
          }
        })
      },
      startFun(val){//开启
        var that=this
        that.tableLoading = true
        this.$http.post('/esn/operation', {
          imei: val.imei,
          status:'2'
        }, function(res) {
          that.tableLoading = false
          if (res.success) {
            that.$message({
              message: "启用成功",
              type: 'success'
            })
            // that.$parent.qureyInfoList()
          }
        })
      },
      refreshFun(val){//重启
        var that=this
        that.tableLoading = true
        this.$http.post('/esn/operation', {
          imei: val.imei,
          status:'1'
        }, function(res) {
          that.tableLoading = false
          if (res.success) {
            that.$message({
              message: "启用成功",
              type: 'success'
            })

            // that.$parent.qureyInfoList()
          }
        })
      },
      stopFun(val){//停用
        var that=this
        that.tableLoading = true
        this.$http.post('/esn/operation', {
          imei: val.imei,
          status:'3'
        }, function(res) {
          that.tableLoading = false
          if (res.success) {
            that.$message({
              message: "启用成功",
              type: 'success'
            })
          }
        })
      },
      binUploadFun(val) {
        console.log("bin文件上传", val)
        this.$refs.checkDialog.openDiag(val,'bin')
      },
      startFunClk(val) {
        this.$refs.checkDialog.openDiag(val,'start')
      },
      stopFunClk(val) {
        this.$refs.checkDialog.openDiag(val,'stop')
      },
      refreshFunClk(val) {
        this.$refs.checkDialog.openDiag(val,'refresh')
      },
      resetInfo() {
        this.tableObjectFirst.data = []
        this.tableObjectFirst.pageNo = 1
        this.tableObjectFirst.total = 0
        this.tableObjectFirst.pageSize = 10
        this.queryInfoList()
      },
      deleteFun(val){
        var that=this
        this.$http.post('/esn/delete', {
          id: val.id
        }, function(res) {
          if (res.success) {
            that.$message({
              message: "删除成功",
              type: 'success'
            })
            that.resetInfo()
          }
        })
      },
      pageSizeChangeFirst(val) {
        this.tableObjectFirst.pageSize = val
        this.queryInfoList()
      },
      currentPageChangeFirst(val) {
        this.tableObjectFirst.pageNo = val
        this.queryInfoList()
      },
      editOpenDialogFun(val) {
        this.$refs.openUserEsnUpdateDialog.openDiag(val)
      },
      addOpenDialogFun(val) {
        this.$refs.openUserEsnDialog.openDiag(val)
      }
    }
  }
</script>
