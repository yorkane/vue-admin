<template>
  <span>
    <el-popover
      ref="popover1"
      width="600"
      trigger="hover"
      v-model="showPopup"
      placement="right-start">
      <span v-if="item.Comment" slot="reference">
        {{item.Comment}}
        <i class="el-icon-info el-icon--right"></i><i class="el-icon-edit-outline el-icon--right"
                                                      @click="switchForm($event, true)"></i></span>
      <span v-else slot="reference">{{item.Field}}</span>
      <div style="margin:10px;">
        <div>{{item.info}}</div>
        <k-form ref="kform" :data-struct="datastruct" labelWidth="100px" is-edit-mode :model="fieldModel"
                @updated="updateInfo"
                v-if="isEditing"
                size="mini" @cancel="close" @close="close">
          <template slot-scope="scope">
            <template v-if="scope.row.Field=='_DB'">{{fieldModel._DB}}</template>
            <template v-else-if="scope.row.Field=='_NAME'">{{fieldModel._NAME}}</template>
            <template v-else-if="scope.row.Field=='Field'">{{fieldModel.Field}}</template>
          </template>
          <!--<template scope="scope" v-else-if="scope.row.Field=='_NAME'">{{fieldModel._NAME}}</template>-->
        </k-form>
        <!--<span v-else>{{getLable()}}</span>-->
      </div>
    </el-popover>
    <!--<el-button v-if="editTable"  round type="primary"-->
    <!--style="float:left" class="el-icon-edit" size="mini" v-show="!isEditing"></el-button>-->
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
        queryList: []
      }
    },
    watch: {
      showPopup(val) {
        if (!val) {
          // this.isEditing = false
        }
      }
    },
    computed: {
      fieldModel() {
        let model = JSON.parse(JSON.stringify(this.item));
        model._DB = this.parentDataStruct._DB
        model._NAME = this.parentDataStruct._NAME
        return model
      },
      datastruct() {
        return this._api.dataStruct
      },
      parentDataStruct() {
        return klib.getParentDataStruct.call(this)
      },
    },
    mounted() {
    },
    methods: {
      getModel() {
        let model = JSON.parse(JSON.stringify(this.item));
        return model
      },
      switchForm(event, isEdit) {
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
        this.item.info = po.info
        this.item.Comment = po.Comment || this.item.Comment
      },
      getLable() {
        console.log(this.item)
        return this.item.Comment || this.item.Field;
      },
      getParentDataStruct: klib.getParentDataStruct
    }
  }
</script>
