<template>
  <el-dialog class="dialogClass" :title="dialogTit" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
    <el-form :model="form">
      <el-form-item label="上传图片" :label-width="formLabelWidth">
        <el-upload
          ref="upload"
          action="/yzd/imageManager/bmpImgUploadAndPrint"
          accept="image/bmp"
          list-type="picture-card"
          :limit=limitNum
          :auto-upload="false"
          :on-exceed="handleExceed"
          :before-upload="handleBeforeUpload"
          :on-preview="handlePictureCardPreview"
          :on-success="handleAvatarSuccess"
          :on-remove="handleRemove">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" @click="uploadFile">上传并打印</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      dialogFormVisible: false,
      dialogImageUrl: '',
      dialogVisible: false,
      formLabelWidth: '80px',
      limitNum: 1,
      form: {}
    };
  },
  computed: {
    dialogTit() {
      return  'BMP上传并打印'
    },
    UID() {
      return this.$store.getters.userid
    }
  },
  created() {
  },
  methods: {
    openDiag(val) {
      var that = this
      setTimeout(() => {
        that.dialogFormVisible = true
      }, 1)
    },
    // 上传文件之前的钩子
    handleBeforeUpload(file){
      console.log('before')
      if(!(file.type === 'image/bmp')) {
        this.$notify.warning({
          title: '警告',
          message: '请上传格式为image/bmp的图片'
        })
      }
      let size = file.size / 1024 / 1024 / 20
      if(size > 2) {
        this.$notify.warning({
          title: '警告',
          message: '图片大小必须小于20M'
        })
      }
    },
    // 文件超出个数限制时的钩子
    handleExceed(files, fileList) {

    },
    handleAvatarSuccess(response, file, fileList) {
      if(response.success){
        this.$message({
          message: "上传并打印成功",
          type: 'success'
        })
        this.dialogFormVisible = false
        this.$refs.upload.clearFiles()
        this.$parent.printFun(response.data.id)
        this.$parent.queryInfoList()
      }else {
        this.$message({
          message:response.msg,
          type: 'error'
        })
      }
    },
    printFun(val){//下发打印
      var that=this
      // if(confirm("确实要打印图片吗？")) {
        this.$http.post('/imageManager/printImg', {
          id: val
        }, function (res) {
          if (res.success) {
            that.$message({
              message: "下发打印成功",
              type: 'success'
            })
            this.queryInfoList()
          }
        })
      // }
    },
    // 文件列表移除文件时的钩子
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    // 点击文件列表中已上传的文件时的钩子
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    uploadFile() {
      // alert("上传并打印")
      this.$refs.upload.submit()
    }
  }
};
</script>
