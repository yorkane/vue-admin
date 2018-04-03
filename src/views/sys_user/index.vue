<template>
  <div>
    <div style="margin:5px 0 5px 0;">
      <k-condition @btnEvt_insert="handleInsert" size="mini" :dataStruct="dataStruct"
                   @btnEvt_batchDelete="handelBatchDelete"
                   @query="updateQueryCondition" @mnuEvt_mail="" @btnEvt_mail="">
      </k-condition>
      <sys_user_grid :dataStruct="dataStruct" :model="currentData" :totalCount="totalCount"
                     :page.sync="page" :pageSize.sync="pageSize" @pageChange="handlePageChange"
                     :selected.sync="selectedList"
                     @quickEdit="quickEdit" @sort="sortField" @btnEvt_edit="handleEdit" @btnEvt_delete="handleDelete"
                     @mnuEvt_mail="sendMailNotify" @mnuEvt_search=""
      ></sys_user_grid>
    </div>
    <sys_user_form :model="currentRow" :isEditMode="isEditMode" withDialog :dataStruct="dataStruct"
                   @inserted="inserted" :visible.sync="dialog_edit_show"></sys_user_form>
  </div>
</template>

<script>
  import userAPI from '../../api/sys_user'
  import roleAPI from '../../api/sys_role'
  import modelAPI from '../../api/model'
  import klib from '../../klib/grid'
  import Sys_user_form from "./form.vue";
  import Sys_user_grid from "./grid.vue";
  import KCondition from "../../components/KCondition.vue";

  export default {
    components: {
      KCondition,
      Sys_user_grid,
      Sys_user_form
    },
    // beforeRouteEnter(to, from, next) {
    //   roleService.getTree({}, store).then((data) => {
    //     next()
    //   })
    // },
    data: function () {
      /**
       *
       * @type {userAPI}
       * @private
       */
      this._api = userAPI.new({}, this.$store)
      this._roleApi = roleAPI.new({}, this.$store)
      return {
        pageSize: 20,
        page: 1,
        isEditMode: true,
        selectedList: [],
        loading: false, //切换Loading显示状态
        currentDB: 'approot', //当前表对应的数据库
        currentTable: 'sys_user', //当前表
        dataStruct: {_NAME: 'sys_user'}, // 当前表描述
        tables: [],  //数据库表
        currentData: [], //当前数据
        currentRow: {}, //当前表选中的数据行
        currentField: 'id',
        deleteRowIndex: -1,
        totalCount: 0, //数据记录总数
        cache: {}, //缓存
        currentWhere: '',
        orderBy: ' id DESC',
        dialog_edit_show: false,
        select: ''
      }
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          published: 'success',
          draft: 'gray',
          deleted: 'danger'
        }
        return statusMap[status]
      }
    },
    watch: {},
    created() {
      modelAPI.new('sys_organization').getTree()
      this._roleApi.getTree().then(() => {
        this._api.getDataStruct().then(data => {
          this.dataStruct = data
          this.loadData();
        })
      })
    },
    methods: {
      cancel: function () {
        this.dialog_edit_show = false;
      },
      inserted: function (usr) {
        this.currentData.splice(0, 0, usr)
        this.dialog_edit_show = false
      },
      handlePageChange(page, size) {
        //console.log(page, this.page, size, this.pageSize)
        this.loadData()
      },
      handleInsert() {
        this.isEditMode = false;
        this.dialog_edit_show = true;
        this.currentRow = {role: 0, status: 0}
      },
      handleEdit: function (data) {
        console.log('start edit', data)
        this.currentRow = data
        this.isEditMode = true
        this.dialog_edit_show = true
      },
      handleDelete: function (rowData, index) {
        let pk = this.dataStruct._PK;

        this._api.deleteById(rowData[pk]).then(res => {
          this.currentData.splice(index, 1);
          this.$notify.info({title: name + '删除成功', message: res.data.result});
        })
      },
      handelBatchDelete: function () {
        if (this.selectedList.length < 1) {
          this.$message('请先勾选对象!');
          return
        }
        this.selectedList.forEach((item, index) => {
          console.log(item.id, index)
        })
      },
      chooseRole: function () {

      },
      sortField(orderBy) {
        this.loadData(null, orderBy)
      },
      loadData: function (where, orderby) {

        where = this.getWhere(where)
        let query = {
          'page': this.page,
          'pageSize': this.pageSize,
          'orderby': this.getOrderBy(orderby),
        }
        if (typeof(where) === 'string') {
          query.where = where
        } else {
          if (where && !where.null) query = Object.assign(query, where)
        }
        this._api.getData(query, true).then(data => {
          this.currentData = data.list;
          this.totalCount = data.count;
        })
      },
      sendMailNotify(data) {
        this._api.mailNotify({
          id: data.id,
          name: data.name,
          email: data.email,
        }).then(resp => {
          this.$notify.success({title: '提醒认证邮件发送成功', message: resp.msg});
          console.log('mailNotify success', data)
        })
      },
      quickEdit(data) {
        this._api.update(data).then(res => {
          this.$notify.info({title: name + '快速修改成功', message: data});
          console.log('quick edit success', res.data)
        })
      },
      ...klib
    }
  }
</script>
