<template>
  <k-wrap :withDialog="withDialog" :visible.sync="showDialog">
    <el-form :model="vModelData" ref="sys_user_form" label-width="200px" :rules="dialogFormRules">
      <template v-for="(item, index) in dataStruct._FIELD_LIST">
        <template
          v-if="item.isPK || item.Field =='email'|| item.Field =='name'|| item.Field =='salt'||item.Field =='key'">
          <k-form-item :item="item" v-if="hiddenField[item.Field]"/>
          <k-form-item v-else :item="item" :vModelData="vModelData" :dataStruct="dataStruct"/>
        </template>
        <k-form-item v-else-if="item.Field == 'role'" :item="item">
          <choose-role-dialog v-model="vModelData[item.Field]"></choose-role-dialog>
        </k-form-item>
        <k-form-item v-else :vModelData="vModelData" :dataStruct="dataStruct" :item="item"></k-form-item>
      </template>
      <el-button type="primary" @click="submitForm">提交</el-button>
      <el-button @click="reset">重置</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-form>
  </k-wrap>
</template>
<script>
  import userAPI from '../../api/sys_user'
  import klib from '../../klib/grid'
  import ChooseRoleDialog from "../sys_role/chooseRoleDialog.vue";
  import KFormItem from "../../components/KFormItem.vue";

  export default {
    components: {
      KFormItem,
      ChooseRoleDialog
    },
    name: 'sys_user_form',
    props: {
      vModelData: {
        type: Object,
        required: false
      },
      dataStruct: {
        type: Object,
        required: false
      },
      isEditMode: {
        type: Boolean,
        default: false
      }
    },
    watch: {
      vModelData() {
        this.setOriginalData()
      }
    },
    data: function () {
      return {
        currentDB: 'approot', //当前表对应的数据库
        currentTable: 'sys_user', //当前表
        dialogFormRules: {},
        hideField: {
          create_time: true,
          last_login: true,
          last_modify: true,
          status: true,
          level: true,
          role: true,
          key: true,
          salt: true,
          is_deleted: true,
          ext1: true,
          ext2: true,
          ext3: true
        }
      }
    },
    created() {
      this.loaddataStruct(this.dataStruct)
      this.setOriginalData()
    },
    methods: {
      isEditable(item) {
        let name = item.Field
        if (item.isPK || name === 'createTime' || name === 'key') {
          return false
        }
        return true
      },
      reset: function () {
        this.restoreVmodelData()
        this.$emit('reset')
      },
      cancel: function () {
        this.restoreVmodelData()
        this.$emit('close')
      },
      submitForm: function () {
        var ok = false
        this.$refs['sys_user_form'].validate(function (valid) {
          ok = valid;
        });
        if (!ok) return;
        let newObj = this.getEditData(this.isEditMode)
        if (newObj) {
          newObj._DB = this.currentDB;
          newObj._NAME = this.currentTable;
          this.saveModel(newObj);
        } else {
          this.$notify.info({title: '没有改动', message: ''});
        }
      },
      saveModel: function (plainObj) {
        if (!plainObj) return;
        if (this.isEditMode) {
          userAPI.update(plainObj).then(res => {
            let data = res.data
            this.$emit('update', plainObj);
            this.$notify.info({title: '更新记录成功', message: data.result.message})
          })
        } else {
          userAPI.insert(plainObj).then(res => {
            let data = res.data
            plainObj.id = data.result.insert_id; //get id from db
            this.$emit('inserted', plainObj);
            this.$notify.info({title: '新建记录成功', message: data.result.message})
          })
        }
      },
      ...klib
    }
  }
</script>
