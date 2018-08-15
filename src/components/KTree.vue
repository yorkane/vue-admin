<template>
  <div class="ktree__wrapper" ref="wrap1">
    <div style="margin:5px" v-if="withFilter" class="KTreeFilter">
      <el-input size="mini" style="" placeholder="输入关键字进行过滤"
                v-model="filterText">
        <i slot="suffix"
           :class="['el-select__caret', 'el-input__icon', 'el-icon-circle-close']"
           @click="filterText=''"
        ></i>
      </el-input>
    </div>
    <el-tree ref="ktree" :check-strictly="checkStrictly"
             :data="data.root||data"
             :props="tprop"
             :node-key="nkey"
             :expand-on-click-node="expandOnClickNode"
             :default-expand-all="defaultExpandAll"
             @node-click="nodeClick"
             @check="handleNodeChecked"
             :highlight-current="highlightCurrent"
             :show-checkbox="showCheckBox"
             :filter-node-method="filterMethod"
             :default-checked-keys="defaultCheckedKeys"
             :defaultExpandedKeys="defaultExpandedKeys"
             :style="getHeight()"
             class="ktree">
      <span class="k-tree-node" slot-scope="{ node, data }">
        <span :title="data.desc||data.comment">{{ data[tprop.label] }}</span>
        <span class="node-menu-bar">
          <i v-if="_events.insert" class="el-icon-plus" @click="sendEvent($event,'insert', data)" title="新建"></i>
          <i v-if="_events.edit" class="el-icon-edit" @click="sendEvent($event,'edit', data)" title="编辑"></i>
          <i v-if="_events.delete" class="el-icon-delete" @click="sendEvent($event, 'delete', data)" title="删除"></i>
          <i v-if="_events.move" class="el-icon-share" @click="sendEvent($event,'move', data)" title="移动"></i>
          <i v-if="_events.detail" class="el-icon-tickets" @click="sendEvent($event, 'detail', data)" title="详情"></i>
        </span>
      </span>
    </el-tree>
    <div style="text-align: right" v-if="showCheckBox && !hideButton">
      <el-button-group style="margin:5px">
        <el-button size="small" v-if="_events.cancel" type="primary" icon="el-icon-close" @click="$emit('cancel')">取消
        </el-button>
        <el-button v-if="!this.disabled" size="small" type="primary" icon="el-icon-circle-close-outline"
                   @click="checkAll(false)">清除选择
        </el-button>
        <el-button size="small" v-if="!isSingleCheck && !this.disabled" type="primary" icon="el-icon-menu"
                   @click="checkAll(true)">全部选择
        </el-button>
        <slot name="confirm" v-if="!this.disabled">
          <el-button size="small" type="success" icon="el-icon-success" @click="checkConfirm()">确认</el-button>
        </slot>
        <slot name="button"></slot>
      </el-button-group>
    </div>
    <el-dialog :visible.sync="showMoveDialog" title="请选择需要移动到指定的节点" :before-close="cancel">
      <div style="height: 280px;">
        <el-cascader size="large " style="width:500px;"
                     placeholder="请选择上级"
                     :options="data.root||data"
                     filterable
                     v-model="currentPath"
                     change-on-select
                     :props="tprop"
                     expand-trigger="hover"
                     @change="handleNodeChange"
        >
        </el-cascader>
      </div>
      <el-button type="primary" icon="" @click="doMove()">确定</el-button>
      <el-button type="primary" icon="" @click="doMove(0)">移动到根目录</el-button>
      <el-button type="primary" icon="" @click="resetPath">重置</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-dialog>
  </div>
</template>

<script>
  import {Tree} from 'element-ui';
  import klib from '../klib/utils'

  export default {
    name: 'KTree',
    props: {
      hideButton: Boolean,
      checkStrictly: Boolean,
      height: Number,
      withFilter: {
        type: Boolean,
        default: true
      },
      loading: {
        type: Boolean,
        default: true
      },
      highlightCurrent: {
        type: Boolean,
        default: true
      },
      showCheckBox: {
        type: Boolean,
        default: false
      },
      data: {
        type: [Object, Array],
        default: function () {
          return []
        }
      },
      nodeKey: {
        type: [String, Number],
        required: false
      },
      filterNodeMethod: Object,
      treeProps: {
        default: function () {
          return {
            children: "__children",
            label: "name",
            value: "id"
          }
        }
      },
      disabled: Boolean,
      defaultCheckedKeys: Array,
      expandOnClickNode: {
        type: Boolean,
        default: true
      },
      defaultExpandedKeys: Array,
      defaultExpandAll: {
        type: Boolean,
        default: false
      },
      isSingleCheck: Boolean,
      isMultipleCheck: Boolean,
      onlyLeafCheckable: Boolean,
    },
    computed: {
      tprop() {
        let p = this.treeProps || (this.data ? this.data.tree_desc : {})
        let that = this
        p.disabled = function () {
          return that.disabled
        }
        return p
      },
      nkey() {
        let id = this.nodeKey || ((this.data && this.data.tree_desc) ? this.data.tree_desc.pk : 'id')
        return id
      },
      filterMethod() {
        return this.filterNodeMethod || this.filterNode
      },
    },
    watch: {
      filterText: function (val) {

        this.$refs.ktree.filter(val);
      }
      ,
      loading(val) {
        this.toggleLoading()
      }
    },
    data() {
      // 声明保存当前操作分类node对象
      this.__currentNode = null
      return {
        filterText: '',
        visible2: false,
        showMoveDialog: false,
        currentPath: [],
        treeData: [],
        lastCheckedNode: {}
      }
    },
    mounted() {
//      this.toggleLoading()
    },
    methods: {
      getHeight() {
        if (this.height) {
          return 'height:' + this.height + 'px;overflow:auto;'
        }
      },
      cancel() {
        this.showMoveDialog = false
      },
      moveTo(data) {
        this.showMoveDialog = true
        this.nodeData = data
        this.currentPath = this.getRootPath(data)
      },
      resetPath() {
        this.currentPath = this.getRootPath(this.nodeData);
      },
      filterNode: function (value, data, node) { //filter menu items by name
        if (!value) return true;
        let text = data.label || data.name || data.desc;
        let isMatch = (text.toLocaleLowerCase().indexOf(value.toLowerCase()) !== -1) || value == data.id
        if (isMatch) return true;
        if (data.parent_id === 0) {
          return false
        }
        if (node.parent && node.parent.data) {
          let nd = node.parent.data
          if (nd) {
            text = nd.label || nd.name || nd.desc;
            return (text.toLocaleLowerCase().indexOf(value.toLowerCase()) !== -1) || value == nd.id
          }
        }
      },
      checkAll(isChecked) {
        if (isChecked) {
          let pk = this.nkey
          let arr = []
          klib.walkTreeNode(this.data.root || this.data, node => {
            arr.push(node[pk])
          })
          this.$refs.ktree.setCheckedKeys(arr, true)
        } else {
          this.$refs.ktree.setCheckedKeys([])
        }
      },
      setChecked(key, isChecked, deep) {
        this.$refs.ktree.setChecked(key, isChecked, deep);
      },
      getRootPath(nodeId) {
        let path = []
        let data = this.$refs.ktree.getNode(nodeId)
        if (!data) {
          if (typeof(nodeId) === 'string') {
            nodeId = parseInt(nodeId)
            data = this.$refs.ktree.getNode(nodeId)
          } else {
            data = this.$refs.ktree.getNode(nodeId + '')
          }
        }
        if (!data) return path;
        data = data.data
        path.push(data)
        while (data) {
          let parent = this.$refs.ktree.getNode(data.parent_id)
          if (parent) {
            path.push(parent.data)
            data = parent.data
          } else {
            break
          }
        }
        return path.reverse();
      },
      doMove(parent_id) {
        if (parent_id !== null && parent_id !== undefined) {
          parent_id = 0;
        } else {
          parent_id = this.__changedPath[this.__changedPath.length - 1];
        }
        var newObj = {
          id: this.nodeData.id,
          parent_id: parent_id,
        };
//        this.nodeData.parent_id = newObj.parent_id;
        this.$emit('move', newObj)
        this.showMoveDialog = false;
      },
      handleNodeChange: function (pathArr) {
        this.__changedPath = pathArr;
      },
      /* 点击响应时间 */
      nodeClick(data, treeNode, nodeComponent) {
        this.nodeData = data;
        this.$emit('node-click', data, treeNode, nodeComponent)
        if (!this.disabled) {
          if (this.onlyLeafCheckable && treeNode.childNodes && treeNode.childNodes.length > 0) {
            return
          }
          if (this.isSingleCheck) {
            this.$refs.ktree.setCheckedKeys([], this.onlyLeafCheckable)
            treeNode.checked = !treeNode.checked
          }
          if (this.isMultipleCheck) {
            treeNode.checked = !treeNode.checked
          }
        }
      },
      /**
       * 发送确认事件
       */
      checkConfirm() {
        //选中的节点
        let nodes = this.$refs.ktree.getCheckedNodes()
        //选中节点的
        let keys = this.$refs.ktree.getCheckedKeys()
        this.$emit('check-confirm', nodes, keys, this)
      },
      handleNodeChecked: function (data, checkedInfo) {
        // if (isChecked && this.isSingleCheck) {
        // if(this.lastCheckedNode) {
        //   this.$refs.ktree.setChecked(this.lastCheckedNode)
        // }
        // this.lastCheckedNode = data
        // let node = this.$refs.ktree.getCurrentNode()
        // // if (node && node !== data) {
        // //   this.$refs.ktree.setChecked(data)
        // // }
        // if (!node) {
        //   this.$refs.ktree.setCurrentNode(data)
        // }
        // }
        // console.log(data, isChecked)
        this.$emit('check', data, checkedInfo)
      },
      setCheckedKeys(keys, leafOnly) {
        return this.$refs.ktree.setCheckedKeys(keys, leafOnly)
      },
      getCheckedKeys(isLeafOnly) {
        return this.$refs.ktree.getCheckedKeys(isLeafOnly)
      },
      getCheckedNodes(isLeafOnly) {
        return this.$refs.ktree.getCheckedNodes(isLeafOnly)
      },
      getNode(data) {
        let tree = this.$refs.ktree
        if (tree && tree.getNode) {
          return tree.getNode(data)
        }
      },
      toggleLoading() {
        if (this.loading) {
          if (!this._loadMask) {
            this._loadMask = Loading.service({
              target: this.$el,
              body: true,
            })
          } else {
            this._loadMask.visible = true
          }
        } else {
          if (this._loadMask) {
            this._loadMask.close()
          }
        }
      },
      sendEvent(event, eventName, data) {

        event.stopPropagation()
        switch (eventName) {
          case 'insert':
          case 'detail':
          case 'edit':
            this.$emit(eventName, data, eventName)
            break;
          case 'move':
            this.moveTo(data); //open select node dialog
            break;
          case 'delete':
            this.$confirm('删除该节点, 是否继续? ', '提示(您可以选择隐藏或者标记删除)', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$emit(eventName, data, eventName)
            }).catch(() => {
            })
            break;
          default:
        }
      },
    }
  }
</script>

<style lang="scss">
  .ktree__wrapper {
    min-width: 300px;
    text-align: left;
    border: 0;

    .KTreeFilter button {
      margin: 0;
    }
    .el-tree-node {
      position: relative;
    }
    .k-tree-node {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      padding-right: 8px;
      .node-menu-bar {
        display: none;
      }
      .extra {
        position: absolute;
      }
    }
    .k-tree-node:hover {
      i {
        color: #999;
        display: inline;
        padding: 1px;
      }
      i:hover {
        color: #00B7FF;
        background: #5e7382;
      }
      .extra {
        display: none;
      }
      .node-menu-bar {
        position: absolute;
        right: 0;
        display: block;
      }
    }
  }
</style>
