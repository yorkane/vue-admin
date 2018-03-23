<template>
  <div class="app-wrapper" :class="{hideSidebar:!sidebar.opened}">
    <div class="sidebar-wrapper">
      <div class="toggle-bar" @click="toggleSideBar">
        <div class="info">你好：{{userName}}</div>
        <i :class="getClass()"></i>
      </div>
      <sidebar class="sidebar-container"></sidebar>
    </div>
    <div class="main-container">
      <tab-nav-bar></tab-nav-bar>
      <!--<navbar></navbar>-->
      <app-main></app-main>
    </div>
  </div>
</template>


<script>
  import {Navbar, Sidebar, AppMain} from '@/views/layout'
  import {getName} from '../../utils/auth'
  import TabNavBar from './TabNav'

  export default {
    name: 'layout',
    components: {
      TabNavBar,
      Sidebar,
      AppMain
    },
    computed: {
      sidebar() {
        return this.$store.state.app.sidebar
      },
      userName() {
        return getName()
      }
    },
    mounted(){
      if (!this.sidebar.opened) {
        setTimeout(() => {
          this.$el.className += ' closedSideBar';
        }, 500)
      }
    },
    methods: {
      getClass() {
        return this.sidebar.opened ? 'el-icon-d-arrow-left toggle' : 'el-icon-d-arrow-left toggle is-active'
      },
      toggleSideBar() {
        this.$store.dispatch('ToggleSideBar')
        if (!this.sidebar.opened) {
          setTimeout(() => {
            this.$el.className += ' closedSideBar';
          }, 500)
        }
      },
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    .sidebar-container {
      background: #545c64;
    }
    .toggle-bar {
      cursor: pointer;
      text-align: right;
      overflow: hidden;
      height: 40px;
      background: #545c64;
      z-index: 1000;
    }
    .info {
      display: inline;
      text-align: left;
      font-size: 14px;
    }
    &.hideSidebar {
      .sidebar-wrapper {
        transform: translate(-160px, 0);
        .sidebar-container {
          transform: translate(152px, 0);
        }
      }
      .main-container {
        margin-left: 40px;
      }
      .toggle-bar {
        border: 0;
      }
    }
    &.closedSideBar {
      .sidebar-wrapper {
        transform: translate(-160px, 0);
        .sidebar-container {
          transform: translate(152px, 0);
        }
        &:hover {
          transform: translate(0, 0);
          .sidebar-container {
            transform: translate(0, 0);
          }
        }
      }
      .main-container {
        margin-left: 40px;
      }
      .toggle-bar {
        border: 0;
      }
    }
    .sidebar-wrapper {
      width: 200px;
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      z-index: 1001;
      overflow: hidden;
      box-shadow: 0 0 0, 1px 0 5px #666;
      color: #fff;
      transition: all .28s ease-out;
      border-right: 1px solid #eee;
      .toggle {
        line-height: 30px;
        height: 30px;
        margin: 0 10px;
        cursor: pointer;
        transform: rotate(0deg);
        transition: .38s;
        transform-origin: 50% 50%;
      }
      .toggle.is-active {
        transform: rotate(180deg);
      }
    }
    .sidebar-container {
      transition: all .28s ease-out;
      position: absolute;
      top: 30px;
      bottom: 0;
      left: 0;
      right: -18px;
      overflow-y: scroll;
      overflow-x: hidden;
    }
    .main-container {
      min-height: 100%;
      transition: all .28s ease-out;
      margin-left: 200px;
    }
  }
</style>
