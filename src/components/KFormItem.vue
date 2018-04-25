<template>
  <el-form-item v-show="!isHide" :class="isFieldReadOnly()?'read-only':''"
                :label="getLabel()"
                :prop="key">
    <slot>
      <template v-if="item.Field.match(/^(password|salt)/ig)">
      </template>
      <template v-else-if="isFieldReadOnly()">
        <span v-if="item.isStatus">{{getStatus(item.Field, model[key], true)}}</span>
        <span v-else-if="item.isOption">{{getOption(item.Field, model[key], true)}}</span>
        <el-switch v-else-if="item.isBool" v-model="model[key]" disabled></el-switch>
        <el-switch v-else-if="item.isIntBool" v-model="model[key]" disabled
                   :active-value="1" :inactive-value="0"></el-switch>
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
            <k-select v-model="model[key]" :label-field="getLabelField(item)" :key-field="getValueField(item)" :value-field="getValueField(item)" :isMultiple="item.isText||false"
                      :placeholder="'请选择'+item.Comment" :options="getMapOptions(item)">
            </k-select>
          </div>
        </template>
        <el-input-number v-else-if="item.isInt" v-model="model[key]"></el-input-number>
        <el-input-number v-else-if="item.isFloat" v-model="model[key]" :step="0.1"
                         :maxlength="item.width"></el-input-number>
        <el-date-picker v-else-if="item.isDate" v-model="model[key]" type="datetime"
                        placeholder="选择日期时间"></el-date-picker>
        <template v-else-if="item.isStatus">
          <el-radio-group v-model="model[key]" v-if="getStatusList(item.Field).length < 6">
            <el-radio-button v-for="option in getStatusList(item.Field)" :key="option.id" :label="option.label">
              {{option.label}}
            </el-radio-button>
          </el-radio-group>
          <el-select v-else v-model="model[key]"
                     :placeholder="'请选择'+item.Comment">
            <el-option
              v-for="option in getStatusList(item.Field)"
              :key="option.id"
              :label="option.label+' | '+option.id"
              :value="option.id">
            </el-option>
          </el-select>
        </template>
        <template v-else-if="item.isOption||item.isTextOption">
          <el-radio-group v-model="model[key]" v-if="getOptionList(item.Field).length < 6">
            <el-radio-button v-for="option in getOptionList(item.Field)" :key="option.value" :label="option.value">
              {{option.label}}
            </el-radio-button>
          </el-radio-group>
          <el-select v-else="item.isOption||item.isTextOption" v-model="model[key]"
                     :placeholder="'请选择'+item.Comment" style="min-width:200px;width:70%">
            <el-option
              v-for="option in getOptionList(item.Field)"
              :key="option.value"
              :label="option.label ? option.label + ' | ' + option.value : option.value"
              :value="option.value">
            </el-option>
          </el-select>
        </template>
        <template v-else-if="item.isBool||item.isIntBool">
          <el-switch v-if="item.isBool" v-model="model[key]"></el-switch>
          <el-switch v-else="item.isIntBool" v-model.number="model[key]"
                     :active-value="1" :inactive-value="0"></el-switch>
          {{item.Field}}
        </template>
        <el-input v-else-if="item.width > 200" v-model="model[key]" :maxlength="item.width" type="textarea"
                  :placeholder="placeholder" :autosize="{ minRows: 2, maxRows: 10}"></el-input>
        <el-input v-else v-model="model[key]" :maxlength="item.width" :type="type"
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
      prop: String,
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
      isFieldReadOnly(item = this.item) {
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
    }
  }
</script>
