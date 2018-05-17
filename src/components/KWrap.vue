<template>
  <div class="kwrap">
    <el-dialog :width="width" :visible.sync="showDialog" v-if="withDialog" :title="title" :before-close="closeDialog">
      <component v-if="componentPath" :is="innerComponent" :visible.sync="showDialog" :model="model"
                 :isEditMode="isEditMode"></component>
      <slot v-else></slot>
    </el-dialog>
    <auto-height-wrapper v-else-if="showDialog">
      <h1 v-if="title" class="title">{{title}}</h1>
      <component v-if="componentPath" :is="innerComponent" :visible.sync="showDialog" :model="model"
                 :isEditMode="isEditMode"></component>
      <slot v-else></slot>
    </auto-height-wrapper>
  </div>
</template>
<script>
  import AutoHeightWrapper from "./AutoHeightWrapper";

  const _import = require('../router/_import_' + process.env.NODE_ENV)
  export default {
    components: {AutoHeightWrapper},
    name: 'KWrap',
    data() {
      return {
        showDialog: false,
        innerComponent: {},
      }
    },
    props: {
      title: String,
      visible: Boolean,
      width: {
        type: String,
        default: '70%'
      },
      withDialog: {
        type: Boolean,
        default: true,
        required: false
      },
      isEditMode: Boolean,
      componentPath: String,
      model: {
        type: Object,
        required: false,
        default: function () {
          return {}
        }
      },
    },
    watch: {
      visible(val) {
        this.showDialog = val
      },
      showDialog(val) {
        this.$emit('update:visible', val)
      },
    },
    created() {
      this.showDialog = !this.withDialog
      if (this.componentPath) {
        this.innerComponent = _import(this.componentPath)
      }
    },
    mounted() {
    },
    methods: {
      closeDialog() {
        let p = this.$parent
        if (p.cancel) {
          this.$parent.cancel()
        }
        if (this.withDialog) {
          this.showDialog = false
        }
        if(this.close) {
          this.close()
        }
        this.$emit('close')
      },
      loadComponent(componentPath) {
        this.innerComponent = _import(componentPath)
      }
    }
  }
</script>
<style>
  .kwrap .el-dialog__body {
    padding:0 20px 20px 20px
  }
  .kwrap .el-dialog__header {
    height:40px;
    line-height: 45px;
    padding: 0 0 0 20px;
    border-bottom: 1px solid #eee;
  }
</style>
