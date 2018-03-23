import modelAPI from '../../api/model'

const apiStore = {
  state: {
    dic: {},
    name: 'apiStore'
  },

  mutations: {
    ADD_API: (state, api) => {
      state.dic[api.key] = api
    },
  },
  actions: {
    GetAPI(context, tableName, params) {

      let api = context.state.dic[tableName]

      if (api) {
        // console.log(11111111, context.state.dic, api, tableName)
        return api
      }
      api = modelAPI.new(tableName, params)
      context.commit('ADD_API', api)
      return new Promise((resolve, reject) => {
        // api.getDataStruct(context).then(data => {
          resolve(api)
        // })
      })
    }
  }
}

export default apiStore
