<template>
  <k-wrap :withDialog="withDialog" :visible.sync="showDialog" :title="formTitle">
    <k-form :data-struct="m_dataStruct" :label-width="labelWidth" :visible.sync="showDialog"
            :is-edit-mode="isEditMode" :model="model" :size="size" :fieldEditable="fieldEditable">
      <!--<template slot="label" slot-scope="item">-->
        <!--<k-form-field-info :edit-table="fieldEditable" :item.sync="item.row"></k-form-field-info>-->
      <!--</template>-->
      <!--<template slot="component" slot-scope="scope">-->
      <!--<template v-if="scope.row.Field=='_DB'">{{fieldModel._DB}}</template>-->
      <!--</template>-->
    </k-form>
  </k-wrap>
</template>
<script>
  import KWrap from "./KWrap.vue";
  import KFormItem from "./KFormItem.vue";
  import klib from '../klib/utils'
  import KForm from './KForm'
  import KFormFieldInfo from "./KFormFieldInfo";

  export default {
    mixins: [KForm],
    components: {
      KFormFieldInfo,
      KFormItem,
      KWrap,
      KForm
    },
    name: 'KFormWrap',
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
    methods: {}
  }
</script>
