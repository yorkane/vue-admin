<template>
  <div>{{label}}
    <div v-for="(val, key) in viewMap" :style="'margin-left:'+(indent*20)+'px'">
      <template v-if="typeof(jsonObject[key]) === 'object'">
        <json-view :json-object="jsonObject[key]" :label="getLabel(key)" :indent="indent+1"></json-view>
      </template>
      <template v-else="getLabel(key)">
        {{getLabel(key)+ ' : ' + getValue(key) }}
      </template>
    </div>
  </div>
</template>
<script>
  export default {
    components: {},
    name: 'jsonView',
    data() {
      return {
        fieldLabelMap: {},
      }
    },
    props: {
      indent: {
        type: Number,
        default: 0
      },
      label: String,
      labelMap: Object,
      jsonObject: {
        type: Object,
        required: false,
        default: function () {
          return {}
        }
      },
    },
    watch: {},
    computed: {
      viewMap() {
        return this.labelMap || this.jsonObject
      }
    },
    created() {
    },
    mounted() {
    },
    methods: {
      getLabel(fieldKey) {
        if (this.labelMap) {
          return this.labelMap[fieldKey]
        }
        return fieldKey
      },
      getValue(fieldKey) {
        let val = this.jsonObject[fieldKey]
        if (val !== null && val !== undefined) {
          if (fieldKey.match(/time$|date$|^expire/)) {
            let v = val.toString().match(/(^15\d{8}$|^15\d{11}$)/)
            if (v) {
              v = v[1]
              console.log(v)
              if (v.length === 10) {
                v = parseInt(v) * 1000
              } else {
                v = parseInt(v)
              }
              val = new Date(v).toLocaleString()
            }
          }
        }
        return val
      },
    }
  }
</script>
