<template>
  <k-wrap :withDialog="withDialog" :visible.sync="showDialog">
    <el-form :model="model" ref="form" labelWidth="200px" :rules="formRules">
      <template v-for="(item, index) in m_dataStruct._FIELD_LIST">
        <k-form-item v-if="item.Field === 'text'" :item="item" hide-label>
          <ace-editor v-model="model[item.Field]"></ace-editor>
        </k-form-item>
        <k-form-item :item="item" v-else>
          <component :is="getComponent(item.Field)" :item="item" v-model="model[item.Field]" :model="model"></component>
        </k-form-item>
      </template>
      <el-button type="primary" @click="submitForm">{{isEditMode ? '保存修改' : '创建'}}</el-button>
      <el-button @click="reset">重置</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-form>
  </k-wrap>
</template>
<script>
  import KFormItem from "../../components/KFormItem.vue";
  import KForm from "../../components/KForm.vue";
  import KWrap from "../../components/KWrap.vue";
  import AceEditor from "../../components/ace-editor";

  export default {
    name: 'textForm',
    mixins: [KForm],
    components: {
      AceEditor,
      KWrap,
      KFormItem,
    },
    data: function () {
      return {
        outputHtml: '',
      }
    },
    mounted() {
    },
    methods: {}
  }
</script>
