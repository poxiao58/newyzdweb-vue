<template>
  <el-dropdown trigger="click">
    <el-button type="primary" :style="{width:width}">
      {{options.cur}}<i class="el-icon-arrow-down el-icon--right"></i>
    </el-button>
    <el-dropdown-menu slot="dropdown" :style="{width:width}">
      <el-dropdown-item v-for="item in options.list" :key="item.index"
        :class="options.cur===item.name ? 'active' : ''"
        @click.native="$emit('chooseFun', item)">{{item.name}}
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  props: {
    options: {
      type: Object
    },
    width: {
      type: String,
      default: '4rem'
    }
  }
};
</script>
