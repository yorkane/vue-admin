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
             @check-change="handleNodeChecked"
             :highlight-current="highlightCurrent"
             :render-content="nodeRender"
             :show-checkbox="showCheckBox"
             :filter-node-method="filterMethod"
             :default-checked-keys="defaultCheckedKeys"
             :defaultExpandedKeys="defaultExpandedKeys"
             :style="getHeight()"
             class="ktree">
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
      getRootPath(data) {
        let pk = this.data.tree_desc.pk;
        let parent_key = this.data.tree_desc.parent_key;
        let path = [data[pk]];
        let stack = [data[parent_key]];
        while (stack.length > 0) {
          let pid = stack.pop();
          let obj = this.data.nodeDic[pid];
          if (obj) {
            path.push(obj[pk]);
            pid = obj[parent_key];
            if (pid == 0 || pid == '' || pid == '0') {
              break;
            } else {
              stack.push(pid);
            }
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
        if (!this.disabled) {
          if (this.isSingleCheck) {
            this.$refs.ktree.setCheckedKeys([])
            treeNode.checked = !treeNode.checked
          }
          if (this.isMultipleCheck) {
            treeNode.checked = !treeNode.checked
          }
        }
        this.$emit('node-click', data, treeNode, nodeComponent)
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
      handleNodeChecked: function (data, isChecked, isChildrenChecked) {
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
        this.$emit('check-change', data, isChecked, isChildrenChecked)
      },
      setCheckedKeys(keys, isChecked) {
        return this.$refs.ktree.setCheckedKeys(keys, isChecked)
      },
      getCheckedKeys(isLeafOnly) {
        return this.$refs.ktree.getCheckedKeys(isLeafOnly)
      },
      getCheckedNodes(isLeafOnly) {
        return this.$refs.ktree.getCheckedNodes(isLeafOnly)
      },
      getNode(data) {
        return this.$refs.ktree.getNode(data)
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
      /* 构建分类title及工具 */
      nodeRender(h, {_self, node, data}) {
        let has_edit = _self._events.edit ? true : false;
        let has_insert = _self._events.insert ? true : false;
        let has_delete = _self._events.delete ? true : false;
        let has_move = _self._events.move ? true : false;
        let has_detail = _self._events.detail ? true : false;
        let childrenNodes = [h('span', data.name)]
        if (data.id === 0) {

        } else {
          if (has_edit || has_insert || has_delete || has_move || has_detail) {
            let ktreeBar = []
            if (has_insert) {
              // 添加
              ktreeBar.push(
                h('i', {
                  'class': 'el-icon-plus',
                  on: {
                    click: function (event) {
                      event.stopPropagation()
//                    console.log('click insert',data, node)
                      _self.$emit('insert', data, 'insert')
                    }
                  }
                }))
            }
            if (has_edit) {
              // 编辑
              ktreeBar.push(
                h('i', {
                  'class': 'el-icon-edit',
                  on: {
                    click: function (event) {
                      event.stopPropagation()
//                    console.log('click edit',data, node)
                      _self.$emit('edit', data, 'edit')
                    }
                  }
                }),)
            }
            if (has_delete) {
              // 删除
              ktreeBar.push(
                h('i', {
                  'class': 'el-icon-delete',
                  on: {
                    click: function (event) {
                      event.stopPropagation()
                      _self.$confirm('删除该节点, 是否继续? ', '提示(您可以选择隐藏或者标记删除)', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                      }).then(() => {
                        _self.$emit('delete', data, 'delete')
                      }).catch(() => {
                      })
                    }
                  }
                })
              )
            }
            if (has_move) {
              // 移动
              ktreeBar.push(
                h('i', {
                  'class': 'el-icon-share',
                  on: {
                    click: function (event) {
                      _self.moveTo(data); //open select node dialog
                      event.stopPropagation()
                    }
                  }
                })
              )
            }
            if (has_detail) {
              // 详情
              ktreeBar.push(
                h('i', {
                  'class': 'el-icon-tickets',
                  on: {
                    click: function (event) {
                      _self.$emit('detail', data, 'detail')
                      event.stopPropagation()
                    }
                  }
                })
              )
            }
            childrenNodes.push(h('span', {'class': 'ktree-bar'}, ktreeBar))
          }
        }
        return h(
          'div',
          {
            'class': 'el-tree-node__label',
            prop: {
              children: '-'
            }
          },
          childrenNodes
        )
      }
    }
  }
</script>

<style>
  .ktree__wrapper {
    min-width: 300px;
    text-align: left;
    border: 0;
  }

  .KTreeFilter button {
    margin: 0;
  }

  .el-tree-node {
    position: relative;
  }

  .el-tree-node__content:hover .ktree-bar {
    display: block;
  }

  .ktree-bar {
    display: none;
    position: absolute;
    top: 0;
    right: 10px;
    font-size: 12px;
  }

  .ktree-bar > i {
    color: #999;
    display: inline-block;
    padding: 5px;
  }

  .ktree-bar > i:hover {
    color: #20a0ff;
  }
</style>
