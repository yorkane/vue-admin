const menu = {
  state: {
    tabList: [],
    activeTab: '/'
  },
  mutations: {
    // 添加tabs
    add_tabs(state, data) {
      //console.log(state)
      state.tabList.push(data);
    },
    // 删除tabs
    delete_tabs(state, path) {
      let index = 0;
      for (let tab of state.tabList) {
        if (tab.path === path) {
          break;
        }
        index++;
      }
      state.tabList.splice(index, 1);
    },
    // 设置当前激活的tab
    set_active_index(state, index) {
      state.activeTab = index;
    },
    clear_tabs(state){
      state.tabList = []
    }
  }
}

export default menu
