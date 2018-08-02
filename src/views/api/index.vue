<template>
  <auto-height-wrapper>
    <auto-height-wrapper class="tree" style="float:left;min-height:600px;border-right:1px solid #dfe6ec;">
      <k-tree :data="dataTree"
              @node-click="handleNodeClick"
              @detail="handleTreeEvent"></k-tree>
    </auto-height-wrapper>
    <div style="overflow: auto;">
      <!--<model-grid class="tree-grid" :dataStruct="m_dataStruct" :model="gridData" :totalCount="totalCount"-->
      <!--:page.sync="page" :pageSize.sync="pageSize" :selected.sync="selectedList"-->
      <!--@btnEvt_inspect="handleEvent"-->
      <!--drag-order></model-grid>-->
      <el-row class="row" style="cursor: pointer;height: 100%">
        <el-card>
          <json-edior v-model="methodInfo" size="mini"></json-edior>
        </el-card>

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
  import klib_utils from "../../klib/utils"
  import KFormWrap from "../../components/KFormWrap";
  import JsonEdior from "../../components/jsonEditor";


  export default {
    name: 'APITree',
    components: {
      JsonEdior,
      KFormWrap,
      AutoHeightWrapper,
      ModelGrid,
      KTree
    },
    mixins: [KDataStruct],
    data: function () {
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
        methodInfo: {name: 'title', type: 0, arr: [1, 2, {a: 3, b: 4, time: '2018-08-08T22:11:11'}], arr2:[6,7,8,9]}
      }
    },
    created() {
    },
    computed: {},
    methods: {
      loadMethodInfo(id) {
        console.log(id)
        let arr = id.split('@')
        sysAPI.getInfo(arr[0], arr[1]).then(resp => {
          this.methodInfo = resp.data
        })
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
        // console.log(data, eventName)
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
          case 'btnEvt_delete':
            console.warn('try to delete data', data)
            this.api.deleteById(data.id).then(resp => {
              let indx = this.dataList.list.indexOf(data)
              this.dataList.list.splice(indx, 1)
              this.$message({
                message: '删除成功',
                type: 'success'
              });
            })
            break
          default:
            return this.sysList
            break;
        }
      },
    }
  }
</script>
<style>
  .tree-grid .el-table--border {
    border-left: 0;
  }
</style>
