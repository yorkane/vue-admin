<template>
  <div class="KSelect">
    <template v-if="isTree">
      <el-popover
        ref="popoverKtree"
        :width="width"
        trigger="click"
        class="KSelect"
        v-model="showPopover">
        <k-tree :data="treeRoot" :tree-props="treeProps" show-check-box check-strictly
                @check-confirm="checkChange"
                @node-click="selectNode"
                ref="ktree" :height="height"
                :is-single-check="isSingle"
                :is-multiple-check="isMultiple"
                @cancel="cancleTree"
                :default-expanded-keys="defaultExpandedKeys"
                :disabled="readOnly"
        >
        </k-tree>
      </el-popover>
      <template v-if="disabled">{{buttonLabel||'*未选择'}}</template>
      <template v-else>
        <el-input-number v-if="withInput&&isSingle" controls-position="right" :size="size" v-model="idValue"
                         v-popover:popoverKtree @change="changeValue"></el-input-number>
        <el-button-group>
          <el-button :size="size" type="primary" icon="el-icon-edit" @click="withInput=!withInput"></el-button>
          <el-button :size="size" disabled>{{buttonLabel||'*未选择'}}</el-button>
          <el-button :size="size" type="primary" icon="el-icon-arrow-down" v-popover:popoverKtree
                     @click="showTreeSelect"></el-button>
        </el-button-group>
        <el-input v-if="withInput&&isMultiple" :size="size" v-model="idListStr" @change="changeValue"></el-input>
        <!--<el-button v-else :size="size" :round="round" type="primary">-->
        <!--{{buttonLabel||'*请点击选择'}}-->
        <!--<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i></el-button>-->


      </template>
    </template>
    <el-select v-else-if="isList && isMultiple" v-model="idList" :size="size" @change="changeValue" style="width:100%;"
               multiple filterable
               clearable>
      <el-option
        v-for="item in optionList"
        :key="item[keyField]"
        :label="getLabel(item)"
        :value="item[valueField]">
      </el-option>
    </el-select>
    <el-select v-else-if="isList && !isMultiple" v-model="idValue" :size="size" @change="changeValue"
               style="width:100%;" filterable>
      <el-option
        v-for="item in optionList"
        :key="item[keyField]"
        :label="getLabel(item)"
        :value="item[valueField]">
      </el-option>
    </el-select>
    <template v-else>{{value}} [列表数据未载入]</template>
    <!--<el-input-number v-else-if="isSingle" v-model="value"></el-input-number>-->
    <!--<el-input v-else v-model="value"></el-input>-->
  </div>
</template>
<script>
  import klib from '../klib/utils'
  import KTree from "./KTree";

  export default {
    components: {
      KTree,
    },
    name: 'KSelect',
    data() {
      return {
        withInput: false,
        isTree: false,
        isList: false,
        idList: [],
        idListStr: '',
        idValue: 0,
        optionList: [],
        isCascader: false,
        showPopover: false,
        treeRoot: [],
        selection: {},
        buttonLabel: '',
        selectValue: '',
        isSingle: true,
        defaultExpandedKeys: [],
      }
    },
    props: {
      value: [String, Number],
      round: {
        type: Boolean,
        default: false
      },
      height: {
        type: Number,
        default: 300
      },
      width: {
        type: Number,
        default: 400
      },
      size: {
        type: String,
        default: 'medium'
      },
      options: [Array, Object, String, Number],
      splitter: {
        type: String,
        default: ','
      },
      maxTreeDepth: Number,
      keyField: {
        type: String,
        default: 'id'
      },
      labelField: {
        type: String,
        default: 'label'
      },
      valueField: {
        type: String,
        default: 'id'
      },
      trunkOnly: {
        type: Boolean,
        default: false,
      },
      leafOnly: {
        type: Boolean,
        default: true,
      },
      isMultiple: {
        type: Boolean,
        default: false
      },
      //For delay load option datasource
      dataSourceKey: String,
      readOnly: Boolean,
      disabled: Boolean,
      treeProps: {
        default: function () {
          return {
            children: "__children",
            label: "name",
            value: "id"
          }
        }
      },
    },
    computed: {},
    watch: {
      value(val) {
        this.syncVal(val)
      },
      options(val) {
        this.syncOption(val)
      },
    },
    created() {
      setTimeout(() => {
        this.syncVal(this.value)
        this.syncOption(this.options)
      }, 1)

    },
    mounted() {
      this.optionList = this.getOptionsList()
    },
    methods: {
      syncVal(val) {
        if (this.isTree) {
          let ktree = this.$refs.ktree
          if (!val && val !== 0) {
            this.buttonLabel = '*请点击选择'
          } else {
            if (this.isSingle) {
              this.defaultExpandedKeys = [val]
            } else {
              this.idListStr = val
            }
            this.getButtonlabel(val)
          }
        }
        this.isSingle = (typeof(val) === 'number') || !this.isMultiple
        this.idValue = this.isSingle ? parseInt(val) : val
        if (this.isMultiple && val) {
          if (!val.split) { //防止错误的value 类型注入
            this.$emit('input', '')
            return
          }
          this.idList = []
          val.split(',').forEach(v => {
            this.idList.push(parseInt(v))
          })
        } else {
          this.idList = val ? [val] : []
        }
      },
      syncOption(val) {
        // console.log(val)
        if (val && val.root) {
          this.isTree = true
          if (this.maxTreeDepth && this.maxTreeDepth > 0) {
            let arr = []
            klib.walkTreeNode(val.root, node => {
              if (node.__depth <= this.maxTreeDepth) {
                let nd = Object.assign({}, node)
                nd.__children = null
                arr.push(nd)
              }
            })
            this.treeRoot = arr;
          } else {
            this.treeRoot = val.root;
          }
          this.$nextTick(() => {
            let ktree = this.$refs.ktree
            if (!ktree) return;
            if (this.isMultiple) {
              ktree.setCheckedKeys(this.idList, true)
            } else {
              ktree.setCheckedKeys([this.value], true)
            }
            ktree.checkConfirm()
          })
        } else if (val && (val.list || val.push)) {
          this.isList = true
          this.optionList = val.list || val;
          // this.$emit('input', 0)
          // this.$nextTick(() => {
          // this.getButtonLabel(true)
          // this.$refs.ktree.setCheckedKeys([this.value], true)
          // this.$emit('input', 1)
          // })
        } else {
          // this.isInput = true
        }
        // console.debug('KSelect syncOption: option loaded:', val, '|value:', this.value, '|optionList:', this.optionList, '|isList', this.isList)
      },
      changeValue(val) {
        if (val === undefined) {
          this.$emit('input', '')
        } else if (val.push) {
          let v = val.join(',')
          this.$emit('input', v)
        } else {
          if (this.isSingle) {
            val = parseInt(val)
            this.$emit('input', val)
          } else {
            val = val.replace(/([\d,]*)[^\d,]*/ig, '$1')
            this.idListStr = val
            this.$emit('input', val)
          }
        }
      },
      getLabel(val) {
        let lb = val[this.labelField] || val['label'] || val['name'] || val['desc']
        return lb
      },
      getOptionsList() {
        if (this.options) {
          return this.options.list || this.options
        }
        let arr = []
        // If no options inject, than make the list by value
        if (this.value && this.value.substr) {
          this.value.split(this.splitter).forEach(val => {
            arr.push({
              [this.keyField]: parseInt(val),
              [this.labelField]: val,
              [this.valueField]: parseInt(val),
            })
          })
        }
        // console.log(arr)
        return arr
      },

      selectNode(data, treeNode) {
      },
      showTreeSelect() {
        this.showPopover = true;
        this.$nextTick(() => {
          console.log(this.idList, this.value, 'showTreeSelect')
          if (this.isMultiple) {
            this.$refs.ktree.setCheckedKeys(this.idList, true)
          } else {
            this.$refs.ktree.setCheckedKeys([this.value], true)
          }
        })
      },
      cancleTree() {
        this.showPopover = false
      },
      /**
       * 刷新选择按钮文字
       * @param isInit
       */
      checkChange(nodes, keys, treeComponent) {
        this.showPopover = false;
        let label
        for (let i = 0; i < nodes.length; i++) {
          let val = nodes[i]
          if (!val) continue;
          if (label) {
            label = label + ',' + (val.label || val.name || val.desc)
          } else {
            label = (val.label || val.name || val.desc)
          }
        }
        let idList = this.isMultiple ? keys.join(',') : keys[0];
        this.$emit('input', idList)
        // console.log('KSelect:checkChange', nodes, keys, this.value, treeComponent)
        this.buttonLabel = label
      },
      getButtonlabel(val) {
        if (this.isSingle) {
          let nd = this.$refs.ktree.getNode(val)
          if (nd) {
            this.buttonLabel = nd.label || nd.name || nd.desc
          }
          return
        }
        let arr = val.split(',')
        let label
        for (let i = 0; i < arr.length; i++) {
          let val = this.$refs.ktree.getNode(arr[i])
          if (!val) continue;
          if (label) {
            label = label + ',' + (val.label || val.name || val.desc || val)
          } else {
            label = (val.label || val.name || val.desc || val)
          }
        }

        this.buttonLabel = label || '*请点击选择'
      },
    }
  }
</script>