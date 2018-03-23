<template>
  <el-menu mode="vertical" :default-active="$route.path">
    <sidebar-item :routes='permission_routers'></sidebar-item>
    <side-menu-item :menus="menu"></side-menu-item>
  </el-menu>
</template>


<script>
  import {mapGetters} from 'vuex'
  import SidebarItem from './SidebarItem'
  import {getList} from '../../api/sys_menu'
  import SideMenuItem from "./SideMenuItem.vue";

  export default {
    data() {
      return {
        menu: []
      }
    },
    components: {
      SideMenuItem,
      SidebarItem
    },
    computed: {
      ...mapGetters([
        'permission_routers'
      ])
    },
    created() {
      getList().then(resp => {
        this.menu = resp.data.root;
      })
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  .sidebar-container {
    .el-menu {
      background: #545c64;
      color: #fff;
    }
    .el-menu-item, .el-submenu .el-menu-item, .el-menu-item, .el-submenu__title {
      height: 40px;
      line-height: 40px;
      color: #fff;
    }
    .el-submenu__title:hover {
      background: #00B7FF;
    }
    .svg-icon {
      margin-right: 10px;
    }
    .el-submenu .el-menu-item {
      background: #2d2f33;
    }
    .el-menu-item:hover {
      background: #00B7FF;
    }
    .el-submenu [class^=el-icon-] {
      font-size: 28px !important;
      margin-right: 10px;
    }
    .hideSidebar .menu-indent {
      display: block;
      text-indent: 10px;
    }
    var, kbd {
      font-size: 24px;
      margin: 0 8px 0 -4px;
    }
    kbd {
      margin: 0 20px 0 -25px;
    }
    .router-link-active li.el-menu-item, .el-menu-item.is-active {
      background: #00B7FF;
    }
  }

  .hideSidebar .menu-indent {
    display: block;
    text-indent: 10px;
  }
</style>
