<template>
  <div class="tabNavWrap">
    <el-tabs
      v-model="activeTab"
      type="border-card"
      closable
      @tab-click="tabClick"
      v-if="tabList.length > 1"
      @tab-remove="tabRemove">
      <el-tab-pane
        :key="item.name"
        v-for="(item, index) in tabList"
        :label="item.name"
        :name="item.path">
        <iframe-containter :src="item.url" v-if="item.url"></iframe-containter>
      </el-tab-pane>
    </el-tabs>
    <template v-else-if="tabList.length == 1">
      <iframe-containter :src="tabList[0].url" v-if="tabList[0].url"></iframe-containter>
    </template>
  </div>
</template>

<script>
  import IframeContainter from "../../components/Iframe.vue";
  import {removeAuthToken} from '../../utils/auth'

  export default {
    components: {IframeContainter},
    data() {
      return {}
    },
    computed: {
      tabList() {
        return this.$store.state.menu.tabList;
      },
      activeTab: {
        get() {
          return this.$store.state.menu.activeTab;
        },
        set(val) {
          this.$store.commit('set_active_index', val);
        }
      }
    },
    watch: {
      '$route'(to, fromR) {
        let flag = false;
        if (to.path.indexOf('__logout_gate') > 0) {
          removeAuthToken()
          this.$router.push({path: '/login'});
          this.$store.commit('clear_tabs');
          this.$message({
            message: '您已经安全退出',
            type: 'success',
            duration: 3 * 1000
          })
          return
        }
        for (let tab of this.tabList) {
          if (tab.path === to.path) {
            flag = true;
            this.$store.commit('set_active_index', to.path);
            break
          }
        }
        if (!flag) {
          let tab = this.getTabByPath(to)
          this.$store.commit('add_tabs', tab);
          this.$store.commit('set_active_index', to.path);
        }
      }
    },
    created() {
      let tab = this.getTabByPath()
      this.$store.commit('add_tabs', tab);
      this.$store.commit('set_active_index', tab.path);
    },
    methods: {
      // tab切换时，动态的切换路由
      tabClick(tab) {
        let path = this.activeTab;
        // 用户详情页的时候，对应了二级路由，需要拼接添加第二级路由
        if (this.activeTab === '/userInfo') {
          path = this.activeTab + '/' + this.$store.state.userInfo.name;
        }
        //console.log('goto path', path)
        this.$router.push({path: path});
      },
      tabRemove(targetName) {
        // 首页不可删除
        if (targetName == '/') {
          return;
        }
        this.$store.commit('delete_tabs', targetName);
        if (this.activeTab === targetName) {
          // 设置当前激活的路由
          if (this.tabList && this.tabList.length >= 1) {
            this.$store.commit('set_active_index', this.tabList[this.tabList.length - 1].path);
            this.$router.push({path: this.activeTab});
          } else {
            this.$router.push({path: '/'});
          }
        }
      },
      getTabByPath(to) {
        let rt = to || this.$route.currentRoute || this.$route
        let url = rt.fullPath
        let mc = url.match(/\/url\/([^\/]+)\/(.+)/i)
        if (mc) {
          let href = mc[2]
          if (href.indexOf('http') !== 0) {
            href = '/' + href
          }
          return {path: mc[0], name: decodeURIComponent(mc[1]), url: href}
        }
        let name = rt.params.name || rt.name
        return {path: url, name: decodeURIComponent(name)}
      },
    }
  }
</script>
<style lang="scss">
  .tabNavWrap {
    .el-tabs--border-card {
      -webkit-box-shadow: none;
      box-shadow: none;
      border: 0;
    }
    .el-tabs--border-card > .el-tabs__content {
      padding: 0;
    }
    .el-tabs__item {
      padding-top: 5px;
      line-height: 35px;
    }
    .el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active {
      border-top: 5px solid #409EFF;
      padding-top: 0;
    }
  }
</style>
