<template>
  <el-form-item v-show="!isHide && !item.hide_in_form" :class="isFieldNoValidate()?'no-validate':''" :size="size"
                :label="getLabel()"
                :prop="key">
    <template slot="label">
      <slot name="label">{{getLabel() + form.labelSuffix}}</slot>
    </template>
    <slot>
      <template v-if="item.Field.match(/^(password|salt)/ig)">
      </template>
      <template v-else-if="isFieldReadOnly()">
        <template v-if="item.isStatus">{{getStatus(item.Field, model[key], true)}}</template>
        <template v-else-if="item.isOption">{{getOption(item.Field, model[key], true)}}</template>
        <template v-else-if="item.isDate">{{formatDate(model[item.Field], true)}}</template>
        <el-switch v-else-if="item.isBool" v-model="model[key]" disabled></el-switch>
        <el-switch v-else-if="item.isIntBool" v-model="model[key]" disabled
                   :active-value="1" :inactive-value="0"></el-switch>
        <template v-else-if="item.isText">
          <template v-if="model[item.Field].length > 50">
            <el-popover trigger="hover" width="650">
              <el-input readonly v-model.trim="model[item.Field]"  type="textarea" :autosize="{ minRows: 15, maxRows: 30}"></el-input>
              <span slot="reference">{{model[item.Field].substring(0,50)}}</span>
            </el-popover>
          </template>
          <span v-else>{{model[item.Field]}}</span>
        </template>
        <span v-else>{{getFieldLabel(item)}}</span>
      </template>
      <template v-else>
        <template v-if="item.Field.indexOf('__') > 3">
          <div style="right:0;position: absolute">
            <el-tooltip :content="'修改' + item.Comment + '选项'" placement="top" :enterable="false" :open-delay="200">
              <el-button style="padding:10px 11px" type="primary" icon="el-icon-d-arrow-right"
                         @click="intoMapField(item)"></el-button>
            </el-tooltip>
          </div>
          <div style="margin-right:60px;">
            <k-select v-model="model[key]" :label-field="getLabelField(item)" :key-field="getValueField(item)"
                      tabindex="1" :value-field="getValueField(item)" :isMultiple="item.isText||false"
                      :placeholder="'请选择'+item.Comment" :options="getMapOptions(item)">
            </k-select>
          </div>
        </template>
        <el-input-number v-else-if="item.isInt" v-model="model[key]" tabindex="1"></el-input-number>
        <el-input-number v-else-if="item.isFloat" v-model="model[key]" :step="0.1"
                         :maxlength="item.width" tabindex="1"></el-input-number>
        <el-date-picker v-else-if="item.isDate" v-model="model[key]" type="datetime"
                        placeholder="选择日期时间" tabindex="1"></el-date-picker>
        <template v-else-if="item.isStatus">
          <el-radio-group v-model="model[key]" v-if="getStatusList(item.Field).length < 6" tabindex="1">
            <el-radio-button v-for="option in getStatusList(item.Field)" :key="option.id" :label="option.label">
              {{option.label}}
            </el-radio-button>
          </el-radio-group>
          <el-select v-else v-model="model[key]"
                     :placeholder="'请选择'+item.Comment" tabindex="1">
            <el-option
              v-for="option in getStatusList(item.Field)"
              :key="option.id"
              :label="option.label+' | '+option.id"
              :value="option.id">
            </el-option>
          </el-select>
        </template>
        <template v-else-if="item.isOption||item.isTextOption">
          <el-radio-group v-model="model[key]" v-if="getOptionList(item.Field).length < 6" tabindex="1">
            <el-radio-button v-for="option in getOptionList(item.Field)" :key="option.value" :label="option.value">
              {{option.label}}
            </el-radio-button>
          </el-radio-group>
          <el-select v-else="item.isOption||item.isTextOption" v-model="model[key]"
                     :placeholder="'请选择'+item.Comment" style="min-width:200px;width:70%" tabindex="1">
            <el-option
              v-for="option in getOptionList(item.Field)"
              :key="option.value"
              :label="option.label ? option.label + ' | ' + option.value : option.value"
              :value="option.value">
            </el-option>
          </el-select>
        </template>
        <template v-else-if="item.isBool||item.isIntBool">
          <el-switch tabindex="1" v-if="item.isBool" v-model="model[key]"></el-switch>
          <el-switch tabindex="1" v-else="item.isIntBool" v-model.number="model[key]"
                     :active-value="1" :inactive-value="0"></el-switch>
          {{item.Field}} {{model[key]}}
        </template>
        <el-input tabindex="1" v-else-if="item.width > 200" v-model="model[key]" :maxlength="item.width" type="textarea"
                  :placeholder="placeholder" :autosize="{ minRows: 2, maxRows: 10}"></el-input>
        <el-input tabindex="1" v-else v-model="model[key]" :maxlength="item.width" :type="type"
                  :placeholder="placeholder" :style="item.isPK ? 'width:70%':null"></el-input>
      </template>
    </slot>
  </el-form-item>
</template>
<script>
  import klib from '../klib/utils'
  import {FormItem} from 'element-ui'
  import KSelect from "./KSelect";

  export default {
    components: {
      KSelect
    },
    name: 'KFormItem',
    mixins: [FormItem],
    data() {
      return {}
    },
    props: {
      size: String,
      prop: String,
      readOnly: Boolean,
      item: {
        type: Object,
        default: function () {
          return {
            Field: ''
          }
        }
      },
      placeholder: String,
      type: String,
      value: [String, Number, Object, Array],
      label: String,
      disabled: Boolean,
      showFieldKey: Boolean,
      isHide: Boolean,
      hideLabel: Boolean
    },
    created() {
    },

    mounted() {
    },
    computed: {
      model() {
        let model = this.form.model
        //console.log(model, this.key, this.value)
        return model
      },
      key() {
        return this.prop || this.item.Field
      }
    },
    methods: {
      isFieldNoValidate() {
        if (this.item.isIntBool || this.item.isBool) {
          return true
        }
        return this.isFieldReadOnly()
      },
      isFieldReadOnly(item = this.item) {
        if (item.is_readonly) return true;
        if (this.readOnly) return true;
        if (this.disabled || (item.isDate && item.Field.match(/^(create_|last_)/ig))) {
          return true
        }
        if (item.isPK) {
          if (item.isText && !item.isEditMode) {
            return false;
          }
          return true
        }
      },
      getLabel() {
        if (this.hideLabel) {
          return
        }
        if (this.label) {
          if (this.showFieldKey && !this.item.isIntBool && !this.item.is_bool) {
            return this.label + ' ' + this.key
          } else {
            return this.label
          }
        }
        if (this.item.Comment) {
          if (this.showFieldKey && !this.item.isIntBool && !this.item.is_bool) {
            return this.item.Comment + ' ' + this.key
          } else {
            return this.item.Comment
          }
        }
        return this.key
      },
      getLabelField(fi) {
        let f = fi.Field.split('__')[1]
        if (f === 'id') {
          f = 'label'
        }
        return f
      },
      getValueField(fi) {
        let f = fi.Field.split('__')[1]
        return f
      },
      intoMapField(fi) {
        let key = fi.Field.split('__')[0]
        this.$root.$emit('IntoMapField', key, fi)
        console.debug('send emit to root event', key, fi)
      },
      getMapOptions: klib.getMapOptions,
      getFieldLabel: klib.getFieldLabel,
      getStatusList: klib.getStatusList,
      getOptionList: klib.getOptionList,
      getStatus: klib.getStatus,
      getOption: klib.getOption,
      formatDate: klib.formatDate,
    }
  }
</script>
