<template>
    <div class="home">
      <ul class="intro">
        <li><img src="" /></li>
        <li><img src="" /></li>
        <li><img src="" /></li>
        <li><img src="" /></li>
        <li><img src="" /></li>

      </ul>
    </div>
</template>

<script>
    export default {
        name: "home"
    }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .home{
    width : 100% ;

    .intro{
      display: flex;
      flex-direction: column;
      width : 100% ;
      img{
        width : 100% ;

      }
    }
  }
</style>
