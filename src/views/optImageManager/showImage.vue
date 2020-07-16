<template>
  <el-dialog class="dialogClass" :title="dialogTit" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
    <img style="width: 150px;height: 150px;" :src="src"/>
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
      return  '图片显示'
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
