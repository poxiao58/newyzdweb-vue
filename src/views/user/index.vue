<template>
  <div class="app-container">
    <div class="form-filter">
      <filter-form v-show="activeName==='1'" :formObject="formObjectFirst" @addOpenDialogFun="addOpenDialogFun" @search="search"></filter-form>
    </div>
    <div class="list-tabs-show">
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="用户列表明细" name="1">
          <complex-table v-loading="tableLoading"
            :tableObject="tableObjectFirst"
            @pageCurFun="currentPageChangeFirst"
            @pageSizeFun="pageSizeChangeFirst"
            @deleteFun="deleteFun"
            @editOpenDialogFun="editOpenDialogFun"></complex-table>
        </el-tab-pane>
      </el-tabs>
    </div>
    <add-user ref="openUserDialog"></add-user>
    <update-user ref="openUserUpdateDialog"></update-user>
  </div>
</template>

<script>
  import { dateFormat } from '@/utils'
  import filterForm from '@/components/FilterForm'
  import complexTable from '@/components/ComplexTable'
  import addUser from './addUser'
  import updateUser from './updateUser'

  export default {
    data() {
      return {
        activeName: '1',
        tableLoading: false,
        tableObjectFirst: {
          el: 'tableFirst',
          data: [],
          pageNo: 1,
          total: 0,
          pageSize: 10,
          arr: [
            {
              prop: 'id',
              tit: '用户ID'
            },
            {
              prop: 'name',
              tit: '用户姓名'
            },
            {
              prop: 'username',
              tit: '登录账户'
            },
            {
              prop: 'roleName',
              tit: '用户类型'
            },
            {
              prop: 'status',
              tit: '用户状态'
            },
            {
              prop: 'updateTime',
              tit: '最后登录时间'
            },
            {
              operate: true,
              tit: '操作'
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
            },
            {
              icon: 'reset_password',
              event: 'resetPwdFun'
            }
          ]
        },
        formObjectFirst: {
          ref: 'userForm',
          model: {
            username: '',
            name: ''
          },
          arr: [
            {
              prop: 'username',
              tit: '登录账户'
            },
            {
              prop: 'name',
              tit: '用户名称'
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
      addUser,
      updateUser
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
        var whereObj={'parentId': that.UID}
        if(this.formObjectFirst.model.username!=''){
          whereObj.username=this.formObjectFirst.model.username
        }
        if(this.formObjectFirst.model.name!=''){
          whereObj.name=this.formObjectFirst.model.name
        }
        this.$http.post('/user/getUserList', {
          where: whereObj,
          curpage: that.tableObjectFirst.pageNo,
          pagesize: that.tableObjectFirst.pageSize
        }, function(res) {
          that.tableLoading = false
          const obj = res.data.rows
          const objData = res.data.rows
          for(let i = 0; i < obj.length; ++i) {
            if (obj[i].Logs_Date) {
              obj[i].Logs_Date = dateFormat(obj[i].Logs_Date)
            }
            if(obj[i].status=="0"){
              objData[i].status='正常';
            }else if(obj[i].status=="1"){
              objData[i].status='已锁定';
            }
            objData[i].roleName=obj[i].roleList[0].name
          }
          that.tableObjectFirst.data = objData
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
          userId: val.id
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
      addOpenDialogFun(val) {
        this.$refs.openUserDialog.openDiag(val)
      }
    }
  }
</script>
