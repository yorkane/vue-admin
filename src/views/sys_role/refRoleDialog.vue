<template>
  <div>
    <!--<el-button v-if="model" :size="size" :round="round" type="primary" @click="editRoleRefs()" icon="k-ico-re-data">{{value}}-->
    <!--</el-button>-->
    <el-input v-if="model" placeholder="请点击选择角色关联" v-model="value">
      <el-button slot="prepend" icon="k-ico-re-data" @click="editRoleRefs()"></el-button>
    </el-input>
    <el-dialog :visible.sync="showDialog"
               :title='"当前角色："+role.name+" （被关联的角色将被继承）"' :before-close="cancel"
               append-to-body width="550px">
      <div>
        <k-tree :data="tree" @edit="editRole" :defaultExpandedKeys="expandRoleKeys" showCheckBox ref="roleTree"
                @check-change="handleRoleChecked">

          <el-button slot="confirm" type="success" @click="saveRoleRefs" size="small" icon="el-icon-upload">保存角色关联</el-button>
          <el-button slot="button" type="primary" @click="cancel" size="small" icon="el-icon-close">取消</el-button>
        </k-tree>
        <!--<el-tree ref="roleTree"-->
        <!--:data="tree.root"-->
        <!--:props="treeProps"-->
        <!--node-key="id"-->
        <!--:default-expand-all="false"-->
        <!--:expand-on-click-node="true"-->
        <!--highlight-current-->
        <!--show-checkbox-->
        <!--:default-expanded-keys="expandRoleKeys"-->
        <!--:filter-node-method="filterMenuNode"-->
        <!--@check-change="handleRoleChecked"-->
        <!--&gt;</el-tree>-->
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import roleAPI from '../../api/sys_role'
  import klib from '../../klib/grid'
  import KDataStruct from "../../components/KDataStruct.vue";
  import KTree from "../../components/KTree.vue";

  export default {
    components: {KTree},
    mixins: [KDataStruct],
    name: 'refRoleDialog',
    data: function () {
      this.__dic = {}
      this._api = roleAPI.new({}, this.$store)
      return {
        emptyTree: {roo: [{label: '无数据', value: -1}]},
        role: {},
        roleName: '',
        showDialog: false,
        filterText: '',
        expandRoleKeys: [],
        treeProps: {
          children: "__children",
          label: "name",
          value: "id"
        },
      }
    },
    props: {
      model: Object,
      treeData: Object,
      value: String,
      size: {
        type: String,
        default: 'medium'
      },
      round: Boolean
    },
    watch: {
      filterText: function (val) {
        this.$refs.roleTree.filter(val);
      }
    },
    created() {
      if (!this.treeData) {
        this._api.getTree({}).then(data => {
          this.emptyTree = data.root
        })
      }
      if (this.model) {

      }
      this.__roleRefDic = {}
    },
    mounted() {
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
    methods: {
      editRole(data) {
        this.$emit('editRole', data)
      },
      editRoleRefs(data) {
        this.showDialog = true;
        if (data) {
          this.role = data
        } else {
          this.role = this.model || {}
        }
        //console.log(this.role, this.tree)
        this.$nextTick(() => {
          this.updateTreeCheck(this.role)
        })
      },
      updateTreeCheck(data) {
        this.reset()
        let arr = (data.role_refs || '').split(',');
        for (var i = 0; i < arr.length; i++) {
          let id = arr[i];
          if (!id) continue;
          this.__roleRefDic[id] = true;
          let node = this._api.getById(id)
          if (node) {
            this.$refs.roleTree.setChecked(id, true);
            this.expandRoleKeys.push(node.parent_id);
          }
        }
      },
      filterMenuNode: function (value, data) { //filter menu items by name
        if (!value) return true;
        let text = data.label || data.name;
        return text.toLocaleLowerCase().indexOf(value.toLowerCase()) !== -1;
      },
      reset(checked = false) {
        this.$refs.roleTree.checkAll(checked)
      },
      cancel() {
        this.showDialog = false;
      },
      handleRoleChecked: function (data, isChecked, isChildrenChecked) {
        if (data.__children) {
          klib.walkTreeNode(data.__children, node => {
            if (!node.__children) {
              this.__roleRefDic[node.id] = isChecked;
            }
          })
          return
        }
        this.__roleRefDic[data.id] = isChecked;
      },
      saveRoleRefs: function () {
        let arr = this.$refs.roleTree.getCheckedKeys(true)
        let refs = arr.join(',')
        if (refs === this.role.role_refs) {
          this.$message({
            message: '没有任何改变',
            type: 'warning'
          });
          return
        }
        if (this.model) {
          this.model.role_refs = refs
        }
        this.$emit('input', refs)
        this.$emit('update', {id: this.role.id, role_refs: refs}, this.role)
        this.showDialog = false;
      }
    }
  }
</script>
