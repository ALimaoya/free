<template>
  <div class="detail">
    <div class="title">活动商品详情</div>
    <div class="content">
      <ul class="detailInfor">
        <!--<li>1、活动类型：{{ detailInfo.activity}}</li>-->
        <!--<li>2、商品来源：{{detailInfo.resource}}</li>-->
        <!--<li>3、活动标题：{{ detailInfo.title }}</li>-->
        <!--<li>4、试用品类型：{{ detailInfo.type}}</li>-->
        <!--<li>5、商品链接：{{ detailInfo.link}}</li>-->
        <!--<li>6、下单规格：{{ detailInfo.size }} </li>-->
        <!--<li class="keys">  件数：{{ detailInfo.number }}  </li>-->
        <!--<li class="keys">  金额：{{detailInfo.money }}  </li>-->
        <!--<li class="keys">  包邮：{{detailInfo.passway}}</li>-->
        <!--<li>7、找到推广宝贝的入口 </li>-->
        <!--<li class="keys">关键词：{{detailInfo.key}}</li>-->
        <!--<li class="keys">淘口令：{{ detailInfo.tao }}</li>-->
        <!--<li>8、上架时间：{{detailInfo.date }}</li>-->
        <li><span>试客活动编号：</span><span>{{ detailInfo.activityCode }}</span></li>
        <li><span>试客订单编号：</span><span>{{ detailInfo.orderCode}}</span></li>
        <li><span>商铺名称：</span><span>{{ detailInfo.shopName }}</span></li>
        <li><span>平台类型：</span><span>{{ platForm[detailInfo.platform] }}</span></li>
        <li><span>第三方单号：</span><span>{{ detailInfo.thirdOrderCode }}</span></li>
        <li><span>中奖时间：</span><span>{{ detailInfo.winTime }}</span></li>
        <li><span>开奖时间：</span><span>{{ detailInfo.receiveTime }}</span></li>
        <li><span>订单价格：</span><span>{{ detailInfo.amount }} 元</span></li>
        <li class="detailPic">
          <p>图片详情：</p>
          <div>
            <dl v-for="item in detailInfo.orderImageList">
              <dt>{{ imgType[item.type-1] }}</dt>
              <dd>
                <img @click="getImg(item.imageUrl)" :src="imgUrl + item.imageUrl" alt="" />
              </dd>
            </dl>
          </div>
        </li>
      </ul>
    </div>
    <div v-if="showImg" @click="close" class="mask">
      <img :src="bigImg" alt="" />
    </div>
  </div>
</template>

<script>
  import { orderDetail } from '@/api/activity'
    export default {
        name: "detail" ,
      data(){
          return  {
            detailInfo : {},
            platForm : ['','淘宝','天猫', '京东'],
            imgType : ['商品收藏截图','店铺收藏截图','订单截图','评价截图'] ,
            showImg : false ,
            bigImg : '' ,
            imgUrl : 'http://lgf8953.oss-cn-beijing.aliyuncs.com'
          }
      },
      mounted(){
        let order = this.$route.params.order ;
        console.log(order);
        orderDetail(order).then( res => {
          console.log(res);
          if(res.data.status === '000000000'){
            this.detailInfo = res.data.data
          }
        }).catch( err => {
          alert('服务器开小差啦，请稍等~')
        })
      },
      methods : {
        getImg(url){
          this.showImg = true ;
          this.bigImg = url ;
        },
        close(){
          this.showImg = false ;
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
      width : 80% ;
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
      span{
        display : inline-block;
        &:nth-child(1){
          width : 40% ;
          text-align: right ;

        }
        &:nth-child(2){
          width : 60% ;
          text-indent : 0.3rem ;
        }
      }
    }
    .detailPic{
      float : left;
      /*padding-top : 0.2rem ;*/
      width : 100% ;
      display : flex ;
      flex-direction: row;

      p{
        width : 40% ;
        height : 0.3rem ;
        line-height : 0.3rem ;
        text-align: right ;

      }
      div{
        flex : 1 ;
        display : flex ;
        margin-top : 0.3rem ;
        flex-wrap: wrap;
        height : auto ;
        dl{
          width : 46% ;
          font-weight : 100 ;
          &:nth-child(1){
            margin-right : 0.25rem ;

          }
          dt{
            width : 100% ;
            text-align : center;
            font-size : 0.16rem ;
            line-height : 0.4rem ;
            height : 0.4rem ;
          }
          dd{
            margin : 0.2rem auto;
            width : 100% ;
            height : 1.5rem ;

            img{
              width : 100% ;
              height : 100% ;
              border : 1px solid #D3D3D3;
              /*border-radius : 0.05rem ;*/
            }
          }
        }
      }
    }
    .mask{
      position : fixed ;
      top : 0;
      left : 0 ;
      width : 100% ;
      height : 100% ;
      background : #f1f1f1 ;
      opacity: 0.3;
      display : flex ;
      align-items: center;
      justify-content: center;
      z-index : 10000;
      img{

         max-height : 100% ;

      }
    }
  }
</style>
