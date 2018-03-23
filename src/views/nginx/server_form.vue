<template>
  <k-wrap :withDialog="withDialog" :visible.sync="showDialog">
    <el-form :model="model" ref="sys_menu_form" labelWidth="120px" :rules="formRules">
      <template v-for="(item, index) in m_dataStruct._FIELD_LIST">
        <!--<el-form-item :label="item.Comment||item.Field" v-if="item.isPK">-->
        <!--<span>{{model[item.Field]}}</span>-->
        <!--</el-form-item>-->
        <!--<k-form-item v-else-if="item.Field == 'icon'" :item="item">-->
        <!--<k-icon-selector type="extend" v-model="model[item.Field]"></k-icon-selector>-->
        <!--</k-form-item>-->
        <!--<k-form-item v-else :item="item"></k-form-item>-->
        <k-form-item :item="item" v-if="item.Field === 'nginx_upstream__id'">
          <k-select v-model="model[item.Field]" :options="getMapOptions(item)" is-multiple :max-tree-depth="1"></k-select>
        </k-form-item>

        <k-form-item v-else :item="item" hide-field-key>
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
  import modelAPI from '../../api/model'
  import KFormItem from "../../components/KFormItem.vue";
  import KForm from "../../components/KForm.vue";
  import KWrap from "../../components/KWrap.vue";
  import klib from '../../klib/utils'
  import KSelect from "../../components/KSelect";

  export default {
    name: 'ServerForm',
    mixins: [KForm],
    components: {
      KSelect,
      KWrap,
      KFormItem,
    },
    name: 'model_form',
    data: function () {
      this.m_componentMap = {}
      return {
        formRules: {
          // access_log_format: [
          //   {required: true, message: '请输入日志格式', trigger: 'blur'},
          //   {min: 3, max: 5, message: '长度在 3 到 30 个字符', trigger: 'blur'}
          // ],
        }
      }
    },
    created() {
      let api = modelAPI.new('nginx_upstream')
      api.getTree({}, this.$store, true).then(data => {
        this.dataTree = data
        // this.upstreamTree = data
      })
    },
    methods: {
      getUpstreamList() {
        let arr = []
        klib.walkTreeNode(this.dataTree.root, node => {
          if (node.__depth == 1 || node.__children) {
            arr.push(node)
          }
        })
        return arr
      },
      getMapOptions: klib.getMapOptions,
    },

  }
</script>
