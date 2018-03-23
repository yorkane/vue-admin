<template>
  <k-wrap :withDialog="withDialog" :visible.sync="showDialog">
    <el-form :model="model" ref="sys_menu_form" label-width="150px" :rules="formRules">
      <template v-for="(item, index) in m_dataStruct._FIELD_LIST">
        <k-form-item :item="item" v-if="item.Field == 'permission'">
          <menu-permission v-model="model[item.Field]" :model="model"></menu-permission>
        </k-form-item>
        <k-form-item :item="item" v-else-if="item.Field == 'role_refs'">
          <ref-role-dialog v-model="model[item.Field]" :model="model" ></ref-role-dialog>
        </k-form-item>
        <k-form-item :item="item" v-else></k-form-item>
      </template>
      <el-button type="primary" @click="submitForm('ruleForm')">{{isEditMode ? '保存修改' : '创建'}}</el-button>
      <el-button @click="reset">重置</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-form>

  </k-wrap>
</template>
<script>
  import roleAPI from '../../api/sys_role'
  import KFormItem from "../../components/KFormItem.vue";
  import MenuPermission from "../sys_menu/menuPermission.vue";
  import RefRoleDialog from "./refRoleDialog.vue";
  import KWrap from "../../components/KWrap.vue";
  import KForm from "../../components/KForm.vue";

  export default {
    mixins: [KForm],
    components: {
      KForm,
      KWrap,
      RefRoleDialog,
      MenuPermission,
      KFormItem
    },
    name: 'sys_role_form',
    data() {
      this._api = roleAPI;
      return {
        formRules: {},
      }
    },
    methods: {}
  }
</script>
