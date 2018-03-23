import Cookies from 'js-cookie'

const app = {
  state: {
    sidebar: {
      opened: !+localStorage.getItem('sidebarStatus')
    }
  },
  mutations: {
    TOGGLE_SIDEBAR: state => {
      if (state.sidebar.opened) {
        localStorage.setItem('sidebarStatus', 1)
        // Cookies.set('sidebarStatus', 1)
      } else {
        localStorage.setItem('sidebarStatus', 0)
        // Cookies.set('sidebarStatus', 0)
      }
      state.sidebar.opened = !state.sidebar.opened
    }
  },
  actions: {
    ToggleSideBar: ({commit}) => {
      commit('TOGGLE_SIDEBAR')
    }
  }
}

export default app
