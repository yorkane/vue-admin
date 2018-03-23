<template>
  <iframe-containter :src="src"></iframe-containter>
</template>
<script>
  import IframeContainter from "../../components/Iframe.vue";
  import {isLogin} from '../../utils/auth' // 验权
  export default {
    components: {IframeContainter},
    name: 'login',
    computed: {
      src() {
        let host = window.location.hostname
        if (host.indexOf('27.0.0.1') < 0 && host.indexOf('localhost') < 0) {
          return window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '') + '/auth.html';
        }
        return window.location.protocol + "//" + window.location.hostname + '/auth.html';
      }
    },
    methods: {
      detectLogin() {
        let that = this
        setTimeout(function () {
          console.debug('check login...')
          if (isLogin()) {
            console.log('login and redirect to home')
            that.$router.replace({path: '/'})
          } else {
            that.detectLogin()
          }
        }, 1000)
      }
    },
    created() {
      this.detectLogin()
    }
  }
</script>
