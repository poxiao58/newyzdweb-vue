<template>
  <el-dialog class="dialogClass" :title="dialogTit" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
    <el-form :model="formObject.model" :ref="formObject.ref" :rules="formObject.rules">
      <el-form-item v-for="item in formObject.arr" :key="item.index" :label="item.tit + ' :'" :prop="item.prop">
        <el-input v-model="formObject.model[item.prop]"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <div class="form-tip">注：所有信息均为必填项</div>
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="saveSubmitInfo">保 存</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      objId: '',
      dialogFormVisible: false,
      formObject: {
        ref: 'formName',
        model: {
          name: '',
          imei: ''
        },
        rules: {
          name: [{ required: true, message: '请输入设备名称', trigger: 'blur' }],
          imei: [{ required: true, message: '请输入设备IME号', trigger: 'blur' }],
        },
        arr: [
          {
            prop: 'name',
            tit: '设备名称'
          },
          {
            prop: 'imei',
            tit: '设备IMEI号'
          }
        ]
      }
    };
  },
  computed: {
    dialogTit() {
      return  '新建设备'
    },
    UID() {
      return this.$store.getters.userid
    }
  },
  created() {
    // this.queryUserAreaList()
  },
  methods: {
    openDiag(val) {
      var that = this
      if (val) {
        this.objId = val.id
        this.formObject.model = {
          test: val.test
        }
      } else {
        this.formObject.model = {
          test: ''
        }
      }
      setTimeout(() => {
        that.dialogFormVisible = true
      }, 1)
    },
    saveSubmitInfo() {
      var that = this
      this.$refs[that.formObject.ref].validate(valid => {
        if (valid) {
          const paramsData = {
            userId: that.UID,
            name: that.formObject.model.name,
            imei: that.formObject.model.imei,
          }
          that.$http.post('/esn/add', paramsData, function(res) {
            if (res.success) {
              that.$message({
                message: '信息保存成功',
                type: 'success'
              })
              that.closeDialog()
              that.$parent.resetInfo()
            }
          })
        }
      })
    },
    closeDialog() {
      this.$refs[this.formObject.ref].resetFields()
      this.dialogFormVisible = false
    },
    // queryUserAreaList(){
    //   var that = this
    //   that.$http.post('/esn/getUserAreaByUserId', {
    //     'userId': that.UID
    //   }, function(res) {
    //     if (res.success) {
    //       that.selectOptionsAddress=res.data;
    //     }
    //   })
    // }
  }
};
</script>
