<template>
  <div class="app-container">
    <div class="form-filter">
      <filter-form v-show="activeName==='1'" :formObject="formObjectFirst"></filter-form>
      <filter-form v-show="activeName==='2'" :formObject="formObjectTwo"></filter-form>
    </div>
    <div class="list-tabs-show">
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="操作日志列表" name="1">
          <complex-table ref="tableChildObj" :tableObject="tableObjectFirst" @pageCurFun="currentPageChangeFirst"></complex-table>
        </el-tab-pane>
        <!--<el-tab-pane label="预警日志列表" name="2">-->
          <!--<complex-table ref="tableChildObj2" :tableObject="tableObjectTwo" @pageCurFun="currentPageChangeTwo"></complex-table>-->
        <!--</el-tab-pane>-->
      </el-tabs>
    </div>
  </div>
</template>

<script>
  import { dateFormat } from '@/utils'
  import filterForm from '@/components/FilterForm'
  import complexTable from '@/components/ComplexTable'

  export default {
    data() {
      return {
        activeName: '1',
        tableObjectFirst: {
          el: 'tableLogFirst',
          data: [],
          pageNo: 1,
          total: 0,
          pageSize: 10,
          arr: [
            {
              prop: 'ip',
              tit: '操作ip'
            },
            {
              prop: 'name',
              tit: '操作名称'
            },
            {
              prop: 'content',
              tit: '操作内容'
            },
            {
              prop: 'createTime',
              tit: '创建时间'
            }
          ]
        },
        tableObjectTwo: {
          el: 'tableLogTwo',
          data: [],
          pageNo: 1,
          total: 0,
          pageSize: 10,
          arr: [
            {
              prop: 'LogsID',
              tit: '预警触发地块'
            },
            {
              prop: 'Logs_Date',
              tit: '触发/解除时间'
            },
            {
              prop: 'Control_Way',
              tit: '预警方式'
            },
            {
              prop: 'Control_Man',
              tit: '预警内容'
            }
          ]
        },
        formObjectFirst: {
          ref: 'first',
          model: {
            Logs_Date: '',
            Control_Type: '',
            Control_Way: '',
            Control_Man: ''
          },
          arr: [
            // {
            //   prop: 'Logs_Date',
            //   tit: '操作时间',
            //   date: true,
            // },
            // {
            //   prop: 'Control_Type',
            //   tit: '操作类型'
            // },
            // {
            //   prop: 'Control_Way',
            //   tit: '操作方式'
            // },
            // {
            //   prop: 'Control_Man',
            //   tit: '操作人'
            // }
          ],
          oFun: [
            // {
            //   name: '查询',
            //   event: 'submitFirstFun'
            // }
          ]
        },
        formObjectTwo: {
          ref: 'two',
          model: {
            Logs_Date: '',
            Control_Type: '',
            Control_Way: '',
            Control_Man: ''
          },
          arr: [
            {
              prop: 'Logs_Date',
              tit: '触发时间',
              date: true,
            },
            {
              prop: 'Control_Type',
              tit: '触发地块'
            },
            {
              prop: 'Control_Way',
              tit: '预警方式'
            }
          ],
          oFun: [
            {
              name: '查询',
              event: 'edit'
            }
          ]
        }
      }
    },
    components: {
      filterForm,
      complexTable
    },
    computed: {
    },
    created() {
      this.queryInfoList()
    },
    methods: {
      queryInfoList() {
        var that = this
        that.tableLoading = true
        var whereObj={'userId': that.UID}
        // if(this.formObjectFirst.model.name!=''){
        //   whereObj.name=this.formObjectFirst.model.name
        // }
        this.$http.post('/logs/getPageList', {
          where: whereObj,
          curpage: that.tableObjectFirst.pageNo,
          pagesize: that.tableObjectFirst.pageSize,
          sortField:'createTime',
          orderBy:'desc'
        }, function(res) {
          that.tableLoading = false
          const obj = res.data.rows
          that.tableObjectFirst.data = obj
          that.tableObjectFirst.total = res.data.sumcount
        })
      },
      currentPageChangeFirst(val) {
        this.tableObjectFirst.pageNo = val
        this.queryInfoList()
      },
      currentPageChangeTwo(val) {
        this.tableObjectTwo.pageNo = val
        this.queryInfoList()
      },
      submitFirstFun() {
        console.log(123)
      }
    }
  }
</script>
