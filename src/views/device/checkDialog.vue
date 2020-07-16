<template>
  <el-dialog class="dialogClass" :title="title" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
    <el-form :model="formObject.model" :ref="formObject.ref" :rules="formObject.rules">
      <el-form-item v-for="item in formObject.arr" :key="item.index" :label="item.tit + ' :'" :prop="item.prop">
        <el-input v-if="!item.select" v-model="formObject.model[item.prop]" type="password"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <div class="form-tip">注：所有信息均为必填项</div>
      <el-button @click="closeDialog">取 消</el-button>
      <el-button type="primary" @click="saveSubmitInfo">保 存</el-button>
    </div>
  </el-dialog>
</template>

<script>
  export default {
    data() {
      return {
        objId: '',
        type: 'bin',
        vals: {},
        title: '输入密码',
        dialogFormVisible: false,
        selectOptions: [],
        formObject: {
          ref: 'formName',
          model: {
            id: '',
            password: '',
          },
          rules: {
            password: [{required: true, message: '请输入密码', trigger: 'blur'}],
          },
          arr: [
            {
              prop: 'password',
              tit: '密码'
            }
          ]
        }
      };
    },
    created() {
    },
    computed: {
      UID() {
        return this.$store.getters.userid
      }
    },
    methods: {
      openDiag(val, type) {
        var that = this
        that.type = type
        that.vals = val
        this.formObject.model = {
          id: val.id,
          password: '',
        }
        setTimeout(() => {
          that.dialogFormVisible = true
        }, 1)
      },
      saveSubmitInfo() {
        var that = this
        this.$refs[that.formObject.ref].validate(valid => {
          if (valid) {
            const paramsData = this.formObject.model
            this.formObject.model.id = that.UID
            that.$http.post('/user/check', paramsData, function (res) {
              console.log("操作结果：", res)
              if (res.success) {
                // that.$message({
                //   message: '操作成功',
                //   type: 'success'
                // })
                that.closeDialog()
                if (that.type === 'bin') {
                  that.$parent.$refs.openBinDialog.openDiag(that.vals)
                } else if (that.type === 'start') {
                  that.$parent.startFun(that.vals)
                } else if (that.type === 'stop') {
                  that.$parent.stopFun(that.vals)
                } else if (that.type === 'refresh') {
                  that.$parent.refreshFun(that.vals)
                } else {
                  that.$parent.refreshEsnFun(that.vals)
                }

              }
            })
          }
        })
      },
      closeDialog() {
        this.$refs[this.formObject.ref].resetFields()
        this.dialogFormVisible = false
      },
    }
  };
</script>
