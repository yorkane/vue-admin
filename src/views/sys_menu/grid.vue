<template>
  <el-table :data="vModelData" border v-loading="loading" stripe
            element-loading-text="加载中" highlight-current-row>
    <el-table-column label="操作" width="200" fixed="right"><!--menu opts here-->
      <template slot-scope="scope">
        <k-button-menus :data="scope.row" size="mini" :index="scope.$index" group round></k-button-menus>
      </template>
    </el-table-column>
    <template v-for="(item, index) in dataStruct._FIELD_LIST">
      <template v-if="getColWidth(item) > 0">
        <el-table-column :label="item.Comment" min-width="120px"
                         :prop="item.Field" :width="getColWidth(item)">
          <template slot-scope="scope">
            <template v-if="item.isPK">
              <div draggable :id="getDragDropId(scope.$index, scope.row)" :orderindex="scope.$index"
                   @drop="handleDrop"
                   @dragleave="handleDragLeave"
                   @dragenter="handleDragEnter"
                   @dragstart="handleDrag"
                   class="onDropElement">
                <i class="el-icon-d-arrow-right"></i>
                <a class="menuHref" :href="scope.row['href']" target="_blank">{{
                  scope.row['name'] }}</a>
              </div>
            </template>
            <k-grid-item v-else :model="scope.row" :item="item" :PK="dataStruct._PK"></k-grid-item>
          </template>
        </el-table-column>
      </template>
    </template>
  </el-table>
</template>
<script>
  import {getList, update, desc, deleteById} from '../../api/sys_menu'
  import klib from '../../klib/grid'
  import KButtonMenus from "../../components/KButtonMenus.vue";
  import KGridItem from "../../components/KGridItem.vue";

  export default {
    name: 'sys_menu_grid',
    components: {
      KGridItem,
      KButtonMenus
    },
    props: {
      vModelData: {
        type: Array,
        required: false
      },
      dataStruct: {
        type: Object,
        required: false
      },
    },
    data: function () {
      this.dragUtil = klib.dragUtil
      return {
        isEditMode: true,
        loading: false, //切换Loading显示状态
        tables: [],  //数据库表
        treeData: {
          tree_desc: {
            children: "__children",
            label: "name",
            value: "id",
          }
        }, //当前数据
        nodeList: [],

        currentField: 'id',
        totalCount: 0, //数据记录总数
        currentWhere: '',
        orderBy: ' id DESC',
        dialog_edit_show: false,
        columnWidth: {
          id: 200,
          msg: 100,
          name: 0,
          keys: 0,
          path: 0,
          icon: 100,
          option_target: 100,
          is_visible: 70,
          level: 0,
          controller: 0,
          parent_id: 0,
          order: 70,
          has_children: 0,
          type: 0,
          href: 0,
          opAt: 140,
          opBy: 100,
          is_deleted: 100,
        },
        tags: {0: '', 1: 'success', 2: 'danger', 3: 'warning', 4: 'primary', 5: 'gray', 6: ''}
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
    created() {
      this.initDragDrop();
    },
    methods: {
      getDragDropId: function (index, rowData) {
        return 'dragdrop_' + rowData[this.dataStruct._PK]
      },
      dropOrder: function (fromIndex, toIndex) {
        var toObj = this.vModelData[toIndex];  // above or below this node
        var fromObj = this.vModelData[fromIndex]; //drag node
        var isToParentNode = (toObj.id === fromObj.parent_id); //the first node is the parent node
        if (isToParentNode) {
          fromObj.order = 0; //mark it to the first position in children list
          toIndex = 1;
        } else {
          if (fromIndex < toIndex) {
            fromObj.order = toIndex + 2; //move node down side
          } else {
            fromObj.order = toObj.order - 1; //move node up side
          }
        }
        this.vModelData.splice(fromIndex, 1);  //remove node from the table
        //console.log(fromObj.name, fromObj.order, 'To Position', toIndex);
        this.vModelData.splice(toIndex, 0, fromObj); //move position in table. DragDrop end
        this.$emit('order-change', {id: fromObj.id, order: fromObj.order})
      },
      ...klib
    }
  }
</script>

<style>
</style>
