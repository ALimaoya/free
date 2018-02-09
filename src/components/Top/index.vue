<template>
  <div class="top">
    <img src="../../assets/imgs/ic_launcher.png"  alt="" />
    <h1>商家中心</h1>
  </div>
</template>

<script>
    export default {
        name: "top"
    }
</script>

<style lang="scss" scoped rel="stylesheet/scss" >
  .top{
    width : 100% ;
    box-sizing: border-box;
    /*min-width : 12rem ;*/
    margin : 0.2rem auto ;
    font-size : 0.15rem ;
    height : 1.4rem ;
    border-radius : 0.05rem ;
    border : 1px solid #aaa ;
    img,h1{
      float : left;
    }
    img{
      width : 0.8rem ;
      height : 0.8rem ;
      margin : 0.3rem ;
    }
    h1{
      line-height : 1.4rem ;
    }
  }

</style>

