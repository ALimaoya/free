<template>
  <div class="detail">
    <div class="title">活动商品详情</div>
    <div class="content">
      <ul class="detailInfor">
        <li>1、活动类型：{{ detailInfo.activity}}</li>
        <li>2、商品来源：{{detailInfo.resource}}</li>
        <li>3、活动标题：{{ detailInfo.title }}</li>
        <li>4、试用品类型：{{ detailInfo.type}}</li>
        <li>5、商品链接：{{ detailInfo.link}}</li>
        <li>6、下单规格：{{ detailInfo.size }} </li>
        <li class="keys">  件数：{{ detailInfo.number }}  </li>
        <li class="keys">  金额：{{detailInfo.money }}  </li>
        <li class="keys">  包邮：{{detailInfo.passway}}</li>
        <li>7、找到推广宝贝的入口 </li>
        <li class="keys">关键词：{{detailInfo.key}}</li>
        <li class="keys">淘口令：{{ detailInfo.tao }}</li>
        <li>8、上架时间：{{detailInfo.date }}</li>
      </ul>
      <div class="detailPic">
        <dl>
          <dt>试用品图例</dt>
          <dd><img src="../../assets/imgs/default0.png" alt="" /></dd>
        </dl>
        <dl>
          <dt>商品主图</dt>
          <dd><img src="../../assets/imgs/default0.png" alt="" /></dd>
        </dl>
        <ul>
          <li>试用品份数：{{detailInfo.piece }}</li>
          <li>每日最多申请人数：{{detailInfo.peaple}}</li>
          <li>日均投放量{{ detailInfo.amount}}单</li>
        </ul>
      </div>
    </div>

  </div>
</template>

<script>
    export default {
        name: "detail" ,
      data(){
          return  {
            detailInfo : {
              activity : '',
              resource : '',
              title : '',
              type : '',
              link :'',
              size : '',
              number : '',
              money : '',
              passway : '',
              key : '',
              tao : '',
              date : '',
              piece : '',
              people : '',
              amount : ''

            }

          }
      }
    }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .detail{
    width : 70% ;
    margin : 0.3rem  auto;
    padding : 0.3rem ;
    font-weight : bold ;

    .title{
      width : 100% ;
      height : 0.8rem ;
      font-size : 0.24rem ;
      line-height : 0.8rem ;
      text-align : center ;
    }
    .content{
      width : 100%;
      display : flex;
      flex-direction: row;
      justify-content: space-between;
    }
    .detailInfor{
      width : 44% ;
      float : left;

      .keys{
        padding-left : 0.3rem ;
        font-size : 0.14rem ;
      }
    }
    li{
      width : 100% ;
      line-height : 0.4rem ;
      height : 0.4rem ;
      font-size : 0.16rem ;
      float : left ;
    }
    .detailPic{
      float : left;
      padding-top : 0.2rem ;
      width : 66% ;
      dl{
        float : left;
        width : 46% ;
        &:nth-child(1){
          margin-right : 0.25rem ;

        }
        dt{
          width : 100% ;
          text-align : center;
          font-size : 0.18rem ;
          line-height : 0.4rem ;
          height : 0.4rem ;
        }
        dd{
          margin : 0;
          img{
            width : 100% ;

          }
        }
      }
    }
  }
</style>
