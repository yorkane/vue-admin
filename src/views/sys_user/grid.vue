<template>
  <div>
    <el-table :data="model" border :loading="loading" element-loading-text="加载中"
              @selection-change="selectionChange"
              stripe
              @sort-change="sortEvent" highlight-current-row @header-dragend="saveHeaderWidth">
      <!--<el-table-column type="selection" width="40" fixed="left"></el-table-column>&lt;!&ndash;menu opts here&ndash;&gt;-->
      <el-table-column label="操作" width="160" fixed="right"><!--menu opts here-->
        <template slot-scope="scope">
          <k-button-menus :data="scope.row" size="mini" :index="scope.$index" group round></k-button-menus>
        </template>
      </el-table-column>
      <template v-for="(item, index) in dataStruct._FIELD_LIST">
        <el-table-column v-if="getColWidth(item)>0" :label="item.Comment||item.Field" min-width="50px"
                         :sortable="isSortable(item)"
                         :prop="item.Field" :width="getColWidth(item)">
          <template slot-scope="scope">
            <template v-if="item.isPK && hasDragOrder()">
              <div draggable :id="getDragDropId(scope.$index, scope.row)" :orderindex="scope.$index"
                   @drop="handleDrop"
                   @dragleave="handleDragLeave"
                   @dragenter="handleDragEnter"
                   @dragstart="handleDrag"
                   class="onDropElement">
                <i class="el-icon-d-arrow-right"></i>
                <a class="menuHref" target="_blank">{{scope.row[dataStruct._PK]}}</a>
              </div>
            </template>
            <span v-else-if="item.Field == 'role'">{{getRoleName(scope.row[item.Field])}}</span>
            <el-button v-else-if="item.Field == 'key'" type="info" size="mini" :plain="true"
                       @click="showQRCode(scope.row)" class="key-button">{{scope.row.key}}
            </el-button>
            <k-grid-item v-else :model="scope.row" :item="item" :PK="dataStruct._PK"></k-grid-item>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <el-pagination :current-page.sync="m_page" @current-change="pageChange" v-if="!hidePage"
                   :total="totalCount" @size-change="sizeChange" background
                   :page-sizes="sizes" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>

    <el-dialog :visible.sync="qr_dialog_show" title="请扫描二维码或者手动输入以下密钥">
      <div style="text-align:center;" id="__dialog">
        <div style="font-family:Courier New, Courier, monospace;text-align:center;font-size:2em;">{{current_key}}
        </div>
        <canvas id="qr_canvas" style="width: 500px;"></canvas>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {getList, desc, deleteById} from '../../api/sys_user'
  import roleAPI from '../../api/sys_role'
  import QRCode from 'qrcode'
  import KGridItem from "../../components/KGridItem.vue";
  import KGrid from "../../components/KGrid.vue";

  export default {
    name: 'sys_user_grid',
    mixins: [KGrid],
    components: {
      KGridItem,
    },
    props: {},
    data: function () {
      return {
        qr_dialog_show: false,
        current_key: '',
        cache: {}, //缓存
        dialog_edit_show: false,
        columnWidth: {
          id: 80,
          role: 150,
          email: 250,
          salt: 0,
          desc: 0,
          msg: 300,
          phone: 0,
          org_id: 0,
          level: 0,
          password: 0,
          key: 200,
          ext1: 0,
          ext2: 0,
          ext3: 0,
          create_time:140,
          is_deleted: 0,
          last_modify: 0
        },
        tags: {0: 'info', 1: 'success', 2: 'danger', 3: 'warning', 4: 'primary', 5: 'gray', 6: ''}
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
    mounted() {
    },
    created() {
    },
    methods: {
      showQRCode: function (rowData) {
        let qrcode_source = 'otpauth://totp/' + rowData.name + ':' + rowData.email + '?secret=' + rowData.key + '&issuer=wasu&algorithm=SHA1&digits=6&period=30';
        this.current_key = rowData.key;
        this.qr_dialog_show = true;
        setTimeout(function () {
          let canvas = document.getElementById('qr_canvas')
          QRCode.toCanvas(canvas, qrcode_source, {errorCorrectionLevel: 'H', scale: 6}, function (error) {
          })
        }, 200)
      },
      getRoleName(roleId) {
        let role = roleAPI.getById(roleId) || {name: '无角色'}
        return role.name
      }
    }
  }
</script>
