<template>
  <auto-height-wrapper>
    <auto-height-wrapper class="tree" style="float:left;min-height:600px;border-right:1px solid #dfe6ec;">
      <k-tree :data="dataTree" ref="ktree"
              @node-click="handleNodeClick"
              :default-expanded-keys="defaultOpenKey"
              @detail="handleTreeEvent"></k-tree>
    </auto-height-wrapper>
    <div class="infoZone">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-card class="box-card">
            <el-tabs v-if="definitions">
              <el-tab-pane label="当前方法">
                {{currentId || '未选择'}}
                <hr/>
                方法描述：{{info.desc||'无'}}
                <br/><br/>

                <el-table :data="info.params" header-row-class-name="th-header">
                  <el-table-column prop="name" label="参数名" width="150"></el-table-column>
                  <el-table-column prop="type" label="类型" width="120"></el-table-column>
                  <el-table-column prop="desc" label="描述" width=""></el-table-column>
                </el-table>

                <div class="returns">
                  返回类型：{{info.returns || '无'}}
                  <hr/>
                  返回描述：{{info.return_desc || '无'}}
                </div>
              </el-tab-pane>
              <template v-for="(item, key) in definitions">
                <el-tab-pane :label="key">
                  <div style="min-width: 800px;overflow: auto">
                    <el-table :data="objectToArray(item)" header-row-class-name="th-header">
                      <el-table-column prop="name" label="参数名" width="150"></el-table-column>
                      <el-table-column prop="type" label="类型" width="120"></el-table-column>
                      <el-table-column prop="desc" label="描述" width=""></el-table-column>
                    </el-table>
                  </div>
                </el-tab-pane>
              </template>
            </el-tabs>
          </el-card>
        </el-col>
        <!--<el-col :span="8">-->
        <!--<el-card class="box-card">-->
        <!--<div slot="header" class="clearfix">-->
        <!--<span>方法信息</span>-->
        <!--<el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>-->
        <!--</div>-->
        <!--<pre><code class="javascript">const s =-->
        <!--new Date().toString()</code></pre>-->
        <!--</el-card>-->
        <!--</el-col>-->
      </el-row>

      <!--<model-grid class="tree-grid" :dataStruct="m_dataStruct" :model="gridData" :totalCount="totalCount"-->
      <!--:page.sync="page" :pageSize.sync="pageSize" :selected.sync="selectedList"-->
      <!--@btnEvt_inspect="handleEvent"-->
      <!--drag-order></model-grid>-->
      <el-row class="jsonRow">
        <json-editor v-model="requestParams" size="mini" extra-tab-label="额外" :active-tab.sync="activeTab"
                     editor-label="测试参数编辑"
                     preview-label="方法定义" :preview-data="methodInfo" result-label="完整请求" :result-data="testResult"
                     :parse-error.sync="badJsonErr" :addition-preview="{ '预览最终结果' : testResult.data}">
          <div slot="button" style="margin:10px 0 0">
            <el-button @click="doTest">开始测试</el-button>
            <el-button @click="doRestore">默认参数</el-button>
          </div>
        </json-editor>
      </el-row>

      <k-form-wrap label-width="200px" :field-editable="false" :model.sync="currentRow" :API="api"
                   :isEditMode="isEditMode" withDialog :dataStruct="m_dataStruct"
                   :visible.sync="showForm" :component-map="componentMap">
      </k-form-wrap>
    </div>
  </auto-height-wrapper>
</template>
<script>
  import modelAPI from '../../api/model'
  import sysAPI from '../../api/sysAPI'
  import KTree from "../../components/KTree.vue";
  import KDataStruct from "../../components/KDataStruct.vue";
  import ModelGrid from "./grid.vue";
  import AutoHeightWrapper from "../../components/AutoHeightWrapper";
  import KFormWrap from "../../components/KFormWrap";
  import JsonEditor from "../../components/jsonEditor";
  import axios from 'axios'
  import {getAuthToken} from '../../utils/auth'


  export default {
    name: 'APITree',
    components: {
      JsonEditor,
      Prism,
      KFormWrap,
      AutoHeightWrapper,
      ModelGrid,
      KTree
    },
    mixins: [KDataStruct],
    props: {
      className: String,
      methodName: String,
    },
    data() {
      /**
       *
       * @type {modelAPI}
       * @private
       */
      this._api = modelAPI.new('jit_api', {})
      return {
        isEditMode: true,
        loading: false, //切换Loading显示状态
        showForm: false,
        currentRow: {}, //当前表选中的数据行
        pageSize: 20,
        page: 1,
        gridData: [],
        selectedList: [],
        componentMap: {},
        methodInfo: {},
        activeTab: "0",
        testResult: '',
        requestParams: [1, 2, 3, [{a: 1, b: 2}, {c: 1, d: 2}, {e: 1, d: 2}]],
        currentId: '',
        defaultOpenKey: [],
        badJsonErr: '',
      }
    },
    created() {
      if (this.className && this.methodName) {
        let id = this.className + '/' + this.methodName
        let obj
        this.defaultOpenKey = [id]
        try {
          obj = this.$route.query.json
          if (obj && obj.length > 1) {
            obj = JSON.parse(obj)
            let tp = typeof(obj)
            if (tp === 'object' && obj.length) {
              throw "参数输入只能是对象。不接受数组或字符串"
            }
          }
        } catch (e) {
          if (obj.match(/^[\da-z]/i)) {
            // obj = "'" + obj + "'"
          } else {
            obj = null
            this.$notify({title: '您输入的JSON 字符串有误，请检查', message: e.toString()})
          }
        }
        if (obj !== null) {
          this.requestParams = obj
        }
        this.loadMethodInfo(id, obj != null)
      }
    },
    mounted() {
      setTimeout(() => {

      }, 10)

    },
    computed: {
      info() {
        let info = this.methodInfo.info
        if (!info) {
          info = {
            name: 'Unloaded',
            desc: '',
            params: []
          }
        }
        return info
      },
      definitions() {
        let definitions = this.methodInfo.definitions
        return definitions || {}
      }
    },
    methods: {
      loadMethodInfo(id, withoutChangeRequest) {
        if (id && id.indexOf('/') > 4) {
          this.currentId = id
          sysAPI.getInfo(id).then(resp => {
            let data = resp.data
            if (!data.params || !data.params.length) {
              data.params = []
            }
            this.methodInfo = data
            if (!withoutChangeRequest) {
              this.generateRequest(this.methodInfo)
            }
          })
        }
      },
      getData: function (where, orderby) {
        let query = {
          page: this.page,
          pageSize: this.pageSize,
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
      handleNodeClick(data) {
        let id = data.id
        if (id) {
          this.loadMethodInfo(id)
        }
      },
      handleTreeEvent(data, eventName) {
        switch (eventName) {
          case 'detail':
            //ref.refRole.editRoleRefs(data)
            break
          default:
            return this.sysList
            break;
        }
      },

      handleEvent(data, index, eventName) {
        //let ref = this.$refs
        switch (eventName) {
          case 'btnEvt_inspect':
            this.isEditMode = false
            this.loadMethodInfo(data)
            this.showForm = true
            break
          case 'btnEvt_edit':
            this.isEditMode = true
            this.currentRow = data
            this.showForm = true
            break
          default:
            return this.sysList
            break;
        }
      },
      getDataByParam(param, definitions) {
        let tp = param.type
        let format = param.format
        let data
        switch (tp) {
          case 'number':
            data = 1
            break
          case 'boolean':
            data = false
            break
          case 'number[]':
            data = [1, 2, 3, 4]
            break
          case 'string[]':
            data = ['1', '2', '3', '4']
            break
          case 'number[]|string[]':
          case 'string[]|number[]':
            data = [1, 2, 3, 4]
            break
          case 'table':
            data = {}
            break
          case 'string':
          case 'table|string':
          case 'string|table':
            if (format === 'date-time') {
              data = new Date()
            } else {
              data = 'New String'
            }
            break
          case 'table<string, string>':
            data = {'key': 'str'}
            break
          case 'table<string, table>':
            data = {'key': {}}
            break
          case 'table<string, number>':
            data = {'key': 1}
            break
          default:
            let new_tp = definitions[tp]
            if (new_tp) {
              data = {}
              for (let key in new_tp) {
                let n_param = new_tp[key]
                n_param.name = key
                data[key] = this.getDataByParam(n_param, definitions)
              }
            } else {
              data = 'Missing definition: ' + tp
            }
            break
        }
        return data
      },
      generateRequest(schema = this.methodInfo) {
        let param = schema.info.params
        let definitions = schema.definitions
        // console.log(schema, param)
        let params = {}
        if (param) {
          for (let i = 0; i < param.length; i++) {
            params[param[i].name] = this.getDataByParam(param[i], definitions)
          }
        } else {
          this.requestParams = {}
          return
        }
        console.log(this.requestParams, params)
        // this.$set(this.requestParams, params)
        this.requestParams = [1]
        this.requestParams = {}
        this.requestParams = params
        // this.requestParams = params
      },
      doTest() {
        if (this.badJsonErr) {
          this.$notify.info({title: 'JSON 解析出错', message: this.badJsonErr});
          return
        }
        this.activeTab = '4' //switch to test panel
        let token = getAuthToken()

        axios.post(this.methodInfo.uri, this.requestParams, {
          timeout: 60000, // Max 1 min timeout
          headers: {'x-token': token}
        })
          .then(response => {
            this.testResult = response
          })
          .catch(error => {
            this.testResult = error.response
          });
      },
      doRestore() {
        this.generateRequest()
      },
      objectToArray(obj) {
        let arr = []
        let inx = 0
        for (let key in obj) {
          let val = obj[key]
          val.name = key
          arr[inx++] = val
        }
        return arr
      }
    }
  }
</script>
<style>
  .infoZone {
    overflow: auto;
    padding: 20px;
    font-size: 12px;
    color: #606266;
  }

  .jsonRow {
    margin: 20px 0 0 0;
  }

  .infoZone hr {
    padding: 0;
    margin: 9px 0 8px 0;
    color: grey;
    border: 0;
    border-bottom: 1px solid #ebeef5;
    height: 0;
  }

  .infoZone .th-header th {
    color: #000;
    background: #eee;
  }

  .infoZone .returns {
    margin: 10px 0;
  }

  .tree-grid .el-table--border {
    border-left: 0;
  }

  .header {

  }

  .box-card {

  }
</style>
