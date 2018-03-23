<template>
  <k-wrap :withDialog="withDialog" :visible.sync="showDialog" :title="'批量修改' + dataStruct._COMMENT">
    <template v-for="(item, index) in fieldList"><!--KSelect 占用的空间大，需要单独一行-->
      <div style="float:left;width:130px;">{{item.Comment}}</div>
      <div style="margin-left: 130px;min-height: 40px;">
        <k-select :size="size" v-model="model[item.Field]" :label-field="getLabelField(item)"
                  :isMultiple="item.isText||false"
                  :placeholder="'请选择'+item.Comment" :options="getMapOptions(item)">
        </k-select>
      </div>
    </template>
    <div class="divGridWrap" style="width: 799px;margin: 0 0 10px 0;">
      <template v-for="(item, index) in normalFieldList">
        <div class="gridItem" style="width: 400px;">
          <div style="float:left;width:130px;">{{item.Comment}}</div>
          <div style="margin-left: 130px;">
            <el-input-number :size="size" v-if="item.isInt" v-model="model[item.Field]"></el-input-number>
            <el-input-number :size="size" v-else-if="item.isFloat" v-model="model[item.Field]" :step="0.1"
                             :maxlength="item.width"></el-input-number>
            <el-date-picker :size="size" v-else-if="item.isDate" v-model="model[item.Field]" type="datetime"
                            placeholder="选择日期时间"></el-date-picker>
            <el-select :size="size" v-else-if="item.isStatus" v-model="model[item.Field]"
                       :placeholder="'请选择'+item.Comment">
              <el-option
                v-for="option in getStatusList(item.Field)"
                :key="option.id"
                :label="option.label+' | '+option.id"
                :value="option.id">
              </el-option>
            </el-select>

            <el-select :size="size" v-else-if="item.isOption||item.isTextOption" v-model="model[item.Field]"
                       :placeholder="'请选择'+item.Comment" style="min-width:200px;width:70%">
              <el-option
                v-for="option in getOptionList(item.Field)"
                :key="option.value"
                :label="option.label? option.label +' | '+option.value : option.value"
                :value="option.value">
              </el-option>
            </el-select>
            <el-switch :size="size" v-else-if="item.isBool" v-model="model[item.Field]"></el-switch>
            <el-switch :size="size" v-else-if="item.isIntBool" v-model.number="model[item.Field]"
                       :active-value="1" :inactive-value="0"></el-switch>
          </div>
        </div>
      </template>
    </div>
    <el-button type="primary" @click="submit">提交批量修改</el-button>
    <el-button @click="reset">重置</el-button>
    <el-button @click="cancel">取消</el-button>
  </k-wrap>
</template>
<script>
  import klib from '../klib/utils'
  import KSelect from "./KSelect";
  import AutoWidthWrapper from "./AutoWidthWrapper";
  import KFormItem from "./KFormItem";
  import KWrap from "./KWrap";

  export default {
    name: 'KBatchForm',
    mixins: [KWrap],
    components: {
      KSelect,
      KWrap,
      KFormItem,
    },
    props: {
      size: {
        type: String,
        default: 'mini'
      },
      dataStruct: {
        type: Object,
        required: false,
        default: function () {
          return {}
        }
      },
      model: {
        type: Object,
        required: false,
        default: function () {
          return {}
        }
      },
      dataList: Array,
    },
    data() {
      return {
        normalFieldList: [],
        fieldList: [],
        kSelectOptions: {
          isEmpty: true
        }
      }
    },
    watch: {
      dataStruct(val) {
        this.syncDataStruct(val)
      },
      showDialog(val) {
        if (val) {
          setTimeout(() => {
            this.reset()
          }, 10)
        }
      }
    },
    mounted() {
      this.syncDataStruct(this.dataStruct)
    },
    methods: {
      syncDataStruct(val) {
        this.fieldList = []
        this.normalFieldList = []
        if (!val || !val._FIELD_LIST) return;
        for (let i = 0; i < val._FIELD_LIST.length; i++) {
          let fi = val._FIELD_LIST[i];
          if (fi.isText && fi.Field.indexOf('__') > 3 || fi.Field.indexOf('__') > 3) {
            //专门保存KSelect 对应的字段映射控件
            this.fieldList.push(fi)
          } else if (fi.isText || fi.isPK) {
          }
          else {
            this.normalFieldList.push(fi)
          }
        }
        // console.log(val, this.fieldList, this.normalFieldList)
      },
      submit() {
        let po
        for (let key in this.model) {
          let val = this.model[key]
          if (val !== undefined) {
            if (!po) {
              po = {}
            }
            po[key] = val
          }
        }
        this.$emit('submit', po)
      },
      reset() {
        for (let key in this.model) {
          this.model[key] = undefined
        }
      },
      cancel() {
        this.reset()
        if (this.withDialog) {
          this.showDialog = false
          this.$emit('update:visible', false)
        }
        this.$emit('cancel')
      },
      getLabelField(fi) {
        let f = fi.Field.split('__')[1]
        if (f === 'id') {
          f = 'label'
        }
        return f
      },
      getMapOptions: klib.getMapOptions,
      getFieldLabel: klib.getFieldLabel,
      getStatusList: klib.getStatusList,
      getOptionList: klib.getOptionList,
      getStatus: klib.getStatus,
      getOption: klib.getOption,
    }
  }
</script>
