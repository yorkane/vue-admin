import Vue from 'vue'
import Router from 'vue-router'

const _import = require('./_import_' + process.env.NODE_ENV)
// in development env not use Lazy Loading,because Lazy Loading too many pages will cause webpack hot update too slow.so only in production use Lazy Loading

/* layout */
import Layout from '../views/layout/Layout'

//Lazy load for those big js libs
const text_code = () => import(/* webpackChunkName: "text-edit" */ '../viewsExtra/text/code.vue')
const text_index = () => import(/* webpackChunkName: "text-edit" */ '../viewsExtra/text/index.vue')
const text_compare = () => import(/* webpackChunkName: "text-edit" */ '../viewsExtra/text/compare.vue')
const text_compareTool = () => import(/* webpackChunkName: "text-edit" */ '../viewsExtra/text/compareTool.vue')

const model_index = () => import(/* webpackChunkName: "views" */ '../model/index.vue')
const model_tree = () => import(/* webpackChunkName: "views" */ '../model/tree.vue')
const model_relativeTree = () => import(/* webpackChunkName: "views" */ '../model/relativeTree.vue')
const model_category = () => import(/* webpackChunkName: "views" */ '../model/category.vue')

Vue.use(Router)

/**
 * icon : the icon show in the sidebar
 * hidden : if `hidden:true` will not show in the sidebar
 * redirect : if `redirect:noredirect` will not redirct in the levelbar
 * noDropdown : if `noDropdown:true` will not has submenu in the sidebar
 * meta : `{ role: ['admin'] }`  will control the page role
 **/
export const constantRouterMap = [
  {path: '/login', component: _import('login/index'), hidden: true},
  {path: '/404', component: _import('404'), hidden: true},
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard/首页',
    name: 'Dashboard',
    hidden: true,
    children: [{path: 'dashboard/:name', component: _import('dashboard/index')}]
  },
  {
    path: '/sys',
    component: Layout,
    redirect: 'noredirect',
    name: '系统应用',
    hidden: true,
    icon: 'zujian',
    children: [
      {
        path: 'sys_user', name: '用户管理', component: _import('sys_user/index')
      },
      {
        path: 'sys_menu', name: '系统菜单管理', component: _import('sys_menu/index'),
      },
      {
        path: 'sys_role', name: '角色权限管理', component: _import('sys_role/index'),
      },
    ]
  },
  {
    path: '/url',
    component: Layout,
    hidden: true,
    noDropdown: true,
    children: [{path: '/url/*', name: 'iframe', component: _import('empty')}]
  },
  {
    path: '/model',
    component: Layout,
    hidden: true,
    noDropdown: true,
    children: [{path: ':name/:table*', name: 'model', component: model_index}]
  },
  {
    path: '/tree',
    component: Layout,
    hidden: true,
    noDropdown: true,
    children: [{path: ':name/:table*', name: 'tree', component: model_tree}]
  },
  {
    path: '/relate',
    component: Layout,
    hidden: true,
    noDropdown: true,
    children: [{path: ':name/:table*', name: 'relativeTree', component: model_relativeTree}]
  },
  {
    path: '/category',
    component: Layout,
    hidden: true,
    noDropdown: true,
    children: [{path: ':name/:id*', name: 'category', component: model_category}]
  },
  {
    path: '/text',
    component: Layout,
    hidden: true,
    noDropdown: true,
    children: [
      {path: 'list/', name: '文本列表', component: text_index},
      {path: ':left/:right', name: '文本对比', component: text_compare},
      {path: 'tool/', name: '对比工具', component: text_compareTool},
      {path: 'code/', name: '服务器代码管理', component: text_code}
    ]
  },
  {
    path: '/page',
    component: Layout,
    hidden: true,
    noDropdown: true,
    children: [{path: ':name/:component*', name: 'page', component: _import('page')}]
  },
  {path: '*', redirect: '/404', hidden: true}
];

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({y: 0}),
  routes: constantRouterMap
})

export const asyncRouterMap = [];
