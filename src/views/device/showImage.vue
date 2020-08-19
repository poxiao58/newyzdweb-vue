<template>
  <el-dialog class="dialogClass" :title="dialogTit" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
    <img style="width: 100%;height: 100%;" :src="src"/>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      dialogFormVisible: false,
      src: '',
    };
  },
  computed: {
    dialogTit() {
      return  '微信二维码显示'
    },
  },
  created() {
  },
  methods: {
    openDiag(val) {
      var that = this
      that.src=val
      setTimeout(() => {
        that.dialogFormVisible = true
      }, 1)
    }
  }
};
</script>
