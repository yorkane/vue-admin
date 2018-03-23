<template>
  <auto-height-wrapper>
    <iframe :src="url" name="frameName" class="iframeContainter" :id="idStr"></iframe>
  </auto-height-wrapper>
</template>
<script>
  import AutoHeightWrapper from '../components/AutoHeightWrapper.vue'

  export default {
    components: {AutoHeightWrapper},
    name: 'iframeContainter',
    data() {
      return {
        idNum: (Math.random())
      }
    },
    props: {
      src: {
        type: String,
        required: true
      }
    },
    mounted() {
    },
    computed: {
      url() {
        console.log(this.src)
        if (this.src.indexOf('http') < 0) {
          if (window.location.port > 8000) {  //for develop environment
            return window.location.protocol + "//" + window.location.hostname + '/' + this.src
          }
        }
        return this.src
      },
      idStr() {
        return (this.$vnode.tag + '-' + this._uid + '-' + this.idNum)
      }
    }
  }
</script>
<style scoped>
  .iframeContainter {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    border: 0;
    float: left;
  }
</style>
