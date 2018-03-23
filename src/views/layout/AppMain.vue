<template>
  <auto-height-wrapper>
    <section class="app-main" v-show="$router.currentRoute.name !== 'iframe'">
      <transition name="fade" mode="out-in">
        <router-view :key="key"></router-view>
      </transition>
    </section>
  </auto-height-wrapper>
</template>

<script>
  import AutoHeightWrapper from "@/components/AutoHeightWrapper.vue";

  export default {
    components: {AutoHeightWrapper},
    name: 'AppMain',
    computed: {
      key() {
        return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
      }
    },
  }
</script>
