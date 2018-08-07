<template>
  <div class="mainPanel">
    <!--<div class="tree" style="float:left;min-height:600px;border-right:1px solid #dfe6ec;">-->
    <!--<k-tree :loading="loading" :data="treeData" @insert="handleInsert" @edit="handleEdit"-->
    <!--@delete="handleDelete" @move="handleMove" @nodeClick="loadIntoTable"></k-tree>-->
    <!--</div>-->
    <div style="overflow: auto;">
      <k-condition ref="condition" size="mini" :dataStruct="m_dataStruct" @btnEvt_insert="handleEvent"
                   @btnEvt_refresh="getData()" @query="getData" @btnEvt_batch="handleEvent">{{header_text}}
      </k-condition>
      <k-batch-form :data-struct="m_dataStruct" :visible.sync="showBatchForm" with-dialog
                    @submit="batchUpdate"></k-batch-form>
      <model-grid dbclickEvent enable-checked :dataStruct="m_dataStruct" :model="gridData" :totalCount="totalCount"
                  dbclick-event-name="btnEvt_edit"
                  :page.sync="page" :pageSize.sync="pageSize" :selected.sync="selectedList"
                  @quickEdit="quickEdit" @sort="sortField" @btnEvt_edit="handleEvent" @btnEvt_delete="handleEvent"
                  @pageChange="getData()"
      ></model-grid>
      <mform label-width="200px" :model.sync="currentRow"
                   :isEditMode="isEditMode" withDialog :dataStruct="m_dataStruct" @inserted="inserted"
                   :visible.sync="showForm" :component-map="componentMap">
      </mform>
      <!--<k-form></k-form>-->
    </div>
  </div>
</template>
<script>
  import modelAPI from '../../api/model'
  import mform from "./scheduleForm.vue";
  import KCondition from "../../components/KCondition.vue";
  import KDataStruct from "../../components/KDataStruct.vue";
  import ModelGrid from "./scheduleGrid";
  import KBatchForm from "../../components/KBatchForm";

  export default {
    name: 'scheduleIndex',
    components: {
      KBatchForm,
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
      this._api = modelAPI.new('sys_schedule', {})
      this.$root.$on('IntoMapField', (key, field) => {
        this.$router.push({path: '/model/' + field.Comment + '/' + key});
      })
      return {
        apiDict: {
        },
        isEditMode: true,
        loading: false, //切换Loading显示状态
        currentDB: 'approot', //当前表对应的数据库
        showForm: false,
        currentRow: {}, //当前表选中的数据行
        pageSize: 20,
        page: 1,
        gridData: [],
        selectedList: [],
        header_text: '',
        showBatchForm: false,
        componentMap: {
        }
      }
    },
    computed: {
      isAdmin() {
        return isAdmin()
      }
    },
    watch:{},
    created() {
      // console.log(this.isAdmin, 'isAdmin')
    },
    methods: {
      dataStructLoaded(data) {
        if (this._api.isTree) {
          //如果当前API是Tree 则跳转到 Tree 页面，并把当前Tab关闭
          this.$store.commit('delete_tabs', this.$route.path);
          this.$router.replace({
            path: '/tree/' + data._COMMENT + '/' + data._NAME
          })
          return
        }
        if (data && data._COMMENT) {
          // this.header_text = data._COMMENT
        }
      },
      inserted: function (data) {
        this.showForm = false
        this.gridData.push(data);
        this.currentRow = Object.assign({}, this.m_dataStruct._DEFAULT)
        // console.log(this._api.data(store))
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
        // console.log(data, 'in handelEVent')
        //let ref = this.$refs
        switch (eventName) {
          case 'btnEvt_insert':
            this.isEditMode = false
            this.currentRow = {_isEmpty: true}
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
            this._api.deleteById(data[this.m_dataStruct._PK]).then(resp => {
              let indx = this.dataList.list.indexOf(data)
              this.dataList.list.splice(indx, 1)
              this.$message({
                message: '删除成功',
                type: 'success'
              });
            })
            break
          case 'btnEvt_batch':
            this.showBatchForm = true
            break
          default:
            return this.sysList
            break;
        }
      },
      batchUpdate(modelData) {
        let idList = []
        let pk = this.m_dataStruct._PK
        this.selectedList.forEach(item => {
          idList.push(item[pk])
        })
        console.log(idList)
        this._api.batchUpdate(idList, modelData).then(res => {
          this.$notify.info({title: '披露修改成功', message: res.data});
          this.selectedList.forEach(item => {
            for (let key in modelData) {
              item[key] = modelData[key]
            }
          })
        })
        this.showBatchForm = false
      },
    }
  }
</script>
<style>

</style>
