<template>
  <div class="diffView" :style="{height: height, width: width,fontSize: fontSize, fontFamily :fontFamily }"
       v-html="result">
  </div>
</template>
<script>
  import Diff2Html from 'diff2html'
  import difflib from 'difflib'
  import 'diff2html/dist/diff2html.css'

  export default {
    props: {
      lang: {
        type: String,
        default: 'sh'
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
      outputFormat: String,
      oldText: String,
      newText: String,
      fileName: {
        type: String,
        default: 'NOFILE.text'
      },
    },

    data: function () {
      return {
        result: 'Waiting for input...',
        option: {
          inputFormat: 'diff', // diff || json
          outputFormat: 'side-by-side', // line-by-line || side-by-side
          showFiles: false,
          matching: 'none', // lines || words || none
          synchronisedScroll: false,
          matchWordsThreshold: 0.25,
          matchingMaxComparisons: 2500
        },
        editor: null,
      };
    },

    mounted: function () {
      this.doDiff()
    },
    methods: {
      doDiff(beforeString, afterString, options) {
        options = Object.assign({}, this.option, options)
        options.outputFormat = this.outputFormat || options.outputFormat
        beforeString = beforeString || this.oldText
        afterString = afterString || this.newText
        if (!beforeString || !afterString) {
          this.result = 'Nothing to compare'
          return
        }
        'sss.conf'
        let beforeArray = beforeString.split(/\r\n|\r|\n/)
        let afterArray = afterString.split(/\r\n|\r|\n/)
        let diffArray = difflib.unifiedDiff(beforeArray, afterArray, {
          fromFile: this.fileName,
          toFile: this.fileName
        })
        let diff2Html = Diff2Html.Diff2Html || Diff2Html
        // console.log(Diff2Html, diff2Html)
        let diffString = 'diff --git ' + this.fileName + ' ' + this.fileName + '\n' + diffArray.join('\n')
        let html = diff2Html.getPrettyHtml(diffString, options)
        // console.log(diffString, html)
        this.result = html
      }
    },

    watch: {}
  }
</script>
<style>
  .vue2AceEditor {
    font-family: Consolas, "微软雅黑", "Liberation Mono", Menlo, Courier, monospace;
  }
</style>
