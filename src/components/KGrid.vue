<template>
  <div>
    <el-table :data="model" border :loading="loading" element-loading-text="加载中"
              @selection-change="selectionChange"
              stripe
              @sort-change="sortEvent" highlight-current-row>
      <el-table-column v-if="enableChecked" type="selection" width="40" fixed="left"></el-table-column><!--menu opts here-->
      <el-table-column label="操作" width="160" fixed="right"><!--menu opts here-->
        <template slot-scope="scope">
          <k-button-menus :data="scope.row" size="mini" :index="scope.$index" group round></k-button-menus>
        </template>
      </el-table-column>
      <template v-for="(item, index) in m_dataStruct._FIELD_LIST">
        <el-table-column v-if="getColWidth(item)>0" :label="item.Comment||item.Field" min-width="85px"
                         :sortable="isSortable(item)"
                         :prop="item.Field" :width="getColWidth(item)">
          <template slot-scope="scope">
            <k-grid-item :model="scope.row" :item="item" :PK="m_dataStruct._PK"
                         @quick-edit="quickEdit"></k-grid-item>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <el-pagination :current-page.sync="m_page" @current-change="pageChange" v-if="hidePage"
                   :total="totalCount" @size-change="sizeChange" background
                   :page-sizes="sizes" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
  </div>
</template>

<script>
  import klib from '../klib/utils'
  import KButtonMenus from "./KButtonMenus.vue";
  import KGridItem from "./KGridItem.vue";

  export default {
    name: 'KGrid',
    components: {
      KGridItem,
      KButtonMenus
    },
    props: {
      selected: {
        type: Array,
        required: false,
        default() {
          return []
        }
      },
      model: {
        type: Array,
        required: false
      },
      dataStruct: {
        type: Object,
        required: false
      },
      totalCount: {
        type: Number,
        required: false
      },
      pageSize: {
        type: Number,
        required: false,
        default: 20,
      },
      enableChecked: Boolean,
      dragOrder: Boolean,
      hidePage: Boolean
    },
    data() {
      return {
        isEditMode: true,
        loading: false, //切换Loading显示状态
        m_page: 1,
        sizes: [10, 20, 30, 50],
        columnWidth: {},
        tags: {
          '-12': 'warning',
          '-11': 'danger',
          '-10': 'warning',
          '-9': '',
          '-8': 'info',
          '-7': 'info',
          '-6': 'info',
          '-5': 'warning',
          '-4': 'warning',
          '-3': 'danger',
          '-2': 'info',
          '-1': 'info',
          0: 'info',
          1: 'success',
          2: 'danger',
          3: 'warning',
          4: 'primary',
          5: 'info',
          6: 'info',
          7: ''
        }
      }
    },
    filters: {},
    watch: {},
    mounted() {
    },
    created() {
      if (this.dragOrder) {
        this.initDragDrop()
      }
    },
    methods: {
      pageChange(val) {
        this.$emit('update:page', val)
        this.$emit('pageChange', val, this.pageSize)
      },
      sizeChange(val) {
        this.$emit('update:pageSize', val)
        this.$emit('pageChange', this.m_page, val)
      },
      selectionChange(val) {
        this.$emit('update:selected', val)
      },
      getFieldKey(prefix, name) {
        return prefix + '#' + this.dataStruct._NAME + '#' + name + '#'
      },
      //根据 columnWidth 数组获取表格宽度
      getColWidth(fi) {
        let name = fi.Field;
        let cols = this.dataStruct._FIELD_LIST.length
        let factor = 10 / cols
        factor = factor < 1 ? 1 : factor
        let wd = this.columnWidth[name];
        if (wd !== undefined) {
          // console.log('load from columnWidth',fi.Field, wd)
          return wd
        }
        if (localStorage) {
          let key = this.getFieldKey('GridWidth', fi.Field)
          let w = localStorage.getItem(key)
          if (w) {
            if (w > 700) {
              w = 700
            }
            if (w < 40) {
              w = 40
            }
            // console.log('load from localStorage',key, w)
            return parseInt(w)
          }
        }
        let len = fi.Comment ? fi.Comment.length : 4
        if (fi.isOption || fi.isStatus || fi.isPK || fi.isIntBool || fi.isBool) {
          wd = 85
        } else if (name === 'icon') {
          wd = 65
        } else if (fi.isDate) {
          wd = 145
        } else if (fi.width > 300) {
          wd = 450;
        } else if (fi.width >= 100 && fi.width <= 300) {
          wd = fi.width * 2 * factor;
          if (wd > 350) wd = 350;
        } else if (len > 5) {
          wd = len * 30
        } else if (fi.width < 100) {
          wd = fi.width * 2.5 * factor;
          if (wd < 90) wd = 90 * factor;
        } else {
          wd = len * 30 * factor
        }
        // console.log('load from auto',fi.Field, wd)
        return wd;
      },
      //判断表头是否可以排序
      isSortable(item) {
        if (item.isText || item.isStatus || item.isTextOption) {
          return false
        }
        if (item.isPK || item.isDate) {
          return 'custom'
        }
        return true;
      },
      //根据tags数组获取值
      getTagType(value) {
        return this.tags[value] || '';
      },
      saveHeaderWidth(newWidth, oldWidth, column, event) {
        if (localStorage) {
          let key = this.getFieldKey('GridWidth', column.property)
          if (newWidth > 700) {
            newWidth = 700
          }
          if (newWidth < 40) {
            newWidth = 40
          }
          console.log('set column width to localStorage', key, newWidth)
          localStorage.setItem(key, newWidth)
        }
      },
      sortEvent(colObj) {
        if (!colObj.order) return;
        let orderBy = '`' + colObj.prop.toString() + '`' + (colObj.order.indexOf('asc') === 0 ? ' ASC' : ' DESC');
        this.$emit('sort', orderBy)
        //console.log(colObj.order, orderBy)
      },
      hasDragOrder() {
        if (this.dragOrder && this.dataStruct._FIELD_DIC['order']) {
          return true
        }
      },
      getDragDropId(index, rowData) {
        return 'dragdrop_' + rowData[this.dataStruct._PK]
      },
      dropOrder(fromIndex, toIndex) {
        var toObj = this.model[toIndex];  // above or below this node
        var fromObj = this.model[fromIndex]; //drag node
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
        this.model.splice(fromIndex, 1);  //remove node from the table
        //console.log(fromObj.name, fromObj.order, 'To Position', toIndex);
        this.model.splice(toIndex, 0, fromObj); //move position in table. DragDrop end
        this.$emit('order-change', {id: fromObj.id, order: fromObj.order})
      },
      addClassName(el) {
        if (!el.className) el.className = '';
        el.className = el.className.replace(/ onDragEl/ig, '');
        el.className += ' onDragEl';
      },
      removeClassName(el) {
        if (!el.className) el.className = '';
        el.className = el.className.replace(/ onDragEl/ig, '');
      },
      handleDrag(event) {
        let el = event.target
        let orderindex = el.getAttribute('orderindex')
        if (!orderindex) {
          el = el.parentNode
          orderindex = el.getAttribute('orderindex')
        }
        let pkid = el.id;
        //console.log(el, pkid, orderindex)
        event.dataTransfer.setData("nodeInfo", pkid + '|' + orderindex);
        this.addClassName(el);
        let that = this
        setTimeout(function () {
          that.removeClassName(el);
        }, 100);
      },
      handleDragLeave(event) {
        this.removeClassName(event.target)
      },
      handleDragEnter(event) {
        this.addClassName(event.target)
      },
      handleDrop(event) {
        let pkidFrom = event.dataTransfer.getData("nodeInfo");
        let el = event.target
        let orderindex = el.getAttribute('orderindex')
        if (!orderindex) {
          el = el.parentNode
          orderindex = el.getAttribute('orderindex')
        }
        let pkidTo = el.id;
        //console.log('drop from ' + pkidFrom + ' to ' + pkidTo, orderindex)
        event.preventDefault();
        this.removeClassName(document.getElementById(pkidFrom.split('|')[0]));
        this.removeClassName(el);
        let from = parseInt(pkidFrom.split('|')[1]);
        let to = parseInt(orderindex);
        //console.log('handleDrop', from, to)
        if (from === to) {
          return
        }
        this.dropOrder(from, to)
      },
      initDragDrop() {
        // console.log('initDragDrop done')
        document.addEventListener("dragover", function (event) {
          event.preventDefault()
        });
      },
      getOption: klib.getOption,
      getStatus: klib.getStatus,
      formatDate: klib.formatDate,
      getParentDataStruct: klib.getParentDataStruct,
    }
  }
</script>
