<template>
  <div class="tableClass">
    <el-table
      ref="tableBody"
      border
      :data="tableObject.data"
      :height="tableHeight+'rem'"
      :row-class-name="tableRowClassName"
      :header-row-class-name="tableThClassName"
    >
      <el-table-column
        v-for="item in tableObject.arr"
        :key="item.index"
        :prop="item.prop ? item.prop : ''"
        :label="item.tit ? item.tit : ''"
        :width="item.width ? item.width : ''"
        align="center"
        :className="item.active"
      >
        <template slot-scope="scope">
          <div v-if="scope.row[item.prop]">
            <!--<img style="width: 50px;height: 50px;" v-if="item.type=='img'&&item.prop=='showImg'" :src="scope.row[item.prop]"/>-->
            <!--<img style="width: 50px;height: 50px;" v-else-if="item.type=='img'&&item.prop=='bmpImg'&&scope.row['status']!='0'&&scope.row['status']!='1'" :src="scope.row[item.prop]"/>-->
           <!--<a v-if="item.prop=='showImg'||item.prop=='bmpImg'" href="JavaScript:void(0);">详情</a>-->
            <el-button type="text" v-if="item.prop=='showImg'" style="color: #2a97fe" @click="$emit(item.event, scope.row,item.prop)"  >详情</el-button>
            <el-button type="text" v-else-if="item.prop=='bmpImg'&&scope.row['status']!='0'&&scope.row['status']!='1'" style="color: #2a97fe" @click="$emit(item.event, scope.row,item.prop)"  >详情</el-button>
            <span v-else-if="item.color&&scope.row['status']=='0'" style="color: red" > {{scope.row[item.prop]}}</span>
            <span v-else-if="item.color&&scope.row['status']!='0'&&scope.row['status']!='5'" style="color: yellow" > {{scope.row[item.prop]}}</span>
            <span v-else-if="item.color&&scope.row['status']=='0'" style="color: red" > {{scope.row[item.prop]}}</span>
            <span v-else-if="item.esnColor&&scope.row['status']!='空闲'&&scope.row['status']!='正在工作'" style="color: red" > {{scope.row[item.prop]}}</span>
            <span v-else-if="item.esnColor" style="color: green" > {{scope.row[item.prop]}}</span>
            <span v-else> {{scope.row[item.prop]}}</span>
          </div>
          <div v-if="item.operate && typeof scope.row === 'object'">
            <el-button
              type="text"
              v-for="operate in tableObject.oFun"
              :key="operate.index"
              @click="$emit(operate.event, scope.row)"
            >
              <span class="svg-container"  :title="operate.title">
                <svg-icon :icon-class="operate.icon"/>
              </span>
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="tableObject.pageNo"
        :page-sizes="[10, 20, 30, 40, 50]"
        :page-size="tableObject.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableObject.total"
      ></el-pagination>
    </div>
  </div>
</template>


<script>
export default {
  name: 'complexTable',
  props: {
    tableObject: {
      type: Object
    }
  },
  data() {
    return {
      tableHeight: 9.6
    };
  },
  mounted() {
    var that = this;
    setTimeout(() => {
      that._reHeight()
    }, 100);
    window.addEventListener('resize', that._reHeight)
  },
  methods: {
    _reHeight() {
      this.tableHeight = (window.innerHeight - this.$refs.tableBody.$el.offsetTop - 150) * 0.025;
    },
    handleSizeChange(val) {
      this.$emit('pageSizeFun', val)
    },
    handleCurrentChange(val) {
      this.$emit('pageCurFun', val);
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2) {
        return 'even-row';
      } else {
        return 'odd-row';
      }
    },
    tableThClassName({ row, rowIndex }) {
      return 'even-row';
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this._reHeight)
  }
};
</script>
