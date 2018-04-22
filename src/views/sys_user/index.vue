<template>
  <div>
    <div style="margin:5px 0 5px 0;">
      <k-condition @btnEvt_insert="handleEvent" size="mini" :dataStruct="m_dataStruct"
                   @btnEvt_batchDelete="handelBatchDelete"
                   @query="getData" @mnuEvt_mail="" @btnEvt_batch="handleEvent" @btnEvt_mail="">
      </k-condition>
      <k-batch-form :data-struct="m_dataStruct" :visible.sync="showBatchForm" with-dialog
                    @submit="batchUpdate"></k-batch-form>
      <sys_user_grid enable-checked :dataStruct="m_dataStruct" :model="gridData" :totalCount="totalCount" dbclick-event-name="btnEvt_edit"
                     :page.sync="page" :pageSize.sync="pageSize" @pageChange="getData()"
                     :selected.sync="selectedList"
                     @quickEdit="quickEdit" @sort="sortField" @btnEvt_edit="handleEvent" @btnEvt_delete="handleEvent"
                     @mnuEvt_mail="sendMailNotify" @mnuEvt_search=""
      ></sys_user_grid>
    </div>
    <sys_user_form :model.sync="currentRow" :isEditMode="isEditMode" withDialog :dataStruct="m_dataStruct"
                   :fieldMapComponent="{}"
                   @inserted="inserted" :withDialog="true" :visible.sync="showForm"></sys_user_form>
  </div>
</template>

<script>
  import userAPI from '../../api/sys_user'
  import roleAPI from '../../api/sys_role'
  import modelAPI from '../../api/model'
  import klib from '../../klib/grid'
  import Sys_user_form from "./form.vue";
  import Sys_user_grid from "./grid.vue";
  import KDataStruct from "../../components/KDataStruct.vue";
  import KCondition from "../../components/KCondition.vue";
  import KBatchForm from "../../components/KBatchForm";

  export default {
    components: {
      KBatchForm,
      KCondition,
      Sys_user_grid,
      Sys_user_form
    },
    mixins: [KDataStruct],
    beforeRouteEnter(to, from, next) {
      roleAPI.new().getTree().then((data) => {
        modelAPI.new('sys_organization').getTree()
        next()
      })
    },
    data: function () {
      /**
       *
       * @type {userAPI}
       * @private
       */
      this._api = userAPI.new({}, this.$store)
      // this._roleApi = roleAPI.new({}, this.$store)
      this.$root.$on('IntoMapField', (key, field) => {
        this.$router.push({path: '/model/' + field.Comment + '/' + key});
      })
      return {
        apiDict: {
          sys_role: roleAPI.new(),
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
      // modelAPI.new('sys_organization').getTree()
    },
    methods: {
      cancel: function () {
        this.dialog_edit_show = false;
      },
      inserted: function (usr) {
        this.currentData.splice(0, 0, usr)
        this.dialog_edit_show = false
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
      sortField(orderBy) {
        this._orderBy = orderBy
        this.getData(null, orderBy)
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
            return
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
      ...klib
    }
  }
</script>
