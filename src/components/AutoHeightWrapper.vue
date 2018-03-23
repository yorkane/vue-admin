<template>
  <div class="auto-height-wrapper" :style="{height:height}">
    <slot></slot>
  </div>
</template>

<script>
  import throttle from 'throttle-debounce/throttle';
  // import debounce from 'throttle-debounce/debounce';

  export default {
    name: 'AutoHeightWrapper',
    data() {
      if (!window._vue_AutoHeightWrapperNC) {
        window._vue_AutoHeightWrapperNC = 0
      }
      window._vue_AutoHeightWrapperNC++;
      this.nc = (window._vue_AutoHeightWrapperNC++) * 10;
      return {}
    },
    computed: {},
    props: {
      height: String,
      resizeChildHeight: {
        type: Boolean,
        default: true
      }
    },
    created() {
    },
    destroyed() {
      if (this.height && this.height !== '100%') {
        return
      }
      if (this.windowResizeListener) {
        window.removeEventListener('resize', this.windowResizeListener)
      }
    },
    methods: {
      tiggerWindowResize() {
        if (this.height && this.height !== '100%') {
          return
        }
        // console.log('tiggerWindowResized')
        let e = document.createEvent("Event");
        e.initEvent = e.initEvent || e.init
        e.initEvent("resize", true, true);
        window.dispatchEvent(e);
      },
      getWindowBodyHeight() {
        let el = this.$el.parentNode;
        let height = el.offsetHeight
        if (parseInt(height) < 100) {
          height = document.body.scrollHeight;
        }
        if (el.children[0] !== this.$el) {
          height = height - el.children[0].scrollHeight;
//          console.log(height, el.children[0].offsetHeight)
        }
        return height;
      },
      bindHeightResizeEvents() {
        let timeout = 100 + this.nc
        this.windowResizeListener = throttle(50, () => {
          let el = this.$el;
          setTimeout(() => {
            el.style.height = 'auto';
            let ht = this.getWindowBodyHeight();
            el.style.height = ht + 'px';
            if (this.resizeChildHeight) {
              let cd = el.children[0];
              if (cd) {
                cd.style.height = ht + 'px';
                cd = cd.children[0]
                if (cd && cd.className) {
                  if (cd.className.indexOf('auto-height') > -1)
                    cd.style.height = ht + 'px';
                }
              }
            }
          }, timeout)
        });
        window.addEventListener('resize', this.windowResizeListener);
        setTimeout(this.windowResizeListener, 1)
      },
    },
    mounted() {
      if (this.height) {
        return
      }
      this.bindHeightResizeEvents()
      setTimeout(() => {
        this.tiggerWindowResize()
      }, 1000)
    },
  }
</script>
