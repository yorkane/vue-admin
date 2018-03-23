<template>
  <div class="auto-width-wrapper" :style="{width:width}">
    <slot></slot>
  </div>
</template>

<script>
  import throttle from 'throttle-debounce/throttle';
  // import debounce from 'throttle-debounce/debounce';

  export default {
    name: 'AutoWidthWrapper',
    data() {
      if (!window.AutoWidthWrapper) {
        window._vue_AutoWidthWrapperNC = 0
      }
      window._vue_AutoWidthWrapperNC++;
      this.nc = (window._vue_AutoWidthWrapperNC++) * 10;
      return {}
    },
    computed: {},
    props: {
      cssDisplay: {
        type: String,
        default: 'inline-block'
      },
      gapWidth: {
        type: Number,
        default: 5
      },
      width: String,
      resizeChildWidth: {
        type: Boolean,
        default: true
      }
    },
    created() {
    },
    destroyed() {
    },
    methods: {
      bindWidthResizeEvents() {
        let el = this.$el
        setTimeout(() => {
          let wd = el.offsetWidth;
          let pwd = el.parentNode.offsetWidth;
          let tempArr = [];
          let fixWidth = 0
          for (let i = 0; i < el.children.length; i++) {
            let child = el.children[i];
            let cw = child.offsetWidth
            // console.log(child.style.display, child.style.width, child.offsetWidth, wd)
            if (cw == wd || wd != pwd) {
              tempArr.push(child)
            } else {
              fixWidth += parseInt(child.offsetWidth)
              child.style.minWidth = child.offsetWidth + 'px'
              // child.style.width = child.offsetWidth / (pwd / 100) + '%';
            }
          }
          let sharedWdith = Math.floor((pwd - fixWidth) / tempArr.length)
          for (let i = 0; i < tempArr.length; i++) {
            let child = tempArr[i];
            child.style.display = this.cssDisplay;
            child.style.width = (sharedWdith - this.gapWidth) / (pwd / 100) + '%';
            // console.log(sharedWdith, child.style.width)
          }
        }, 10)
      },
    },
    mounted() {
      this.bindWidthResizeEvents()
    },
  }
</script>
