<template>
  <div style="margin: 20px;">
    <el-card>
      <el-row>
        <el-tag>标签一</el-tag>
        <el-tag type="plain">标签一</el-tag>
        <el-tag type="success" hit>标签二</el-tag>
        <el-tag type="info">标签三</el-tag>
        <el-tag type="warning">标签四</el-tag>
        <el-tag type="danger">标签五</el-tag>

      </el-row>
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
  import KForm from "../components/KForm";
  import KFormItem from "../components/KFormItem";



  const _import = require('../router/_import_' + process.env.NODE_ENV)
  export default {
    components: {
      KFormItem,
      KForm,
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
      },
    }
  }
</script>
