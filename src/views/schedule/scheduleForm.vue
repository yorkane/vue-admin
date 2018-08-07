<template>
  <k-wrap :withDialog="withDialog" :visible.sync="showDialog" :title="formTitle">
    <k-form :data-struct="m_dataStruct" :label-width="labelWidth" :visible.sync="showDialog" :API="api"
            :is-edit-mode="isEditMode" :model="model" :size="size" :fieldEditable="fieldEditable" @inserted="inserted"
            @updated="updated">
      <!--<template slot="label" slot-scope="item">-->
        <!--<k-form-field-info :edit-table="fieldEditable" :item.sync="item.row"></k-form-field-info>-->
      <!--</template>-->
      <template slot="component" slot-scope="scope">
        <k-select v-if="scope.row.Field==='jit_api__id'" v-model="model[scope.row.Field]" label-field="name" key-field="id"
                  tabindex="1" value-field="id" :is-multiple="false" only-leaf-checkable
                  :placeholder="'请选择'+scope.row.Comment" :options="getMapOptions(scope.row)">
        </k-select>
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
      getMapOptions: klib.getMapOptions,
    }
  }
</script>
