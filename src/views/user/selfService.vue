<template>
  <k-wrap :withDialog="withDialog" :visible.sync="showDialog" style="margin:10px 40px;width:600px">
    <el-form status-icon :model="model" ref="form" label-width="100px" :rules="formRules">
      <template v-for="(item, index) in m_dataStruct._FIELD_LIST">
        <template v-if="item.Field.match(/is_disabled|salt|password|key|ext\d/)"></template>

        <k-form-item disabled :item="item"
                     v-else-if="item.Field.match(/^(sys_role__id|name|email|status|level)/)"></k-form-item>
        <k-form-item :item="item" v-else>
          <component :is="getComponent(item.Field)" :item="item" v-model="model[item.Field]" :model="model"></component>
        </k-form-item>
      </template>
      <el-button type="primary" @click="submitForm">提交</el-button>
      <el-button @click="reset">重置</el-button>
      <el-button @click="cancel">取消</el-button>
      <el-button @click="toPassword">修改密码</el-button>
    </el-form>
    <change-password ref="kdialog" is-edit-mode :with-dialog="true"></change-password>
  </k-wrap>
</template>
<script>
  import userAPI from '../../api/sys_user'
  import roleAPI from '../../api/sys_role'
  import modelAPI from '../../api/model'
  import ChooseRoleDialog from "../sys_role/chooseRoleDialog.vue";
  import KFormItem from "../../components/KFormItem.vue";
  import KWrap from "../../components/KWrap.vue";
  import KForm from "../../components/KForm.vue";
  import ChangePassword from "./changePassword";

  export default {
    components: {
      ChangePassword,
      KWrap,
      KFormItem,
      ChooseRoleDialog
    },
    mixins: [KForm],
    name: 'selfService',
    data: function () {
      this._api = userAPI.new()
      this._role = roleAPI.new()
      return {
        formRules: {
          desc: [
            {required: true, message: '请输入您的个人信息', trigger: 'blur'},
            {min: 5, max: 40, message: '长度在 5 到 40 个字符', trigger: 'blur'}
          ],
          phone: [
            {required: true, message: '请输入手机号码', trigger: 'blur'},
            {min: 11, max: 15, message: '长度在 11 到 15 个字符', trigger: 'blur'}
          ]
        },
      }
    },
    created() {
    },
    methods: {
      getData() {
        this._role.getTree()
        modelAPI.new('sys_organization').getTree().then(() =>
          this._api.getUserInfo().then(resp => {
            let data = resp.data
            // console.log(data)
            this.$emit('update:model', data)
          }))
      },
      beforeSave(isValid, plainObjct, model) {
        if (!isValid) {
          this.$notify.warning({message: '请确认输入是否正确'})
          return false // true to indicate stop process
        }
        return true
      },
      update(plainObj) {
        return this._api.selfService(plainObj)
        // console.log('update called', plainObj)
      },
      toPassword(){
        this.$refs.kdialog.showDialog = true
        // this.$router.push({path: ''});
      }
    }
  }
</script>
