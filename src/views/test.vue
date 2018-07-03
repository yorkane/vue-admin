<template>
  <div style="margin: 20px;">
    <el-card>
      <!--<div slot="header">-->
      <!--<span>{{$route.params.name}}</span>-->
      <!--&lt;!&ndash;<el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>&ndash;&gt;-->
      <!--</div>-->
      <!--<json-editor :objData="jsonData" v-model="jsonData"></json-editor>-->

      <!--<vue-json-editor v-model="jsonData" mode="view" :show-btns="true" @json-change="onJsonChange"></vue-json-editor>-->
  <!--<k-json-editor :json-object="jsonData"></k-json-editor>-->
      <swagger-u-i></swagger-u-i>
    </el-card>
    <!--<context-menu class="right-menu"-->
    <!--:target="contextMenuTarget"-->
    <!--:show="contextMenuVisible"-->
    <!--@update:show="(show) => contextMenuVisible = show">-->
    <!--<a href="javascript:;" @click="">复制</a>-->
    <!--<a href="javascript:;" @click="">引用</a>-->
    <!--<a href="javascript:;" @click="">删除</a>-->
    <!--</context-menu>-->
  </div>
</template>
<script>
  import Vue from 'vue'
  import empty from './empty.vue'
  import ElCard from "element-ui/packages/card/src/main";
  import VueJsonEditor from "vue-json-editor";
  import KForm from "../components/KForm";
  import KFormItem from "../components/KFormItem";
  // import SwaggerUI from "../viewsExtra/swagger/index";
  // import JsonEditor from 'vue-json-editor-block-view'
  // import ContextMenu from "../components/Libs/ContextMenu";
  const SCHEMA = {
    type: 'object',
    title: 'vue-json-editor demo',
    properties: {
      name: {
        type: 'string',
      },
      email: {
        type: 'string',
      },
    },
  };


  const _import = require('../router/_import_' + process.env.NODE_ENV)
  export default {
    components: {
      KFormItem,
      KForm,
      VueJsonEditor,
      // ContextMenu,
      ElCard
    },
    name: 'test',
    data() {
      this.$root.$on('IntoMapField', (key, field) => {
        this.$router.push({path: '/model/' + field.Comment + '/' + key});
      })
      return {
        model: {
          name: 'Yourtion',
          sub: {
            sEmail: 'yourtion@gmail.com',
          },
        },
        jsonData: {
          name: 'mike',
          age: 22,
          phone: '18552129932',
          address: ['AAA C1', 'BBB C2']
        },
        myData: {name: "test", value: 2},
        noDialog: false,
        show: true,
        emptyModel: {},
        contextMenuTarget: document.body,
        contextMenuVisible: false,
      }
    },
    computed: {
      comp() {
        let rt = this.$route.currentRoute || this.$route
        let compName = rt.params.component
        if (compName) {
          try {
            let cp = _import(rt.params.component)
            return cp
          } catch (e) {
            console.log(e)
          }
        }
        return empty
      }
    },
    created() {
    },
    methods: {

      submit(_e) {
        alert(JSON.stringify(this.model));
      },
      reset() {
        this.$refs.JsonEditor.reset();
      },
      onJsonChange(value) {
        console.log('value:', value)
      }
    }
  }
</script>
