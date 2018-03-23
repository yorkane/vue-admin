<template>
  <div>
    <el-button :size="size" :round="round" type="primary" @click="chooseRole">{{roleName}}</el-button>
    <el-dialog :visible.sync="showDialog" title="请选择角色（当前用户将拥有关联角色的权限）" :before-close="cancel"
               append-to-body>
      当前角色：{{roleName}}
      <div style="height:300px;">

        <el-cascader size="large " style="width:500px;"
                     placeholder="请选择对应的角色"
                     :options="tree.root"
                     filterable
                     v-model="currentPath"
                     change-on-select
                     :props="treeProps"
                     expand-trigger="hover" clearable>
        </el-cascader>
        <el-button @click="currentPath=[]">清空</el-button>
      </div>
      <el-button type="primary" icon="upload" @click="saveChoice">保存角色关联</el-button>

      <el-button @click="cancel">取消</el-button>
    </el-dialog>
  </div>
</template>
<script>
  import roleAPI from '../../api/sys_role'
  import klib from '../../klib/grid'

  export default {
    name: 'chooseRoleDialog',
    data: function () {
      this.__dic = {}
      return {
        treeData: {root: [{label: '无数据', value: -1}]},
        roleName: '数据载入中...',
        showDialog: false,
        loading: false, //切换Loading显示状态
        filterText: '',
        currentPath: [],
        expandRoleKeys: [],
        relatedRoleKeys: [],
        treeProps: {
          children: "__children",
          label: "name",
          value: "id"
        },
      }
    },
    props: {
      multipleRoles: {
        type: Boolean,
        default: false,
      },
      value: [String, Number],
      size: {
        type: String,
        default: 'medium'
      },
      round: Boolean
    },
    watch: {
      value(val) {
        this.setRole(val)
      }
    },
    computed: {
      tree: function () {
        let data = this.treeData
        if (data) {
          return data
        }
        data = roleAPI.tree(this.$store)
        if (data) {
          return data
        }
        return this.emptyTree
      }
    },
    created() {
      roleAPI.getTree({}, this.$store).then(data => {
        this.treeData = data
        let treeDic = {}
        this.walkTreeNode(data.root, function (node) {
          treeDic[node.id] = node
        })
        this.__dic = treeDic;
        this.setRole(this.value)
      })
    },
    mounted() {
    },
    methods: {
      chooseRole() {
        this.showDialog = true
      },
      handleChange(data) {
//        console.log(data)
      },
      getRoleId: function () {
        return this.currentRole
      },
      filterMenuNode: function (value, data) { //filter menu items by name
        if (!value) return true;
        var text = data.label || data.name;
        return text.toLocaleLowerCase().indexOf(value.toLowerCase()) !== -1;
      },
      reset: function () {

      },
      cancel: function () {
        this.reset();
        this.showDialog = false;
      },
      saveChoice: function () {
        //this.$emit('chooseRole', '1,2,3') // todo merge roles
        let role = this.currentPath.pop()
        this.$emit('input', role) //Make parent component v-model value changed
        this.setRole(role)
        this.showDialog = false;
      },
      loadData: function (where, orderby) {
        this.treeData = data.root;
        this.treeProps = data.tree_desc;
        let treeDic = {}
        this.walkTreeNode(this.treeData, function (node) {
          treeDic[node.id] = node
        })
        this.__dic = treeDic;
        this.setRole(this.value)
      },
      setRole(id) {
        let node = this.__dic[id] || {}
        this.roleName = node.name || '无角色！'
      },
      walkTreeNode: klib.walkTreeNode
    }
  }
</script>
