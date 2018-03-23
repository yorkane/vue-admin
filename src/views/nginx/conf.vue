<template>
  <div class="mainPanel">
    <!--<div class="tree" style="float:left;min-height:600px;border-right:1px solid #dfe6ec;">-->
    <!--<k-tree :loading="loading" :data="treeData" @insert="handleInsert" @edit="handleEdit"-->
    <!--@delete="handleDelete" @move="handleMove" @nodeClick="loadIntoTable"></k-tree>-->
    <!--</div>-->
    <div style="overflow: auto;">
      <k-condition ref="condition" size="mini" :dataStruct="m_dataStruct" @btnEvt_insert="handleEvent"
                   @btnEvt_refresh="getData()" @query="getData"></k-condition>
      <model-grid :dataStruct="m_dataStruct" :model="gridData" :totalCount="totalCount"
                  :page.sync="page" :pageSize.sync="pageSize" :selected.sync="selectedList"
                  @quickEdit="quickEdit" @sort="sortField" @btnEvt_edit="handleEvent" @btnEvt_delete="handleEvent"
                  @pageChange="getData()"
      ></model-grid>
      <mform :model.sync="currentRow" :isEditMode="isEditMode" withDialog :dataStruct="m_dataStruct"
             :fieldMapComponent="{}"
             @inserted="inserted" :withDialog="true" :visible.sync="showForm"></mform>
    </div>
  </div>

</template>
<script>
  import modelAPI from '../../api/model'
  import mform from "./server_form.vue";
  import KCondition from "../../components/KCondition.vue";
  import KDataStruct from "../../components/KDataStruct.vue";
  import ModelGrid from "../../model/grid.vue";
  import KSelect from "../../components/KSelect";
  import NginxConfAPI from "../../api/nginx_conf"

  export default {
    name: 'nginxConf',
    components: {
      KSelect,
      ModelGrid,
      KCondition,
      mform
    },
    mixins: [KDataStruct],
    data: function () {
      /**
       *
       * @type {modelAPI}
       * @private
       */
      this._api = NginxConfAPI.new()
      modelAPI.new('nginx_server').getData()
      return {
        isEditMode: true,
        loading: false, //切换Loading显示状态
        currentDB: 'approot', //当前表对应的数据库
        showForm: false,
        currentRow: {}, //当前表选中的数据行
        pageSize: 20,
        page: 1,
        gridData: [],
        selectedList: [],
        testV: 1,
      }
    },
    created() {
      modelAPI.new('nginx_proxy').getData({pageSize: 1000})

    },
    methods: {
      inserted: function (data) {
        this.showForm = false
        this.gridData.push(data);
        this.currentRow = Object.assign({}, this.m_dataStruct._DEFAULT)
      },
      quickEdit(data) {
        this._api.update(data).then(resp => {
          this.$notify.info({title: name + '快速修改成功', message: data});
          console.log('quick edit success', resp)
        })
      },
      batchDelete() {
        console.log('batchDelete')
      },
      getData(where, orderby) {
        where = this.getWhere(where)
        let query = {
          page: this.page,
          pageSize: this.pageSize,
          orderby: this.getOrderBy(orderby),
        }
        if (typeof(where) === 'string') {
          query.where = where
        } else {
          if (where && !where.null) query = Object.assign(query, where)
        }
        this._api.getData(query, true).then(data => {
          this.dataList = data
          this.gridData = data.list
          this.totalCount = data.count
        })
      },
      sortField(orderBy) {
        this._orderBy = orderBy
        this.getData(null, orderBy)
      },
      getWhere(where = this._where) {
        if (!where) {
          let cd = this.$refs.condition
          if (cd && cd.getQuery) {
            where = cd.getQuery()
            this._where = where
          }
        } else {
          this._where = where
        }
        return where
      },
      getOrderBy(orderBy = this._orderBy) {
        if (!orderBy) {
          this._orderBy = ''
          return this._orderBy
        } else {
          this._orderBy = orderBy
        }
        return orderBy
      },
      handleEvent(data, index, eventName) {
        //let ref = this.$refs
        switch (eventName) {
          case 'btnEvt_insert':
            this.isEditMode = false
            this.currentRow = Object.assign({}, this.m_dataStruct._DEFAULT)
            this.showForm = true
            break
          case 'btnEvt_edit':
            this.isEditMode = true
            this.currentRow = data
            this.showForm = true
            break
          case 'btnEvt_relation':
            //ref.refRole.editRoleRefs(data)
            break
          case 'btnEvt_permission':
            //ref.permissions.editPermission(data)
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

</style>
