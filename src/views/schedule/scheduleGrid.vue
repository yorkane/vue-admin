<template>
  <div>
    <el-table :data="model" border :loading="loading" element-loading-text="加载中"
              @selection-change="selectionChange"
              stripe @row-dblclick="doubleClickRow"
              @sort-change="sortEvent" highlight-current-row @header-dragend="saveHeaderWidth">
      <el-table-column v-if="enableChecked" type="selection" width="40" fixed="left"></el-table-column><!--menu opts here-->
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
            <k-grid-item v-else :model="scope.row" :item="item" :PK="dataStruct._PK" :dataStruct="dataStruct"></k-grid-item>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <el-pagination :current-page.sync="m_page" @current-change="pageChange" v-if="!hidePage"
                   :total="totalCount" @size-change="sizeChange" background
                   :page-sizes="sizes" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>

  </div>
</template>

<script>
  import KButtonMenus from "../../components/KButtonMenus.vue";
  import KGridItem from "../../components/KGridItem.vue";
  import KGrid from "../../components/KGrid.vue";

  export default {
    name: 'scheduleGrid',
    mixins: [KGrid],
    components: {
      KGrid,
      KGridItem,
      KButtonMenus
    },
    props: {},
    data: function () {
      return {
        columnWidth: {},
        tags: {0: 'info', 1: 'success', 2: 'danger', 3: 'warning', 4: 'primary', 5: 'info', 6: 'plain', 7: ''}
      }
    },
    filters: {},
    watch: {},
    mounted() {
    },
    created() {
    },
    methods: {
    }
  }
</script>
