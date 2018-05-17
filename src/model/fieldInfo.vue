<template>
  <span>
    <el-popover
      :ref="'pop_'+item.Field"
      width="400"
      trigger="manual"
      v-model="showPopup"
      placement="right-end">
      <div class="fieldInfoDiv" style="margin:5px;"><div v-if="!isEditing" v-html="item.info"></div>
        <h3 v-if="isEditing">编辑 {{item.Field + ' | ' + (item.Comment||'')}}</h3>
        <k-form :ref="'kform_' + item.Field" :data-struct="dataStruct" labelWidth="100px"
                :is-edit-mode="fieldModel.id!==undefined"
                :model="fieldModel"
                @updated="updateInfo"
                v-if="isEditing"
                size="mini" @cancel="close" @close="close">
          <!--<template slot-scope="scope">-->
          <!--<template v-if="scope.row.Field=='_DB'">{{fieldModel._DB}}</template>-->
          <!--</template>-->
        </k-form>
      </div>
    </el-popover>

    <template v-if="item.info">
      <span v-popover="'pop_'+item.Field" @mouseenter="showPopup=true;isEditing=false;" @mouseleave="showPopup=false">
        {{item.Comment||item.Field}}
        <i class="el-icon-info el-icon--right"></i>
      </span>
    </template>
    <template v-else><span v-popover="'pop_'+item.Field">{{item.Comment||item.Field}}</span></template>
    <i class="el-icon-edit-outline el-icon--right" v-if="editTable" @click="switchForm($event, true)"></i>
  </span>
</template>
<script>
  import KFormItem from "../components/KFormItem.vue";
  import KWrap from "../components/KWrap.vue";
  import KIconSelector from "../components/KIconSelector.vue";
  import ElButton from "element-ui/packages/button/src/button";
  import ElTag from "element-ui/packages/tag/src/tag";
  import KForm from "../components/KForm";
  import sys_field_infoAPI from '../api/sys_field_info'
  import klib from '../klib/utils'


  export default {
    name: 'fieldInfo',
    components: {
      KForm,
      ElTag,
      ElButton,
      KWrap,
      KFormItem,
    },
    props: {
      item: {
        type: Object,
        default: function () {
          return {
            Comment: 'NoInfo',
            info: 'noinfo'
          }
        }
      },
      editTable: Boolean,
    },
    data() {
      this._api = sys_field_infoAPI.new()
      this.m_componentMap = {
        'icon': KIconSelector,
      }
      return {
        isEditing: false,
        showPopup: false,
        queryList: [],
        fieldModel: {},
      }
    },
    watch: {
      showPopup(val) {
        if (!val) {
          // this.isEditing = false
        }
      }
    },
    created() {
      this._formId = 'kform' + this.item.Field
      setTimeout(() => {
        this.getModel()
      }, 2)
    },

    computed: {
      dataStruct() {
        return this._api.dataStruct
      },
      parentDataStruct() {
        return klib.getParentDataStruct.call(this.$parent)
      },
    },
    mounted() {
    },
    methods: {
      getModel() {
        this.fieldModel = JSON.parse(JSON.stringify(this.item));
        this.fieldModel._DB = this.parentDataStruct._DB
        this.fieldModel._NAME = this.parentDataStruct._NAME
      },
      switchForm(event, isEdit) {
        // console.log(this.$refs)
        // this.$refs[this._formId].model = this.fieldModel
        // event.stopPropagation()
        // let el = event.currentTarget
        // console.log(el)
        this.isEditing = isEdit
        setTimeout(() => {
          this.showPopup = true
        }, 2)
      },
      close(ev) {
        this.isEditing = false
        this.showPopup = false
      },
      updateInfo(po) {
        this.item.info = po.info || this.item.info
        this.item.Comment = po.Comment || this.item.Comment
        // this.item.validate_regex = po.validate_regex || this.item.validate_regex
        // this.item.validate_error = po.validate_error || this.item.validate_error
        // console.log(this.fieldModel)
      },
      getLable() {
        console.log(this.item)
        return this.item.Comment || this.item.Field;
      },
      getParentDataStruct: klib.getParentDataStruct
    }
  }
</script>
<style>
  .fieldInfoDiv {
    margin: 10px;
  }

  .fieldInfoDiv h3 {
    margin: 0;
  }
</style>
