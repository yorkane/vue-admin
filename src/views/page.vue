<template>
  <div style="margin: 20px;">
    <el-card>
      <!--<div slot="header">-->
      <!--<span>{{$route.params.name}}</span>-->
      <!--&lt;!&ndash;<el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>&ndash;&gt;-->
      <!--</div>-->
      <component :is="comp" :withDialog="noDialog" :visible.sync="show" :model.sync="emptyModel" isEditMode></component>
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
  import empty from './empty.vue'
  import ElCard from "element-ui/packages/card/src/main";
  // import ContextMenu from "../components/Libs/ContextMenu";

  const _import = require('../router/_import_' + process.env.NODE_ENV)
  export default {
    components: {
      // ContextMenu,
      ElCard
    },
    name: 'page',
    data() {
      this.$root.$on('IntoMapField', (key, field) => {
        this.$router.push({path: '/model/' + field.Comment + '/' + key});
      })
      return {
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
    methods: {}
  }
</script>
