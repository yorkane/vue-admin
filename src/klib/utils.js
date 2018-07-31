import klib from "./grid";
import klib_api from "./api";

const klib_utils = {
  /**
   * 是否空字符串
   * @param str
   * @returns {boolean}
   */
  isEmpty: function (str) {
    if (str == '' || str == undefined || str == null || typeof(str) != 'string' || str.length < 1) {
      return true
    }
  },
  /**
   * 根据Field类型获取对应名称（尝试跨表查询）
   * @param fi
   * @param maxLength
   * @returns {string}
   */
  getFieldLabel(fi, maxLength) {
    let val = this.model[fi.Field]
    let v = klib_utils.getMapValue.call(this, fi)
    if (v === null || v === undefined) {
      return ''
    }
    // if (fi.Field.indexOf('__') > 0) {
    // }
    if (v.mapped) {
      let field = fi.Field.split('__')[1]
      if (field === 'id') {
        field = null
      }
      if (v.list) {
        let vArr = []
        for (let i = 0; i < v.list.length; i++) {
          let p = v.list[i]
          if (field) {
            //using field to get first
            vArr.push(p[field] || p.label || p.name || p.desc || p)
          } else {
            // ignore id checks
            vArr.push(p.label || p.name || p.desc || p)
          }
        }
        return vArr.join(',').substr(0, maxLength || 50);
      }
      v = v.value
      if (field) {
        val = v[field] || val
      } else {
        val = v.label || v.name || v.desc || val
      }
      return val.substr(0, maxLength || 50);
    } else {
      if (v.mapped === false) {
        return v.list.join(',')
      }
      return v.toString().substr(0, maxLength || 50);
    }
  },
  /**
   * 尝试跨表
   * @param fi
   * @param getAll 是否获取全部列表
   * @returns {*}
   */
  getMapValue(fi, getAll) {
    let val = this.model[fi.Field]
    if (!getAll && (!val || fi.Field.indexOf('__') < 3)) {
      return val
    }

    let ds = klib_utils.getParentDataStruct.call(this)
    let arr = fi.Field.split('__')
    let key = arr[0]
    let field = arr[1]
    let func = ds._MAP_FIELD[key]
    let v = func(val, getAll)
    if (v && getAll) {
      return v || val
    }
    if (!v) return val;

    if (v.push) {
      let vArr = []
      let changed = false
      for (let i = 0; i < v.length; i++) {
        let p = v[i]
        if (field && p[field]) {
          changed = true
        }
        vArr.push(p)
      }
      return {
        mapped: changed,
        list: vArr
      }
    }
    return {mapped: true, value: v}
  },
  getMapOptions(fi, onlyLeaf, onlyTrunk, maxDepth) {
    let v = klib_utils.getMapValue.call(this, fi, true)
    // console.debug('getMapOptions:', fi.Field, v)
    return v;
    if (v.list) {
      return v.list
    }
    if (v.root) {
      maxDepth = maxDepth || 100;
      let arr = []
      klib_utils.walkTreeNode(v.root, node => {
        if (node.__depth < maxDepth) {
          if (onlyLeaf && !node.__children) {
            arr.push(node)
          } else if (onlyTrunk && node.__children) {
            arr.push(node)
          }
        }
      })
      return arr
    }
  },
  /**
   * 获取上层组件的属性, 会自动尝试key 或者m_key
   * @param key
   * @param maxLevel
   * @param func
   * @returns {*}
   */
  getParentProp(key, maxLevel = 6, func) {
    let prop, stop
    let p = this
    let privateKey = 'm_' + key;
    let nc = 0
    while (p && nc < maxLevel) {
      prop = p[key] || p[privateKey]
      if (!klib.isEmptyObj(prop)) {
        if (func) {
          stop = func(p, prop)
          if (stop) {
            return prop
          }
        }
        else {
          return prop
        }
      }
      p = p.$parent
      nc++;
    }
  },
  /**
   * 获取上层组件的dataStruct 对象
   * @param vue
   * @returns {*}
   */
  getParentDataStruct(vue = this) {
    if (this.m_dataStruct) {
      return this.m_dataStruct
    }
    let ds = vue.dataStruct || vue.m_dataStruct
    if (ds && ds._NAME) {
      this.m_dataStruct = ds;
      return ds;
    }
    let p = vue.$parent
    let nc = 0
    while (p && nc < 6) {
      ds = p.dataStruct || p.m_dataStruct
      if (ds && ds._NAME) {
        this.m_dataStruct = ds;
        return ds;
      }
      p = p.$parent
      nc++;
    }
    return emptyDataStruct
  },
  /**
   * 格式化日期对象
   * @param dateobj
   * @returns {*}
   */
  formatDate: function (dateobj) {
    if (!dateobj) return dateobj;
    if (!dateobj.getDate) {
      let num = parseInt(dateobj)
      if (num > 1450000000 && num < 1450000000000) {
        num = num * 1000
        dateobj = new Date(num)
      } else {
        dateobj = new Date(dateobj)
      }
    }

    function fmt(v) {
      return v < 10 ? '0' + v : v
    }

    let month = (dateobj.getMonth() + 1)
    let day = dateobj.getDate()
    let hour = dateobj.getHours()
    let min = dateobj.getMinutes()
    let sec = dateobj.getSeconds()
    return dateobj.getFullYear() + "-" + fmt(month) + "-" + fmt(day) + " " + fmt(hour) + ":" + fmt(min) + ":" + fmt(sec)
  },

  /**
   * 获取状态列表用于 Select 组件
   * @param fieldName
   * @returns {*|Array}
   */
  getStatusList: function (fieldName) {
    let list = klib_utils.getParentDataStruct.call(this).statusDic[fieldName] || [];
    // console.log(fieldName, list, this.getParentDataStruct())
    return list
  },
  /**
   * 获取选项列表用于 Select 组件
   * @param fieldName
   * @returns {Array}
   */
  getOptionList: function (fieldName) {
    let ds = klib_utils.getParentDataStruct.call(this)
    let fi = ds._FIELD_DIC[fieldName];
    let list = ds.optionsDic[fieldName];
    if (!list) {
      fieldName = ds._NAME + '.' + fieldName;
      list = ds.optionsDic[fieldName]
    }
    if (!list) {
      let inx = fieldName.indexOf('option_')
      fieldName = fieldName.substring(inx + 7, 100);
      list = ds.optionsDic[fieldName]
      if (!list) {
        list = ds.optionsDic[ds._NAME + '.' + fieldName]
      }
    }
    if (list) {
      let arr = []
      for (let i = 0; i < list.length; i++) {
        let item = Object.assign({}, list[i]);
        if (fi.isText || fi.isTextOption) {
          //item.value = item.value.toString()
        } else if (fi.isOption || fi.isInt || fi.isIntBool) {
          item.value = parseInt(item.value)
        } else {
        }
        arr.push(item)
      }
      //console.log(arr)
      return arr
    }
    return [];
  },
  /**
   * 获取状态列表
   * @param key
   * @param value
   * @param labelOnly 是否只返回标签, 否则返回单个选项
   * @returns {*}
   */
  getStatus(key, value, labelOnly) {
    if (value === null || value === undefined) {
      return ''
    }
    let ds = klib_utils.getParentDataStruct.call(this)
    let fi = ds.statusValueDic[value] || ds.statusValueDic[value.toString()] || {};
    if (labelOnly) {
      return fi.label || ('N/A' + '|' + value);
    }
    return fi;
  },

  /**
   * 获取选项列表
   * @param key
   * @param value
   * @param labelOnly 是否只返回标签, 否则返回单个选项
   * @returns {*}
   */
  getOption(key, value, labelOnly) {
    let ds = klib_utils.getParentDataStruct.call(this)
    let isMatched, fi = false
    let list = ds.optionsDic[key]; //先根据field name 获取列表
    if (!list) {
      key = ds._NAME + '.' + key; //加上表格前缀再获取一次， table.field
      list = ds.optionsDic[key]
    }
    if (!list) return value; //如果还没有，直接返回原始值
    for (let i = 0; i < list.length; i++) {
      fi = list[i];
      if (fi.value == value) {
        isMatched = true
        break;
      }
    }
    if (labelOnly) return isMatched ? (fi.label || fi.value) : ('N/A' + (value ? ('|' + value) : ''));
    return isMatched ? fi : {};
  },
  /**
   * 根据组件名获取实例对象
   * @param name
   * @param comp
   * @param clist
   * @returns {Array}
   */
  getComponentsByName(name, comp = this, clist = []) {
    let list = comp.$children;
    if (list) {
      for (let i = 0; i < list.length; i++) {
        let cp = list[i];
        if (cp.$options._componentTag == name) {
          clist.push(cp)
        }
        this.getComponentsByName(name, cp, clist)
      }
    }
    return clist
  },
  /**
   * 先根遍历树
   * @param root
   * @param fun
   */
  walkTreeNode(root, fun) {
    if (!root) return;
    let stack = []
    for (let i = 0; i < root.length; i++) {
      if (fun(root[i], root)) {
        return
      }
      stack.push(root[i])
    }
    //crusie all nodes
    while (stack.length > 0) {
      let tmpNode = stack.pop();
      if (tmpNode.__children) {
        for (let i = 0; i < tmpNode.__children.length; i++) {
          let obj = tmpNode.__children[i];
          if (fun(obj, tmpNode.__children, i)) {
            return
          }
          if (obj.__children) {
            stack.push(obj)
          }
        }
      }
    }
  },
  /**
   * 根据节点信息插入树的指定位置
   * @param root 树根
   * @param node 节点（根据parent_id 插入对应父节点，如为0则插入根节点）
   */
  insertNodeInTree(root, node) {
    if (node.parent_id === 0 || !node.parent_id) {
      root.push(node)
      return
    }
    let that = this
    this.walkTreeNode(root, function (obj) {
      if (node.parent_id === obj.id) {
        if (obj.__children) {
          obj.__children.push(node)
        } else {
          that.$set(obj, '__children', [node])
        }
        return true
      }
      return false
    })
  },
  /**
   * 从树中删除指定节点
   * @param root
   * @param pk
   */
  deleteNodeInTree(root, pk) {
    function moveToRoot(list) {
      if (list && list.length > 0) {
        for (let k = 0; k < list.length; k++) {
          root.push(list[k])
        }
      }
    }

    klib_utils.walkTreeNode(root, function (obj, list, index) {
      if (obj.id === pk) {
        list.splice(index, 1);
        moveToRoot(obj.__children)
      }
    })
  },
}
export default klib_utils
