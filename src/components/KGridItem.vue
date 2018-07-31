<template>
  <div style="text-overflow: ellipsis;">
    <el-tag v-if="item.isStatus" :type="getTagType(item.Field, model[item.Field])" size="small"
            :hit="model[item.Field] >= 0">
      {{getStatus(item.Field,
      model[item.Field], true)}}
    </el-tag>
    <el-tag v-else-if="item.isOption||item.isTextOption" :type="getTagType(item.Field, model[item.Field], true)"
            size="small" hit>
      {{getOption(item.Field,
      model[item.Field], true)}}
    </el-tag>
    <template v-else-if="item.isDate">{{formatDate(model[item.Field], true)}}</template>
    <el-switch v-else-if="item.isIntBool" v-model="model[item.Field]"
               @change="quickEdit(item.Field)"
               :active-value="1"
               :inactive-value="0"></el-switch>
    <el-switch v-else-if="item.isBool" v-model="model[item.Field]"
               @change="quickEdit(item.Field)"></el-switch>
    <i v-else-if="item.Field ==='icon'" style="font-size: 24px;color: #1f2d3d"
       :class="model['icon']"></i>
    <template v-else-if="item.Field.indexOf('__')>5">{{getFieldLabel(item, 60)}}</template>
    <template v-else>{{maxContent(model[item.Field])}}</template>
  </div>
</template>
<script>
  import klib from '../klib/utils'

  export default {
    name: 'KGridItem',
    data() {
      if (this.item.Field.indexOf('__') > 4) {
        this.$root.$on('k-data-ready', () => {
          this.$forceUpdate()
        })
      }
      return {
        defaultTags: {
          [-1]: "danger",
          0: 'info',
          1: 'success',
          2: 'plain',
          3: 'primary',
          4: 'warning',
          5: 'danger',
        }
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
      item: {
        type: Object,
        required: true,
      },
      PK: {
        type: [String, Number],
        required: true
      },
      maxColumnLength: {
        type: Number,
        default: 60
      },
      dataStruct: Object
    },
    mounted() {
    },
    methods: {
      quickEdit(key) {
        let obj = {};
        let pk = this.PK;
        obj[pk] = this.model[pk];
        obj[key] = this.model[key];
        let nc = 0
        let p = this;
        while (p && nc < 7) {
          if (p._events) {
            for (let item in p._events) {
              if (item === 'quickEdit') {
                p.$emit('quickEdit', obj, this.model, key)
              }
            }
          }
          p = p.$parent
          nc++;
        }
      },
      getTagType(field, val, isOptions) {
        let tags = this.getParentProp('tags')
        if (tags) {
          return tags[val]
        } else {
          if (val === 0) return this.defaultTags[val];
          let len = 6
          let list = isOptions ? this.getOptionList(field) : this.getStatusList(field)
          if (list) {
            let index = 1
            for (let i = 0; i < list.length; i++) {
              if (list[i].value && list[i].value == val) {
                index = i
                break
              }
              if (list[i].id === val) {
                index = i
                break
              }
            }
            console.log(val, index, this.defaultTags[index % len])
            return this.defaultTags[index % len]
          }
          else {
            return this.defaultTags[Math.abs(val % len)]
          }
        }
      },
      maxContent(text) {
        if (text && text.length > this.maxColumnLength) {
          return (text.substr(0, this.maxColumnLength) + '...')
        }
        return text
      },
      getParentProp: klib.getParentProp,
      getFieldLabel: klib.getFieldLabel,
      getOption: klib.getOption,
      getStatus: klib.getStatus,
      getStatusList: klib.getStatusList,
      getOptionList: klib.getOptionList,
      formatDate: klib.formatDate,
    }
  }
</script>
