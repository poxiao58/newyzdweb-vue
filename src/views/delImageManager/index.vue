<template>
  <div class="app-container">
    <div class="form-filter">
      <filter-form v-show="activeName==='1'" :formObject="formObjectFirst" @search="search" @addOpenDialogFun="addOpenDialogFun" ></filter-form>
    </div>
    <div class="list-tabs-show">
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="图片列表明细" name="1">
          <complex-table v-loading="tableLoading"
                         :tableObject="tableObjectFirst"
                         @pageCurFun="currentPageChangeFirst"
                         @pageSizeFun="pageSizeChangeFirst"
                         @showImgFun="showImgFun"
                         @resetFun="resetFun"
                         @deleteFun="deleteFun"
                         @editOpenDialogFun="editOpenDialogFun"></complex-table>
        </el-tab-pane>
      </el-tabs>
    </div>
    <show-image ref="openShowImageDialog"></show-image>
    <!--<add-device ref="openUserEsnDialog"></add-device>-->
    <!--<update-device ref="openUserEsnUpdateDialog"></update-device>-->
  </div>
</template>

<script>
  import { dateFormat } from '@/utils'
  import filterForm from '@/components/FilterForm'
  import complexTable from '@/components/ComplexTable'
  import showImage  from '../imageManager/showImage'
  import Upload from "element-ui/packages/upload/src/upload";

  export default {
    data() {
      return {
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
              prop: 'time',
              tit: '日期'
            },
            {
              prop: 'name',
              tit: '图片名称'
            },
            {
              prop: 'showImg',
              tit: '图片显示(处理前)',
              event:'showImgFun'
            },
            {
              prop: 'bmpImg',
              tit: '图片显示(处理后)',
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
              prop: 'deleteTime',
              tit: '删除时间'
            },
            {
              operate: 'edit',
              tit: '操作',
              width: '100'
            }
          ],
          oFun: [
            // {
            //   icon: 'download',
            //   title:'领取任务',
            //   event: 'downloadFun'
            // },
            {
              icon: 'reset',
              title:'图片还原',
              event: 'resetFun'
            },
            {
              icon: 'delete',
              title:'永久删除',
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
            // {
            //   name: 'BMP图片上传',
            //   event: 'addOpenDialogFun'
            // },
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
      showImage
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
    },
    methods: {
      queryInfoList() {
        var that = this
        that.tableLoading = true
        var whereObj={delStatus:'0'}
        // var whereObj={'userId': that.UID}
        if(this.formObjectFirst.model.name!=''){
          whereObj.name=this.formObjectFirst.model.name
        }
        if(this.formObjectFirst.model.imei!=''){
          whereObj.imei=this.formObjectFirst.model.imei
        }
        this.$http.post('/delImageFile/getImageList', {
          where: whereObj,
          sortField:'deleteTime',
          orderBy:'asc',
          curpage: that.tableObjectFirst.pageNo,
          pagesize: that.tableObjectFirst.pageSize
        }, function(res) {
          that.tableLoading = false
          const obj = res.data.rows
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
            // obj[i].showImg="/yzd/fileImg/original/"+obj[i].imei+"/"+obj[i].time+"/"+obj[i].name
            obj[i].showImg="https://zzfset.oss-cn-beijing.aliyuncs.com/yzd/original/"+obj[i].name
            if(obj[i].status=='0'||obj[i].status=='1'){
              obj[i].bmpImg=''
            }else {
              let nameArr=obj[i].name.split(".");
              obj[i].bmpImg="https://zzfset.oss-cn-beijing.aliyuncs.com/yzd/bmp/"+nameArr[0]+".bmp"
              // obj[i].bmpImg="/yzd/fileImg/BMP/"+obj[i].imei+"/"+obj[i].time+"/"+nameArr[0]+".bmp"
            }
          }
          that.tableObjectFirst.data = obj
          that.tableObjectFirst.total = res.data.sumcount
        })
      },
      search(){
        this.resetInfo()
      },
      deleteFun(val){//永久删除
        var that=this
        if(confirm("确实要永久删除图片吗？")) {
          this.$http.post('/delImageFile/delete', {
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
      showImgFun(val,type){//显示图片
        // alert(type+"==="+val[type])
        this.$refs.openShowImageDialog.openDiag(val[type])
      },
      resetFun(val){//图片还原
        var that=this
        if(confirm("确实要还原图片吗？")) {
          this.$http.post('/delImageFile/resetImg', {
            id: val.id
          }, function (res) {
            if (res.success) {
              that.$message({
                message: "还原成功",
                type: 'success'
              })
            }
            that.queryInfoList()
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
      }
    }
  }
</script>

