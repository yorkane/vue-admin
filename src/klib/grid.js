
const emptyDataStruct = {
  _FIELD_DIC: {},
  statusDic: {},
  optionsDic: {},
  _FIELD_LIST: [],
  _NAME: false,
  _PK: 'id'
}
/**
 * Deprecated in 2018.1.11
 */
const klib = {
  test(t) {
    if (t) {
      console.log(t)
    } else {
      console.log('test')
    }
  },
  getById(API, id) {
    return API.getById(this.$store, id)
  },
  cleanClone(obj) {
    if (obj === undefined || obj === null) return;
    let newObj
    if (obj.forEach) {
      newObj = {}
      obj.forEach((item, key) => {
        if (typeof(key) !== 'function') {
          newObj[key] = this.cleanClone(item)
        }
      })
      return newObj
    } else if (obj.pop && obj.splice) {
      newObj = Array.from(obj)
      for (let i = 0; i < newObj.length; i++) {
        let item = newObj[i];
        newObj[i] = this.cleanClone(item)
      }
      return newObj
    } else if (typeof(obj) === 'object') {
      newObj = {}
      for (let key in obj) {
        if (typeof(key) === 'string' || typeof(key) === 'number') {
          newObj[key] = this.cleanClone(obj[key])
        }
      }
      return newObj
    }
    if (typeof(obj) !== 'function') {
      return obj
    }
  },
  isEmptyObj(obj) {
    if (obj === undefined || obj === null) return true;
    if (typeof(obj) === 'string') {
      return obj === ''
    }
    let isEmpty = true
    for (let key in obj) {
      let item = obj[key]
      if (item !== false) {
        isEmpty = false
      }
    }
    return isEmpty
  },
  quick_edit(plainObj) {
    this.$emit('quick-edit', plainObj)
  },
  getState(vue = {}, key) {
    let st = vue.$store || this.$store || {}
    return st[key]
  },
  isEmpty: function (str) {
    if (str == '' || str == undefined || str == null || typeof(str) != 'string' || str.length < 1) {
      return true
    }
  },
  //读取树结构并返回ID对应字典
  loadTreeDic: function (root, pk) {
    let stack = [];
    let dic = {};
    for (let i = 0; i < root.length; i++) {
      let obj = root[i];
      dic[obj[pk]] = obj;
      if (!obj.__children) {
      } else {
        stack.push(obj)
      }
    }
    //crusie all nodes
    while (stack.length > 0) {
      let tmpNode = stack.pop();
      if (tmpNode.__children) {
        for (let i = 0; i < tmpNode.__children.length; i++) {
          let obj = tmpNode.__children[i];
          dic[obj[pk]] = obj;
          if (!obj.__children) {
          } else {
            stack.push(obj)
          }
        }
      }
    }
    return dic;
  },
  deleteNodeInTree(root, pk) {
    function moveToRoot(list) {
      if (list && list.length > 0) {
        for (let k = 0; k < list.length; k++) {
          root.push(list[k])
        }
      }
    }

    this.walkTreeNode(root, function (obj, list, index) {
      if (obj.id === pk) {
        list.splice(index, 1);
        moveToRoot(obj.__children)
      }
    })
  },
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

//读取表格结构
  loaddataStruct(data) {
    if (!data._FIELD_DIC) {
      data._FIELD_DIC = {};
      for (let i = 0; i < data._FIELD_LIST.length; i++) {
        let fi = data._FIELD_LIST[i];
        data._FIELD_DIC[fi.Field] = fi;
        if (fi.isPK) {
          data._PK = fi.Field;
        }
      }
    }
    if (!data.statusValueDic) {
      data.statusDic = data._STATUS; //注册状态字典
      let dic = {};
      for (let key in data._STATUS) {
        let list = data._STATUS[key];
        for (let i = 0; i < list.length; i++) {
          let si = list[i];
          dic[si.id] = si;
        }
      }
      data.statusValueDic = dic; //注册状态值对应字典
    }
    if (!data.optionsValueDic) {
      let dic = {};
      data.optionsDic = data._OPTIONS; //注册选项字典
      for (let key in data._OPTIONS) {
        let list = data._OPTIONS[key];
        for (let i = 0; i < list.length; i++) {
          let pi = list[i];
          dic[pi.id] = pi;
        }
      }
      data.optionsValueDic = dic; //注册选项ID字典
    }
    return data;
  },
  restoreVmodelData() {
    // restore data
    for (let key in this.___oridata) {
      let val = this.___oridata[key];
      if (typeof(val) === 'function') continue;
      this.vModelData[key] = val;
    }
  },
//根据 columnWidth 数组获取表格宽度
  getColWidth: function (fi) {
    let name = fi.Field;
    let wd = this.columnWidth[name];
    if (wd !== undefined) return wd;
    return 150;
  },
  sortEvent(colObj) {
    if (!colObj.order) return;

    let orderBy = '`' + colObj.prop.toString() + '`' + (colObj.order.indexOf('asc') == 0 ? ' ASC' : ' DESC');
    this.$emit('sort', orderBy)
    //console.log(colObj.order, orderBy)
  },
//判断表头是否可以排序
  isSortable: function (item) {
    if (item.isText || item.isStatus) {
      return false
    }
    if (item.isPK || item.isDate) {
      return 'custom'
    }
    return true;
  },
//根据tags数组获取值
  getTagType: function (value) {
    return this.tags[value] || '';
  },
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
  getStatusList: function (fieldName) {
    let list = this.getParentDataStruct().statusDic[fieldName] || [];
    // console.log(fieldName, list, this.getParentDataStruct())
    return list
  },
  getOptionList: function (fieldName) {
    let ds = this.getParentDataStruct()
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
    let ds = this.getParentDataStruct()
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
    let ds = this.getParentDataStruct()
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
  getQueryUrl(where, orderby, pageIndex, pageSize) {
    where = this.getWhere(where);
    orderby = this.getOrderBy(orderby);
    let qr = (this.isEmpty(where) ? '' : '&where=' + encodeURIComponent(where)) +
      (this.isEmpty(orderby) ? '' : '&orderby=' + encodeURIComponent(orderby));
    return qr
  },
  getOrderBy(orderby) {
    if (orderby) {
      this.orderBy = orderby;
    } else {
      orderby = this.orderBy;
    }
    return orderby || '';
  },
  getPageIndex(page) {
    if (page) {
      this.page = page;
    } else {
      page = this.page;
    }
    return page || 1;
  },
  getPageSize(size) {
    if (size) {
      this.pageSize = size;
    } else {
      size = this.pageSize;
    }
    return size || 20;
  },
  getWhere: function (where) {
    if (where) {
      this.currentWhere = where;
    } else {
      where = this.currentWhere;
    }
    return where
  },
  updateQueryCondition(where) {
    where = this.getWhere(where)
    if (this.loadData) {
      this.loadData(null, null, where, null)
    }
  },
  formatDate: function (dateobj) {
    if (!dateobj) return dateobj;
    if (dateobj.getDate) {
      return dateobj.getFullYear() + "-" + (dateobj.getMonth() + 1) + "-" + dateobj.getDate() + " " + dateobj.getHours() + ":" + dateobj.getMinutes() + ":" + dateobj.getSeconds()
    }
    return dateobj + '';
  },
  addClassName: function (el) {
    if (!el.className) el.className = '';
    el.className = el.className.replace(/ onDragEl/ig, '');
    el.className += ' onDragEl';
  }
  ,
  removeClassName: function (el) {
    if (!el.className) el.className = '';
    el.className = el.className.replace(/ onDragEl/ig, '');
  }
  ,
  handleDrag: function (event) {
    let el = event.target
    let orderindex = el.getAttribute('orderindex')
    if (!orderindex) {
      el = el.parentNode
      orderindex = el.getAttribute('orderindex')
    }
    let pkid = el.id;
    //console.log(el, pkid, orderindex)
    event.dataTransfer.setData("nodeInfo", pkid + '|' + orderindex);
    this.addClassName(el);
    let that = this
    setTimeout(function () {
      that.removeClassName(el);
    }, 100);
  }
  ,
  handleDragLeave: function (event) {
    this.removeClassName(event.target)
  },
  handleDragEnter: function (event) {
    this.addClassName(event.target)
  },
  allowDrop: function (ev) {
    ev.preventDefault()
  },
  handleDrop: function (event) {
    let pkidFrom = event.dataTransfer.getData("nodeInfo");
    let el = event.target
    let orderindex = el.getAttribute('orderindex')
    if (!orderindex) {
      el = el.parentNode
      orderindex = el.getAttribute('orderindex')
    }
    let pkidTo = el.id;
    //console.log('drop from ' + pkidFrom + ' to ' + pkidTo, orderindex)
    event.preventDefault();
    this.removeClassName(document.getElementById(pkidFrom.split('|')[0]));
    this.removeClassName(el);
    let from = parseInt(pkidFrom.split('|')[1]);
    let to = parseInt(orderindex);
    //console.log('handleDrop', from, to)
    if (from === to) {
      return
    }
    this.dropOrder(from, to)
//			console.log(arr1[1], arr1[2]);
  },
  initDragDrop: function () {
    document.addEventListener("dragover", function (event) {
      event.preventDefault()
    });
  },
}

export default klib
