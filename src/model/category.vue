<template>
  <div class="mainPanel">
    <div class="tree" style="float:left;min-height:600px;border-right:1px solid #dfe6ec;">
      <k-tree :data="currentRoot" @insert="handleTreeEvent" @edit="handleTreeEvent"
              @delete="handleTreeEvent" @move="handleNodeMove" @node-click="handleNodeClick"
              @detail="handleTreeEvent"></k-tree>
    </div>
    <div style="overflow: auto;">
      <k-condition ref="condition" size="mini" :dataStruct="grid_dataStruct" @btnEvt_insert="handleEvent"
                   @btnEvt_refresh="getGrid()" @query="getGrid"></k-condition>
      <model-grid :dataStruct="grid_dataStruct" :model="gridData" :totalCount="totalCount"
                  :page.sync="page" :pageSize.sync="pageSize" :selected.sync="selectedList"
                  @quickEdit="quickEdit" @sort="sortField" @btnEvt_edit="handleEvent" @btnEvt_delete="handleEvent"
                  @pageChange="getGrid()"
      ></model-grid>
      <k-form-wrap label-width="200px" :field-editable="isAdmin" :model.sync="currentRow"
                   :isEditMode="isEditMode" withDialog :dataStruct="grid_dataStruct" @inserted="inserted"
                   :visible.sync="showForm" :component-map="componentMap">
      </k-form-wrap>
    </div>
  </div>

</template>
<script>
  import modelAPI from '../api/model'
  import categoryAPI from '../api/sys_category'
  import KTree from "../components/KTree.vue";
  import mform from "./form.vue";
  import KCondition from "../components/KCondition.vue";
  import KDataStruct from "../components/KDataStruct.vue";
  import {store} from '../main'
  import ModelGrid from "./grid.vue";
  import klib from "../klib/utils";
  import KFormWrap from "../components/KFormWrap";
  import {isAdmin, getRole} from "../utils/auth";

  export default {
    name: 'ModelCategory',
    components: {
      KFormWrap,
      ModelGrid,
      KCondition,
      mform,
      KTree
    },
    mixins: [KDataStruct],
    data: function () {
      /**
       * @type {categoryAPI}
       */
      this._api = modelAPI.new('sys_category')
      let id = parseInt(this.$route.params.id)
      if (id) {
        this._id = id
      } else {
        this._key = this.$route.params.id
      }
      this.categoryKey = parseInt(id) || id
      return {
        mapi: {},
        isEditMode: true,
        loading: false, //切换Loading显示状态
        currentDB: 'approot', //当前表对应的数据库
        showForm: false,
        currentRow: {}, //当前表选中的数据行
        pageSize: 20,
        page: 1,
        gridData: [],
        selectedList: [],
        currentRoot: [],
        currentCat: {},
        grid_dataStruct: {},
        componentMap: {}
      }
    },
    created() {

    },
    methods: {
      inserted: function (data) {
        this.showForm = false
        this.gridData.push(data);
        this.insertNodeInTree(this.dataTree.root, data)
        this.currentRow = Object.assign({}, this.m_dataStruct._DEFAULT)
        // console.log(modelAPI.data(store))
        // console.log(this.gridData)
      },
      quickEdit(data) {
        this._api.update(data).then(data => {
          this.$notify.info({title: name + '快速修改成功', message: res.data.result});
          console.log('quick edit success', data)
        })
      },
      batchDelete() {
        console.log('batchDelete')
      },
      getCategoryTree() {
      },
      getData(key) {
        key = key || this._key
        this._api.getTree({}, true).then(data => {
          this.dataTree = data
          if (key) {
            this.walkTreeNode(data.root, node => {
              if (node.key === key) {
                let id = node.parent_id
                this.currentCat = node
                let root = this._api.getById(store, id)
                if (!this.currentRoot.root) {
                  this.currentRoot = {root: (root ? root.__children : data.root)}
                }
                return true
              }
            })
          } else {
            let root = this._api.getById(this._id)
            this.currentCat = root
            this._key = root.key
            root = this._api.getById(root.parent_id)
            if (!this.currentRoot.root) {
              this.currentRoot = {root: (root ? root.__children : data.root)}
            }
          }
          this._table = this.currentCat.option_table
          this.mapi = modelAPI.new(this._table, {})
          this.mapi.getDataStruct().then(data => {
            this.grid_dataStruct = data
            this.getGrid({category: this._key})
          })
        })
      },
      getGrid(where, orderby) {
        // console.log(this._table, this.currentCat, this.currentRoot)
        where = this.getWhere(where)
        let query = {
          page: this.page,
          pageSize: this.pageSize,
          orderby: this.getOrderBy(orderby),
        }
        if (typeof(where) === 'string') {
          query.where = where
        } else {
          if (where && !where.null) {
            query = Object.assign(query, where)
            query.category = this._key
          }
        }
        //console.log(query)
        this.mapi.getData(query, true).then(data => {
          this.dataList = data
          this.gridData = data.list
          this.totalCount = data.count
        })
      },
      sortField(orderBy) {
        this._orderBy = orderBy
        this.getGrid(null, orderBy)
      },
      getWhere(where = this._where) {
        if (!where) {
          let cd = this.$refs.condition
          if (cd && cd.getQuery) {
            where = cd.getQuery()
            this._where = where
          }
        } else {
          this._where = where
        }
        where.category = this._key
        return where
      },
      getOrderBy(orderBy = this._orderBy) {
        if (!orderBy) {
          this._orderBy = ''
          return this._orderBy
        } else {
          this._orderBy = orderBy
        }
        return orderBy
      },
      handleNodeClick(data) {
        let key = data.key
        this.getData(key)
      },
      handleTreeEvent(data, eventName) {
        console.log(data, eventName)
        switch (eventName) {
          case 'insert':
            this.isEditMode = false;
            this.showForm = true;
            data = data || Object.assign({id: 0}, this.m_dataStruct._DEFAULT) //insert to root if empty data
            this.currentRow = {id: 0, role: 0, status: 0, parent_id: data.id}
            break
          case 'edit':
            this.isEditMode = true
            this.currentRow = data
            this.showForm = true
            break
          case 'detail':
            //ref.refRole.editRoleRefs(data)
            break
          case 'delete':
            mapi.deleteById(data.id).then(resp => {
              this.$message({
                message: '删除节点成功',
                type: 'success'
              });
              this.deleteNodeInTree(this.dataTree.root, data.id)
            })
            break
          default:
            return this.sysList
            break;
        }
      },
      handleNodeMove(data) {
        let node = this.dataTree.___dic[data.id]
        if (!node) return
        let pnode = this.dataTree.___dic[data.parent_id] || {__children: this.dataTree.root}
        //find the parent node or Root
        let oriParent = this.dataTree.___dic[node.parent_id] || {__children: this.dataTree.root}
        if (oriParent.__children) {
          let index = oriParent.__children.indexOf(node)
          //remove node from original parent node
          oriParent.__children.splice(index, 1)
        }
        //insert into new parent
        if (pnode.__children) {
          pnode.__children.push(Object.assign({}, node))
        } else {
          pnode.__children = [Object.assign({}, node)]
        }
        mapi.update(data).then(resp => {
          let dt = resp.data
          this.$message({
            message: '移动节点成功',
            type: 'success'
          });
        })
      },
      handleEvent(data, index, eventName) {
        //let ref = this.$refs
        switch (eventName) {
          case 'btnEvt_insert':
            this.isEditMode = false
            this.currentRow = Object.assign({}, this.m_dataStruct._DEFAULT)
            this.showForm = true
            break
          case 'btnEvt_edit':
            this.isEditMode = true
            this.currentRow = data
            this.showForm = true
            break
          case 'btnEvt_relation':
            //ref.refRole.editRoleRefs(data)
            break
          case 'btnEvt_permission':
            //ref.permissions.editPermission(data)
            break
          case 'btnEvt_delete':
            console.warn('try to delete data', data)
            this.api.deleteById(data.id).then(resp => {
              let indx = this.dataList.list.indexOf(data)
              this.dataList.list.splice(indx, 1)
              this.$message({
                message: '删除成功',
                type: 'success'
              });
            })
            break
          default:
            return this.sysList
            break;
        }
      },
      ...klib
    }
  }
</script>
