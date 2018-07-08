<template>
  <div class="source-goods">
    <h1 class="h_title">查询源宝贝</h1>
    <div class="tips">
      <p>查询您搬家的源宝贝，供您发货使用</p>
      <ul>
        <li>注意：</li>
        <li>1、确认输入丫贝商品编号，不是订单编号</li>
        <li>2、如果点击没反应，请确认弹出窗口有没有被浏览器拦截！</li>
      </ul>
    </div>
    <div class="getCode">
      <el-input type="textarea" :rows="4" v-model.trim="orderId" placeholder="请输入丫贝商家编号，每条一行，多条用换行分隔"></el-input>
    </div>
    <div class="btnWrap">
      <el-button type="danger" size="small" @click="getGoods()">查看源宝贝</el-button>
    </div>
  </div>
</template>

<script>
    export default {
      name: "source-goods",
      data(){
          return{
            orderId: '',
            orderArr : []
          }
      },
      methods:{
        getGoods(){
          this.orderArr = this.orderId.split('\n');
          // console.log(this.orderArr);
          if(this.orderArr.length>0&&this.orderArr.indexOf('')=== -1 ){
            this.$router.push({ path: '/merchantCenter/tool/list',query: {type: "2"}})

          }else{
            this.$message({
              center : true ,
              type : 'error' ,
              message : '请输入丫贝商家编号'
            })
          }

        }
      }
    }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .tips{
    margin : 0.5rem auto;
    width : 80% ;
    p{
      font-size : 0.26rem;
      color : #aaa ;
      line-height : 0.4rem ;
      margin : 0.5rem 0;

    }
    ul{
      color : #333 ;
      font-size: 0.14rem ;
      line-height : 0.3rem ;
    }
  }
  .getCode,.btnWrap{
    width : 80% ;
    margin : 0.2rem auto ;

  }

</style>
