<template>
    <div class="merchantCenterHome">
      <div class="mainInfo">
        <div class="userInfo" @click="goShopInfo">
          <div v-if="shopObj.ybMerchantShopDto!== undefined">
            <img v-if="shopObj.ybMerchantShopDto.logoImage !== undefined || shopObj.ybMerchantShopDto.logoImage !== ''" :src="imageDomain + shopObj.ybMerchantShopDto.logoImage" :onerror="errorImg">
            <img :src="failImg"  v-else>

            <dl><dd>{{ shopObj.ybMerchantShopDto.name }}</dd><dt>主营类目：{{ mainType }}</dt></dl></div>
          <ul>
            <li><span>描述相符</span><span class="tips_warn">5.0</span></li>
            <li><span>服务态度</span><span class="tips_warn">5.0</span></li>
            <li><span>物流服务</span><span class="tips_warn">5.0</span></li>
          </ul>
        </div>
        <ul class="flowDetail" >
          <li @click="goTransition"><span><img src="../../assets/imgs/home1.png" alt="" /></span><span>今日成交金额</span><span class="tips_warn">{{ shopObj.todayTurnover}}元</span></li>
          <li @click="goTransition"><span><img src="../../assets/imgs/home2.png" alt="" /></span><span>近20天出货量</span><span class="tips_warn">{{ shopObj.deliverNum}}单</span></li>
          <li @click="goTransition"><span><img src="../../assets/imgs/home3.png" alt="" /></span><span>近20天成交金额</span><span class="tips_warn">{{ shopObj.turnover}}元</span></li>
          <!--<li><span><img src="../../assets/imgs/home4.png" alt="" /></span><span>今日访客数</span><span class="tips_warn">1312321</span></li>-->
          <!--<li><span><img src="../../assets/imgs/home5.png" alt="" /></span><span>今日浏览量</span><span class="tips_warn">423422</span></li>-->
          <!--<li></li>-->
        </ul>
      </div>
      <div class="manage_wrap">
        <div class="manage">
          <p class="title">宝贝管理</p>
          <ul>
            <li @click="goGoodsList"><span>出售中的宝贝</span><span>{{ shopObj.inTheSaleProductNum }}件</span></li>
            <li @click="goGoodsList"><span>待上架的宝贝</span><span>{{ shopObj.notForSaleProductNum }}件</span></li>
          </ul>
        </div>
        <div class="manage">
          <p class="title">订单提醒</p>
          <ul>
            <li @click="goTransition"><span>待付款</span><span>{{ shopObj.pendingPaymentOrderNum }}单</span></li>
            <li @click="goTransition"><span>待发货</span><span>{{ shopObj.toBeDeliveredOrderNum }}单</span></li>
            <li @click="goTransition"><span>待评价</span><span>{{ shopObj.toBeEvaluatedOrderNum }}单</span></li>
            <li @click="goRefund('0')"><span>退款/待处理</span><span>{{ shopObj.pendingReturnOrderNum }}单</span></li>
            <li @click="goRefund('1')"><span>退款/已处理</span><span>{{ shopObj.returnOrderNum }}单</span></li>
          </ul>
        </div>
      </div>
      <div class="flowInfo">
        <p class="title">近期数据</p>
        <div class="dataChange"><button :class="{active: changeBtn === '1'}" @click="getType('1')">近7天数据</button><button :class="{active: changeBtn === '2' }" @click="getType('2')">近30天数据</button>
        <el-select size="mini" v-model="chartsType" @change="changeType(chartsType)">
          <el-option
            v-for="item in chartsOptions"
            :key="item.value"
            :label="item.name"
            :value="item.value">
          </el-option>
        </el-select>
        </div>
        <div id="myChart" ></div>
      </div>
      <div class="mask" v-if="shopPass==='4'">
        <div class="boxWrap">
          <div class="success_icon"></div>
          <div class="box_content">
            <p class="box_title">恭喜您的店铺申请通过审核</p>
            <p class="tips_warn">吧啦啦啦啦</p>
            <p class="box_note">您可在商户中心 - 商家/店铺信息 内查看您的店铺信息</p>
            <div class="box_footer">
              <el-button type="danger" @click="goShopInfo">立即查看</el-button>
              <div class="box_close" @click="closeMask">关闭此页面</div>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
  import echarts from 'echarts'
  import { getShopInfo, getSaleNum,getApprovedStatus } from "@/api/userCenter"
  import userPhoto from '@/assets/404_images/fail.png'
  import { firstList } from "@/api/merchant"
  export default {
        name: "merchantCenter-home",
        data() {
            return {
              dateArr: [],
              chartData : [],
              chartsType: 1,
              changeBtn: '1',
              chartsOptions: [
                {
                  value: 1,
                  name : '销售额'
                },
                {
                  value : 2,
                  name : '销售量'
                }
              ],
              yLabel: ['金额','件数'],
              shopPass: '0',
              shopObj: {},
              imageDomain : process.env.IMAGE_DOMAIN ,
              errorImg:'this.src="' + userPhoto + '"',
              failImg: userPhoto,
              mainType : ''
            }
        },
        mounted() {
          this.getShopStatus();
        },
        beforeDestroy() {
          if (!this.chart) {
            return
          }
          this.chart.dispose();
          this.chart = null
        },

        methods: {
          //获取店铺审核状态
          getShopStatus(){
            getApprovedStatus().then( res => {
              if(res.data.status === '000000000'){
                this.shopPass = res.data.data.status ;
                if(this.shopPass !== '2'&&this.shopPass !== '4'){
                  let message = '';
                  if(this.shopPass === '0'){
                    message = '您还未入驻商城，请前往入驻';
                  }else if(this.shopPass === '1'){
                    message = '您提交的入驻申请正在审核中，审核通过后即可试用特卖商城相关功能'
                  }else if(this.shopPass === '3'){
                    message = '您提交的入驻申请已被拒绝，请前往查看具体原因'
                  }
                  this.$message({
                    message : message,
                    center : true ,
                    type : 'error',
                    duration : 1500
                  });
                  setTimeout(() => {
                    if(this.shopPass ==='1'){
                      this.$router.push('/accountManage/admission/admissionShop/successAdd')

                    }else if( this.shopPass === '3'){
                      this.$router.push('/accountManage/admission/admissionShop/failAdd');
                    }else if( this.shopPass === '0'){
                      this.$router.push('/accountManage/admission/admissionShop/index')

                    }

                  },2000)
                }else{
                  getShopInfo().then( res => {
                    if(res.data.status === '000000000'){
                      this.shopObj = res.data.data ;
                      this.getMainType();
                      this.getType('1');

                    }
                  });

                }
              }
            });

          },
          getMainType(){
            firstList().then(res=> {
              res.data.data.map( i => {
                if(i.id == this.shopObj.ybMerchantShopDto.mainBusiness ){
                  this.mainType = i.name
                }
              });
            })
          },
          getType(type){

            this.changeBtn = type ;
            this.changeType(this.chartsType);

          },
          changeType(type){
            getSaleNum(type).then( res => {
              let dataList = [];

              if(res.data.status === '000000000'){

                dataList = res.data.data ;
                dataList.map(i => {
                  this.chartData.unshift(i);
                });
                let arr = [];
                for(let i = 1 ; i<= 30 ;i++){
                  let num = this.getDate(i);
                  arr.unshift(num);
                }
                let subDateArr = arr.slice(23,30);
                if(this.changeBtn ==='1'){
                  this.dateArr = subDateArr ;
                  this.chartData = this.chartData.slice(23)
                }else if(this.changeBtn === '2'){
                  this.dateArr = arr ;
                }
                this.initChart(this.chartData,this.yLabel[type-1]);
              }
            });

          },
          getDate(index){
            let now = new Date();
            let date = new Date(now.getTime() - index * 24 * 3600 * 1000);
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let day = date.getDate();
            return month+ '/'+ day;
          },
          initChart(value,type){

            this.chart = echarts.init(document.getElementById('myChart'));
            this.chart.setOption({
              // backgroundColor: '#394056',
              // title: {
              //   top: 20,
              //   text: 'Requests',
              //   textStyle: {
              //     fontWeight: 'normal',
              //     fontSize: 16,
              //     color: '#F1F1F3'
              //   },
              //   left: '1%'
              // },
              tooltip: {
                trigger: 'axis',
                axisPointer: {
                  lineStyle: {
                    color: '#57617B'
                  }
                }
              },
              xAxis: [{
                type : 'category',
                name: '日期',
                // boundaryGap: false,
                data: this.dateArr
              }],
              yAxis: [{
                type : 'value',
                name: type,
                axisTick: {
                  show: false
                },
                axisLine: {
                  lineStyle: {
                    color: '#57617B'
                  }
                },
              }],
              series: [
                {
                  type : 'line',
                  data : value,
                  itemStyle: {
                    normal: {
                      color: '#3888fa',
                      lineStyle: {
                        color: '#57617B',
                        width: 2
                      },
                      areaStyle: {
                        color: '#f3f8ff'
                      }
                    }
                  },
                },

              ]
            })
          },
          closeMask(){
            this.shopPass = '0';
          },
          goShopInfo(){
            this.$router.push('/merchantCenter/userCenter/shopInfo')
          },
          goTransition(){
            this.$router.push('/merchantCenter/transaction/search');
          },
          goRefund(type){
            this.$router.push('/merchantCenter/transaction/refund?type='+ type);
          },
          goGoodsList(){
            this.$router.push('/merchantCenter/goods/goodsList');
          }
        }
    }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .merchantCenterHome{
    width : 95% ;
    margin : 0.5rem auto ;
    .mainInfo{
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      border: 1px solid #dcdfe6;
      border-bottom: 0;

      .userInfo{
        width: 35% ;
        display: flex;
        flex-direction: column;
        background : #eee ;
        padding : 0.2rem ;
        box-sizing: border-box;
        border-bottom: 1px solid #dcdfe6;

        div{
          /*display: flex;*/
          /*flex-direction: row;*/
          img{
            width : 30% ;
            border-radius: 50% ;
            padding : 0.1rem ;
          }
          dl{
            /*flex :1 ;*/
            width : 70% ;
            float: right ;
            dd{
              font-size : 0.26rem ;
              font-weight : bold ;
              line-height: 0.8rem ;
              color : #333 ;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            dt{
              font-size : 0.2rem ;
              color : #999 ;
              line-height : 0.3rem ;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }
        }
        ul{
          margin-top: 0.3rem ;
          border-top: 1px solid #dcdfe6;
          padding-top: 0.2rem ;
          display: flex;
          flex-direction: row;
          flex-wrap: nowrap;
          justify-content: space-around;
          li{
            display: flex;
            flex-direction: column;
            width : 30% ;

            span:nth-child(1){
              border : 1px solid #363636;
              border-radius : 0.05rem ;
              text-align: center ;
              font-size : 0.14rem ;
              color : #363636;
              height : 0.4rem ;
              line-height : 0.4rem ;

            }
            span:nth-child(2){
              height : 0.6rem ;
              line-height : 0.6rem ;
              text-align: center ;
              font-size : 0.2rem ;

            }

          }
        }
      }
      .flowDetail{
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-around;
        flex: 1 ;
        li{
          width: 33.33% ;
          /*height : 1.75rem ;*/
          display: flex;
          flex-direction: column;
          border-left: 1px solid #dcdfe6;
          border-bottom: 1px solid #dcdfe6;
          padding : 0.15rem ;

          span{
            display: flex;
            width: 100%;
            font-size : 0.26rem ;
            color : #333 ;
            line-height : 2 ;
            text-align: center ;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }
          span:nth-child(1){
            height : 40% ;
            align-items: center;
            img{
              width : 15% ;
              margin : auto ;
              display: block;


            }
          }
        }
      }
    }
    .manage_wrap{
      display: flex;
      flex-wrap: nowrap;
      flex-direction: row;
      .manage{
        display: flex;
        flex-direction: column;
        color : #333 ;

        ul{
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          li{
            width : 47% ;
            height : 1.5rem ;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background : #b3d8ff;
            span{
              display: inline-block;
              line-height: 2 ;
              font-size : 0.22rem ;

            }
          }
        }
      }
      .manage:nth-child(1){
        width: 28% ;
        margin-right : 0.4rem ;

      }
      .manage:nth-child(2){
        flex: 1 ;
        li{
          width : 19% ;
        }
      }
    }
    .title{
      font-size: 0.26rem ;
      height: 0.4rem ;
      line-height: 0.4rem ;
      text-indent: 0.15rem ;
      border-left : 0.07rem solid #ff0011;
      margin : 0.1rem 0 ;
      box-sizing: border-box;
    }
    .flowInfo{
      .dataChange{
        button{
          background : 0;
          width : 1.4rem ;
          height : 0.5rem ;
          line-height : 0.5rem ;
          font-size : 0.2rem ;
          color : #666 ;
          border : 2px solid #b3d8ff ;
        }
        button:nth-child(1){
          border-right : 0;
        }
        .active{
          color : #f56c6c ;
          border-bottom: 0!important ;
        }
        .el-select{
          float : right ;
          width : 1.6rem ;
        }
      }
      #myChart{
        width : 100% ;
        height: 6rem ;
      }
    }
    .mask{
      position: absolute ;
      top: 0 ;
      left : 170px;
      width: 100% ;
      height: 100% ;
      background : rgba(0,0,0,0.3);
      z-index: 20000;
      .boxWrap{
        width:60% ;
        height : 40%;
        margin : 1.5rem auto;
        background : #fff;
        position: relative ;
        padding :1rem 0.4rem;
        .success_icon{
          width : 1.3rem ;
          height : 1.3rem ;
          background : url('../../assets/imgs/success.png') no-repeat center #fff ;
          background-size : 70% ;
          position : absolute ;
          left : 0;
          right : 0;
          top: -0.65rem ;
          margin : auto ;
          border-radius: 50%;
        }
        .box_content{
          margin : auto;
          width : 80% ;
          p{
            text-align: center ;
            font-size : 0.24rem ;
            line-height : 0.8rem ;

          }
          .box_title{
            font-size : 0.3rem!important ;
            font-weight : bold ;
            line-height : 0.8rem;
            color : #333 ;
          }
          .box_note,.box_close{
            color : #999;
          }
          .box_footer{
            width : 60% ;
            margin : 0.3rem auto ;
            display: flex ;
            flex-direction: row;
            justify-content: space-around;
            align-items: center;
            .el-button{
              margin-right : 0.3rem ;
            }
            /*.box_close{*/
              /**/
            /*}*/
          }
        }
      }
    }
  }

</style>
