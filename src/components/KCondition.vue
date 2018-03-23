<template>
  <div class="kmenuWrapper">
    <k-button-menus size="mini" :data="{}" :index="-1" round label menuText=" 更多 "></k-button-menus>
    <template v-if="hasQuery">
      <el-button :size="size" icon="el-icon-search" @click.stop="updateQuery" round>查询</el-button>
      <el-button :size="size" icon="el-icon-refresh" @click.stop="reset" round>重置</el-button>
      <el-input v-model="model[mainSearchField.Field]" :placeholder="'请输入查询：' + (mainSearchField.Comment || '')"
                :size="size"
                @keyup.enter.native="updateQuery" style="width: 200px;display: inline-block"></el-input>

      <el-button :size="size" icon="el-icon-d-arrow-left" @click.stop="showExtendQuery = !showExtendQuery" round
                 style="float:right">扩展过滤
      </el-button>
    </template>
    <!--遍历字段-->
    <template v-for="(item, index) in optionFields" v-if="optionFields.length > 0">
      <k-select v-if="item.Field.indexOf('__') > 3 && !item.isText" v-model="model[item.Field]" :size="size"
                :data-source-key="item.Field"
                :isMultiple="item.isText||false"
                :placeholder="'请选择'+item.Comment" :options="getMapOptions(item)">
      </k-select>
      <el-select v-else-if="item.isStatus" v-model="model[item.Field]" :size="size"
                 :placeholder="'请选择'+item.Comment">
        <el-option
          v-for="option in getStatusList(item.Field)"
          :key="option.id"
          :label="option.label+' | '+option.id"
          :value="option.id">
        </el-option>
      </el-select>
      <el-select v-else-if="item.isOption||item.isTextOption" v-model="model[item.Field]" :size="size"
                 :placeholder="'请选择'+item.Comment" style="min-width:200px;">
        <el-option
          v-for="option in getOptionList(item.Field)"
          :key="option.value"
          :label="option.label? option.label +' | '+option.value : option.value"
          :value="option.value">
        </el-option>
      </el-select>
    </template>
    <k-more :isExpand="showExtendQuery" v-if="hasQuery">
      <div class="numberField" v-if="numberFields.length > 0">
        <template v-for="(item, index) in numberFields">
          <el-input v-model="model[item.Field]" class="input-with-select" :size="size"
                    @keyup.enter.native="updateQuery">
            <el-select v-model="numberOption[item.Field]" slot="prepend" defaultFirstOption
                       :placeholder="item.Comment+'='" size="mini">
              <template v-for="(listItem, inx) in equalList">
                <el-option :value="listItem" :label="item.Comment+'' +listItem"></el-option>
              </template>
            </el-select>
          </el-input>
        </template>
      </div>
      <div class="extendPanel">
        <template v-for="(item, index) in textFields">
          <div v-if="item.isText" class="textPanel">
            <div class="label">{{item.Comment}}</div>
            <el-input v-model="model[item.Field]" placeholder="请输入内容" :size="size"
                      @keyup.enter.native="updateQuery">

            </el-input>
          </div>
        </template>
        <template v-for="(item, index) in timeFields">
          <div class="timePanel">
            <div class="label">{{item.Comment}}</div>
            <el-date-picker :size="size"
                            v-model="model[item.Field]"
                            type="datetimerange"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            :picker-options="datePickerOptions"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            align="right">
            </el-date-picker>
          </div>
        </template>
      </div>
    </k-more>
    <slot></slot>
  </div>
</template>

<script>
  import klib from '../klib/utils'
  import KMore from "./KMore.vue";
  import KButtonMenus from "./KButtonMenus.vue";
  import KFormItem from "./KFormItem";
  import KSelect from "./KSelect";

  export default {
    components: {
      KSelect,
      KFormItem,
      KButtonMenus,
      KMore
    },
    name: 'KCondition',
    props: {

      size: {
        type: String,
        required: false,
        default: 'mini'
      },
      loading: {
        type: Boolean,
        default: true
      },
      dataStruct: {
        type: Object,
        required: false,
      },
      condition: {
        type: Object,
        required: false,
        default: null
      },
      searchField: String,
    },
    watch: {
      dataStruct(val) {
        this.timeFields = []
        this.optionFields = []
        this.numberFields = []
        this.textFields = []
        if (this.searchField) {
          this.mainSearchField = val._FIELD_DIC[this.searchField]
        }
        for (let i = 0; i < val._FIELD_LIST.length; i++) {
          let item = val._FIELD_LIST[i];
          // this.$set(this.fields, item.Field, item)
          if (item.isPK) {
            this.pkField = item
          } else if (item.isDate) {
            this.timeFields.push(item)
          } else if (item.isOption || item.isStatus || item.isTextOption || item.Field.indexOf('__') > 3) {
            // console.log(item)
            this.optionFields.push(item)
          } else if (item.isInt || item.isFloat) {
            this.numberFields.push(item)
          } else if (item.isText) {
            if (!this.mainSearchField.Field) {
              this.mainSearchField = item
            }
            this.textFields.push(item)
          } else {
          }
        }
        // console.log(this.optionFields, 'optionFields')
      },
    },
    computed: {},
    data() {
      // 声明保存当前操作分类node对象
      //this.__currentNode = null
      return {
        mainSearchField: {},
        pkField: {},
        optionFields: [],
        numberFields: [],
        textFields: [],
        timeFields: [],
        equalList: ['=', '>', '>=', '<', '<='],
        numberOption: {},
        showExtendQuery: false,
        model: {},
        showPop: false,
        hasQuery: false,
        hasBatchDelete: true,
        hasInsert: true,
        hasDate: false,
        kSelectOptions: {},
        datePickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近二个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 60);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近六个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 180);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一年',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近两年',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 365 * 2);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三年',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 365 * 2);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
      }
    },
    created() {
      this.hasQuery = this._events.query ? true : false;
      this.reset()
    },
    mounted() {
      this.delayLoadOptions()
    },
    methods: {
      updateQuery() {
        let obj = this.getQuery()
        if (!obj) obj = {'null': true}
        this.$emit('query', obj)
      },
      getQuery() {
        let obj
        for (let key in this.model) {
          let fd = this.dataStruct._FIELD_DIC[key]
          if (fd) {
            let val = this.model[key]
            if (val !== null && val !== undefined && val !== '') {
              console.log(111, key, val)
              if (fd.isInt || fd.isFloat) {
                if (!obj) obj = {};
                obj[key] = (this.numberOption[key] || '=') + val
              } else {
                if (!obj) obj = {};
                obj[key] = val
              }
            }
          }
        }
//        console.log(obj)
        return obj
      },
      cancel() {
      },
      reset() {
        if (!this.dataStruct || !this.dataStruct._FIELD_LIST) return;
        this.dataStruct._FIELD_LIST.forEach((item, i) => {
          this.$delete(this.model, item.Field)
        })
        this.$emit('reset')
      },
      getParentDataStruct: klib.getParentDataStruct,
      getMapOptions: klib.getMapOptions,
      getFieldLabel: klib.getFieldLabel,
      getStatusList: klib.getStatusList,
      getOptionList: klib.getOptionList,
      getStatus: klib.getStatus,
      getOption: klib.getOption,
      delayLoadOptions(timeout = 1000) {
        if (!this.timerNC) {
          this.timerNC = 0
        }
        setTimeout(() => {
          let list = this.getComponentsByName('k-select') //search all the k-select in this component
          let noLoaded = [];
          for (let i = 0; i < list.length; i++) {
            let item = list[i];
            if (!item.options && item.dataSourceKey) { //field and model must exist
              noLoaded.push(item)
            }
          }
          if (noLoaded.length === 0) {
            return
          }
          let nc = noLoaded.length
          for (let i = 0; i < noLoaded.length; i++) {
            let item = noLoaded[i];
            if (!item.options) { //field and model must exist
              let key = item.dataSourceKey.split('__')[0]
              key = {Field: key}
              let opt = this.getMapOptions(key)
              if (opt) {
                item.syncOption(opt)
                nc--;
              }
              if (nc === 0) {
                return
              }
            }
          }
          this.timerNC++;
          if (this.timerNC > 20) {
            console.debug('20 seconds load KSelect component data failed ', noLoaded)
            return
          }
          this.delayLoadOptions()
        }, timeout)
      },
      getComponentsByName: klib.getComponentsByName,
    },
  }


</script>

<style lang="scss">
  .kmenuWrapper {
    width: 98%;
    margin: 5px 0 5px 0px;
    font-size: 14px;
    .el-button + .el-button {
      margin: 0 0 0 0px;
    }
    .el-button {
      margin: 0;
    }
    .KButtonMenuWrap {
    }
    .KButtonMenuWrap, .el-button, .KSelect, .el-select {
      display: inline-block;
      margin-right: 5px;
    }
    .numberField {
      float: right;
    }
    .kmoreWrap {
      clear: both;
    }
    .el-select {
      margin: 0 0 0 5px;
      height: 33px;
    }
    .input-with-select {
      max-width: 180px;
      margin: 0 0 0 5px;
      .el-select {
        min-width: 80px;
        margin: 0;
        height: 26px;
      }
      .el-input-group__prepend {
        margin: 0;
        padding: 0;
        height: 20px;
        overflow: hidden;
      }
      .el-input__suffix {
        margin: 0 -12px 0 0px;
      }
      .el-input__inner {
        padding: 0 0 0 2px;
      }
      .el-input-group__append, .el-input-group__prepend {
        padding: 0 3px;
      }
    }
    .el-collapse, .el-collapse-item__header, .el-collapse-item__wrap {
      border: 0;
    }
    .el-collapse-item__content {
      padding: 0;
    }
  }

  .mainQuery {
  }

  .extendPanel {
    margin: 5px 0 0 0;
    div.label {
      display: inline-block;
      margin: 0px 5px 2px 2px;
    }
    .timePanel {
      margin: 0;
      min-width: 500px;
      display: inline-block;
      .el-date-editor {
        margin: 5px 15px 0 0;
      }
    }
    .textPanel {
      display: inline-block;
      .el-input {
        margin: 0px 15px 0 0;
        width: 140px;
      }
      input.el-input__inner {
        max-width: 150px;
      }
    }
  }

  .queryPanel {

  }
</style>
