<script>
  import Prism from 'prismjs'
  import 'prismjs/themes/prism-tomorrow.css'
  // import loadLanguages from 'prismjs/components/index'

  export default {
    name: 'prism',
    data() {
      return {}
    },
    props: {
      code: [String, Object, Array],
      language: {
        type: String
      },
    },
    created() {
    },
    mounted() {
    },
    render(h) {
      let code
      if (this.code) {
        if (typeof(this.code) !== "string") {
          code = JSON.stringify(this.code)
        } else {
          code = this.code
        }
      } else {
        code = this.$slots.default[0].text || ''
      }
      let lang = this.language || this.detectLanguage(code)
      let prismLanguage = Prism.languages[lang];
      if (!prismLanguage) {
        //Todo support more languages
        console.error('No language ' + lang + ' was not found. Only [javascript, markup, css, clike] supported in current version. Default with javascript')
        lang = this.detectLanguage(code)
        prismLanguage = Prism.languages[lang]
      }
      let className = "language-" + lang;
      return h(
        'pre', {class: className},
        [h('code', {class: className, domProps: {innerHTML: Prism.highlight(code, prismLanguage)}})]
      )
    },
    methods: {
      detectLanguage(text) {
        if (typeof(text) === 'object' || /^\s*(var |\{|\[)/.test(text)) {
          return 'javascript'
        }
        if (/^\s*<[a-z]+/.test(text)) {
          return 'markup'
        }
        if (/color:\s*#[a-f\d]{3,}/i.test(text)) {
          return 'css'
        }
        if (/\([^\)]+\)\s*\{[^\}]+\}/.test(text)) {
          return 'clike'
        }
        return 'javascript'
      }
    }
  }
</script>
