import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
// import sys_user from './modules/sys_user'
import user from './modules/user'
import role from './modules/sys_role'
import menu from './modules/sys_menu'
import api from './modules/apiStore'
import permission from './modules/permission'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    user,
    // sys_user,
    permission,
    role,
    menu,
    api
  },
  getters
})

export default store
