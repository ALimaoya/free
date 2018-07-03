<template>
    <div class="merchantCenter allWid">
      <!--<iframe src="../../../a.html" scrolling ='no' >点这里</iframe>-->
      <div class="warn" :class="{ hide: close === '1' }">
        <p>温馨提示</p>
          <div>您的<span  v-if="statusTag.aptitudeStatus === '0'">资质、</span>  <span v-if="statusTag.shopStatus=== '0'">店铺、</span><span v-if="statusTag.wallet === '0'">保证金</span> 信息还未提交，无法进行商品、交易、结算等相关操作，请尽快补充资料。</div>
          <div v-if="statusTag.aptitudeStatus === '1'">您的 资质 信息正在审核中，请耐心等候，审核通过后，您可进行商品、交易、结算等相关操作。</div>
          <div v-else-if="statusTag.aptitudeStatus === '-1'">您的 资质 信息未通过审核，请重新编辑提交，审核通过后，您可进行商品、交易、结算等相关操作。</div>
        <span class="close_icon" @click="close = '1'"></span>
      </div>
      <ul class="step allWid">
        <!--<li v-for="(item,index) in Process" :key="index" :class="{isActive:show == index }" @click="changeTabs(index)">-->
          <!--&lt;!&ndash;<a href="#" >&ndash;&gt;-->
            <!--<span>{{(index + 1)*1 }}</span>-->
            <!--<dl><dt>{{item.title}}</dt>-->
              <!--<dd v-if="isRegister&&!isChecking">{{ item.intro1 }}</dd>-->
              <!--<dd v-if="!isRegister">{{ item.intro2 }}</dd>-->
              <!--<dd v-if="isRegister&&isChecking">{{ item.intro3 }}</dd>-->

            <!--</dl>-->
          <!--&lt;!&ndash;</a>&ndash;&gt;-->
        <!--</li>-->
        <li :class="{isActive:show === '1' }" @click="changeTabs('1')">
          <!--<a href="#" >-->
          <span>1</span>
          <dl><dt>资质上传</dt>
            <dd v-if="statusTag.aptitudeStatus === '0'">您的相关资质还未提交</dd>
            <dd v-else-if="statusTag.aptitudeStatus === '1'"> 您的相关资质正在审核 </dd>
            <dd v-else-if="statusTag.aptitudeStatus === '-1'">您的相关资质未审核通过，请重新上传</dd>
            <dd v-else>您的相关资质已审核通过</dd>
          </dl>
          <!--</a>-->
        </li>
        <!--<li :class="{isActive:show === '2' }" @click="changeTabs('2')">-->
          <!--&lt;!&ndash;<a href="#" >&ndash;&gt;-->
          <!--<span>2</span>-->
          <!--<dl><dt>绑定账号</dt>-->
            <!--<dd v-if="statusTag.isBundle === '0'"> 您还未绑定结算账号 </dd>-->
            <!--<dd v-else>您已绑定结算账号</dd>-->
          <!--</dl>-->
          <!--&lt;!&ndash;</a>&ndash;&gt;-->
        <!--</li>-->
        <li :class="{isActive:show === '2' }" @click="changeTabs('2')">
          <!--<a href="#" >-->
          <span>2</span>
          <dl><dt>缴纳保证金</dt>
            <dd v-if="statusTag.wallet === '0'"> 您还未缴纳保证金 </dd>
            <dd v-else>您的保证金已缴纳</dd>

          </dl>
          <!--</a>-->
        </li>
        <li :class="{isActive:show === '3' }" @click="changeTabs('3')">
          <!--<a href="#" >-->
          <span>4</span>
          <dl>
            <dt>我要开店</dt>
            <dd v-if="statusTag.shopStatus === '0'"> 您还未提交店铺信息 </dd>
            <dd v-else-if="statusTag.shopStatus === '1'"> 您提交的店铺信息正在审核中 </dd>
            <dd v-else-if="statusTag.shopStatus === '-1'"> 您提交的店铺信息未通过审核，请修改后重新提交 </dd>
            <dd v-else>您的店铺信息已审核通过</dd>

          </dl>
          <!--</a>-->
        </li>

      </ul>
      <div class="wrap allWid" >


        <component  :is="tabView " :deposit="statusTag.deposit" :step3Status="statusTag.wallet" :step4Status="statusTag.aptitudeStatus"></component>

        <!--<step-wrap></step-wrap>-->
      </div>
    </div>
</template>

<script>
  import {  getUser,getToken } from '@/utils/auth'
  import Step1 from "@/views/merchantCenter/center/Step1"
  // import Step2 from "@/views/merchantCenter/center/Step2"
  import Step3 from "@/views/merchantCenter/center/Step3"
  import Step4 from "@/views/merchantCenter/center/Step4"
  import { getStatus } from "@/api/userCenter"
  export default {
      name: "MerchantCenter-home",
      components: {
        Step1,
        // Step2,
        Step3,
        Step4

      },
      data(){
          return{

            show : '1',
            isActive : false,
            tabView : 'step1',
            user : getUser(),
            statusTag: {},
            close: ''
          }
      },
    mounted(){
        //跳转到缴纳保证金步骤
        let step3 = this.$route.params.step3 ;
        if( step3 ){
          this.show = '2' ;
          this.tabView = 'step3';
          this.statusTag.wallet = '0';
        };
        this.getStatusType();

    },
    methods: {
        getStatusType(){
          getStatus().then(res=> {
            if(res.data.status === '000000000'){
              this.statusTag = res.data.data;
              if(this.statusTag.aptitudeStatus=== '9'&& this.statusTag.isBundle === '1'&& this.statusTag.shopStatus === '9'&&this.statusTag.wallet === '1'){
                this.close = '';
              }

            }else{
              this.$message({
                message : res.data.message,
                center: true ,
                type : 'error'
              });

            }
          }).catch( err => {
            alert('服务器开小差啦，请稍等~')

          })
        },
      changeTabs(index){
        this.show = index ;
        if(index === '1'){
          this.tabView = 'step1' ;

        }else if( index === '2'){
          this.tabView = 'step3' ;

        }else if(index === '3'){
          this.tabView = 'step4' ;

        }
      },

    }
    }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import '../../../styles/variables.scss';
  .warn{
    width : 100% ;
    margin : 0.5rem 0 ;
    border-radius : 0.05rem ;
    background : #f8b2b2 ;
    color : #a94442 ;
    padding : 0.3rem 0.15rem ;
    position: relativel
    p{
      font-size : 0.24rem ;
      font-weight : bold ;
      line-height : 0.4rem ;
    }
    div{
      font-size : 0.14rem ;
      line-height : 0.3rem ;
    }
    .close_icon{
      position: absolute ;
      right : 0.5rem ;
      top: 1.1rem ;
      width : 0.25rem ;
      height : 0.25rem ;
      display: inline-block;
      background: url('../../../assets/imgs/close.png') no-repeat center;
      background-size: contain ;
    }

  }
  .hide{
    display: none;
  }
  .allWid {
    width : 100% ;

  }
  .isActive{
    display : block ;

  }
  .isActive,.isActive:hover{
    background :$active!important; ;
    dt{
      color : #fff!important; ;
    }
  }
.merchantCenter{
  padding : 0.2rem ;
  background : #eee ;
  box-sizing: border-box;
  overflow : hidden ;
  border-radius: 0.05rem;
  .step,.wrap{
    background : #fff ;
    border-radius: 0.1rem;

  }
  .step{
    display : flex ;
    flex-direction : row ;
    height : 70px;
    align-items: center;
    justify-content: center;
    margin-bottom : 0.1rem ;
    li{
      /*display : block;*/
      flex : 1 ;
      height : 100% ;

      /*a{*/
        display : flex ;
        flex-direction: row;
        padding : 10px ;
        box-sizing: border-box;
        border-radius: 0.05rem;

        span{
          display: inline-block;
          width : 22px ;
          height : 22px ;
          border-radius: 50% ;
          font-size : 0.12rem ;
          color : #fff ;
          font-weight : bold ;
          text-align: center;
          background : #6d7479!important ;
          line-height : 22px ;
          margin-right: 0.1rem ;
        }
        dl{
          flex : 1 ;
          dd,dt{
            height : 20px;
            line-height : 20px;
          }
          dt{
            color : #333 ;
            font-size : 0.16rem ;

          }
          dd{
            color : #aaa ;
            font-size : 0.14rem ;
          }
        }
      /*}*/

      /*:acitve{*/
        /**/
      /*}*/
    }
    li:hover{
      background :$hover ;

    }

  }
  .wrap{
     border : 1px solid #aaa ;
     padding : 10px ;

  }

  /*overflow-y: auto;*/
}
/*iframe{*/
  /*border : 0;*/
  /*width : 100% ;*/


/*}*/
</style>
