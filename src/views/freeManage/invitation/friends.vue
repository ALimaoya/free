<template>
  <div class="friends">
    <img src="../../../assets/imgs/u1023.png" alt="" />
    <span>本次活动最终解释权归丫贝试客官方所有</span>
    <div class="center"><img src="../../../assets/imgs/u1024.png" alt="" /></div>
    <img src="../../../assets/imgs/u1025.png" alt="" />
    <div class="center"><img src="../../../assets/imgs/u1027.png" alt="" /></div>
    <span>邀请方式一</span>
    <p>复制您的专属链接，发给您的QQ、微信好友，好友通过您的邀请链接注册商家并成功开通VIP商家，即可获得邀请奖励</p>
    <div class="link">
      <div class="linkIpt"><span v-model="link">{{ link }}</span></div><el-button type="primary" @click="copy(link,$event)">复制链接</el-button>
    </div>
    <div class="center"><img src="../../../assets/imgs/u1032.png" alt="" /></div>
      <el-table :data="tableData" border height="0.3rem" style="width: 100%">
        <el-table-column prop="top" label="排名"></el-table-column>
        <el-table-column prop="ID" label="商家账号"></el-table-column>
        <el-table-column prop="number" label="邀请人数"></el-table-column>
        <el-table-column prop="money" label="累计奖励金额"></el-table-column>
      </el-table>
    <div class="center"><img src="../../../assets/imgs/u1120.png" alt="" /></div>
    <ul>
      <li>？：我邀请好友加入会员，奖励如何发放给我？</li>
      <li>答：根据活动规则，邀请会员获得的奖励，将会以可用金币的形式发放到您的试客巴帐户， 成功邀请好友开通VIP 商家后，可以联系在线客服咨询奖励具体发放时间。</li>
      <li>？：被邀请注册的商家需要开通会员吗？</li>
      <li>答：邀请的商家必须要加入商家会员，才可以获得奖励。</li>
      <li>？：是每次邀请成功都可以返现XXX元吗？</li>
      <li>答：是的，每成功邀请一个好友，就能获得XXX元奖励，邀请越多，获利越高。</li>
      <li>？：我忘记使用邀请链接了，但他确实是我邀请加入你们会员的，怎么办？</li>
      <li>答：如有特殊原因，请联系在线客服。</li>
    </ul>
  </div>
</template>

<script>
  import clip from '@/utils/clipboard' // use clipboard directly
  import ElButton from "element-ui/packages/button/src/button";

    export default {
      components: {
        ElButton
      },
      name: "friends" ,
      data(){
        return{
          tableData : [] ,
          link : 'http://rap2.taobao.org/repository/editor?id=3968&mod=8485&itf=24811'
        }
      },
      created(){

      },
      methods : {
        copy(text,event){
          clip(text, event)
          this.$message({
            message: '复制成功',
            type: 'success',
            duration: 1500 ,
            center : true
          });
          // console.log(text);
        },
      }
    }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .friends{
    width : 80% ;
    margin : 0 auto ;
    img{
      width : 100% ;
    }
    span{
      width : 100% ;
      text-align : center;
      font-size : 0.14rem ;
      display : inline-block;
    }
    .center{
      width : 100% ;
      margin : 0.3rem 0 ;
      img{
        width : 37% ;
        margin : 0 auto ;
        display : block ;
      }
    }
    p{
      width : 100% ;
      text-align : center;
      height : 0.4rem ;
      line-height : 0.4rem ;
    }
   .link{
     width : 100% ;
     display : flex ;
     flex-direction: row;
     justify-content: space-around;
     .linkIpt{
       width : 70% ;
       /*float : left ;*/
       margin :  0.2rem 0 0.2rem 0.5rem;
       span {
         width : 100% ;
         height : 0.4rem ;
         line-height : 0.4rem ;
         border-radius : 0.05rem ;
         display : block ;
         box-shadow: 0.01rem 0.001rem 0.1rem #8f949a  ;
         white-space: nowrap;
         overflow : hidden ;
         text-overflow :  ellipsis ;
       }
     }


     .el-button{
       margin-top : 0.2rem ;
       height : 0.4rem ;
     }
   }
    .el-table{
      border-color : #aaa ;
      border-radius : 0.05rem ;

    }
    ul{
      width : 100% ;
      display : flex ;
      flex-direction: column;
      justify-content: center;
      li{
        line-height : 0.3rem ;
        font-size : 0.14rem ;
        color : #333;
      }
    }
  }
</style>
