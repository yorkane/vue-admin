<template>
  <div class="mainPanel">
    <div class="tree" style="float:left;min-height:600px;border-right:1px solid #dfe6ec;">
      <k-tree :loading="loading" :data="treeData" @insert="handleInsert" @edit="handleEdit"
              @delete="handleDelete" @move="handleMove" @node-click="loadIntoTable"></k-tree>
    </div>
    <div style="overflow: auto;">
      <k-condition size="mini" :dataStruct="dataStruct" @btnEvt_insert="handleInsert" @btnEvt_refresh="loadData"
      ></k-condition>
      <sys_menu_grid :vModelData="nodeList" :dataStruct="dataStruct" @quickEdit="quickEdit"
                     @quick-edit="quickEdit" @order-change="quickEdit" @btnEvt_edit="handleEdit"
                     @btnEvt_insert="handleInsert" @btnEvt_delete="handleDelete" @mnuEvt_mail="" @mnuEvt_search="">
      </sys_menu_grid>
      <sys_menu_form :model="currentRow" :isEditMode="isEditMode" withDialog :dataStruct="dataStruct"
                     @inserted="inserted" :visible.sync="dialog_edit_show"
      ></sys_menu_form>
    </div>
  </div>
</template>
<script>
  import {getList, update, desc, deleteById} from '../../api/sys_menu'
  import klib from '../../klib/grid'
  import KTree from "../../components/KTree.vue";
  import Sys_menu_form from "./form.vue";
  import Sys_menu_grid from "./grid.vue";
  import KCondition from "../../components/KCondition.vue";

  export default {
    components: {
      KCondition,
      Sys_menu_grid,
      Sys_menu_form,
      KTree
    },

    data: function () {
      return {
        isEditMode: true,
        loading: false, //切换Loading显示状态
        currentDB: 'approot', //当前表对应的数据库
        currentTable: 'sys_user', //当前表
        dataStruct: {_NAME: 'sys_user'}, // 当前表描述
        tables: [],  //数据库表
        treeData: {
          root: [],
          tree_desc: {
            children: "__children",
            label: "name",
            value: "id",
          }
        }, //当前数据
        nodeList: [],
        currentRow: {}, //当前表选中的数据行
        currentField: 'id',
        totalCount: 0, //数据记录总数
        cache: {}, //缓存
        dialog_edit_show: false,
      }
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          published: 'success',
          draft: 'gray',
          deleted: 'danger'
        }
        return statusMap[status]
      }
    },
    created() {
      this.loadTableDesc()
    },
    methods: {
      cancel: function () {
        this.dialog_edit_show = false;
      },
      inserted: function (data) {
        this.insertNodeInTree(this.treeData.root, data)
        this.dialog_edit_show = false
      },
      handleInsert(data) {
//        console.log('start insert in', data)
        this.isEditMode = false;
        this.dialog_edit_show = true;
        data = data || {id: 0} //insert to root if empty data
        this.currentRow = {id: 0, role: 0, status: 0, parent_id: data.id}
      },
      handleEdit: function (data) {
//        console.log('start edit', data)
        this.currentRow = data
        this.isEditMode = true
        this.dialog_edit_show = true
      },
      quickEdit(data, model) {
        update(data).then(resp => {
          console.log('quick edit success', data)
        }).catch(err => {
          console.log(err)

        })
      },
      batchDelete() {
        console.log('batchDelete')
      },
      handleDelete: function (data) {
        console.log('start delete', data)
        deleteById({id: data.id}).then(resp => {
          this.$message({
            message: '删除节点成功',
            type: 'success'
          });
          this.deleteNodeInTree(this.treeData.root, data.id)
        })
      },
      handleMove(data) {
        //console.log(data)
        let node = this.treeData.nodeDic[data.id]
        if (!node) return
        let pnode = this.treeData.nodeDic[data.parent_id] || {__children: this.treeData.root}
        //find the parent node or Root
        let oriParent = this.treeData.nodeDic[node.parent_id] || {__children: this.treeData.root}
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
        update(data).then(resp => {
          let dt = resp.data
          this.$message({
            message: '移动节点成功',
            type: 'success'
          });
        })
      },
      loadTableDesc: function () {
        var key = this.currentDB + this.currentTable;
        var _ca = this.cache[key];
        if (_ca) {
          this.dataStruct = _ca;
          return;
        }
        desc().then(
          response => {
            this.dataStruct = this.loaddataStruct(response.data)
            this.loadData();
          }
        )
      },
      loadData: function (where, orderby) {
        where = this.getWhere(where);
        orderby = this.getOrderBy(orderby);
        getList({page: 1, pageSize: 20, where: where, orderby: orderby}).then(response => {
          let data = response.data
          data.nodeDic = klib.loadTreeDic(data.root, data.tree_desc.pk)
          this.treeData = data;
          this.loading = false;
          this.nodeList = data.root
        })
      },
      loadIntoTable: function (data) {
        let id = data.id
        let node
        if (id) {
          node = this.treeData.nodeDic[id];
        } else {
          this.nodeList = this.treeData.root;
          return;
        }
        if (node) {
          this.nodeList = [node];
          var list = node.__children;
          if (list) {
            for (var i = 0; i < list.length; i++) {
              var obj = list[i];
              this.nodeList.push(obj);
            }
          }
        } else {
          this.nodeList = [];
        }
      },
      ...klib
    }
  }
</script>

<style>
  .el-tree {
    border: 0;
  }

  .el-table {
    border-left: 0;
  }
</style>
