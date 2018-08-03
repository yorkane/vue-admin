<template>
  <div class="kjson-editor">
    <el-tabs type="border-card" v-if="le === -1" v-model="activeTabName">
      <el-tab-pane label="JSON 编辑">
        <el-input class="jsonTextArea" placeholder="请填写字符串" v-model="sourceCode" :size="size" type="textarea"
                  :autosize="{ minRows: 20, maxRows: 40}"></el-input>
      </el-tab-pane>
      <el-tab-pane label="字段编辑" lazy>
        <el-button type="success" size="mini" icon="el-icon-upload2" style="width: 100%;margin:0 0 5px 0"
                   @click="getSourceCode()">保存修改
        </el-button>
        <json-editor v-model="value" :le="0" ref="level0" :size="size"></json-editor>
        <!--<slot name="button"></slot>-->
      </el-tab-pane>
      <el-tab-pane :label="previewLabel" v-if="previewData || previewLabel !== 'Preview'" lazy>
        <prism :language="previewType">{{ previewData }}</prism>
      </el-tab-pane>
      <el-tab-pane :label="resultLabel" v-if="resultData || resultLabel !== 'Result'" lazy>
        <prism :language="resultType">{{ resultData }}</prism>
      </el-tab-pane>
      <el-tab-pane v-if="extraTabLabel" :label="extraTabLabel">
        <slot name="tab">
          Extra content
        </slot>
      </el-tab-pane>
      <slot name="button"></slot>
    </el-tabs>
    <el-row v-else>
      <table cellspacing="0" cellpadding="4">
        <tr v-if="!le" align="left">
          <th class="col_type">类型</th>
          <th class="field" align="center">字段名</th>
          <th class="value">值</th>
          <th class="operation">操作</th>
        </tr>
        <template v-for="(item , index) in items">
          <tr>
            <td class="col_type">
              <el-select v-model="item.type" @input="changeType(item)" :disabled="!item.isNew" :size="size">
                <el-option value="String"></el-option>
                <el-option value="Number"></el-option>
                <el-option value="Boolean"></el-option>
                <el-option value="Date"></el-option>
                <el-option value="Array"></el-option>
                <el-option value="Object"></el-option>
              </el-select>
            </td>
            <td :style="{paddingLeft:level*20+'px'}" class="field">
              <el-col :span="1" style="min-width: 16px">
                            <span v-if="item.type === 'Object' || item.type === 'Array' "
                                  :class="item.show?'el-icon-caret-bottom':'el-icon-caret-right'"
                                  style="color:#c7c7c7;line-height: 28px" @click="toggle(item)"></span>
                <span v-else style="padding: 4px"></span>
              </el-col>
              <el-col :span="23">
                <el-input placeholder="请填写名称" v-model.trim="item.name" :disabled="!item.isNew" :size="size">
                </el-input>
              </el-col>
            </td>
            <td class="value">
              <el-input placeholder="请填写字符串" v-model.trim="item.data" v-if="item.type === 'String' "
                        :size="size" type="textarea" :autosize="{ minRows: 1, maxRows: 4}"></el-input>
              <el-input-number v-else-if="item.type === 'Number'" v-model="item.data" :size="size"
                               style="width: 200px"></el-input-number>
              <el-switch tabindex="1" v-if="item.type === 'Boolean' " active-text="true" inactive-text="false"
                         v-model="item.data"></el-switch>
              <el-date-picker v-else-if="item.type === 'Date'" v-model="item.data" type="datetime"
                              placeholder="选择日期时间" tabindex="1" :size="size"></el-date-picker>
            </td>
            <td class="operation">
              <el-button-group>
                <template v-if="item.type === 'Array' || item.type === 'Object'">
                  <el-button type="primary" @click="addSubNode(item)"
                             size="mini" title="Add Node" icon="el-icon-plus"></el-button>
                </template>
                <template v-else>
                  <el-button type="primary" icon="el-icon-plus" @click="addElement()"
                             size="mini" title="Add Field"></el-button>
                </template>
                <el-button v-if="type === 'Array' && item.type === 'Object'" type="success" icon="el-icon-back"
                           size="mini"
                           @click="copyInArray(item)" title="Copy"></el-button>
                <el-button v-if="item.isNew" type="danger" icon="el-icon-delete" size="mini"
                           @click="remove(item, index)" title="Delete"></el-button>
              </el-button-group>
            </td>
          </tr>
          <tr v-if="(item.type === 'Array'||item.type === 'Object')"
              :title="item.show + '' + item.data[0]">
            <td colspan="7" style="width: 100%;margin:0;padding: 0 ">
              <json-editor v-model="item.data" :le="level+1" :is-new="item.isNew" :parent="item" :type="item.type"
                           :size="size" :keyEntry="item.name" v-show="item.show"
                           :ref="'subEditor' + item.id"></json-editor>
            </td>
          </tr>
        </template>
      </table>
    </el-row>
  </div>
</template>

<script>
  import Vue from 'vue'
  import 'prismjs'
  import 'prismjs/themes/prism-tomorrow.css'
  import Prism from 'vue-prism-component'

  var eventHub = new Vue()
  export default {
    components: {Prism},
    name: "jsonEditor",
    props: {
      value: Object | Array,
      parent: Object,
      index: Number,
      size: String,
      le: {
        type: Number,
        default: -1
      },
      isNew: Boolean,
      type: {
        type: String,
        default: 'Object'
      },
      extraTabLabel: String,
      activeTab: {
        type: String,
        default: "1"
      },
      previewLabel: {
        type: String,
        default: 'Preview'
      },
      previewType: {
        type: String,
        default: 'javascript'
      },
      resultLabel: {
        type: String,
        default: 'Result'
      },
      resultType: {
        type: String,
        default: 'javascript'
      },
      previewData: [String, Object, Array],
      resultData: [String, Object, Array],
    },
    data: function () {
      return {
        level: this.le ? this.le : 0,
        items: [],
        sourceCode: '',
        eventHub: {},
        nc: 0,
      }
    },
    computed: {
      activeTabName: {
        get() {
          return this.activeTab.toString()
        },
        set(value) {
          this.$emit('update:activeTab', value)
        }
      },
    },
    created() {
      if (this.le === -1) {
        this.eventHub = new Vue()
      } else {
        eventHub.$on('updateParent', () => {
          this.updateParent()
        })
      }
      this.parsedItems()
    },
    mounted() {
      this.syncValue()
    },
    watch: {
      value(val) {
        this.parsedItems()
        this.syncValue(val)
      },
      sourceCode(val) {
        // console.log(val)
        let obj = JSON.parse(val)
        this.$emit('input', obj)
        this.$emit('change', obj)
      },
    },
    methods: {
      syncValue() {
        if (this.le === -1) {
          this.items = []
          setTimeout(() => {
            this.parsedItems()
            this.getSourceCode()
          }, 2)
        }
      },
      updateParent() {
        if (this.le >= 0) {
          for (let i = 0; i < this.items.length; i++) {
            let item = this.items[i]
            this.value[item.name] = item.data
            // console.log(item.data)
          }
        } else {
        }
      },
      getSourceCode() {
        eventHub.$emit('updateParent')
        setTimeout(() => {
          // console.log(this.$refs.level0)
          this.sourceCode = this.JSONFormat(JSON.stringify(this.value))
        }, 2)

      },
      addElement() {
        let newId = this.nc++;
        switch (this.type) {
          case 'Array':
            let length = this.items.length
            // let last_item = this.items[length - 1]
            this.items.push({
              isNew: true,
              data: 'New Element: ' + newId,
              name: length,
              show: true,
              type: 'String',
              id: newId
            })
            break
          case 'Object':
            this.items.push({
              isNew: true,
              show: true,
              name: 'Key' + newId,
              type: 'String',
              data: "New value " + newId,
              id: newId
            })
            break
          default:
            break
        }
        // console.log(this.items)
      },
      createNewItem(name, data, type) {
        let item = {isNew: this.isNew, id: this.nc++}
        this.$set(item, 'name', name)
        this.$set(item, 'data', data)
        this.$set(item, 'show', true)
        this.$set(item, 'type', type)
        return item
      },
      parsedItems() {
        // this.sourceCode = this.JSONFormat(JSON.stringify(this.value))
        this.items = []
        let parent = this.parent || {type: this.type}
        for (let key in this.value) {
          let val = this.value[key]
          let tp = typeof(val)
          console.log(key, '=', val)
          let item = this.createNewItem(key, val, parent)
          // this.$set(item,"name",key);
          // this.$set(item,"data",val);
          switch (tp) {
            case 'string':
              item.type = "String"
              if (key.match(/(time|date)$/i)) {
                item.type = 'Date'
              }
              break
            case 'number':
              item.type = 'Number'
              break
            case 'boolean':
              item.type = 'Boolean'
              break
            default:
              if (val.splice) {
                item.type = 'Array'
              } else {
                item.type = 'Object'
              }
              this.$set(item, "show", true)
              break;
          }
          this.items.push(item)
        }
        // console.log(this.items)


        // this.$set(this.items, items)
        // this.items = items
        return this.items
      },
      remove: function (item, index, level) {
        if (item.type === 'Array' || item.type === 'Object') {
          this.$confirm("该元素是" + item.type + "类型,是否确认删除！", '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.items.splice(index, 1)
          }).catch(() => {
          });
        }
        else {
          this.items.splice(index, 1)
        }
      },
      toggle: function (item) {
        // console.log(item)
        item.show = !item.show;
      },
      changeType: function (item) {
        item.isNew = true
        if (item.type === 'Array') {
          this.$set(item, "data", ['Auto Inject From: ' + item.id]);
        } else if (item.type === 'Object') {
          this.$set(item, "data", {["AutoInject" + item.id]: "Auto Inject From:" + item.id});
        } else {
          item.data = item.data.toString()
        }
        item.show = true
      },
      addSubNode(item) {
        // console.log(this.$refs.subEditor, item.subIndex)
        let subNode = this.$refs['subEditor' + item.id]
        if (subNode) {
          subNode[0].addElement()
        } else {
        }
      },
      copyInArray(item) {
        let ni = Object.assign({}, item)
        ni.isNew = true
        ni.name = this.items.length
        this.items.push(ni)
      },
      JSONFormat(json) {
        //from https://github.com/phoboslab/json-format
        let p = []
        let indentType = '  '
        let push = function (m) {
          return '\\' + p.push(m) + '\\';
        }
        let pop = function (m, i) {
          return p[i - 1]
        }
        let tabs = function (count) {
          return new Array(count + 1).join(indentType);
        }
        p = [];
        let out = "", indent = 0;

        // Extract backslashes and strings
        json = json
          .replace(/\\./g, push)
          .replace(/(".*?"|'.*?')/g, push)
          .replace(/\s+/, '');

        // Indent and insert newlines
        for (let i = 0; i < json.length; i++) {
          let c = json.charAt(i);
          switch (c) {
            case '{':
            case '[':
              out += c + "\n" + tabs(++indent, indentType);
              break;
            case '}':
            case ']':
              out += "\n" + tabs(--indent, indentType) + c;
              break;
            case ',':
              out += ",\n" + tabs(indent, indentType);
              break;
            case ':':
              out += ": ";
              break;
            default:
              out += c;
              break;
          }
        }
        out = out.replace(/\[[\d,\s]+?\]/g, function (m) {
          return m.replace(/\s/g, '');
        }).replace(/\\(\d+)\\/g, pop) // strings
          .replace(/\\(\d+)\\/g, pop); // backslashes in strings

        return out;
      }
    }
  }
</script>
<style>
  .kjson-editor {
    height: 100%;
  }

  .kjson-editor textarea.el-textarea__inner {
    background: #2d2d2d !important;
    color: #7ec699;
    font-family: "Menlo", "Consolas", monospace;
  }

  .kjson-editor table {
    /*border-collapse: separate;*/
    border-collapse: collapse;
    border-spacing: 5px;
    width: 100%;
  }

  .kjson-editor .field {
    min-width: 150px;
    width: 60%;
  }

  .kjson-editor .col_type {
    min-width: 110px;
    max-width: 110px;
    width: 5%;
  }

  .kjson-editor .value {
    min-width: 250px;
    width: 20%;
  }

  .kjson-editor pre[class*="language-"] {
    margin: 0;
  }

  .kjson-editor .operation {
    min-width: 150px;
    width: 5%;
  }
</style>
