<template>
  <el-dialog class="dialogClass" title="编辑用户" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
    <el-form :model="formObject.model" :ref="formObject.ref" :rules="formObject.rules">
      <el-form-item v-for="item in formObject.arr" :key="item.index" :label="item.tit + ' :'" :prop="item.prop">
        <el-select v-if="item.select&&item.prop=='roleId'" v-model="formObject.model[item.prop]">
          <el-option v-for="sel in selectOptions" :key="sel.index" :label="sel.name" :value="sel.id"></el-option>
        </el-select>
        <el-select v-if="item.select&&item.prop=='status'" v-model="formObject.model[item.prop]">
          <el-option v-for="sel in selectOptionsStatus" :key="sel.index" :label="sel.name" :value="sel.id"></el-option>
        </el-select>
        <el-input v-if="!item.select" v-model="formObject.model[item.prop]"></el-input>
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
      dialogFormVisible: false,
      selectOptionsStatus:[
        {
          id:'0',
          name:'正常'
        },
        {
          id:'1',
          name:'锁定'
        }
      ],
      selectOptions: [],
      formObject: {
        ref: 'formName',
        model: {
          username: '',
          name: '',
          password: '',
          roleId: '',
          status: ''
        },
        rules: {
          name: [{ required: true, message: '请输入用户姓名', trigger: 'blur' }],
          username: [{ required: true, message: '请输入用户账户', trigger: 'blur' }],
          roleId: [{ required: true, message: '请选择用户类型', trigger: 'blur' }],
          status: [{ required: true, message: '请选择用户状态', trigger: 'blur' }]
        },
        arr: [
          {
            prop: 'username',
            tit: '用户账户'
          },
          {
            prop: 'name',
            tit: '用户姓名'
          },
          {
            prop: 'roleId',
            tit: '用户类型',
            select: true
          },
          {
            prop: 'status',
            tit: '用户状态',
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
    openDiag(val) {
      var that = this
      if (val) {
        this.objId = val.id
        let st = this.selectOptionsStatus.find((item)=>{
          return item.name === val.status
        })
        this.formObject.model = {
          username: val.username,
          name: val.name,
          password: val.password,
          roleId: val.roleList[0].id,
          status: st.id
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
            userId:that.objId,
            parentId: that.UID,
            username: that.formObject.model.username,
            name: that.formObject.model.name,
            password: that.formObject.model.password,
            roleId: that.formObject.model.roleId
          }
          that.$http.post('/user/update', paramsData, function(res) {
            if (res.success) {
              that.$message({
                message: '信息编辑成功',
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
