import service from '../utils/service'
import klib from './utils'

function loadDataStruct(data) {
  if (!data._FIELD_LIST) return data;
  if (!data._FIELD_DIC) { //未初始化
    data._FIELD_DIC = {}; //生成字段字典
    data._RULES = {}; // 生成表单检查规则
    data._MAP_FIELD = {} //生成字段映射字典
    for (let i = 0; i < data._FIELD_LIST.length; i++) {
      let fi = data._FIELD_LIST[i];
      data._FIELD_DIC[fi.Field] = fi;
      if (fi.isPK) {
        //data._PK = fi.Field; //原生 接口已经有_PK
      } else if (fi.notNull) { //根据字段中不允许空的配置，加入公共的验证规则
        data._RULES[fi.Field] = {required: true, message: fi.Field + ' ' + (fi.Comment || '') + "不能为空", trigger: 'blur'}
      }

      //根据 字段名中包含 `__` 字符判断 Map 的table 与字段
      if (fi.Field.indexOf('__') > 3) {
        let arr = fi.Field.split('__')
        let key = arr[0]
        //注册字段映射闭包
        data._MAP_FIELD[key] = function (id, getAll) {
          // console.log(key, id, klib_api.data(key) || klib_api.tree(key), store)
          if (getAll) {
            // console.log(data)
            return klib_api.tree(key) || klib_api.data(key)
          }
          if (id.indexOf && id.indexOf(',') > 0) {
            let idlist = id.split(',')
            let list = []
            for (let j = 0; j < idlist.length; j++) {
              let vid = idlist[j]
              list.push(klib_api.getById(vid, key) || vid);
            }
            return list
          }
          return klib_api.getById(id, key)
        }
      }
    }
  }
  if (!data.statusValueDic) {
    data.statusDic = data._STATUS; //注册状态字典
    let dic = {};
    for (var key in data._STATUS) {
      var list = data._STATUS[key];
      for (var i = 0; i < list.length; i++) {
        var si = list[i];
        dic[si.id] = si;
      }
    }
    data.statusValueDic = dic; //注册状态值对应字典
  }
  if (!data.optionsValueDic) {
    let dic = {};
    data.optionsDic = data._OPTIONS; //注册选项字典
    for (key in data._OPTIONS) {
      var list = data._OPTIONS[key];
      for (var i = 0; i < list.length; i++) {
        var pi = list[i];
        dic[pi.id] = pi;
      }
    }
    data.optionsValueDic = dic; //注册选项ID字典
  }
  return data;
}

/**@class klib_api*/
const klib_api = {
  _apiCacheDict: {},
  /**
   *
   * @param key
   * @param params
   * @param store
   * @returns {klib_api}
   */
  newInstance(key, params, store = this.$store) {
    //todo 不同的params 也应该对应不同的API 缓存，而不是仅根据key简单缓存
    let api = this._apiCacheDict[key];
    if (api) {
      return api
    }
    else {
      api = {}
    }
    api.key = key
    api.params = params || {}
    if (klib_api.$store) {
      store = klib_api.$store
    } else {
      store = store || window._$store
      if (!store) {
        console.warn('Empty store injected in ', key, ' API ', params)
        return
      }
      klib_api.$store = store
    }
    api.$store = store
    console.debug(key, ' API created', api, params, store)
    api.__proto__ = this
    this._apiCacheDict[key] = api
    return api
  },
  setCache(key, data) {
    key = key || this.key
    let st = this.getState(key)
    if (!st.cache) {
      st.cache = {}
    }
    st.cache[key] = data
  },
  getCache(key) {
    key = key || this.key
    let st = this.getState(key)
    if (!st.cache) {
      st.cache = {}
      return
    }
    return st.cache[key]
  },
  /**
   *
   * @param key
   * @param name
   * @returns {*}
   */
  getState(key, name) {
    let st = {}
    key = key || this.key
    if (this.$store.state && this.$store.state[key]) {
      st = this.$store.state[key]
    } else {
      this.$store.state[key] = st
    }
    if (name) {
      let ns = st[name] || {};
      if (!ns) {
        st[name] = ns
      }
      return ns
    }
    else {
      return st
    }
  },
  _getDataStruct(key, url, params) {
    let that = this
    key = key || this.key
    let st = this.getState(key);
    if (st.dataStruct) {
      return new Promise(function (resolve) {
        resolve(st.dataStruct)
      })
    }
    return new Promise(function (resolve, reject) {
      service({
        url: url,
        method: 'get',
        params
      }).then(resp => {
        let data = resp.data
        st.dataStruct = loadDataStruct.call(that, data)
        console.log('%c' + key + ' data-structure loaded from remote server', 'background:#000;color:#FFF', data)
        resolve(st.dataStruct)
      }).catch(data => {
        reject(data)
      })
    })
  },
  getTree(params, forceReload, key, url) {
    key = key || this.key
    return this._getData(params, forceReload, key, url, true)
  },
  data(key, name) {
    key = key || this.key
    let state = this.getState(key, name);
    if (state) return state.dataList
  },
  tree(key, name) {
    key = key || this.key
    let state = this.getState(key, name);
    if (state) return state.dataTree
  },
  _getData(params, forceReload, key, url, isTree) {
    let state
    key = key || this.key
    if (this.$store) {
      state = this.getState(key);
      if (!forceReload) {
        let data = isTree ? state.dataTree : state.dataList;
        if (data) {
          return new Promise(function (resolve) {
            resolve(data)
          })
        }
      }
    }
    if(!url) {
      console.debug('%c' + key + ' try to loaded from remote server failed', 'background:#aaa;color:#fff', 'url is empty')
      return new Promise(function (resolve) {
        resolve()
      })
    }
    return new Promise(function (resolve) {
      service({
        url: url,
        method: 'get',
        params
      }).then(resp => {
        let data = resp.data
        //Only Object accepted in this function. string response will be considered as bad request
        if (data.substr) {
          console.trace()
          console.warn('%c' + key + ' data loaded from remote server failed', 'background:#00F;color:#fff', data.substr(0, 50))
          resolve()
          return
        }
        data.___dic = {}
        //Based on response data has these two fields
        isTree = isTree || (data.tree_desc && data.root)
        if (isTree) {
          if (!data.root) {
            resolve({root: []})
            console.warn('%c' + key + ' tree data loaded from remote server failed', 'background:#00F;color:#fff', data)
            return
          }
          //this.___isTree = true
          let desc = data.tree_desc
          klib.walkTreeNode(data.root, node => {
            if (!node.parent_id) {
              node.__depth = 1;
            } else {
              let pnode = data.___dic[node.parent_id]
              if (pnode) {
                node.__depth = pnode.__depth + 1;
              }
            }
            data.___dic[node[desc.pk]] = node
          })
        } else {
          if (!data.list) {
            resolve({list: [], count: 0})
            console.warn('%c' + key + ' list data loaded from remote server failed', 'background:#00F;color:#fff', data)
            return
          }
          for (let i = 0; i < data.list.length; i++) {
            let obj = data.list[i];
            data.___dic[obj.id] = obj
          }
        }
        console.log('%c' + key + ' data loaded from remote server', 'background:#00F;color:#fff', data)
        //cache for new update
        if (state) {
          if (isTree) {
            state.dataTree = data
          } else {
            state.dataList = data
          }
        }
        resolve(data)
      })
    })
  },
  getById(id, key, name) {
    key = key || this.key
    let st = this.getState(key, name);
    let data = st.dataTree || st.dataList
    if (data && data.___dic) {
      let intId = parseInt(id)
      let val
      if (intId) {
        val = data.___dic[intId]
      }
      if (val === undefined || val === null) {
        val = data.___dic[id]
      }
      return val
    }
    return null
  }
}
export default klib_api
