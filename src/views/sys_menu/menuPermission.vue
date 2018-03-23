<template>
  <div>
    <!--<el-button v-if="model" style="display: inline-block" type="primary" icon="k-ico-style" @click="editPermission()"></el-button>-->
    <el-input v-if="model" placeholder="请输入内容" v-model="value">
      <el-button slot="prepend" icon="k-ico-style" @click="editPermission()"></el-button>
    </el-input>

    <el-dialog :visible.sync="showDialog" :title="'请编辑【 '+currentRole.name+' 】对应的菜单权限'" :before-close="cancel"
               append-to-body width="870px">
      <el-container>
        <el-aside width="250px">
          <div style="margin:0 0 5px 0;">
            <el-input
              placeholder="输入关键字进行过滤"
              v-model="filterText">
            </el-input>
          </div>
          <el-tree ref="menuTree"
                   :data="tree.root"
                   :props="treeProps"
                   node-key="id"
                   @node-click="handleMenuNodeClick"
                   :expand-on-click-node="true"
                   highlight-current
                   show-checkbox
                   check-strictly
                   :default-checked-keys="grantedMenus"
                   :default-expanded-keys="expandMenuKeys"
                   :filter-node-method="filterMenuNode"
                   @check-change="handleMenuChecked"
          >
          </el-tree>
        </el-aside>
        <el-main><h2>{{currentMenu.id}} {{dialogTitle}}</h2>
          <div>访问地址：{{currentMenu.href}}</div>
          <div>后端地址：{{currentMenu.controller}}</div>
          <div class="divGridWrap" style="width: 559px;">
            <div class="gridItem" v-for="(item, index) in menuPermissions" style="width: 280px">
              <el-switch :disabled="permissionDisabled"
                         v-model=" item.is_checked"
                         active-color="#67c23a"
                         inactive-color="#ff4949"
                         @change="detectMenuChecked"
              ></el-switch>
              {{item.label}}
            </div>
          </div>
          <div style="margin:5px 0;clear: both">
            <el-button @click="grantAll(true)" type="success" :disabled="permissionDisabled">全部允许</el-button>
            <el-button @click="grantAll(false)" type="danger" :disabled="permissionDisabled">全部禁止</el-button>
            <el-button type="primary" icon="el-icon-upload" @click="savePermission">保存权限</el-button>
            <el-button @click="cancel">取消</el-button>
          </div>
        </el-main>
      </el-container>
      <div style="margin:5px auto;">
        <el-button @click="revokeAllMenu" type="primary">回收全部权限</el-button>
        <el-button @click="grantAllMenu" type="primary">授予全部权限</el-button>
        <el-button type="success" icon="el-icon-upload" @click="savePermission">保存【 {{currentRole.name}} 】的权限
        </el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import klib from '../../klib/grid'
  import menuAPI from '../../api/sys_menu'

  export default {
    name: 'menuPermission',
    data: function () {
      this.__dic = {}
      /**
       *
       * @type {menuAPI}
       * @private
       */
      this._api = menuAPI.new({}, this.$store)
      return {
        currentRole: {},
        emptyTree: [{label: '无数据', value: -1}],
        roleName: '数据载入中...',
        menuId: 0,
        permissionDisabled: false,
        showDialog: false,
        loading: false, //切换Loading显示状态
        treeProps: {
          children: "__children",
          label: "name",
          value: "id"
        },
        filterText: '',
        menuPermissionDic: [],
        grantedMenus: [],
        currentMenu: {},
        menuPermissions: {}, //展现权限子项使用
        permissionMap: { //权限数据对照字典
          1: 'GET | 允许 GET 访问',
          2: 'POST | 允许 POST 访问',
          4: 'PUT | 允许 PUT 访问',
          8: 'DELETE | 允许 DELETE 访问',
          16: 'PATCH | 允许 PATCH 访问',
          32: '允许 delete 参数',
          64: '允许 update 参数',
          128: '允许 insert 参数'
        },
        dialogTitle: '',
        expandMenuKeys: [],
      }
    },
    props: {
      treeData: Object,
      model: Object,
      value: String,
      size: {
        type: String,
        default: 'medium'
      },
      round: Boolean
    },
    computed: {
      tree: function () {
        let data = this.treeData
        if (data) {
          return data
        }
        data = this._api.tree()
        if (data) {
          return data
        }
        return this.emptyTree
      }
    },
    watch: {
      filterText: function (val) {
        this.$refs.menuTree.filter(val);
      }
    },
    created() {
      if (!this.treeData) {
        this._api.getTree().then(data => {
          this.emptyTree = data
        })
      }
    },
    methods: {
      emptyPermission() {
        let tree = this.treeData || this.emptyTree
        let dic = []
        klib.walkTreeNode(tree.root, node => {
          if (node.href || node.controller) {
            dic[node.id] = this.emptyPermissionItem()
          } else {
            dic[node.id] = []
          }
        })
        this.menuPermissionDic = dic
        return dic
      },
      emptyPermissionItem() {
        let arr = [];
        for (var j = 0; j < 32; j++) {
          var v = Math.pow(2, j);
          var text = this.permissionMap[v];
          if (text) {
            arr.push({is_checked: false, 'label': text, 'value': v});
          }
        }
        return arr
      },
      filterMenuNode: function (value, data) { //filter menu items by name
        if (!value) return true;
        var text = data.label || data.name;
        return text.toLocaleLowerCase().indexOf(value.toLowerCase()) !== -1;
      },
      reset() {

      },
      cancel() {
        this.reset();
        this.showDialog = false;
      },
      //根据当前菜单的权限字段值，将对话框中的权限项渲染正确
      handleMenuNodeClick: function (data) {
        //let mi = menuAPI.getById(this.$store, data.id)
        if (data && (data.href || data.controller)) {
          this.currentMenu = data
          this.dialogTitle = data.name + ' 权限编辑';
          this.permissionDisabled = false;
        } else {
          this.currentMenu = {id: data.id}
          this.dialogTitle = data.name + '  是菜单目录无法编辑权限！';
          this.permissionDisabled = true;
          this.menuPermissions = [];
          return;
        }

        this.menuPermissions = this.menuPermissionDic[data.id];
      },
      //当菜单节点被选中时触发
      handleMenuChecked: function (data, isChecked, isChildrenChecked) {
        this.handleMenuNodeClick(data);
        if (data.__children) {
          if (!isChildrenChecked) {
            data.__children.forEach(node => {
              this.grantAll(isChecked, node.id)
            })
          }
          if (isChecked) {
            if (this.expandMenuKeys.indexOf(data.id) < 0) {
              this.expandMenuKeys.push(data.id) //未展开状态
            }
          }
        }
        let arr = this.menuPermissionDic[data.id];
        let has_checked = false;
        if (arr) {
          for (let i = 0; i < arr.length; i++) {
            has_checked = arr[i] ? arr[i].is_checked : false;
            if (has_checked) {
              break;
            }
          }
        }
        //如果该Node没有单项被选中，则将全部权限项选中,避免覆盖
        if (!has_checked && isChecked) {
          this.grantAll(true);
        }
        if (!isChecked) {
          this.grantAll(false);
        }
        //console.log(this.menuPermissionDic)
      },

      editPermission(roleData) {
        if (!roleData) {
          if (this.model) {
            roleData = this.model
          } else {
          }
        }
        // console.log(roleData)
        this.showDialog = true;
        this.currentRole = roleData;
        let data = roleData.permission;
        this.grantedMenus = []; // 有授权的菜单项数组
        this.menuPermissions = [];// 单项菜单的权限列表
        this.expandMenuKeys = []; //默认展开的菜单节点
        this.emptyPermission() //保存角色对应菜单的具体权限列表字典
        this.$nextTick(() => {
          this.updateTreeCheck(data)
        })
      },
      updateTreeCheck(data) {
        let mt = this.$refs.menuTree
        let nodeId, node, value, arr_temp, arr
        //Clear all the checked node
        mt.setCheckedKeys([])
        if (!data) return;
        arr = data.split(',');
        for (let i = 0; i < arr.length; i++) {
          let pi = arr[i];
          let arr2 = pi.split('|');
          nodeId = parseInt(arr2[0]);
          node = this._api.getById(nodeId)
          if (!node) continue; //菜单节点不存在
          value = parseInt(arr2[1]);
          this.grantedMenus.push(nodeId);
          //将节点展开
          this.expandMenuKeys.push(node.parent_id);
          arr_temp = [];
          for (let j = 0; j < 32; j++) {
            let v = Math.pow(2, j);
            let text = this.permissionMap[v];
            if (text) {
              let check = (value & v) == v //二进制与运算
              arr_temp.push({is_checked: check, 'label': text, 'value': v});
              if (check) {
                //将相关节点置为Checked
                mt.setChecked(nodeId, true)
              }
            }
          }
          this.menuPermissionDic[nodeId] = arr_temp;
        }
        if (nodeId && node) {
          //选中节点
          mt.setCurrentKey(nodeId)
          this.$nextTick(() => {
            this.handleMenuNodeClick(node)
          });
        }
      },
      //当前菜单节点全部授权或者全部取消授权
      grantAll: function (isGranted, id) {
        let list = id ? this.menuPermissionDic[id] : this.menuPermissions
        if (list) {
          for (var i = 0; i < list.length; i++) {
            list[i].is_checked = isGranted;
            //console.log(this.menuPermissions[i])
          }
        }
        this.$refs.menuTree.setChecked(id || this.currentMenu.id, isGranted);
      },
      //将当前所有菜单的权限编辑结果压缩成字符串
      getRolePermissions() {
        let arr = [];
        this.menuPermissionDic.forEach((list, index) => {
          let val = 0;
          for (let i = 0; i < list.length; i++) {
            let mi = list[i];
            if (mi.is_checked) {
              val += mi.value;
            }
          }
          if (val > 0) {
            arr.push(index + '|' + val)
          }
        })
        return arr.join(',');
      },
      //保存角色权限字段
      savePermission: function () {
        this.showDialog = false
        let permits = this.getRolePermissions();
        //console.log(permits, this.currentRole.permission, this.menuPermissionDic)
        if (permits === this.currentRole.permission) {
          this.$message({
            message: '没有任何改变',
            type: 'warning'
          });
          return
        }
        if (this.model) {
          this.currentRole.permission = permits
          //this.$emit('input', this.currentRole);
        }
        this.$emit('input', permits)
        this.$emit('update', {id: this.currentRole.id, permission: permits}, this.currentRole)
      },
      //判断该菜单是否有权限项被选中
      detectMenuChecked() {
        var val = 0;
        //如果有菜单被选中
        for (var i = 0; i < this.menuPermissions.length; i++) {
          var mi = this.menuPermissions[i];
          if (mi.is_checked) {
            val += mi.value;
          }
        }
        this.$refs.menuTree.setChecked(this.currentMenu.id, val > 0);
      },
      grantAllMenu() {
        this.menuPermissionDic.forEach((item, id) => {
          this.$refs.menuTree.setChecked(id, true, true)
          this.grantAll(true, id)
        })
      },
      revokeAllMenu() {
        this.menuPermissionDic.forEach((item, id) => {
          this.$refs.menuTree.setChecked(id, false, true)
          this.grantAll(false, id)
        })
      }
    }
  }
</script>
