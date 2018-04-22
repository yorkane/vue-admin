<template>
  <div>
    <el-form :labelWidth="labelWidth" :ref="refs" :rules="formRules"
             :labelPosition="labelPosition" :model="model" :inline="inline"
             :label-suffix="labelSuffix" :show-message="showMessage" :inline-message="inlineMessage"
             :status-icon="statusIcon"
             :size="size">
      <template v-for="(item, index) in m_dataStruct._FIELD_LIST">
        <k-form-item :model="model" :item="item">
          <component :is="getComponent(item.Field)" :item="item" v-model="model[item.Field]"></component>
        </k-form-item>
      </template>
    </el-form>
    <slot>
      <el-button type="primary" @click="submitForm">{{isEditMode ? '保存修改' : '创建'}}</el-button>
      <el-button @click="reset">重置</el-button>
      <el-button @click="cancel">取消</el-button>
    </slot>
  </div>
</template>
<script>
  import KWrap from "./KWrap.vue";
  import KFormItem from "./KFormItem.vue";
  import klib from '../klib/utils'
  import KDataStruct from "./KDataStruct.vue";
  import {Form} from 'element-ui'

  export default {
    mixins: [KDataStruct, KWrap, Form],
    components: {
      KFormItem,
      KWrap
    },
    name: 'KForm',
    data() {
      return {
        emptyRule: {},
        formRules: {}
      }
    },
    props: {
      model: {
        type: Object,
        required: false,
        default: function () {
          return {}
        }
      },
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
      }
    },
    created() {
      if (!this.___oridata) {
        this.setOriginalData()
      }
    },
    watch: {
      model(val) {
        this.getKFormItems()
        this.setOriginalData(val)
      }
    },
    mounted() {
      setTimeout(this.updateValidateRule.bind(this), 300)
    },
    methods: {
      updateValidateRule() {
        if (this.m_dataStruct._RULES) {
          for (let key in this.formRules) {
            let val = this.m_dataStruct._RULES[key];
            if (val) {
              let value = this.formRules[key]
              value.push(val)
              // value.splice(0, 0, val)
            }
          }
          for (let key in this.m_dataStruct._RULES) {
            let val = this.formRules[key];
            if (!val) {
              val = []
              let value = this.m_dataStruct._RULES[key]
              val.push(value)
              this.formRules[key] = val
            }
          }
        }
      },
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
        this.fields = arr
        return arr
      },
      setOriginalData: function (newVal = {}) {
        let pk = this.m_dataStruct._PK
        // console.log(this.m_dataStruct, newVal)
        if (!this.___oridata) {
          this.___oridata = {[pk]: -404}
        }
        let pkid = newVal[pk]
        if (!pkid || this.___oridata[pk] == pkid) return; //already loaded
        let ds = this.m_dataStruct
        for (let key in newVal) {
          let val = newVal[key];
          let tp = typeof(val)
          if (tp === 'function') continue; //ignore function
          let fi = ds._FIELD_DIC[key]; //field valid in dataStruct
          if (fi) {
            if (fi.isDate) {
              this.___oridata[key] = val || null // this.formatDate(val);
            } else {
              this.___oridata[key] = val || null;
            }
          }
        }
      },
      reset() {
        // console.log(this.model)
        // console.log(this.___oridata)
        // return
        if (this.___oridata[this.m_dataStruct._PK] === -404) {
          // data untouched
          return
        }
        for (let key in this.model) {
          let val = this.___oridata[key];
          if (key.indexOf('_') !== 0) {
            // ignore addon values overwrite
            this.model[key] = val
          }
        }
        //this.resetFields(); call native reset will overwrite the saved data
        //this.$emit('reset')
      },
      cancel() {
        this.reset()
        if (this.withDialog) {
          this.showDialog = false
          this.$emit('update:visible', false)
        }
        this.broadcast('k-select', 'cancel')
        this.$emit('cancel')
      },
      close() {
        if (this.withDialog) {
          this.showDialog = false
          this.$emit('update:visible', false)
        }
        this.___oridata = null
        this.setOriginalData(this.model)
        this.$emit('close')
      },
      getEditData(isEditMode) {
        let list = this.getKFormItems()
        let newObj, pk = this.m_dataStruct._PK
        // console.log(this.model, this.___oridata);
        //console.log('origin', this.___oridata, 'new', this.model)
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
            if (newVal && newVal.getDate) newVal = this.formatDate(newVal);
            if (val && val.getDate) val = this.formatDate(val)
          }
          if (isEditMode && newVal === val) continue; //In edit mode, new value and old value could not be the same

          if (!newObj) {
            newObj = {};
            newObj[pk] = this.model[pk]
          }
          if (fi.isDate) {
            if (newVal) {
              newObj[key] = this.formatDate(newVal);
            }
          } else {
            if (newVal !== undefined) {
              newObj[key] = newVal
            }
          }
        }
        return newObj
      },
      submitForm: function () {

        let newObj = this.getEditData(this.isEditMode)
        if (!newObj) {
          this.$notify.info({title: '没有改动', message: ''});
          return
        }
        console.log(this.$parent)
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
