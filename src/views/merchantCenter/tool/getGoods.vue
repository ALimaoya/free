<template>
  <div class="getGoods">
    <h1 class="h_title">一键抓取商品</h1>
    <div class="key">
      <p>注意事项：目前仅能抓取淘宝/天猫、京东、拼多多、1688等平台的商品，其他平台正在陆续开放，如有需要，可联系专属运营客服反馈</p>
      <el-input  type="textarea" :rows="5" v-model.trim="url" placeholder="请输入需要复制的对应平台的宝贝链接，每条一行，多条用换行分隔！
      示例：
      https://detail.tmall.com/item.htm?id=XXXXXXXXXXXX
      https://detail.tmall.com/item.htm?id=XXXXXXXXXXXXXXX"></el-input>
      <el-button size="small" type="danger" @click="getGoods(url)">一键抓取</el-button>
    </div>
  </div>
</template>

<script>
  import {  httpString } from '@/utils/validate'

  export default {
        name: "get-goods",
      data(){
          return{
            url: '',
            urlArr : []
          }
      },
      methods : {
        getGoods(url){
          this.urlArr = httpString(url);
          console.log(this.urlArr);

          if(this.urlArr !== null ){
            this.$router.push({ path: '/merchantCenter/tool/list',query: { type: "1" } })
          }else{
            this.$message({
              center : true ,
              type : 'error' ,
              message : '请输入商品链接'
            })
          }
        }
      }
    }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .key{
    margin: 0.5rem auto ;
    width : 80% ;
    p{
      font-size : 0.22rem ;
      color : #CC9900 ;
      line-height : 0.4rem ;
      margin-bottom : 0.5rem ;

    }
    .el-button{
      margin-top : 0.5rem ;
    }
  }
</style>
