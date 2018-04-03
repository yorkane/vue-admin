<template>
  <k-wrap :withDialog="withDialog" :visible.sync="showDialog">
    <el-form :model="model" ref="form" labelWidth="200px" :rules="formRules">
      <template v-for="(item, index) in m_dataStruct._FIELD_LIST">
        <!--<el-form-item :label="item.Comment||item.Field" v-if="item.isPK">-->
        <!--<span>{{model[item.Field]}}</span>-->
        <!--</el-form-item>-->
        <!--<k-form-item v-else-if="item.Field == 'icon'" :item="item">-->
        <!--<k-icon-selector type="extend" v-model="model[item.Field]"></k-icon-selector>-->
        <!--</k-form-item>-->
        <k-form-item v-if="item.Field === 'url_path'" :item="item">
          <el-autocomplete style="width:90%"
                           class="inline-input"
                           v-model="model[item.Field]"
                           :fetch-suggestions="buildQuerySearch(item)"
                           placeholder="请输入内容"
          ></el-autocomplete>
        </k-form-item>
        <k-form-item showFieldKey :item="item" v-else>
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
  import KFormItem from "../components/KFormItem.vue";
  import KForm from "../components/KForm.vue";
  import KWrap from "../components/KWrap.vue";
  import KIconSelector from "../components/KIconSelector.vue";


  export default {
    name: 'ModelForm',
    mixins: [KForm],
    components: {
      KWrap,
      KFormItem,
    },
    data() {
      this.m_componentMap = {
        'icon': KIconSelector,
      }
      return {
        queryList: []
      }
    },
    mounted() {
    },
    methods: {
      buildQuerySearch(item) {
        let list = []
        // if (item.Field == 'sys_role_upstream') {
        this.api.getList('sys_menu', {
          page: 1,
          pageSize: 200,
          custom: {href: 'value'},
          where: 'href is not NULL',
          orderby: 'ID DESC'
        }).then(
          data => {
            data = data.data || {}
            data = data.list || []
            let list = data.filter(item => {
              return item.value.indexOf('#') != 0
            })
            this.queryList = list
            // console.log(this.queryList, 11111)
          }
        )
        // }
        return this.querySearch
      },
      querySearch(queryString, cb) {
        let list = this.queryList;
        if (queryString) {
          let results = []
          list.forEach(item => {
            if (item && item.value) {
              let q = item.value.toLowerCase()
              let t = queryString.toLowerCase()
              if (q.indexOf(t) > -1) {
                results.push(item)
              }
            }
          })
          // 调用 callback 返回建议列表的数据
          cb(results);
        } else {
          cb(list);
        }
      },
    }
  }
</script>
