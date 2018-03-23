<template>
  <auto-height-wrapper>
    <div class="tree" style="float:left;min-height:600px;border-right:1px solid #dfe6ec;">
      <k-tree :data="dataTree" @insert="handleTreeEvent" @edit="handleTreeEvent"
              @delete="handleTreeEvent" @move="handleNodeMove" @node-click="handleNodeClick"
              @detail="handleTreeEvent"></k-tree>
    </div>
    <div style="overflow: auto;">
      <k-condition ref="condition" size="mini" :dataStruct="m_dataStruct" @btnEvt_insert="handleEvent"
                   @btnEvt_refresh="getSearch()" @query="getSearch"></k-condition>
      <model-grid :dataStruct="m_dataStruct" :model="gridData" :totalCount="totalCount"
                  :page.sync="page" :pageSize.sync="pageSize" :selected.sync="selectedList"
                  @quickEdit="quickEdit" @sort="sortField" @btnEvt_edit="handleEvent" @btnEvt_delete="handleEvent"
                  @pageChange="getData()" @order-change="quickEdit" drag-order></model-grid>
      <mform :model.sync="currentRow" :isEditMode="isEditMode" withDialog :dataStruct="m_dataStruct"
             :fieldMapComponent="{}"
             @inserted="inserted" :withDialog="true" :visible.sync="showForm"></mform>
    </div>
  </auto-height-wrapper>
</template>
<script>
  import modelAPI from '../api/model'
  import KTree from "../components/KTree.vue";
  import mform from "./form.vue";
  import KCondition from "../components/KCondition.vue";
  import KDataStruct from "../components/KDataStruct.vue";
  import ModelGrid from "./grid.vue";


  export default {
    name: 'ModelIndex',
    components: {
      ModelGrid,
      KCondition,
      mform,
      KTree
    },
    mixins: [KDataStruct],
    data: function () {
      /**
       *
       * @type {modelAPI}
       * @private
       */
      this._api = modelAPI.new(this.$route.params.table || 'sys_logs',{},this.$store)
      return {
        isEditMode: true,
        loading: false, //切换Loading显示状态
        currentDB: 'approot', //当前表对应的数据库
        showForm: false,
        currentRow: {}, //当前表选中的数据行
        pageSize: 20,
        page: 1,
        gridData: [],
        selectedList: [],
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
        this._api.update(data).then(res => {
          this.$notify.info({
            title: name + '快速修改成功', message: data,
            duration: 1000
          });
          console.log('quick edit success', data, res.data)
        })
      },
      batchDelete() {
        console.log('batchDelete')
      },
      getData: function (where, orderby) {
        where = this.getWhere(where)
        let query = {
          page: this.page,
          pageSize: this.pageSize,
          orderby: this.getOrderBy(orderby),
        }
        if (typeof(where) === 'string') {
          query.where = where
        } else {
          if (where && !where.null) query = Object.assign(query, where)
        }
        //console.log(query)
        this._api.getTree(query, true).then(data => {
          this.dataTree = data
          this.gridData = data.root
        })
      },
      getSearch(where, orderby) {
        where = this.getWhere(where)
        let query = {
          page: this.page,
          pageSize: this.pageSize,
          orderby: this.getOrderBy(orderby),
        }
        if (typeof(where) === 'string') {
          query.where = where
        } else {
          if (where && !where.null) query = Object.assign(query, where)
        }
        //console.log(query)
        this._api.getData(query, true).then(data => {
          this.dataList = data
          this.gridData = data.list
          this.totalCount = data.count
        })
      },
      sortField(orderBy) {
        this._orderBy = orderBy
        this.getData(null, orderBy)
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
        let id = data.id
        let node
        if (id) {
          node = this.dataTree.___dic[id];
        } else {
          this.gridData = this.dataTree.root;
          return;
        }
        if (node) {
          this.gridData = [node];
          var list = node.__children;
          if (list) {
            for (var i = 0; i < list.length; i++) {
              var obj = list[i];
              this.gridData.push(obj);
            }
          }
        } else {
          this.gridData = [];
        }
      },
      handleTreeEvent(data, eventName) {
        // console.log(data, eventName)
        switch (eventName) {
          case 'insert':
            this.isEditMode = false;
            this.showForm = true;
            let newNode = Object.assign({}, this.m_dataStruct._DEFAULT) //insert to root if empty data
            newNode.parent_id = data.id
            this.currentRow = newNode
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
            this._api.deleteById(data.id).then(resp => {
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
        this._api.update(data).then(resp => {
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
    }
  }
</script>
<style>

</style>
