<template>
  <div class="mainPanel">
    <div class="tree" style="float:left;min-height:600px;border-right:1px solid #dfe6ec;">
      <k-tree :loading="loading" :data="treeData" @insert="handleInsert" @edit="handleEdit"
              @delete="handleDelete" @move="handleMove" @node-click="loadIntoTable"
              @detail="handleEditRolePermission"></k-tree>
    </div>
    <div style="overflow: auto;">
      <k-condition size="mini" :dataStruct="dataStruct" @btnEvt_insert="handleInsert" @btnEvt_refresh="loadData">
        <el-button @click="manageRoot" size="mini" type="primary">管理根目录</el-button>
      </k-condition>
      <menu-permission ref="permissions" @update="saveRolePermission"></menu-permission>
      <ref-role-dialog @editRole="handleEditRolePermission" ref="refRole" @update="saveRoleReference"></ref-role-dialog>
      <sys_menu_grid :vModelData="nodeList" :dataStruct="dataStruct" @quickEdit="quickEdit"
                     @switch-value="quickEdit" @order-change="quickEdit" @btnEvt_edit="handleEdit"
                     @btnEvt_permission="handleEvent" @btnEvt_relation="handleEvent"
                     @btnEvt_insert="handleInsert"
                     @mnuEvt_delete="handleDelete">
      </sys_menu_grid>
      <sys_role_form :model="currentRow" :isEditMode="isEditMode" withDialog :dataStruct="dataStruct"
                     @inserted="inserted" :visible.sync="dialog_edit_show"></sys_role_form>
    </div>
  </div>
</template>
<script>
  import roleAPI from '../../api/sys_role'
  import klib from '../../klib/grid'
  import KTree from "../../components/KTree.vue";
  import Sys_role_form from "./form.vue";
  import Sys_menu_grid from "./grid.vue";
  import KCondition from "../../components/KCondition.vue";
  import MenuPermission from "../sys_menu/menuPermission.vue";
  import RefRoleDialog from "./refRoleDialog.vue";

  export default {
    components: {
      RefRoleDialog,
      MenuPermission,
      KCondition,
      Sys_menu_grid,
      Sys_role_form,
      KTree
    },

    data: function () {
      /**
       *
       * @type {roleAPI}
       * @private
       */
      this._api = roleAPI.new({}, this.$store)
      return {
        isEditMode: true,
        loading: false, //切换Loading显示状态
        currentDB: 'approot', //当前表对应的数据库
        currentTable: 'sys_user', //当前表
        dataStruct: {}, // 当前表描述
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
      this._api.getDataStruct().then(data => {
        this.dataStruct = data;
        this.loadData()
      })
    },
    methods: {
      manageRoot() {
        this.loadIntoTable()
      },
      inserted(data) {
        this.insertNodeInTree(this.treeData.root, data)
      },
      handleInsert(data) {
        console.log('start insert in', data)
        this.isEditMode = false;
        this.dialog_edit_show = true;
        data = data || {id: 0} //insert to root if empty data
        this.currentRow = {id: 0, role: 0, status: 0, parent_id: data.id}
      },
      handleEdit: function (data) {
        console.log('start edit', data)
        this.currentRow = data
        this.isEditMode = true
        this.dialog_edit_show = true
      },
      handleEditRolePermission(data) {
        this.$refs.permissions.editPermission(data)
      },
      quickEdit(data) {
        this._api.update(data).then(res => {
          console.log('quick edit success', data)
        })
      },
      batchDelete() {
        console.log('batchDelete')
      },
      handleDelete: function (data) {
        console.log('start delete', data)
        this._api.deleteById({id: data.id}).then(resp => {
          this.$message({
            message: '删除节点成功',
            type: 'success'
          });
          this.deleteNodeInTree(this.treeData.root, data.id)
        })
      },
      handleMove(data) {
        // console.log(data)
        let node = this.treeData.___dic[data.id]
        if (!node) return
        let pnode = this.treeData.___dic[data.parent_id] || {__children: this.treeData.root}
        //find the parent node or Root
        let oriParent = this.treeData.___dic[node.parent_id] || {__children: this.treeData.root}
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
      loadData: function (where, orderby) {
        where = this.getWhere(where);
        orderby = this.getOrderBy(orderby);
        this._api.getTree({where: where, orderby: orderby}, true).then(data => {
          this.treeData = data;
          this.nodeList = data.root
        });
      },
      loadIntoTable: function (data = {}) {
        // console.log(data)
        let id = data.id
        let node
        if (id) {
          node = this.treeData.___dic[id];
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
      handleEvent(data, index, eventName) {
        let ref = this.$refs
        switch (eventName) {
          case 'btnEvt_relation':
            ref.refRole.editRoleRefs(data)
            break
          case 'btnEvt_permission':
            ref.permissions.editPermission(data)
            break
          case 'sys':
          default:
            return this.sysList
            break;
        }
      },
      saveRolePermission(po, role) {
        this._api.update(po).then(resp => {
          role.permission = po.permission
          this.$message({
            message: '保存权限成功',
            type: 'success'
          });
        })
      },
      saveRoleReference(po, role) {
        this._api.update(po).then(resp => {
          role.role_refs = po.role_refs
          this.$message({
            message: '角色关系保存成功',
            type: 'success'
          });
        })
        //console.log(po, role)
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
