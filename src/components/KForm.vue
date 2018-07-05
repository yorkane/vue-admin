<template>
  <div>
    <slot name="main">
      <el-form :labelWidth="labelWidth" :ref="refs" :rules="formRules"
               :labelPosition="labelPosition" :model="model" :inline="inline"
               :label-suffix="labelSuffix" :show-message="showMessage" :inline-message="inlineMessage"
               :status-icon="statusIcon"
               :size="size" :class="size">
        <template v-for="(item, index) in m_dataStruct._FIELD_LIST">
          <slot name="form-item">
            <k-form-item :item="item" :size="size" v-if="(item.hide_in_form !== 1) || fieldEditable">
              <slot name="label" slot="label" :row="item">
                <k-form-field-info :item="item" :edit-table="fieldEditable"></k-form-field-info>
              </slot>
              <slot name="component" :row="item" :$index="index">
                <component :is="getComponent(item.Field)" :item="item" v-model="model[item.Field]">
                </component>
              </slot>
            </k-form-item>
          </slot>
        </template>
      </el-form>
    </slot>
    <slot name="buttons">
      <div class="form-buttons">
        <el-button :size="size" type="primary" @click="submitForm">{{isEditMode ? '保存修改' : '创建'}}</el-button>
        <el-button :size="size" @click="reset">重置</el-button>
        <el-button :size="size" @click="resetDefault">默认值</el-button>
        <el-button :size="size" @click="cancel">取消</el-button>
      </div>
    </slot>
  </div>
</template>
<script>
  import KWrap from "./KWrap.vue";
  import KFormItem from "./KFormItem.vue";
  import klib from '../klib/utils'
  import KDataStruct from "./KDataStruct.vue";
  import {Form} from 'element-ui'
  import KForm from './KForm'
  import KFormFieldInfo from "./KFormFieldInfo";

  export default {
    mixins: [KDataStruct, KWrap, Form],
    components: {
      KFormFieldInfo,
      KFormItem,
      KWrap,
      KForm
    },
    name: 'KForm',
    data() {
      return {
        isModelChanged: false,
        emptyRule: {},
        formRules: {}
      }
    },
    props: {
      size: String,
      model: {
        type: Object,
        required: false,
        default: function () {
          return {}
        }
      },
      fieldEditable: Boolean,
      isEditMode: {
        type: Boolean,
        default: false
      },
      'refs': {
        type: String,
        default: 'el-form'
      },
      componentMap: Object
    },
    computed: {
      form() {
        return this.getComponentsByName('el-form')[0]
      },
      formTitle() {
        let txt = this.isEditMode ? '修改' : '创建'
        return txt + this.m_dataStruct._COMMENT
      },
    },
    created() {
      // console.log(this.model)
      this.setOriginalData(this.model)
    },
    watch: {
      model(val) {
        this.getKFormItems()
        this.setOriginalData(val)
      }
    },
    mounted() {
      if (!this.___oridata) {
        this.setOriginalData(this.model)
      }
      setTimeout(() => {
        this.updateValidateRule()
      }, 300)
    },
    methods: {
      /**
       * Merge dataStruct rules with customized rules
       */
      updateValidateRule() {
        if (this.m_dataStruct._RULES) {
          for (let key in this.m_dataStruct._RULES) {
            let rule = this.m_dataStruct._RULES[key];
            if (rule) {
              let value = this.formRules[key]
              if (!value) {
                //No validate rules found in formRules, just inject the default rules
                value = []
                this.formRules[key] = value
              }
              //Has rule in formRules, append to the array
              if (!value.push) {
                value = [value]
                this.formRules[key] = value
              }
              for (let i = 0; i < rule.length; i++) {
                value.push(rule[i])
              }
            }
          }
          // for (let key in this.m_dataStruct._RULES) {
          //   let val = this.formRules[key];
          //   if (!val) {
          //     val = []
          //     let value = this.m_dataStruct._RULES[key]
          //     val.push(value)
          //     this.formRules[key] = val
          //   }
        }
        // console.log(this.formRules, this.m_dataStruct._RULES)
      },
      /**
       *
       * @returns {Array}
       */
      getKFormItems() {
        let arr = []
        let list = this.getComponentsByName('k-form-item') //search all the KFormItem in this component
        for (let i = 0; i < list.length; i++) {
          let item = list[i];
          // if (item.item) { //field and model must exist
          arr.push(item)
          // }
          if (item.prop !== undefined) {
            // this.$set(this.model, item.prop, item.value)
          }
        }
        //console.log(arr)
        // this.fields = arr
        return arr
      },

      setOriginalData: function (newVal = {}) {
        let pk = this.m_dataStruct._PK
        // console.log('isModelChanged:', this.isModelChanged, 'setOriginalData', newVal, ' set origin:', this.___oridata)
        if (this.isModelChanged && newVal[pk] === this.___oridata[pk]) {
          return
        }
        if (newVal._isEmpty) {
          this.resetDefault()
          return
        }
        this.___oridata = {}
        // console.log('setOriginalData', newVal, ' set origin:', this.___oridata)
        let ds = this.m_dataStruct
        for (let key in newVal) {
          if (key === undefined) {
            continue;
          }
          let val = newVal[key];
          let tp = typeof(val)
          if (val === undefined || tp === 'function') continue; //ignore function
          let fi = ds._FIELD_DIC[key]; //field valid in dataStruct
          // console.log(this.m_dataStruct._FIELD_DIC, 'sssss', key, val, fi)
          if (fi) {
            this.isModelChanged = true
            this.___oridata[key] = val
          }
        }
        // console.log('setOriginalData set: ',this.___oridata)
      },
      resetDefault: function () {
        this.model._isEmpty = null
        // this.___oridata = {}
        // console.log(this.m_dataStruct._DEFAULT)
        for (let key in this.m_dataStruct._FIELD_DIC) {
          let val = this.m_dataStruct._DEFAULT[key]
          if (key.indexOf('_') !== 0) {
            this.$set(this.model, key, val)
            // this.___oridata[key] = val
          }
        }
      },
      reset() {
        // console.log(this.___oridata, this.model)
        let pk = this.m_dataStruct._PK
        if (!this.___oridata) {
          // data untouched
          return
        }
        for (let key in this.model) {
          let val = this.___oridata[key];
          if (key.indexOf('_') !== 0) {
            // ignore addon values overwrite
            // console.log(key, val)
            this.$set(this.model, key, val)
          }
        }
        // console.log(this.___oridata, this.model)
        //this.resetFields(); call native reset will overwrite the saved data
        this.$emit('reset')
      },

      /**
       *  Restore original model value and done editing
       */
      cancel() {
        this.reset()
        if (this.withDialog) {
          this.showDialog = false
          this.$emit('update:visible', false)
        }
        this.broadcast('k-select', 'cancel')
        this.broadcast('k-form', 'cancel')
        this.$emit('cancel')
        this.isModelChanged = false
        // this.___oridata = null
      },

      /**
       *  Save current model as default value and done editing
       */
      close() {
        if (this.withDialog) {
          this.showDialog = false
          this.$emit('update:visible', false)
        }
        this.isModelChanged = false
        this.setOriginalData(this.model)
        this.$emit('close')
      },
      /**
       * Get the edited data and generated updated value plain object
       * @param isEditMode
       * @returns {*}
       */
      getEditData(isEditMode) {
        let list = this.getKFormItems()
        let newObj, pk = this.m_dataStruct._PK
        // console.log('origin', this.___oridata, 'new', this.model)
        for (let i = 0; i < list.length; i++) {
          let comp = list[i]
          let fi = comp.item; //get dataStruct field in component props
          let key = (comp.prop || fi.Field);
          if (comp.readOnly || fi.isPK) continue;
          let val = this.___oridata[key]; //get old value
          if (typeof (val) === 'function') continue;
          let newVal = this.model[key]; //from changed model
          // console.log(key, newVal)
          if (fi.isIntBool || fi.isInt) { //prevent wrong input
            if (newVal !== val) {
              newVal = parseInt(newVal) || 0
              val = parseInt(val) || 0
            }
          }
          if (fi.isDate) {
            //make sure the datatime object convert to string type for updating in sql
            if (newVal && newVal.getDate) newVal = newVal.toISOString()
            if (val && val.getDate) val = val.toISOString()
          }
          if (isEditMode && newVal === val) continue; //In edit mode, new value and old value could not be the same
          // console.log(key, '||new:',newVal,'|| older:',val,this.___oridata)
          if (!newObj) {
            newObj = {};
            let id = this.model[pk]
            if (id !== undefined) {
              newObj[pk] = id
            }
          }
          if (fi.isDate) {
            newObj[key] = newVal.substring(1, 19) + 'Z'
          } else {
            newObj[key] = newVal
          }
        }
        return newObj
      },

      /**
       *  Submit current Form
       */
      submitForm: function () {
        let newObj = this.getEditData(this.isEditMode)
        if (!newObj) {
          this.$notify.info({title: '没有改动', message: ''});
          return
        }
        // console.log(this.$parent)
        if (!this.api) {
          this.$notify.error({title: 'API 没有注入', message: '请检查API props'});
          return
        }
        this.form.validate(isValid => {
          if (this.beforeSave) {
            if (this.beforeSave(isValid, newObj, this.model)) {
              this.saveModel(newObj);
            }
          } else {
            if (isValid) {
              this.saveModel(newObj);
            }
          }
        });
      },
      saveModel: function (plainObj) {
        if (!plainObj) return;
        if (this.isEditMode) {
          let update = this.update || this.api.update
          if (!update) console.error('[KForm] update method or api.update method required')
          if (this.update) {
            update = update.bind(this)
          } else {
            update = update.bind(this.api)
          }
          let promis = update(plainObj) || {}
          if (promis.then) {
            promis.then(res => {
              this.$emit('updated', plainObj, res, this.model);
              this.afterSave(this.isEditMode, plainObj, res, this.model)
              this.close()
            })
          }
        } else {
          let insert = this.insert || this.api.insert
          if (!insert) console.error('[KForm] insert method or api.insert method required');
          if (this.insert) {
            insert = insert.bind(this)
          } else {
            insert = insert.bind(this.api)
          }
          let promis = insert(plainObj) || {}
          if (promis.then) {
            promis.then(res => {
              let data = res.data
              let pk = this.m_dataStruct._PK
              plainObj[pk] = data.result.insert_id; //get id from db
              this.model[pk] = plainObj[pk];
              this.$emit('inserted', plainObj, res, this.model);
              this.afterSave(this.isEditMode, plainObj, res, this.model)
              this.close()
            })
          }
        }
      },
      getComponent(fieldName) {
        let dic = this.componentMap || this.m_componentMap
        if (!dic) return;
        for (let key in dic) {
          let comp = dic[key]
          if (key == fieldName) {
            return comp
          }
        }
        return null
      },
      resetFields() {
        this.form.resetFields()
      },
      clearValidate() {
        this.form.clearValidate()
      },
      validate(callback) {
        return this.form.validate(callback)
      },
      //abstract method hook, you should always override this method
      // beforeSave(isValid, plainObjct, model) {
      //return true to break the save process
      //console.log('abstract method getData not implemented! you should always override this method!')
      // },
      //abstract method hook, you should always override this method
      afterSave(isEditMode, plainObjct, resp, model) {
        // console.log(isEditMode, plainObjct, resp, model)
        let title = isEditMode ? '更新记录成功' : '新建记录成功'
        this.$notify.info({title: title, message: plainObjct})
      },
      broadcast(componentName, eventName, params) {
        let list = this.getComponentsByName(componentName)
        for (let i = 0; i < list.length; i++) {
          list[i].$emit(eventName, params);
        }
      },
      formatDate: klib.formatDate,
      getComponentsByName: klib.getComponentsByName,
    }
  }
</script>
