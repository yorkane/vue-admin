<template>
  <div style="text-overflow: ellipsis;">
    <el-tag v-if="item.isStatus" :type="getTagType(model[item.Field])" size="small" hit>
      {{getStatus(item.Field,
      model[item.Field], true)}}
    </el-tag>
    <el-tag v-else-if="item.isOption||item.isTextOption" :type="getTagType(model[item.Field])" size="small" hit>
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
    <i v-else-if="item.Field =='icon'" style="font-size: 24px;color: #1f2d3d"
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
      return {}
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
        type:Number,
        default: 60
      }
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
              if (item == 'quickEdit') {
                p.$emit('quickEdit', obj, this.model, key)
              }
            }
          }
          p = p.$parent
          nc++;
        }
      },
      getTagType(val) {
        let tags = this.getParentProp('tags')
        if (tags) {
          return tags[val]
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
      formatDate: klib.formatDate,
    }
  }
</script>
