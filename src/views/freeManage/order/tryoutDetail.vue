<template>
  <div class="tryoutDetail"  v-loading="loading"  element-loading-text="拼命加载中">
    <div class="title">{{ activityTitle[detailInfo.activityType-1]}}订单详情</div>


    <div class="content">
      <ul class="detailInfor">
        <li><span>试客活动编号：</span><span>{{ detailInfo.activityCode }}</span></li>
        <li><span>试客订单编号：</span><span>{{ detailInfo.orderCode}}</span></li>
        <li><span>商铺名称：</span><span v-if="detailInfo.platform">{{ detailInfo.shopName }}</span><span v-else>暂无</span></li>
        <li><span>平台类型：</span><span v-if="detailInfo.platform">{{ platForm[detailInfo.platform] }}</span><span v-else>暂无</span></li>
        <li><span>第三方单号：</span><span v-if="detailInfo.thirdOrderCode">{{ detailInfo.thirdOrderCode }}</span><span v-else>暂无</span></li>
        <li><span>中奖时间：</span><span v-if="detailInfo.winTime">{{ detailInfo.winTime }}</span><span v-else>暂无</span></li>
        <li><span>开奖时间：</span><span v-if="detailInfo.receiveTime">{{ detailInfo.receiveTime }}</span><span v-else>暂无</span></li>
        <li><span>订单价格：</span><span v-if="detailInfo.amount">{{ detailInfo.amount }} 元</span><span v-else>暂无</span></li>
        <li><span>用户购买金额：</span><span v-if="detailInfo.buyAmount">{{ detailInfo.buyAmount }} 元</span><span v-else>暂无</span></li>
        <li class="faileReason" v-if="detailInfo.remarks"><span>订单失败原因：</span><span>{{ detailInfo.remarks }} </span></li>
        <li class="mainImg" >
          <span style="width:18.9%;float : left ;">宝贝主图:</span><span v-if="!detailInfo.mainImageUrl">暂无详情</span>
          <div v-else>
            <img v-if="detailInfo.mainImageUrl!==''" @click="getImg(detailInfo.mainImageUrl)" :src="imageDomain + detailInfo.mainImageUrl"  :onerror="errorImg"/>
            <img :src="failImg"  v-else>
          </div>
        </li>
        <li class="faileReason"><span>用户上传图片详情：</span><span v-if="detailInfo.orderImageList == 0" class="noImg">暂无图片</span></li>
        <li class="detailPic">
          <div v-if="detailInfo.orderImageList != 0">
            <dl v-for="item in detailInfo.orderImageList">
              <dt>{{ imgType[item.type-1] }}</dt>
              <dd>
                <img v-if="item.imageUrl !== ''" @click="getImg(item.imageUrl)" :src="imageDomain + item.imageUrl" :onerror="errorImg"/>
                <img :src="failImg"  v-else>
              </dd>
            </dl>
          </div>

        </li>
      </ul>
    </div>
    <div v-if="showImg" @click="close" class="mask">
      <img :src=" imageDomain + bigImg" />
    </div>
  </div>
</template>

<script>
  import { orderDetail } from '@/api/activity'
  import userPhoto from '@/assets/404_images/fail.png'

  export default {
        name: "tryoutDetail" ,
      data(){
          return  {
            detailInfo : {},
            activityTitle : ['超级试用','','拼团活动'],
            platForm : ['','淘宝','天猫', '京东'],
            imgType : ['商品收藏截图','店铺收藏截图','订单截图','评价截图','搜索截图'] ,
            showImg : false ,
            bigImg : '' ,
            imageDomain : process.env.IMAGE_DOMAIN ,
            loading : true ,
            errorImg:'this.src="' + userPhoto + '"',
            failImg: userPhoto,

          }
      },
      mounted(){
        let order = this.$route.params.order ;
        // console.log(order);

        orderDetail(order).then( res => {
          this.loading = false ;
          // console.log(res);
          this.detailInfo = res.data.data
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
  .tryoutDetail{
    width : 70% ;
    margin : 0.3rem  auto;
    padding : 0.3rem ;
    font-weight : bold ;
    color : #456;

    .title{
      width : 100% ;
      height : 0.8rem ;
      font-size : 0.24rem ;
      line-height : 0.8rem ;
      text-align : center ;
      color : #333 ;
    }
    .content{
      width : 100%;
      display : flex;
      flex-direction: row;
      justify-content: space-between;
    }
    .detailInfor{
      width : 100% ;
      float : left;

      .keys{
        padding-left : 0.3rem ;
        font-size : 0.14rem ;
      }
    }
    li{
      width : 50% ;
      line-height : 0.4rem ;
      /*height : 0.4rem ;*/
      font-size : 0.16rem ;
      float : left ;
      span{
        display : block;
        line-height : 0.4rem ;
        float : left ;
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
    .faileReason{
      width : 100% ;
      span:nth-child(1){
        width : 20% ;
        text-align: right ;

      }
      span:nth-child(2){
        width : 80% ;
        padding-left : 0.3rem ;
        box-sizing: border-box;
        text-indent : 0 ;

      }
    }
    .mainImg{
      width : 100% ;

      div{
        width : 100% ;
        float : left ;
        img{
          width : 15% ;
          margin-left : 23% ;
        }
      }
    }

    .detailPic{
      /*padding-top : 0.2rem ;*/
      width : 100% ;
      display : flex ;
      flex-direction: row;

      div{
        flex : 1 ;
        display : flex ;
        margin : 0.3rem 0 1rem ;
        flex-wrap: wrap;
        justify-content: space-between;
        height : 4rem ;
        dl{
          width : 45% ;
          font-weight : 100 ;
          /*margin-left : 0.52rem ;*/
          height : 3.5rem ;
          &:nth-child(n){
            margin-left : 0.7rem ;
          }
          &:nth-child(2n){
            margin-left : 0 ;
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
            width : 1.5rem ;
            height : 2.5rem ;
            display : flex ;
            /*justify-content: center;*/
            align-items: center;
            img{
              width : 100% ;
              max-height : 100% ;
              border : 1px solid #D3D3D3;
              /*border-radius : 0.05rem ;*/
            }
          }
        }
      }
      .noImg{
        margin : 0 ;
        /*font-size : 0.18rem ;*/
        height : 0.3rem ;
        line-height : 0.3rem ;
        padding-left : 2rem ;
      }
    }
    .mask{
      position : fixed ;
      top : 0;
      left : 0 ;
      width : 100% ;
      height : 100% ;
      background : rgba(250,250,250,0.3) ;
      display : flex ;
      align-items: center;
      justify-content: center;
      z-index : 20000;
      img{
         max-height : 100% ;

      }
    }
  }
</style>
