<template>
  <k-wrap :withDialog="withDialog" :visible.sync="showDialog">
    <el-form :model="model" ref="sys_menu_form" labelWidth="200px" :rules="dialogFormRules">
      <template v-for="(item, index) in m_dataStruct._FIELD_LIST">
        <k-form-item showFieldKey v-if="item.Field == 'icon'" :item="item">
          <k-icon-selector type="extend" v-model="model[item.Field]"></k-icon-selector>
        </k-form-item>
        <k-form-item showFieldKey v-else :item="item"></k-form-item>
      </template>
      <el-button type="primary" @click="submitForm">{{isEditMode ? '保存修改' : '创建'}}</el-button>
      <el-button @click="reset">重置</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-form>
  </k-wrap>
</template>
<script>
  import menuAPI from '../../api/sys_menu'
  import ChooseRoleDialog from "../sys_role/chooseRoleDialog.vue";
  import KIconSelector from "../../components/KIconSelector.vue";
  import KFormItem from "../../components/KFormItem.vue";
  import KForm from "../../components/KForm.vue";
  import KWrap from "../../components/KWrap.vue";

  export default {
    mixins: [KForm],
    components: {
      KWrap,
      KFormItem,
      KIconSelector,
      ChooseRoleDialog
    },
    name: 'sys_menu_form',
    data: function () {
      this._api = menuAPI
      return {
        dialogFormRules: {},
      }
    }
  }
</script>
