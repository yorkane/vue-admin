<template>
  <k-wrap :withDialog="withDialog" :visible.sync="showDialog">
    <el-form :model="model" ref="sys_user_form" label-width="150px" :rules="formRules">
      <template v-for="(item, index) in m_dataStruct._FIELD_LIST">
        <template
          v-if="item.Field =='email'|| item.Field =='name'|| item.Field =='salt'||item.Field =='key'">
          <k-form-item :item="item" v-if="isEditMode || item.isPK" readOnly></k-form-item>
          <k-form-item v-else :item="item" :model="model"></k-form-item>
        </template>
        <k-form-item v-else-if="item.Field == 'role'" :item="item">
          <choose-role-dialog v-model="model[item.Field]"></choose-role-dialog>
        </k-form-item>
        <k-form-item v-else :model="model" :item="item"></k-form-item>
      </template>
      <el-button type="primary" @click="submitForm">提交</el-button>
      <el-button @click="reset">重置</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-form>
  </k-wrap>
</template>
<script>
  import ChooseRoleDialog from "../sys_role/chooseRoleDialog.vue";
  import KFormItem from "../../components/KFormItem.vue";
  import KWrap from "../../components/KWrap.vue";
  import KForm from "../../components/KForm.vue";

  export default {
    components: {
      KWrap,
      KFormItem,
      ChooseRoleDialog
    },
    mixins: [KForm],
    name: 'sys_user_form',
    data: function () {
      return {
        formRules: {
          desc: [
            { required: true, message: '请输入个人描述11', trigger: 'blur' },
            { min: 3, max: 30, message: '长度在 3 到 30 个字符', trigger: 'blur' }
          ],
        }
      }
    },
    created() {

    },
    methods: {

    }
  }
</script>
