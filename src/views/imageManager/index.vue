<template>
  <div class="app-container">
    <div class="form-filter">
      <filter-form v-show="activeName==='1'" :formObject="formObjectFirst" @search="search" @addOpenDialogFun="addOpenDialogFun" @addOpenDialogFun1="addOpenDialogFun1"></filter-form>
    </div>
    <div class="list-tabs-show">
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="图片列表明细" name="1">
          <complex-table v-loading="tableLoading"
                         :tableObject="tableObjectFirst"
                         @pageCurFun="currentPageChangeFirst"
                         @pageSizeFun="pageSizeChangeFirst"
                         @showImgFun="showImgFun"
                         @downloadFun="downloadFun"
                         @printFun="printFun"
                         @deleteFun="deleteFun"
                         @editOpenDialogFun="editOpenDialogFun"></complex-table>
        </el-tab-pane>
      </el-tabs>
    </div>
    <upload-bmp ref="openUploagBmpDialog"></upload-bmp>
    <upload-print-bmp ref="openUploagBmpDialog1"></upload-print-bmp>
    <show-image ref="openShowImageDialog"></show-image>
    <!--<add-device ref="openUserEsnDialog"></add-device>-->
    <!--<update-device ref="openUserEsnUpdateDialog"></update-device>-->
  </div>
</template>

<script>
  import { dateFormat } from '@/utils'
  import filterForm from '@/components/FilterForm'
  import complexTable from '@/components/ComplexTable'
  import uploadBmp  from './uploadBmp'
  import uploadPrintBmp  from './uploadPrintBmp'
  import showImage  from './showImage'
  import Upload from "element-ui/packages/upload/src/upload";

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
              prop: 'imei',
              tit: '设备IMEI号'
            },
            {
              prop: 'esnName',
              tit: '设备名称'
            },
            {
              prop: 'time',
              tit: '日期'
            },
            {
              prop: 'name',
              tit: '图片名称'
            },
            {
              prop: 'showImg',
              tit: '图片显示',
              event:'showImgFun'
            },
            {
              prop: 'bmpImg',
              tit: 'BMP图片',
              event:'showImgFun'
            },
            {
              prop: 'type',
              tit: '图片类型'
            },
            {
              prop: 'pictureTypeName',
              tit: '图片版型'
            },
            {
              prop: 'statusName',
              tit: '图片状态',
              color:true
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
              icon: 'download',
              title:'领取任务',
              event: 'downloadFun'
            },
            {
              icon: 'print',
              title:'下发打印',
              event: 'printFun'
            },
            {
              icon: 'delete',
              title:'删除',
              event: 'deleteFun'
            }
            // {
            //   icon: 'close',
            //   title:'停用',
            //   event: 'stopFun'
            // },
            // {
            //   icon: 'edit',
            //   title:'编辑',
            //   event: 'editOpenDialogFun'
            // },

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
              tit: '图片名称',
            },
            {
              prop: 'imei',
              tit: '设备IMEI号'
            }
          ],
          oFun: [
            {
              name: 'BMP图片上传',
              event: 'addOpenDialogFun'
            },
            {
              name: 'BMP上传并打印',
              event: 'addOpenDialogFun1'
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
      Upload,
      filterForm,
      complexTable,
      uploadBmp,
      showImage,
      uploadPrintBmp
      // addDevice,
      // updateDevice
    },
    computed: {
      UID() {
        return this.$store.getters.userid
      }
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
    destroyed: function () {
      console.log('离开页面')
      clearInterval(this.timer)
    },
    methods: {
      setTimer() {
        this.timer = setInterval( () => {
          console.log('定时器')
          this.queryInfoList(true)
        }, 3000)

      },
      queryInfoList(ds) {
        var that = this
        if(!ds)
        that.tableLoading = true
        var whereObj={status:'no-6',}
        // var whereObj={'userId': that.UID}
        if(this.formObjectFirst.model.name!=''){
          whereObj.name=this.formObjectFirst.model.name
        }
        if(this.formObjectFirst.model.imei!=''){
          whereObj.imei=this.formObjectFirst.model.imei
        }
        this.$http.post('/imageManager/getImageList', {
          where: whereObj,
          sortField:'createTime',
          orderBy:'desc',
          curpage: that.tableObjectFirst.pageNo,
          pagesize: that.tableObjectFirst.pageSize
        }, function(res) {
          that.tableLoading = false
          const obj = res.data.rows
           let obj1 = []
          for(let i = 0; i < obj.length; ++i) {
            if(obj[i].status=='0'){
              obj[i].statusName='未处理'
            }else if(obj[i].status=='1'){
              obj[i].statusName='处理中'
            }else if(obj[i].status=='2'){
              obj[i].statusName='已处理'
            }else if(obj[i].status=='3'){
              obj[i].statusName='正在下载'
            }else if(obj[i].status=='4'){
              obj[i].statusName='已下发'
              // alert("已下发"+obj[i].id)
              // that.autoDeleteFun(obj[i])
            }else if(obj[i].status=='5'){
              obj[i].statusName='正在打印'
            }else if(obj[i].status=='6'){
              obj[i].statusName='已打印'
              // obj[i].splice(i,1)
            }
            if(obj[i].pictureType=='1'){
              obj[i].pictureTypeName='横版'
            }else if(obj[i].pictureType=='2'){
              obj[i].pictureTypeName='竖版'
            }
            obj[i].showImg="https://zzfset.oss-cn-beijing.aliyuncs.com/yzd/original/"+obj[i].name
            if(obj[i].status=='0'||obj[i].status=='1'){
              obj[i].bmpImg=''
            }else {
              let nameArr=obj[i].name.split(".");
              obj[i].bmpImg="https://zzfset.oss-cn-beijing.aliyuncs.com/yzd/bmp/"+nameArr[0]+".bmp"
            }
            // if(obj[i].status=='0'||obj[i].status=='1'||obj[i].status=='2'){
              obj1.push(obj[i])
            // }
          }
          that.tableObjectFirst.data = obj1
          that.tableObjectFirst.total = res.data.sumcount
        })
      },
      search(){
        this.resetInfo()
      },
      deleteFun(val){//删除
        var that=this
        if(confirm("确实要删除图片吗？")) {
          this.$http.post('/imageManager/delete', {
            id: val.id
          }, function (res) {
            if (res.success) {
              that.$message({
                message: "删除成功",
                type: 'success'
              })
              that.queryInfoList()
            }
          })
        }
      },
      autoDeleteFun(val){//删除
        // var that=this
        // console.log(val.id)
        // if(confirm("确实要删除图片吗？")) {
          this.$http.post('/imageManager/delete', {
            id: val.id
          }, function (res) {
            // if (res.success) {
            //   that.$message({
            //     message: "删除成功",
            //     type: 'success'
            //   })
            //   // that.queryInfoList()
            // }
          })
        // }
      },
      showImgFun(val,type){//显示图片
        // alert(type+"==="+val[type])
        this.$refs.openShowImageDialog.openDiag(val[type])
      },
      downloadFun(val){//领取任务
        // alert('领取任务')
        if(confirm("确实要领取任务吗？")) {
          var that = this
          location.href = "/yzd/imageManager/downloadImge?id=" + val.id+"&userId="+that.UID;
          setTimeout(() => {
            that.queryInfoList()
          }, 3000)
        }
      },
      printFun(val){//下发打印
        var that=this
        // alert("下发打印")
        if(val.status!='2'){
          alert("图片未处理，无法打印！")
          return;
        }
        if(confirm("确实要打印图片吗？")) {
          this.$http.post('/imageManager/printImg', {
            id: val.id
          }, function (res) {
            if (res.success) {
              that.$message({
                message: "下发打印成功",
                type: 'success'
              })
              this.queryInfoList()
            }
          })
        }
      },
      resetInfo() {
        this.tableObjectFirst.data = []
        this.tableObjectFirst.pageNo = 1
        this.tableObjectFirst.total = 0
        this.tableObjectFirst.pageSize = 10
        this.queryInfoList()
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
        this.$refs.openUploagBmpDialog.openDiag(val)
      },
      addOpenDialogFun1(val) {
        this.$refs.openUploagBmpDialog1.openDiag(val)
      }
    }
  }
</script>

