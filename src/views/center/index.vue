<template>
    <div class="container">
      <ul class="user">
        <li>
          <img class="photo" src="../../assets/imgs/logo.png" alt=""/>
          <p>
            <span>您好，{{userInfo.name}}</span>
            <span>会员等级：{{ userInfo.vipLevel }}
              <img src="../../assets/imgs/VIP.png" alt="" />
            </span>
            <span>会员到期时间：{{ userInfo.vip_time}}</span>
            <el-button @click="vipPlus" type="primary" size="small" style="width:1rem">续费会员</el-button>
          </p>
        </li>
        <li>
          <div class="title">
            <span>您的专属客服：</span>
            <img :src="attendant.avator" alt="" />
          </div>
          <div class="service">
            <dl>
              <dd>
                <img  src="../../assets/imgs/qq.png" alt=""/>
              </dd>
              <dt>{{ attendant.qq }}</dt>
            </dl>
            <dl>
              <dd>
                <img  src="../../assets/imgs/weixin.png" alt=""/>
              </dd>
              <dt>{{ attendant.wechat}}</dt>
            </dl>
          </div>

        </li>
      </ul>
      <div class="money">
        <ul class="gold">
          <li class="useful"><span>可用押金</span><i></i></li>
          <li class="cash">{{ wallet.deposit }}元
            <el-button size="small" class="btn" @click="recharge(2)">提现</el-button>
            <el-button size="small" class="btn" @click="recharge(1)">充值</el-button>
          </li>
          <li><strong>冻结押金<i></i>:</strong><span>{{ wallet.freeze_deposit}}元</span></li>
        </ul>
        <ul class="gold">
          <li class="useful"><span>可用金币</span><i></i></li>
          <li class="cash">{{ wallet.gold }}元</li>
          <!--<li><el-button size="small" class="btn" @click="recharge(3)">充值</el-button></li>-->
        </ul>
        <!--<ul class="detail">-->
          <!--<span>资金明细：</span>-->
          <!--<li v-for="(item, index) in detail"><b></b>{{item.name}}<b  @click="look(index)"></b>-->
              <!--<div class="history" @click="first(index)" v-show="item.visible==true">-->
                  <!--<div class="tablebox">-->
                    <!--<img class="close" src="../../assets/imgs/close.png" @click="close(index)" alt="" />-->
                      <!--&lt;!&ndash;<el-col :span="4" v-for="" label="时间" ></el-col>&ndash;&gt;-->
                      <!--&lt;!&ndash;<el-col span="4" v-for="" label="类型" prop="type"></el-col>&ndash;&gt;-->
                    <!--&lt;!&ndash;<el-col span="4" v-for="" label="提现金额" prop="type"></el-col>&ndash;&gt;-->
                    <!--&lt;!&ndash;<el-col span="4" v-for="" label="手续费" prop="type"></el-col>&ndash;&gt;-->
                    <!--&lt;!&ndash;<el-col span="4" v-for="" label="收入/支出" prop="create_time"></el-col>&ndash;&gt;-->
                    <!--&lt;!&ndash;<el-col span="4" v-for="" label="结余" prop="create_time"></el-col>&ndash;&gt;-->
                    <!--&lt;!&ndash;<el-col span="4" v-for="" label="到账金额" prop="type"></el-col>&ndash;&gt;-->
                    <!--<span  @click="toAll" class="toAll">查看全部记录&lt</span>-->
                    <!--<span class="tips">请各位商家及时保存资金信息方便后期对账。</span>-->
                  <!--</div>-->
                <!--&lt;!&ndash;<el-popover&ndash;&gt;-->
                <!--&lt;!&ndash;ref="popover${index}"&ndash;&gt;-->
                <!--&lt;!&ndash;placement="right"&ndash;&gt;-->
                <!--&lt;!&ndash;width="400"&ndash;&gt;-->
                <!--&lt;!&ndash;trigger="click">&ndash;&gt;-->


                <!--&lt;!&ndash;<el-table  :data="tableData" stripe>&ndash;&gt;-->

                  <!--&lt;!&ndash;&lt;!&ndash;<el-table-column&ndash;&gt;&ndash;&gt;-->
                  <!--&lt;!&ndash;&lt;!&ndash;prop="create_time"&ndash;&gt;&ndash;&gt;-->
                  <!--&lt;!&ndash;&lt;!&ndash;label="时间"&ndash;&gt;&ndash;&gt;-->
                  <!--&lt;!&ndash;&lt;!&ndash;width="180">&ndash;&gt;&ndash;&gt;-->
                  <!--&lt;!&ndash;&lt;!&ndash;</el-table-column>&ndash;&gt;&ndash;&gt;-->
                  <!--&lt;!&ndash;&lt;!&ndash;<el-table-column&ndash;&gt;&ndash;&gt;-->
                  <!--&lt;!&ndash;&lt;!&ndash;prop="change_type" v-if="show1"&ndash;&gt;&ndash;&gt;-->
                  <!--&lt;!&ndash;&lt;!&ndash;label="类型"&ndash;&gt;&ndash;&gt;-->
                  <!--&lt;!&ndash;&lt;!&ndash;width="180">&ndash;&gt;&ndash;&gt;-->
                  <!--&lt;!&ndash;&lt;!&ndash;</el-table-column>&ndash;&gt;&ndash;&gt;-->
                  <!--&lt;!&ndash;&lt;!&ndash;<el-table-column v-if="show2"&ndash;&gt;&ndash;&gt;-->
                  <!--&lt;!&ndash;&lt;!&ndash;prop="amount"&ndash;&gt;&ndash;&gt;-->
                  <!--&lt;!&ndash;&lt;!&ndash;label="提现金额"&ndash;&gt;&ndash;&gt;-->
                  <!--&lt;!&ndash;&lt;!&ndash;width="180">&ndash;&gt;&ndash;&gt;-->
                  <!--&lt;!&ndash;&lt;!&ndash;</el-table-column>&ndash;&gt;&ndash;&gt;-->
                  <!--&lt;!&ndash;&lt;!&ndash;<el-table-column v-if="show1"&ndash;&gt;&ndash;&gt;-->
                  <!--&lt;!&ndash;&lt;!&ndash;prop="amount"&ndash;&gt;&ndash;&gt;-->
                  <!--&lt;!&ndash;&lt;!&ndash;label="收入/支出">&ndash;&gt;&ndash;&gt;-->
                  <!--&lt;!&ndash;&lt;!&ndash;</el-table-column>&ndash;&gt;&ndash;&gt;-->
                  <!--&lt;!&ndash;&lt;!&ndash;<el-table-column v-if="show2"&ndash;&gt;&ndash;&gt;-->
                  <!--&lt;!&ndash;&lt;!&ndash;prop="charge"&ndash;&gt;&ndash;&gt;-->
                  <!--&lt;!&ndash;&lt;!&ndash;label="手续费"&ndash;&gt;&ndash;&gt;-->
                  <!--&lt;!&ndash;&lt;!&ndash;width="180">&ndash;&gt;&ndash;&gt;-->
                  <!--&lt;!&ndash;&lt;!&ndash;</el-table-column>&ndash;&gt;&ndash;&gt;-->
                  <!--&lt;!&ndash;&lt;!&ndash;<el-table-column&ndash;&gt;&ndash;&gt;-->
                  <!--&lt;!&ndash;&lt;!&ndash;prop="rest" v-if="show1"&ndash;&gt;&ndash;&gt;-->
                  <!--&lt;!&ndash;&lt;!&ndash;label="结余">&ndash;&gt;&ndash;&gt;-->
                  <!--&lt;!&ndash;&lt;!&ndash;</el-table-column>&ndash;&gt;&ndash;&gt;-->
                  <!--&lt;!&ndash;&lt;!&ndash;<el-table-column v-if="show2"&ndash;&gt;&ndash;&gt;-->
                  <!--&lt;!&ndash;&lt;!&ndash;prop="money"&ndash;&gt;&ndash;&gt;-->
                  <!--&lt;!&ndash;&lt;!&ndash;label="到账金额"&ndash;&gt;&ndash;&gt;-->
                  <!--&lt;!&ndash;&lt;!&ndash;width="180">&ndash;&gt;&ndash;&gt;-->
                  <!--&lt;!&ndash;&lt;!&ndash;</el-table-column>&ndash;&gt;&ndash;&gt;-->
                <!--&lt;!&ndash;</el-table>&ndash;&gt;-->
                <!--&lt;!&ndash;</el-popover>&ndash;&gt;-->
              <!--</div>-->

          <!--</li>-->


        <!--</ul>-->
      </div>
      <div class="plan">
        <h2>参考方案</h2>
        <ul>
          <li v-for="item in pub_plans" @click="plan(item.url)">
            <p>{{ item.planTitle }}</p>
            <img :src="item.planImg" alt=""/>
          </li>
          <!--<li><img src="" /></li>-->
          <!--<li><img src="" /></li>-->
        </ul>
      </div>
      <!--<div class="case">-->
        <!--<p>待办事项<span>下方如有数字提示请点击操作，超过48小时未操作，平台将自动确认</span></p>-->
      <!--</div>-->

    </div>
</template>

<script>
  // import store from '@/store'
  import { getToken } from '@/utils/auth'

  export default {
        name: "home",
        data() {
          return {
            userInfo : {},
            wallet : {
              // deposit : '',
            },
            tableData : [] ,
            attendant : {},
            pub_plans : []
            // show : false,
            // show0 : false ,
            // show1 : false ,
            // show2 : false ,
            // note : {},
            // pop : '',
            // detail : [
            //   {
            //     name : '最近押金记录',
            //     visible : false
            //   },
            //   {
            //     name : '最近金币记录',
            //     visible : false
            //
            //   },
            //   {
            //     name : '最近提现记录',
            //     visible : false
            //
            //   }
            // ]
          }
        },

        mounted(){
          // const token = getToken() ;
          // console.log(token) ;
          this.$store.dispatch('GetInfo').then(res => {
            console.log(res);

            if( res.data.status === '000000000'){
              this.attendant = this.$store.state.user.attendant ;
              this.userInfo = this.$store.state.user.userInfo ;
              this.wallet = this.$store.state.user.wallet ;
              this.pub_plans = this.$store.state.user.pub_plans ;
              // const date = this.userInfo.vip_time ;
              // this.userInfo.vip_time = date.slice(0,4)+ ' - ' + date.slice(4,6) + ' - ' + date.slice(6,8) ;
            }else{
              this.$message({
                message : res.data.message ,
                center : true ,
                type : 'error'
              })
            }
          }).catch(() => {
            // this.$store.dispatch('LogOut').then(() => {

            //   this.$message.error('获取用户信息失败,请重新登录');
            //   this.$router.push('/login')
            // })
          })
        },
        methods : {
          vipPlus(){
            this.$router.push('/userInfor/vip')
          },
          //充值/提现
          recharge(type){
            if(type === 2){
              this.$router.push('/fund/cash')
            }else{
              this.$router.push('/fund/recharge')
            }
          },

          //方案链接
          plan(url){
            window.open(url);
            console.log(url)
          }
          // look(index){
          //   if(index!='2'){
          //     // this.$refs.popover1 = true ;
          //     if(index== '0'){
          //       this.show0 = !this.show0 ;
          //     }else{
          //       this.show1 = !this.show1 ;
          //     }
          //   }else{
          //     this.show2 = !this.show2 ;
          //   }
          //  this.first(index);
          //  this.detail[index].visible = !this.detail[index].visible ;
          //   // console.log(index,this.show0,this.show1,this.show2)
          //   var type = String((index+1)*1);
          //
          //   getHistory({ type : type ,size : '1',page : '1'}).then( res =>{
          //       if(res.code == '000000000'){
          //         this.tableData = res.data.splice(5);
          //         console.log(this.tableData)
          //       }
          //   }).catch( err => {
          //     alert('服务开小差啦，请稍等~')
          //   })
          // },
          // toAll(){
          //   this.$route.push('/history/money');
          // },
          // first(index){
          //   let oDiv = document.getElementsByClassName('history');
          //   for(let i = 0 ; i < oDiv.length ; i++ ){
          //     oDiv[i].style.zIndex = 1000*i ;
          //   }
          //   oDiv[index].style.zIndex = 5000 ;
          //
          // }
          // close(index){
          //   console.log(index);
          //   this.detail[index].visible = false ;
          // }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .container{
    width : 70% ;
    margin : 0 auto ;
    .user{
      width : 100% ;
      height : 2rem ;
      float : left ;
      margin-bottom : 0.15rem ;
      li{
        border : 1px solid #aaa ;
        height : 100% ;
        float : left ;
        box-sizing: border-box;
        border-radius : 0.08rem ;
        display : flex ;
        flex-direction: row;
        flex : 2 3 ;
        /*align-items: center;*/
        justify-content: space-between;
      }
      li:nth-child(1){
        width : 55% ;
        float : left ;
      }
      li:nth-child(2){
        width : 42%;
        padding : 0.18rem ;
        box-sizing: border-box;
        float : right ;
        flex-direction: column;
        justify-content: inherit;
        .title{
          width : 100% ;
          height : 0.35rem ;
          span{
            display: inline-block;
            font-size : 0.18rem ;
            font-weight : bold ;
            height : 0.35rem ;
            line-height : 0.35rem ;
            color : #333 ;
            float : left ;
          }
          img{
            margin-left : 0.1rem ;
            width : 0.25rem ;
            height : 0.3rem ;
          }
        }
        .service{
          width : 100% ;
          margin : 0.2rem auto 0 ;
          display : flex;
          flex-direction: column;
          justify-content: center;
          dl{
            width : 100% ;
            height : 0.5rem ;
            display : flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            /*&:nth-child(1){*/
              /*margin-bottom : 0.2rem ;*/
            /*}*/
            &:nth-child(1){
              dd{
                width : 0.24rem ;
                height : 0.27rem ;
              }
            }
            &:nth-child(2){
              dd{
                width : 0.27rem ;
                height : 0.25rem ;
              }
            }
            dd{
              img{
                width : 100% ;
                height : 100%;
              }
            }
            dt{
              width : 80% ;
              height : 100% ;
              line-height : 0.5rem ;
              text-indent : 0.3rem ;
              font-size : 0.17rem ;
              color : #345;

            }
          }
        }

      }
      .photo{
        width : 1.2rem ;
        height : 1.2rem ;
        margin : 0.3rem 0.2rem ;
        float : left ;
      }
      p{
        /*float : left ;*/
        margin-left : 0.1rem ;
        margin-top : 0.1rem ;
        width : 60% ;
        flex : 1 ;
        span{
          height : 0.4rem ;
          line-height : 0.4rem ;
          width : 100% ;
          float : left ;
          display: block ;
          img{
            width : 0.16rem ;
            margin-left :  0.03rem ;
          }
        }

      }
    }
    .money,.plan,.case{
      width : 100% ;
      float : left ;
      border : 1px solid #aaa ;
      padding : 0.15rem 0.4rem ;
      border-radius : 0.07rem ;
      margin-bottom : 0.15rem ;

    }
    .money{
      /*height : 2rem ;*/
      float : left ;
      .gold{
        width : 50% ;
        height : 1.3rem ;
        float : left ;
        margin : 0.1rem 0;
        padding : 0.1rem 0.4rem ;
        box-sizing: border-box;
        li{
          width : 100% ;
          font-size : 0.18rem ;
          font-weight : bold ;
          span,i{
            float : left ;
          }
          i{
            width : 0.12rem ;
            height : 0.12rem ;
            display : block ;
            margin : 0 0.08rem ;
            background : url('../../assets/imgs/tips.png') no-repeat center top;
            background-size : 114% ;
            border-radius: 50%;
            box-shadow: 0 0.03rem 0.03rem #454545;
          }
        }
        .useful{
          height : 0.38rem ;
          line-height : 0.38rem ;
          color : #333 ;
        }
        .cash{
          font-size : 0.16rem ;
          color : #ff0122 ;
          line-height : 0.5rem ;
          text-indent : 0.38rem ;
          .el-button{
            float : right ;
            margin : 0.08rem 0.2rem ;
          }
        }
        li:nth-last-child(1){
          /*color : #666;*/
          line-height : 0.3rem ;
          strong{
            float : left ;
            margin-right : 0.1rem ;
            font-size : 0.16rem ;
            i{
              float : right ;
            }
          }
            span{
              font-size : 0.15rem ;
              display : block;
              float : left ;
            }
          span:nth-child(1){
            margin : 0 0.1rem ;
            display : inline ;

          }
          .btn {
            margin-left : 0.2rem ;
            /*width : 0.6rem ;*/
            /*height : 0.3rem ;*/
            text-align : center;
            font-size : 0.13rem ;
            color : #666;
            border : 1px solid #D3D3D3 ;
            border-radius : 0.03rem ;
          }

        }

      }
      .gold:nth-child(1){
        width : 55% ;
        border-right : 1px solid #aaa ;
        padding-left : 0 ;
        li:nth-last-child(1){
          position : relative ;
          height : 0.6rem ;
          .btn:nth-last-child(2){
            position : absolute ;
            right : 1rem ;
            top : 0 ;
          }
          .btn:nth-last-child(1){
            position : absolute ;
            right : 0.1rem ;
            top : 0 ;
          }
        }
      }
      .gold:nth-child(2){
        width : 45% ;
        padding-right : 0 ;
        li:nth-last-child(1){
          position : relative ;
          height : 0.6rem ;
          .btn{
            position : absolute ;
            right : 0.1rem ;
            top : 0 ;
            /*margin-left : 2rem ;*/
          }
        }

      }
      .detail{
        width : 100% ;
        height : 0.5rem;
        padding-top : 0.2rem ;
        margin-top : 0.1rem ;
        border-top : 1px solid #aaa ;
        font-size : 0.14rem ;
        float : left ;
        span{
          float : left ;
          height : 0.2rem ;
          line-height : 0.2rem ;

        }
        li{
          float : left ;
          width : 1.28rem ;
          height : 100% ;
          line-height : 0.3rem ;
          margin-left : 0.3rem ;
          margin-right : 0.2rem ;
          position : relative;
          .history{
            width : 4rem ;
            height : 2rem ;
            position : absolute ;
            top : 0.3rem ;
            left : -45% ;
            border : 1px solid #aaa ;
            z-index : 10000;
            background : #fff;
            .tablebox{
              position : relative ;
              width : 100%;
              height : 100% ;
              .close{
                width : 0.15rem ;
                display : block;
                float : right ;
                margin-top : 0.08rem ;
                margin-right : 0.08rem ;
              }
              .toAll{
                color : lightskyblue;
                font-size : 0.12rem ;
                text-align : right ;
                position : absolute;
                bottom : 0.25rem ;
                right : 0.08rem ;
              }
              .tips{
                color : #ff2200;
                font-size : 0.12rem ;
                position : absolute;
                bottom : 0.05rem ;
                left : 0.05rem ;
              }
            }

          }

          b{
            display : block ;
          }
          b:nth-child(1){
            background : url('../../assets/imgs/history.png') no-repeat left center;
            background-size : 114% ;
            width : 0.14rem ;
            height : 100% ;
            display: block ;
            float : left ;
            margin-right : 0.07rem ;
          }
          b:nth-child(2){
            background : url('../../assets/imgs/tra.png') no-repeat left center;
            background-size : 114% ;
            width : 0.14rem ;
            height : 100% ;
            display: block ;
            float : right ;
            border : 0;
            margin-left : 0.07rem ;
          }

        }
      }
    }

    .plan{
      float : left ;
      padding : 0.25rem  0.28rem ;
      h2{
        width : 100% ;
        height : 0.2rem ;
        line-height : 0.2rem ;
        font-size : 0.16rem ;
      }
      ul{
        display : flex;
        flex-direction: row;
        flex-wrap: nowrap;
        flex : 1 ;
        margin : 0.25rem 0;
        justify-content:space-around;

        li{
          width : 2.2rem ;
          p{
            height : 0.4rem ;
            line-height : 0.4rem ;
            color : #346 ;
            text-align : center;
          }
          img{
            width : 100% ;
            height : 0.8rem ;
            border : 1px solid #aaa;
            border-radius: 0.05rem ;
          }

        }

      }
    }

    .case{
      height : 2.6rem ;
      margin-bottom : 0.5rem ;
      p{
        height : 0.5rem ;
        width : 100%;
        padding : 0.08rem 0.14rem ;
        font-size : 0.18rem ;
        line-height : 0.34rem ;
        border-bottom : 1px solid #aaa;
        span{
          margin-left : 0.2rem ;
          font-size : 0.12rem ;
          line-height : 0.34rem ;

        }
      }
    }
  }

</style>
