<template>
  <span>
    <el-popover
      :ref="'pop_'+item.Field"
      width="400"
      trigger="manual"
      v-model="showPopup"
      :open-delay="200"
      placement="right-start">
      <div @mouseenter="showPopup=true" @mouseleave="close" class="fieldInfoDiv"><div
        v-if="!isEditing" v-html="getHTML(item)" style="padding:10px"></div>
        <h3 v-else>编辑 {{item.Field + ' | ' + (item.Comment||'')}}</h3>
        <k-form :ref="'kform_' + item.Field" :data-struct="dataStruct" labelWidth="100px"
                :is-edit-mode="fieldModel.id!==undefined"
                :model="fieldModel"
                @updated="updateInfo"
                @inserted="updateInfo"
                v-if="isEditing"
                size="mini" @cancel="close" @close="close">
          <!--<template slot-scope="scope">-->
          <!--<template v-if="scope.row.Field=='_DB'">{{fieldModel._DB}}</template>-->
          <!--</template>-->
        </k-form>
      </div>
    </el-popover>
    <template v-if="item.info">
      <span v-popover="'pop_'+item.Field" @mouseenter="showPopup=true;isEditing=false;" @mouseleave="close">
        {{item.Comment||item.Field}}
        <i class="el-icon-info el-icon--right"></i>
      </span>
    </template>
    <template v-else><span v-popover="'pop_'+item.Field">{{item.Comment||item.Field}}</span></template>
    <i class="el-icon-edit-outline el-icon--right" v-if="editTable" @click="switchForm($event, true)"></i>
  </span>
</template>
<script>
  import KForm from "./KForm";
  import sys_field_infoAPI from '../api/sys_field_info'
  import klib from '../klib/utils'


  export default {
    beforeCreate: function () {
      this.$options.components.KForm = require('./KForm.vue').default
    },
    name: 'KFormFieldInfo',
    components: {
      // KForm
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
      return {
        isEditing: false,
        showPopup: false,
        queryList: [],
        fieldModel: {},
      }
    },
    watch: {},
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
        this.isEditing = isEdit
        setTimeout(() => {
          this.showPopup = true
        }, 2)
      },
      close() {
        this.isEditing = false
        this.showPopup = false
      },
      updateInfo(po) {
        this.item.info = po.info || this.item.info
        this.item.Comment = po.Comment || this.item.Comment
        this.item.is_readonly = po.is_readonly || this.item.is_readonly
        // this.item.validate_regex = po.validate_regex || this.item.validate_regex
        // this.item.validate_error = po.validate_error || this.item.validate_error
        // console.log(this.fieldModel)
      },
      getLabel() {
        // console.log(this.item)
        return this.item.Comment || this.item.Field;
      },
      getHTML(item) {
        return '<pre class="info">' + item.info + '</pre>'
      },
      getParentDataStruct: klib.getParentDataStruct
    }
  }
</script>
<style>
  .fieldInfoDiv {
    padding:10px;
    margin: 0;
    max-height: 500px;
    overflow: auto;
  }

  .fieldInfoDiv pre {
    margin: 0;
    word-wrap: break-word;
    white-space: pre-wrap;
  }

  .fieldInfoDiv h3 {
    margin: 0;
  }
</style>
