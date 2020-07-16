<template>
  <el-dialog class="dialogClass" :title="title" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
    <el-form :model="formObject.model" :ref="formObject.ref" :rules="formObject.rules">
      <el-form-item v-for="item in formObject.arr" :key="item.index" :label="item.tit + ' :'" :prop="item.prop">
        <el-input v-if="!item.select" v-model="formObject.model[item.prop]"></el-input>
        <!--        <el-input v-if="item.select" v-model="formObject.model[item.prop]" type="file"></el-input>-->
        <el-upload v-if="item.select"
                   class="upload-demo"
                   ref="binUpload"
                   drag
                   multiple
                   :limit=limitNum
                   :auto-upload="true"
                   :data="formObject.model"
                   action="/yzd/esn/binFileUpload"
                   :on-success="handleAvatarSuccess"
                   >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">只能上传bin文件</div>
        </el-upload>
      </el-form-item>
    </el-form>
<!--    <div slot="footer" class="dialog-footer">-->
<!--      <div class="form-tip">注：所有信息均为必填项</div>-->
<!--      <el-button @click="closeDialog">取 消</el-button>-->
<!--&lt;!&ndash;      <el-button type="primary" @click="saveSubmitInfo">保 存</el-button>&ndash;&gt;-->
<!--    </div>-->
  </el-dialog>
</template>

<script>
  import axios from 'axios';

  export default {
    data() {
      return {
        objId: '',
        dialogFormVisible: false,
        dialogImageUrl: '',
        dialogVisible: false,
        paramsData: {"version": "1.0.0"},
        fileList: [],
        limitNum: 1,
        type: 'add',
        title: '更新固件',
        dialogFormVisible: false,
        //用户区域
        selectUserAreaOptions: [],
        selectataDirection: [
          {
            id: '0',
            name: '输出控制'
          },
          {
            id: '1',
            name: '输入采集'
          }
        ],
        selectOptions: [],
        formObject: {
          ref: 'formName',
          model: {
            id: '',
            md: '',
            mac: '',
            binDescription:'',
            version:'1.0.0'
          },
          rules: {
            name: [{required: true, message: '请输入网关名称', trigger: 'blur'}],
          },
          arr: [
            {
              prop: 'version',
              tit: '版本号'
            },
            {
              prop: 'binDescription',
              tit: '固件备注'
            },
            {
              select: true,
              prop: 'bin',
              tit: '上传bin文件'
            },
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
      openDiag(val) {
        console.log("得到上传guj")
        if(val.version===null||val.version===''){
          val.version='1.0.0'
        }
        let ss=val.version
        // console.log("ss="+ss)
        let lastVersion=parseInt(ss.substring(ss.length-1,ss.length))
        // console.log("lastVersion="+lastVersion)
        let nver=lastVersion+1;
        // console.log("nver="+nver)
        let nvers=ss.substring(0,ss.length-1)+nver
        val.version=nvers
        this.formObject.model = {
          id: val.id,
          version: val.version,
          md: '',
          mac:val.imei,
          binDescription: ''
        }
        setTimeout(() => {
          this.dialogFormVisible = true
        }, 1)
      },
      //保存
      saveSubmitInfo() {
        this.$refs["binUpload"].submit()
      },
      handleAvatarSuccess(response, file, fileList) {
        console.log("上传成功回传",response)
        if(response.success){
          this.$message({
            message: "上传成功",
            type: 'success'
          })
          this.dialogFormVisible = false
          this.$parent.queryInfoList()
        }else {
          this.$message({
            message:response.msg,
            type: 'error'
          })
        }
      },
      // saveSubmitInfo() {
      //   let that = this
      //   let paramsData = new window.FormData()// 声明一个FormData对象
      //   paramsData.append('file', document.querySelector('input[type=file]').files[0])
      //   paramsData.append("version","1.0.0")
      //   paramsData.append("md","123")
      //   paramsData.append("binDescription","测试固件")
      //   // axios({
      //   //   method: "post",
      //   //   url: process.env.BASE_API+"/model/upload",
      //   //   data: paramsData,
      //   //   headers: {
      //   //     'Content-Type': 'multipart/form-data',  // 文件上传
      //   //   },
      //   // }).then(function (response) {
      //   //   console.log(response);
      //   // }).catch(function (reason) {
      //   //
      //   // })
      //   that.$http.post('/model/upload', paramsData, function (res) {
      //     console.log("操作结果：",res)
      //     if (res.success) {
      //       that.$message({
      //         message: '操作成功',
      //         type: 'success'
      //       })
      //       that.closeDialog()
      //       that.$parent.resetInfo()
      //     }
      //   })
      // },
      // 文件提交之前的操作 可以进行type类型的判断
      onBeforeUploadImage(file) {
        console.log(file)
      },
      closeDialog() {
        this.$refs[this.formObject.ref].resetFields()
        this.dialogFormVisible = false
      },
    }
  };
</script>
