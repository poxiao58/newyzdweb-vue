<template>
  <el-form :inline="true" :model="formObject.model" :ref="formObject.ref || ''" :rules="formObject.rules || {}" class="formClass">
    <el-form-item v-for="item in formObject.arr" :key="item.index" :label="item.tit + ' :'" :prop="item.prop || ''">
      <el-date-picker v-if="item.date" v-model="formObject.model[item.prop]" type="date"></el-date-picker>
      <el-input v-else v-model="formObject.model[item.prop]"></el-input>
    </el-form-item>
    <el-form-item style="float:right" v-for="operate in formObject.oFun" :key="operate.index">
      <el-button type="primary" @click="$emit(operate.event)">{{operate.name}}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  props: {
    formObject: {
      type: Object
    }
  },
  data() {
    return {};
  },
  methods: {}
};
</script>
