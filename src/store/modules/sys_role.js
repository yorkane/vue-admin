const role = {
  state: {
    data: null,
    desc: {},
    dic: {},
    name: 'sysrole'
  },

  mutations: {
    SET_ROLE_DATA: (state, data) => {
      let cData = Object.assign({}, data)
      if (!cData._dic) {
        let dic = {}
        klib.walkTreeNode(cData.root, (node) => {
          dic[node.id] = node
        })
        cData._dic = dic
      }
      state.data = cData
      state.dic = cData._dic
      console.log(cData._dic)
    },
    SET_ROLE_DESC: (state, desc) => {


      state.desc = desc
    }
  },
  getters: {
    getRoleById: (state, getter) => (roleId) => {
      // console.log(typeof(roleId))
      return state.data._dic[roleId]
    }
  },
  actions: {
    InitRole({commit, state}, rawData) {
      return new Promise((resolve, reject) => {
        if (rawData) {
          commit('SET_ROLE_DATA', rawData)
          resolve(data)
        } else {
          if (state.data) {
            resolve(state.data)
          }
          getTree().then(response => {
            const data = response.data

            commit('SET_ROLE_DATA', data)
            resolve(data)
          }).catch(error => {
            reject(error)
          })
        }
      })
    },
  }
}

export default role
