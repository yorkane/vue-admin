<template>
  <k-wrap :withDialog="withDialog" :visible.sync="showDialog">
    <div style="margin:0 0 5px 0">
      <el-button type="primary" @click="doCompare" size="medium">开始对比</el-button>
      <el-button @click="" size="medium">重置</el-button>
      <ace-diff :width="'100%'" height="100%" ref="aceDiff"></ace-diff>
      <!--<ace-diff :old-text="oldText" new-text="newText"></ace-diff>-->
    </div>
    <el-dialog width="80%" :visible="showDiff" :before-close="closeDiff">
      <diff-view :old-text="oldText" :new-text="newText" ref="diff" height="100%"></diff-view>
    </el-dialog>
  </k-wrap>
</template>
<script>
  import KWrap from "../../components/KWrap.vue";
  import DiffView from "../../components/diffView";
  import throttle from 'throttle-debounce/throttle';
  import AceDiff from "../../components/aceDiff";
  import AceEditor from "../../components/ace-editor";
  import textAPI from '../../api/sys_text_history'
  import AutoHeightWrapper from "../../components/AutoHeightWrapper";

  export default {
    name: 'textCompare',
    mixins: [KWrap],
    components: {
      AutoHeightWrapper,
      AceEditor,
      AceDiff,
      DiffView,
      KWrap,
    },
    props: {
      withDialog: {
        type: Boolean,
        default: false
      },
      leftText: String,
      rightText: String,
    },
    data: function () {
      this._api = textAPI
      let that = this;
      this.doCompare = throttle(100, () => {
        this.showDiff= true
        setTimeout(() => {
          this.oldText = that.$refs.aceDiff.getLeftText()
          this.newText = that.$refs.aceDiff.getRightText()
          // console.log(that.$refs.aceDiff.editor)
          // console.log(this.oldText, this.newText)
          this.$refs.diff.doDiff()
        }, 200)
      });
      return {
        showDiff:false,
        manualInput: false,
        showRight: true,
        showLeft: true,
        layoutMode: '编辑比对',
        oldText: `
            data: function () {
      this.m_componentMap = {
        'icon': KIconSelector,
        'role': ChooseRoleDialog,
        'role_refs': Ref.Role.Dialog,
        'permission': MenuPermission,
      }`,
        newText: `
            data: function () {
      this.m_componentMap = {
        'icon': KIconSelector,
        'role': ChooseRoleDialog,
        'role_refs': Ref.Role.Dialog,
        'permission': MenuPermission,
      }`,
        outputHtml: '',
      }
    },
    mounted() {
    },
    watch: {
      leftText(val) {
        this.oldText = val
      },
      rightText(val) {
        this.newText = val
      },
      oldText(val) {
        // console.log(val)
        this.doCompare()
      },
      newText(val) {
        this.doCompare()

      }
    },
    methods: {
      closeDiff(){
        this.showDiff = false
      }
    }
  }
</script>
