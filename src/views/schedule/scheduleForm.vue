<template>
  <k-wrap :withDialog="withDialog" :visible.sync="showDialog" :title="formTitle">
    <k-form :data-struct="m_dataStruct" :label-width="labelWidth" :visible.sync="showDialog" :API="api"
            :is-edit-mode="isEditMode" :model="model" :size="size" :fieldEditable="fieldEditable" @inserted="inserted"
            @updated="updated">
      <!--<template slot="label" slot-scope="item">-->
      <!--<k-form-field-info :edit-table="fieldEditable" :item.sync="item.row"></k-form-field-info>-->
      <!--</template>-->
      <template slot="component" slot-scope="scope">
        <div v-if="scope.row.Field==='jit_api__id'">
          <el-tooltip :content="'测试API ' + model.jit_api__id" placement="top" :enterable="false" :open-delay="200">
            <el-button style="float: right" icon="el-icon-tickets" type="primary"
                       @click="jumpToAPIDoc(model.jit_api__id, model.api_params)"></el-button>
          </el-tooltip>
          <el-tooltip :content="'运行 ' + model.jit_api__id" placement="top" :enterable="false" :open-delay="200">
            <el-button style="float: right" :type="model.status > 0? 'plain':'success'" :disabled="model.status > 0 "
                       :icon="model.status < 1 ?'el-icon-caret-right' : 'el-icon-loading'"
                       @click.stop="$emit('runSchedule', model)"></el-button>
          </el-tooltip>
          <k-select v-model="model[scope.row.Field]" label-field="name"
                    key-field="id"
                    tabindex="1" value-field="id" :is-multiple="false" only-leaf-checkable
                    :placeholder="'请选择'+scope.row.Comment" :options="getMapOptions(scope.row)">
          </k-select>
        </div>
        <template v-if="scope.row.Field==='jit_api__id'">

        </template>
      </template>
    </k-form>
  </k-wrap>
</template>
<script>
  import KWrap from "../../components/KWrap.vue";
  import KFormItem from "../../components/KFormItem.vue";
  import klib from '../../klib/utils'
  import KForm from '../../components/KForm'
  import KFormFieldInfo from "../../components/KFormFieldInfo";
  import KSelect from "../../components/KSelect";

  export default {
    mixins: [KForm],
    components: {
      KSelect,
      KFormFieldInfo,
      KFormItem,
      KWrap,
      KForm
    },
    name: 'scheduleForm',
    data() {
      return {}
    },
    props: {
      labelWidth: {
        type: String,
        default: '200px'
      },

    },
    computed: {},
    created() {
    },
    watch: {},
    mounted() {
    },
    methods: {
      inserted(plainObj, res, model) {
        this.$emit('inserted', plainObj, res, model);
      },
      updated(plainObj, res, model) {
        this.$emit('updated', plainObj, res, model);
      },
      jumpToAPIDoc(jit_api__id, params) {
        if (!jit_api__id || jit_api__id.length < 8) {
          this.$notify.info({title: '请先选择正确的API', message: jit_api__id});
          return
        }
        this.$router.push({path: '/sys/api/' + jit_api__id, query: {json: params}})
      },
      getMapOptions: klib.getMapOptions,
    }
  }
</script>
