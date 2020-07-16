<template>
  <div class="app-container">
    <div class="form-filter">
      <filter-form v-show="activeName==='1'" :formObject="formObjectFirst" @addOpenDialogFun="addOpenDialogFun" @search="search"></filter-form>
    </div>
    <div class="list-tabs-show">
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="区域列表明细" name="1">
          <complex-table ref="tableChildObj" v-loading="tableLoading"
                         :tableObject="tableObjectFirst"
                         @pageCurFun="currentPageChangeFirst"
                         @pageSizeFun="pageSizeChangeFirst"
                         @deleteFun="deleteFun"
                         @editOpenDialogFun="editOpenDialogFun"></complex-table>
        </el-tab-pane>
      </el-tabs>
    </div>
    <add-Area ref="openUserAreaDialog"></add-Area>
    <update-area ref="openUserUpdateDialog"></update-area>
  </div>
</template>

<script>
  import filterForm from '@/components/FilterForm'
  import complexTable from '@/components/ComplexTable'
  import addArea from './addArea'
  import updateArea from './updateArea'

  export default {
    data() {
      return {
        activeName: '1',
        tableLoading: false,
        tableObjectFirst: {
          el: 'tableArea',
          data: [],
          pageNo: 1,
          total: 0,
          pageSize: 10,
          arr: [
            {
              prop: 'sn',
              tit: '区域编码'
            },
            {
              prop: 'name',
              tit: '区域名称'
            },
            {
              prop: 'imageUrl',
              tit: '区域图片Url'
            },
            {
              prop: 'imageParam',
              tit: '配置参数'
            },
            {
              prop: 'type',
              tit: '区域类别'
            },
            {
              prop: 'qkSn',
              tit: '所属区域'
            },
            {
              prop: 'description',
              tit: '备注'
            },
            {
              operate: 'edit',
              tit: '操作',
              width: '100'
            }
          ],
          oFun: [
            {
              icon: 'edit',
              event: 'editOpenDialogFun'
            },
            {
              icon: 'delete',
              event: 'deleteFun'
            }
          ]
        },
        formObjectFirst: {
          ref: 'first',
          model: {
            name: '',
            Control_Type: ''
          },
          arr: [
            {
              prop: 'name',
              tit: '区域名称'
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
      addArea,
      updateArea
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
        var whereObj={'userId': that.UID}
        if(this.formObjectFirst.model.name!=''){
          whereObj.name=this.formObjectFirst.model.name
        }
        this.$http.post('/userArea/getUserAreaList', {
          where: whereObj,
          curpage: that.tableObjectFirst.pageNo,
          pagesize: that.tableObjectFirst.pageSize
        }, function(res) {
          that.tableLoading = false
          const obj = res.data.rows
          that.tableObjectFirst.data = obj
          that.tableObjectFirst.total = res.data.sumcount
        })
      },
      search(){
        this.resetInfo()
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
        this.$http.post('/user/delete', {
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
        this.$refs.openUserUpdateDialog.openDiag(val)
      },
      addOpenDialogFun() {
        this.$refs.openUserAreaDialog.openDiag()
      }
    }
  }
</script>
