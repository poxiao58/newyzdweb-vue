<template>
  <el-dialog class="dialogClass" title="编辑区域" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
    <el-form :model="formObject.model" :ref="formObject.ref" :rules="formObject.rules">
      <el-form-item v-for="item in formObject.arr" :key="item.index" :label="item.tit + ' :'" :prop="item.prop">
        <el-select v-if="item.select" v-model="formObject.model[item.prop]">
          <el-option v-for="sel in selectOptionsType" :key="sel.index" :label="sel.name" :value="sel.id"></el-option>
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
      objId: '',
      dialogFormVisible: false,
      selectOptionsType: [
        {
          id: '区块',
          name: '区块'
        },
        {
          id: '地块',
          name: '地块'
        }
      ],
      formObject: {
        ref: 'formName',
        model: {
          name: '',
          sn:'',
          imageUrl:'',
          imageParam:'',
          type:'',
          qkSn:'',
          description:''
        },
        rules: {
          name: [{ required: true, message: '请输入区域名称', trigger: 'blur' }],
          sn: [{ required: true, message: '请输入区域编码', trigger: 'blur' }],
          type: [{ required: true, message: '请输入区域类型', trigger: 'blur' }],
          qkSn: [{ required: true, message: '请输入所属区域编码', trigger: 'blur' }]
        },
        arr: [
          {
            prop: 'name',
            tit: '区域名称'
          },
          {
            prop: 'sn',
            tit: '区域编号'
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
            tit: '区域类型',
            select:true
          },
          {
            prop: 'qkSn',
            tit: '所属区域'
          },
          {
            prop: 'description',
            tit: '备注'
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
        this.formObject.model = {
          name: val.name,
          sn: val.sn,
          imageUrl: val.imageUrl,
          imageParam: val.imageParam,
          type: val.type,
          qkSn: val.qkSn,
          description: val.description
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
            id: that.objId,
            name: that.formObject.model.name,
            sn: that.formObject.model.sn,
            type: that.formObject.model.type,
            imageUrl: that.formObject.model.imageUrl,
            imageParam: that.formObject.model.imageParam,
            qkSn: that.formObject.model.qkSn,
            description: that.formObject.model.description,
          }
          that.$http.post('/userArea/update', paramsData, function(res) {
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
