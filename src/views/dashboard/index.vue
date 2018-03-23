<template>
  <div class="dashboard-container">
    <h1 class='dashboard-text'>欢迎登录:{{name}}</h1>
  </div>
</template>

<script>
  import {getName} from  '../../utils/auth'
export default {
  name: 'dashboard',
  computed: {
    name(){
      return getName()
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
</style>
