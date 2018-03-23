<template>
  <auto-height-wrapper class="aceDiff" :style="{height: height, width: width,fontSize: fontSize, fontFamily :fontFamily }">
  </auto-height-wrapper>
</template>
<script>
  import AceDiff from 'ace-diff';

  // optionally, include CSS, or use your own
  import 'ace-diff/dist/ace-diff.min.css';
  import AutoHeightWrapper from "./AutoHeightWrapper";

  export default {
    components: {AutoHeightWrapper},
    props: {
      lang: {
        type: String,
        default: 'javascript'
      },
      theme: {
        type: String,
        default: 'monokai'
      },
      height: {
        type: String,
        default: '300px'
      },
      fontFamily: {
        type: String,
        default: "'Microsoft Yahei', monospace, sans-serif;"
      },
      fontSize: {
        type: String,
        default: '17px'
      },
      width: {
        type: String,
        default: '100%'
      },
      sync: {
        type: Boolean,
        default: false
      },
      options: {
        type: Object,
        default: function () {
          return {};
        }
      },
      leftText: {
        type: String,
        default: 'Please input text left'
      },
      rightText: {
        type: String,
        default: 'Please input text right'
      },
    },

    data: function () {
      return {}
    },

    mounted: function () {
      this.editor = new AceDiff({
        element: this.$el,
        mode: 'ace/mode/text',
        theme: null,
        diffGranularity: 'broad',
        showDiffs: true,
        showConnectors: true,
        maxDiffs: 5000,
        left: {
          content: this.leftText,
          mode: null,
          theme: null,
          editable: true,
          copyLinkEnabled: true
        },
        right: {
          content: this.rightText,
          mode: null,
          theme: null,
          editable: true,
          copyLinkEnabled: false
        },
        classes: {
          diff: 'acediff__diffLine',
          connector: 'acediff__connector',
          newCodeConnectorLinkContent: '&#8594;',
          deletedCodeConnectorLinkContent: '&#8592;',
        },
      });
    },
    methods: {
      getLeftText() {
        return this.editor.editors.left.ace.getValue()
      },
      getRightText() {
        return this.editor.editors.right.ace.getValue()
      },
    },
    watch: {
      leftText(val) {
        this.oldText = val
      },
      rightText(val) {
        this.newText = val
      }
    }
  }
</script>
<style>

</style>
