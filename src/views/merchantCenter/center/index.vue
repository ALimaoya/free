<template>
    <div class="merchantCenter allWid">
      <!--<iframe src="../../../a.html" scrolling ='no' >点这里</iframe>-->
      <ul class="step allWid">
        <li v-for="(item,index) in Process" :key="index" :class="{isActive:show == index }" @click="changeTabs(index)">
          <!--<a href="#" >-->
            <span>{{(index + 1)*1 }}</span>
            <dl><dt>{{item.title}}</dt><dd>{{ item.intro}}</dd></dl>
          <!--</a>-->
        </li>
      </ul>
      <div class="wrap allWid" >


        <component  :is="tabView " :getData="form"></component>

        <!--<step-wrap></step-wrap>-->
      </div>
    </div>
</template>

<script>
  // import { Step1,Step2,Step3,Step4 } from '@/views/merchantCenter/center';
  import {  getUser,getToken } from '@/utils/auth'
  import Step1 from "@/views/merchantCenter/center/Step1"
  import Step2 from "@/views/merchantCenter/center/Step2"
  import Step3 from "@/views/merchantCenter/center/Step3"
  import Step4 from "@/views/merchantCenter/center/Step4"

  export default {
      name: "MerchantCenter-home",
      components: {
        Step1,
        Step2,
        Step3,
        Step4

      },
      data(){
          return{
            Process : [
              {
                title : '资质上传',
                intro : '您的相关资质已审核通过',
                path : 'step1'
              },
              {
                title : '绑定账号',
                intro : '已绑定结算账号',
                path : 'step2'
              },
              {
                title : '缴纳保证金',
                intro : '保证金已缴纳',
                path : 'step3'
              },
              {
                title : '我要开店',
                intro : '您的店铺信息已审核通过',
                path : 'step4'
              }
            ],
            show : '',
            isActive : false,
            tabView : 'step1',
            user : getUser(),
            form : {},
          }
      },
    mounted(){
        console.log(this.user,getUser());
        //获取form表单数据
        // this.form
          // this.store.dispatch('GetUserInfo',this.user);

    },
    methods: {
      changeTabs(index){
        this.show = index ;
        // this.store.dispatch('GetUserInfo',this.user);
        this.tabView = 'Step'+ (index+1)*1 ;
      },

    }
    }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import '../../../styles/variables.scss';

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
