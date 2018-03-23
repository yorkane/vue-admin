<template>
  <div class="kmoreWrap">
    <div :class="isExpand?'open':'close'">
      <slot></slot>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'KMore',
    data() {
      return {}
    },
    props: {
      direct: {
        type: String,
        required: false,
        default: 'height'
      },
      isExpand: {
        type: Boolean,
        required: false,
        default: false
      }
    },
    mounted() {
    },
  }
</script>
<style lang="scss">
  .kmoreWrap {
  }

  .kmoreWrap .open {
    transition:max-height 0.8s;
    max-height:200px;
    overflow: hidden;
  }

  .kmoreWrap .close {
    height: 0;
    max-height:3000px;
    overflow: hidden;
  }


</style>
