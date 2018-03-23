<template>
  <k-wrap :withDialog="withDialog" :visible.sync="showDialog">
    <el-form :model="model" status-icon ref="form" label-width="160px" :rules="formRules"
             style="margin:10px 40px;width:600px">
      <k-form-item prop="password" label="请输入新密码" placeholder="必须包含子母，字符组合" :type="inputType"
                   auto-complete="off"></k-form-item>
      <k-form-item label="请重复输入新密码" prop="password2" placeholder="必须包含子母，字符组合" :type="inputType" auto-complete="off">
      </k-form-item>
      <k-form-item prop="code" label="请输入6位数字密码" auto-complete="off"></k-form-item>
      <el-form-item label="显示密码">
        <el-switch v-model="inputType" active-value="" inactive-value="password"></el-switch>
      </el-form-item>
      <el-button type="primary" @click="submitForm">提交</el-button>
      <el-button @click="reset">重置</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-form>
  </k-wrap>
</template>
<script>
  import userAPI from '../../api/sys_user'
  import KFormItem from "../../components/KFormItem.vue";
  import KForm from "../../components/KForm.vue";

  export default {
    components: {
      KFormItem,
    },
    mixins: [KForm],
    name: 'changePassword',
    data: function () {
      this._api = userAPI.new()
      return {
        inputType: 'password',
        pwd: {
          password: '',
          password2: ''
        },
        formRules: {
          code: [
            {required: true, message: '请输入6位数字', trigger: 'blur'},
            {min: 6, max: 6, message: '长度在 3 到 15 个字符', trigger: 'blur'},
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 3, max: 15, message: '长度在 3 到 15 个字符，必须包含子母，字符组合', trigger: 'blur'},
          ],
          password2: [
            {required: true, message: '请重复密码', trigger: 'blur'},
            {min: 3, max: 15, message: '长度在 3 到 15 个字符，必须包含子母，字符组合', trigger: 'blur'},
            {
              validator: (rule, value, cb) => {
                if (this.model.password !== this.model.password2) {
                  cb(new Error())
                } else {
                  cb()
                }
              },
              message: '密码不一致', trigger: 'blur'
            }
          ]
        },
      }
    },
    created() {
      console.log(this.isEditMode)
    },
    methods: {
      beforeSave(isValid, plainObject, model) {
        if (!isValid) {
          this.$notify.warning({message: '请确认输入是否正确'})
          return false // false to indicate stop process
        }
        return true
      },
      update(po) {
        userAPI.resetPasswordStep2(po).then(res => {
          console.log(res)
          this.$notify.success({message: res.data.msg})
          let router = this.$router
          setTimeout(() => {
            router.push({path: '/url/退出/__logout_gate'});
          }, 2000)
        })
        // return this._api.resetPasswordStep2(po)
      }
    }
  }
</script>
