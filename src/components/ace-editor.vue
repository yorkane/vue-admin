<template>
  <div ref="wrap" class="vue2AceEditor" :height="height"
       :style="{height: height, width: width,fontSize: fontSize, fontFamily :fontFamily }">
  </div>
</template>
<script>
  import ace from 'brace';
  import 'brace/mode/javascript'
  import 'brace/mode/java'
  import 'brace/mode/lua'
  import 'brace/mode/php'
  import 'brace/mode/python'
  import 'brace/mode/sh'
  import 'brace/mode/sql'
  import 'brace/mode/css'
  import 'brace/mode/html'
  // import 'brace/mode/apache_conf'
  // import 'brace/mode/ini'
  // import 'brace/mode/properties'
  // import 'brace/snippets/javascript'
  // import 'brace/snippets/lua'
  // import 'brace/snippets/php'
  // import 'brace/snippets/sql'
  // import 'brace/snippets/python'
  // import 'brace/snippets/sh'
  import 'brace/theme/monokai'

  export default {
    props: {
      value: {
        type: String,
        required: true
      },
      lang: {
        type: String,
        default: 'javascript'
      },
      theme: {
        type: String,
        default: 'monokai'
      },
      height: String,
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
          return {
            enableBasicAutocompletion: true,
            enableSnippets: true,
            enableLiveAutocompletion: true
          };
        }
      }
    },

    data: function () {
      return {
        editor: null,
      };
    },

    mounted: function () {
      let vm = this;
      let lang = vm.lang;
      let theme = vm.theme;
      let editor = vm.editor = ace.edit(vm.$el);
      let options = vm.options;
      editor.$blockScrolling = Infinity;
      ace.acequire("ace/ext/language_tools");
      editor.getSession().setMode('ace/mode/' + lang);
      editor.setTheme('ace/theme/' + theme);
      editor.setValue(vm.value, 1);
      editor.setOptions({
        enableBasicAutocompletion: false,
        enableSnippets: true,
        enableLiveAutocompletion: true
      });
      editor.on('change', () => {
        this.$emit('input', this.editor.getValue());
      });
      if (!this.height) {
        editor.setOptions({
          maxLines: Infinity
        });
      }
      editor.session.setUseWrapMode(true);
      editor.commands.addCommand({
        name: 'save',
        bindKey: {win: "Ctrl-S", "mac": "Cmd-S"},
        exec: editor => {
          this.$emit('save', this.editor.getValue())
          // console.log("saving", editor.session.getValue())
        }
      });
      // if (this.height === '100%') {
      //   this.resize()
      // }
    },
    watch: {
      value: function (newContent) {
        if (newContent === this.editor.getValue()) {
          return
        }
        this.editor.setValue(newContent, 1);
      },
      theme: function (newTheme) {
        // let vm = this;
        // vm.editor.setTheme('https://cdn.bootcss.com/ace/1.3.1/' + newTheme);
      }
    },
    methods: {
      setValue(newContent) {
        this.editor.setValue(newContent, 1);
      },
      moveTo(row, line) {
        this.editor.selection.moveTo(row, line)
      },
      setMode(lang) {
        if (lang.toLowerCase() === 'js') {
          lang = 'javascript'
        }
        this.editor.getSession().setMode('ace/mode/' + lang);
      },
      getLength() {
        return this.editor.session.getLength()
      },
    }
  }
</script>
