<template>
    <div class="buyVip">
      <div class="title">
        <p>商家开通VIP</p>
        <span class="tips">充值到账可能会有延时，若<b>30分钟</b>内未到账请联系在线客服</span>
        <div class="vipInfo"><span>账号：</span><b>{{ userTel }}</b><span>，当前为</span><strong></strong><b>{{ userType }}</b><span>，会员有效期已过</span></div>
      </div>
      <div class="step1">
        <p class="choiceDate">1.选择开通会员的时长</p>
        <ul class="payTime" @click.capture="chooseVip">
          <li class="timeImg" :class="target=='1'?'active':''" data-index="1"><img src="../../assets/imgs/1y.png" alt="" /><span class="target" v-show="target=='1'"></span></li>
          <li class="timeImg" :class="target=='2'?'active':''" data-index="2"><img src="../../assets/imgs/2y.png" alt="" /><span class="percent1"></span><span class="target" v-show="target=='2'"></span></li>
          <li class="timeImg" :class="target=='3'?'active':''" data-index="3"><img src="../../assets/imgs/3y.png" alt="" /><span class="king"></span><span class="percent2"></span><span class="target" v-show="target=='3'"></span></li>
        </ul>
        <div class="choose" v-if="target!== ''">
          <p>您已选择购买会员<span>{{ choose.time }}</span>个月，有效期至：<span>{{ choose.date }}</span></p>
          <p>支付金额：<span>{{ choose.money }}</span>元</p>
        </div>
      </div>
      <div class="step2">
        <p class="payType">2.请选择支付方式</p>
        <ul>
          <el-radio-group v-model="radio">
            <li><el-radio :label="1"><img src="../../assets/imgs/pay1.png" alt="" /><p>押金支付（可用押金：<span></span>元）</p></el-radio></li>
            <li><el-radio :label="2"><img src="../../assets/imgs/pay2.png" alt="" /><p>微信支付</p></el-radio></li>
            <li><el-radio :label="3"><img src="../../assets/imgs/pay3.png" alt="" /><p>支付宝支付</p></el-radio></li>
            <li><el-radio :label="4"><img src="../../assets/imgs/pay4.png" alt="" /><p>银行支付</p></el-radio></li>
          </el-radio-group>
          <span class="total">支付：<b>{{ choose.money }}</b>元</span>
        </ul>
      </div>
      <div class="submitOrder">
        <el-button type="primary">确定</el-button>
        <el-button type="info">取消</el-button>
      </div>
    </div>
</template>

<script>
  import { parseTime, DateAdd } from '@/utils/index'
  export default {
    name: "buy-vip",
    data(){
      return{
        userTel : '1111',
        userType : '普通商家',
        target : '',
        radio:'',
        choose :{
          time : '',
          date : '',
          money : ''
        },
        vipTime : [
          {
            time : '12',
            date : '',
            money : '3988'
          },
          {
            time : '24',
            date : '',
            money : '7199'
          },
          {
            time : '36',
            date : '',
            money : '9572'
          }
        ],

      }
    },
    methods : {
      chooseVip(){
        var targets = document.getElementsByClassName('payTime')[0];
        var target = targets.getElementsByTagName('li');
        var nowDate = new Date();

        for(let i of target){
          i.onclick = ()=>{
            const index = i.dataset.index ;
            this.target = index ;
            var now = new Date() ;
            var newDate = DateAdd("y ",index*1,now) ;
            console.log(newDate);
            this.choose.time = this.vipTime[index-1].time ;
            this.choose.date =  parseTime(newDate,'{y}-{m}-{d}');
            this.choose.money = this.vipTime[index-1].money ;


          }
        }


      }
    }
    }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .buyVip{
    padding : 0.4rem 0.5rem ;
    .title{
      width : 95% ;
      padding : 0.15rem 0 ;
      height : 0.6rem ;
      margin : 0 auto ;
      box-sizing: border-box;
      border-bottom : 1px solid #d3d3d3 ;
      p{
        font-size : 0.2rem ;
        color : #b9271a ;
        margin-right : 0.1rem ;
        float : left ;
        height : 0.3rem ;
        line-height : 0.3rem ;
        font-weight : bold ;
      }
      .tips,.vipInfo{
        font-size : 0.14rem ;
        color : #666 ;
        float : left ;
        line-height : 0.3rem ;
      }
      .tips{
        margin-right : 0.6rem ;
        b{
          color : #ff0000;
          font-weight : 100 ;
        }

      }
      .vipInfo{
        float : left;
        span{
          float : left ;
        }

        b{
          color : #ff0000;
          float : left ;
          font-weight : 100 ;

        }
        strong{
          width : 0.2rem ;
          height : 0.2rem ;
          display : block ;
          float : left ;
          margin-top : 0.05rem ;
          background : url('../../assets/imgs/Vip5.png') no-repeat center ;
          background-size : 90% ;
        }
      }
    }
    .step1,.step2{
      width : 80% ;
      margin : 0.4rem auto;
    }
    .payTime{
      width : 100% ;
      height : 1.4rem ;
      display : flex ;
      flex-direction: row;
      justify-content: space-around;
      margin : 0.2rem auto ;
      .active{
        border : 1px solid #f18531;
      }
      li{
        width : 30% ;
        height : 100% ;
        border : 1px solid #D3D3D3;
        position : relative ;
        padding : 0.27rem;
        box-sizing: border-box;

        img{
          width : 100% ;
          height : 100% ;

        }
        .king{
          width : 9% ;
          height : 17% ;
          background : url('../../assets/imgs/king.png') no-repeat center;
          background-size : 100% ;
          position : absolute ;
          top : -0.12rem ;
          left : -0.12rem ;
          z-index : 1000 ;
        }
        .percent1,.percent2{
          width : 22% ;
          height : 40% ;
          display : block ;
          position : absolute ;
          top : 0;
          left : 0;

        }
        .percent1{
          background : url('../../assets/imgs/nine.png') no-repeat left top;
          background-size : 90% ;
        }
        .percent2{
          background : url('../../assets/imgs/eight.png') no-repeat left top;
          background-size : 90% ;
        }
        .target{
          width : 13% ;
          height : 30% ;
          position : absolute ;
          bottom : 0;
          right : 0;
          background : url('../../assets/imgs/right.png') no-repeat right bottom ;
          display : block ;
          background-size : 95% ;

        }
      }
    }
    .choiceDate,.payType{
      width : 100% ;
      font-size : 0.18rem ;
      color : #66686b ;
      line-height : 0.3rem ;
      height : 0.3rem ;
      font-weight : bold ;
    }
    .choose{
      width : 100% ;
      height : 0.5rem ;
      padding : 0 0.3rem ;
      box-sizing: border-box;
      line-height : 0.5rem ;
      font-size : 0.17rem ;
      color : #666;
      background : #f5f4f9;
      p:nth-child(1){
        width : 60% ;
        float : left ;
      }
      p:nth-child(2){
        float : right ;
        margin-right : 0.2rem ;
      }
      span{
        color : #ea5a4c ;
        font-size : 0.18rem ;
      }
    }
    .step2{
      ul{
        width : 100% ;
        height : auto ;
        margin-top : 0.2rem;
        background : #f5f4f9 ;
        padding : 0 0.1rem ;
        box-sizing: border-box;
        position : relative ;
        .el-radio-group{
          width : 100% ;
        }
        li{
          width : 100% ;
          height : 0.6rem ;
          line-height : 0.6rem ;
          float : left ;
          padding-left : 0.2rem ;
          border-bottom : 1px solid #aaa ;
          &:nth-child(4){
            border-bottom : none;
          }
          img,p{
            float : left ;
          }
          p{
            /*display : block ;*/
            line-height : 0.3rem ;
            height : 100% ;
          }
          img{
            width : 0.3rem ;
            height : 0.3rem ;
            margin : 0 0.2rem ;
          }
        }
        .el-radio{
          width : 100% ;
          height : 100% ;
          display : flex ;
          flex-direction: row;
          align-items: center;

        }
        .total{
          position : absolute ;
          bottom : 0.1rem ;
          right : 0.2rem ;
          font-size : 0.14rem ;
          b{
            color : #fd4200 ;
          }
        }
      }
    }
    .submitOrder{
      width : 25% ;
      margin : 0 auto ;
      display : flex ;
      flex-direction: row;
      justify-content: center;
    }
  }
</style>
