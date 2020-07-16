<template>
  <el-dialog class="dialogClass" title="新建用户" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
    <el-form :model="formObject.model" :ref="formObject.ref" :rules="formObject.rules">
      <el-form-item v-for="item in formObject.arr" :key="item.index" :label="item.tit + ' :'" :prop="item.prop">
        <el-select v-if="item.select" v-model="formObject.model[item.prop]">
          <el-option v-for="sel in selectOptions" :key="sel.index" :label="sel.name" :value="sel.id"></el-option>
        </el-select>
        <el-input v-else v-model="formObject.model[item.prop]"></el-input>
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
      dialogFormVisible: false,
      selectOptions: [],
      formObject: {
        ref: 'formName',
        model: {
          username: '',
          name: '',
          password: '',
          roleId: ''
        },
        rules: {
          name: [{ required: true, message: '请输入用户姓名', trigger: 'blur' }],
          username: [{ required: true, message: '请输入用户账户', trigger: 'blur' }],
          password: [{ required: true, message: '请输入用户密码', trigger: 'blur' }],
          roleId: [{ required: true, message: '请选择用户类型', trigger: 'blur' }]
        },
        arr: [
          {
            prop: 'username',
            tit: '用户账户'
          },
          {
            prop: 'password',
            tit: '用户密码'
          },
          {
            prop: 'name',
            tit: '用户姓名'
          },
          {
            prop: 'roleId',
            tit: '用户类型',
            select: true
          }
        ]
      }
    };
  },
  created() {
    this.getRoleList()
  },
  computed: {
    UID() {
      return this.$store.getters.userid
    }
  },
  methods: {
    openDiag() {
      var that = this
      setTimeout(() => {
        that.dialogFormVisible = true
      }, 1)
    },
    saveSubmitInfo() {
      var that = this
      this.$refs[that.formObject.ref].validate(valid => {
        if (valid) {
          const paramsData = {
            parentId: that.UID,
            username: that.formObject.model.username,
            name: that.formObject.model.name,
            password: that.formObject.model.password,
            roleId: that.formObject.model.roleId
          }
          that.$http.post('/user/add', paramsData, function(res) {
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
    getRoleList() {
      var that = this
      that.$http.post('/user/getRoleListByUserId', {
        'userId': that.UID
      }, function(res) {
        if (res.success) {
         that.selectOptions=res.data;
        }
      })
    }
  }
};
</script>
