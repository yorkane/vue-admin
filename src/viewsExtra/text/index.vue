<template>
  <div class="mainPanel">
    <div style="overflow: auto;">
      <k-condition ref="condition" size="mini" :dataStruct="m_dataStruct" @btnEvt_insert="handleEvent"
                   @btnEvt_refresh="getData()" @query="getData" @btnEvt_inspect="handleEvent"></k-condition>
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
  import textHistory from '../../api/sys_text_history'
  import mform from "./form.vue";
  import KCondition from "../../components/KCondition.vue";
  import KDataStruct from "../../components/KDataStruct.vue";
  import {store} from '../../main'
  import ModelGrid from "./grid.vue";

  export default {
    name: 'textListIndex',
    components: {
      ModelGrid,
      KCondition,
      mform
    },
    mixins: [KDataStruct],
    data() {
      /**
       * @type {modelAPI}
       * @private
       */
      this._api = textHistory.new()
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
      }
    },
    created() {
    },
    methods: {
      inserted: function (data) {
        this.showForm = false
        this.gridData.push(data);
        this.currentRow = Object.assign({}, this.m_dataStruct._DEFAULT)
        console.log(this._api.data(store))
        // console.log(this.gridData)
      },
      quickEdit(data) {
        this._api.update(data).then(res => {
          this.$notify.info({title: name + '快速修改成功', message: data});
          console.log('quick edit success', data, res.data)
        })
      },
      batchDelete() {
        console.log('batchDelete')
      },
      getData: function (where, orderby) {
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
        //console.log(query)
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
            // this.$router.push({path: 'v1/v2'});
            break
          case 'btnEvt_relation':
            //ref.refRole.editRoleRefs(data)
            break
          case 'btnEvt_permission':
            //ref.permissions.editPermission(data)
            break
          case 'btnEvt_delete':
            console.warn('try to delete data', data)
            this._api.deleteById(data[this.m_dataStruct._PK]).then(resp => {
              let indx = this.dataList.list.indexOf(data)
              this.dataList.list.splice(indx, 1)
              this.$message({
                message: '删除成功',
                type: 'success'
              });
            })
            break
          case 'btnEvt_inspect':
            let p1 = this.selectedList[0]
            let p2 = this.selectedList[1]
            if (!p1 || !p2 || this.selectedList.length > 2) {
              this.$message({
                message: '请仅选择两条数据',
                type: 'info'
              });
              return
            }
            this._api.setCache('compare', [p1.text, p2.text, p1, p2])
            this.$router.push({path: p1.version + '/v/' + p2.version});
            break;
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
