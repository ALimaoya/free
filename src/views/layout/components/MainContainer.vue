<template>
  <div class="mainContainer" >
      <router-view ></router-view>

  </div>
</template>

<script>
  export default {
    name: "main-container",

    }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .mainContainer{
    width : 100% ;
    height : 100% ;
    flex : 1 ;
  }

</style>
