<template>
    <div class="signUp">
      <div v-if="!goOther">
        <div class="topTitle">
          <img class="logo" v-if="content[type-1]!== undefined" :src="content[type-1].img" alt="" />
          <div class="titleContent">
            <p v-if="content[type-1]!== undefined">{{ content[type-1].title}}<span>{{ progress[0] }}</span></p>
            <div>活动时间：长期招商</div>
            <div><span>报名资质：</span>
              <div class="tips" v-if="permitSign&&hasBond"><img src="../../../assets/imgs/success.png"/><div>您的店铺已达到报名要求</div></div>
              <div class="tips" v-else="!permitSign|| !hasBond"><img src="../../../assets/imgs/wrong.png"/><div>很抱歉，您的店铺还未达到报名要求</div></div>
              <el-button type="text" @click="dialogVisible = true ;">详情</el-button>
            </div>
            <el-button class="sign_btn" type="danger" @click="signNow" size="mini" >立即报名</el-button>
          </div>
        </div>
        <ul class="subContent">
          <li v-for="(item,index) in list" :key="index" @click="show = index ;" :class="{ active:show==index }">{{ item }}</li>
        </ul>
        <div v-if="show== '0'" ><ul class="introduce"><li v-for="(item,index) in intro[type-1]" :key="index">{{ item }}</li></ul></div>
        <div v-else-if="show =='1'">
          <p class="h_title"> 对店铺的要求</p>
          <table  border="1">
            <tr><th>资质名称</th><th>活动要求</th><th>您的资质</th></tr>
            <tr><td>店铺无限制</td><td>活动期间商家不在店铺限制中</td><td><img v-if="permitSign"  src="../../../assets/imgs/success.png"/><img v-else="!permitSign"  src="../../../assets/imgs/wrong.png"/></td></tr>
            <tr><td>店铺账户资金状态</td><td>店铺缴纳保证金方可报名活动</td><td><img v-if="hasBond"  src="../../../assets/imgs/success.png"/><img v-else="!hasBond"  src="../../../assets/imgs/wrong.png"/></td></tr>
          </table>
        </div>
        <el-dialog  title="店铺需要符合报名要求如下：" :visible.sync="dialogVisible" width="50%" center>
          <div>1、店铺缴纳保证金方可报名活动。</div>
        </el-dialog>
      </div>

      <component v-else="goOther" :is="tabView" @getContent="sign"></component>
    </div>

</template>

<script>
  import chooseDate from "@/views/merchantCenter/marketing/chooseDate";
  import signContent from "@/views/merchantCenter/marketing/signContent";
  import success from "@/views/merchantCenter/marketing/success"
  import { getShopStatus,getActivityGoods,getSecondsList } from "@/api/enter"
  import { getBond } from "@/api/userCenter"
  import seconds from "../../../assets/imgs/seconds.jpg"
  import share from "../../../assets/imgs/share.jpg"

  export default {
    name: "sign-up",
    components: {
      chooseDate,
      signContent,
      success
    },
    data() {
      return {
        type: '',
        tabView: '',
        getContent: '',
        goOther: false,
        content: [
          {
            img: seconds,
            title: '首页—0.9元秒杀频道活动报名',

          },
          {
            img: share,
            title: '首页—分享购频道活动报名',

          }
        ],
        progress: ['进行中'],
        list: ['活动介绍', '资质要求'],
        show: '0',
        dialogVisible: false,
        intro: [
          ['丫贝APP端首页—0.9秒杀频道', '活动时间：长期招商', '资源位：首页0.9秒杀频道', '收费方式：免费', '活动要求：', '品类要求：无特殊要求',
            '图片要求：高清图、缩略图、图上不得有字，不得有标；图片清晰美观', '价格要求：在特价时间内做5-8折的限时活动；低至0.9元', '名额有限，先到先得，请尽早提报！'],
          ['丫贝APP端首页—推荐商品分享购大图资源位频道', '活动时间：长期招商', '资源位：首页推荐商品分享购大图资源位频道', '收费方式：免费', '活动要求：', '品类要求：无特殊要求',
            '图片要求：高清图、缩略图、图上不得有字，不得有标；图片清晰美观', '价格要求：在特价时间内做5-8折的限时活动', '名额有限，先到先得，请尽早提报！']
        ],
        permitSign : false,
        hasBond: false ,

      }
    },
    mounted() {
      //获取活动类型
      this.type = this.$route.query.type;
      // console.log(this.$route);
      if(this.type === undefined){
        for (const [i, v] of this.$store.state.tagsView.visitedViews.entries()) {
          if (v.fullPath === this.$route.fullPath) {
            this.$store.state.tagsView.visitedViews.splice(i, 1);
            this.$router.push('/merchantCenter/marketing/activityApply');
          }
        }
      }else{
        this.checkShopStatus() ;

      }

    },
    methods: {
      checkShopStatus(){
        getShopStatus().then( res => {
          if( res.data.status === '000000000'){
            if(res.data.data.shopStatus === '2'){
              this.permitSign = true ;
              this.checkBond();
            }else{
              this.permitSign = false ;
            }
          }
        })
      },
      checkBond(){
        getBond().then( res => {
          if( res.data.status === '000000000' ){
            if(res.data.data.status === '1'|| res.data.data.status === '2'){
              this.hasBond = true ;

            }else{
              this.hasBond = false ;
            }
          }else{
            this.hasBond = false ;

          }
        })
      },
      signNow() {
        if(this.hasBond&& this.permitSign){
          this.tabView = 'chooseDate';
          this.goOther = true;
        }else{
          if(!this.hasBond){
            this.$message({
              message : '您的店铺还未缴纳保证金，请前往缴纳后方可参加活动报名',
              type : 'error',
              center : true
            })
          }

        }

      },



      sign(res) {
        this.tabView = res;
      }
    }
  }

</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .signUp{
    color : #333 ;
    .topTitle{
      padding : 0.2rem 0.4rem ;
      box-sizing: border-box;
      display: flex;
      .logo{
        width : 11% ;
        max-height: 100%;
        margin-right : 0.2rem ;

      }
      .titleContent{
        display: flex;
        flex: 1 ;
        flex-direction: column;
        p{
          font-size : 0.26rem ;
          font-weight : bold ;
          line-height : 2 ;
          span{
            font-size : 0.16rem ;
            color : #ff0011;
            border : 1px solid #ff0011;
            border-radius: 0.05rem;
            padding  :0.07rem 0.2rem ;
            margin-left : 0.3rem ;
            font-weight : 100;
          }
        }
        div{
          font-size : 0.24rem ;
          line-height : 0.48rem ;
          height : 0.48rem ;
          display: flex;
          flex-direction: row;
          justify-content: flex-start;

          .tips{
            display: inline-block;
            margin-right : 0.1rem ;
            /*line-height : 0.3rem ;*/
            img,div,.el-button{
              float : left ;
            }
            img{
              width : 0.3rem ;
              height : 0.3rem ;
              margin : 0.1rem  0.1rem 0 0;
            }

          }
          .el-button{
            padding : 0;

          }
        }
        .sign_btn{
          margin-left : 1.5rem;
          margin-top : 0.3rem ;
          width : 1.2rem ;
          padding : 0;
          height : 0.4rem ;
          line-height : 0.4rem ;
          text-align: center;
        }
      }
    }
    .subContent{
      display: flex;
      flex-direction: row;
      border-bottom : 1px solid #dcdfe6;
      margin-top : 0.5rem ;
      li{
        font-size : 0.2rem ;
        height : 0.5rem ;
        line-height : 0.5rem ;
        padding : 0 0.4rem ;
        cursor: pointer;
      }
      .active{
        border-bottom: 2px solid #ff0011;
        font-weight : bold ;
      }
    }
    .introduce{
      display: flex;
      flex-direction: column;
      width : 80% ;
      margin-left : 0.4rem ;
      padding-top : 0.4rem ;
      li{
        font-size : 0.18rem ;
        line-height : 0.4rem ;

      }
    }
    .h_title{
      font-weight : bold ;
      font-size : 0.26rem ;
      width : 90% ;
      margin : 0.3rem auto ;
    }
    table{
      border-collapse: collapse;
      margin : 0.2rem auto ;
      width : 90% ;
      border-radius : 0.05rem ;
      border-color : #aaa ;
      text-align: center;
        tr{
          height : 0.5rem ;
          line-height : 0.5rem ;

        }
        th{
          background : #ddd ;
        }
      td{
        img{
          width : 0.3rem ;
          height : 0.3rem ;
          margin-top : 0.1rem ;
        }
      }
    }

  }


</style>
