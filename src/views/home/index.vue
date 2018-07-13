<template>
    <div class="home">
      <!--<div class="navBar_wrap">-->
        <!--<div class="navBar">-->
          <!--<div class="logo">-->
            <!--<img src="img/logo.png" alt="logo" />-->
          <!--</div>-->
          <!--<div class="navBar-list">-->
            <!--<span><a class="active">首页</a></span>-->
            <!--&lt;!&ndash;<span class="line">|</span>&ndash;&gt;-->
            <!--<span><a href="shopenter.html">试客商家入驻</a></span>-->
            <!--&lt;!&ndash;<span class="line">|</span>&ndash;&gt;-->
            <!--<span><a href="download.html">下载App</a></span>-->
            <!--&lt;!&ndash;<span class="line">|</span>&ndash;&gt;-->
            <!--<span><a href="helpcenter.html">帮助中心</a></span>-->
            <!--&lt;!&ndash;<span class="line">|</span>&ndash;&gt;-->
            <!--&lt;!&ndash;<span><a href="publish.html">发布信息</a></span>&ndash;&gt;-->
            <!--&lt;!&ndash;<span class="line">|</span>&ndash;&gt;-->
            <!--&lt;!&ndash;<span><a href="list.html">品牌专区</a></span>&ndash;&gt;-->
          <!--</div>-->
          <!--<div class="user">-->
            <!--<img src="img/top.png" alt="" />-->
            <!--<a href="http://sksj.yabei.shop/#/" target="_blank">登录</a>-->
            <!--<a href="http://sksj.yabei.shop/#/" target="_blank">注册</a>-->
          <!--</div>-->
        <!--</div>-->

      <!--</div>-->
      <div class="content">
        <div class="banner">
          <img src="../../assets/imgs/index/banner.png" alt="banner" />
          <router-link to="/login" class="join" ></router-link>
          <img src="../../assets/imgs/index/promess.png" class="promise" />
        </div>
        <!--<div class="video_play">-->
          <!--<video src="video/01505270f69cf0574342794c84669126.mp4" controls width="47%" height="" autoplay></video>-->
        <!--</div>-->
        <div class="six_advantage">
          <img src="../../assets/imgs/index/six_advantage.png" width="100%" />
        </div>
        <div class="tryout_progress">
          <img src="../../assets/imgs/index/tryout_progress.png" width="100%" />
        </div>
        <div class="do_more">
          <img src="../../assets/imgs/index/do_more.png" width="100%" />
        </div>
        <div class="real_feedback">
          <img src="../../assets/imgs/index/real_feedback.png" width="100%" />
        </div>
        <div class="normal_question">
          <img src="../../assets/imgs/index/normal_question.png"  width="100%"/>
        </div>
        <div class="buyer">
          <img src="../../assets/imgs/index/buyer.png"  width="100%"/>
        </div>
        <div class="mtb80">
          <router-link to="/register" >
            <img src="../../assets/imgs/index/register.png" />
          </router-link>
        </div>
        <div class="footer">
          <img src="../../assets/imgs/footer.png" width="100%" />
          <div class="info">

            <div>Copyright © 2006-2017 yabei.com 河南年青人电子商务有限公司<a style="margin-left: .2rem;" target="_blank" href="https://v.pinpaibao.com.cn/cert/site/?site=www.yabei.shop&at=realname" ><img src="https://static.anquan.org/static/outer/image/sm_124x47.png" width="80px"></img></a></div>
            <a href="http://www.miitbeian.gov.cn/" target="_blank">豫ICP备17035119号</a>

          </div>
        </div>
        <div class="chat">
          <div>在线客服</div>
          <div>
            <a href="http://wpa.qq.com/msgrd?v=3&uin=68816110&site=qq&menu=yes" target="_blank">
              <img src="../../assets/imgs/index/qq.png" />
            </a>
          </div>
          <div class="wechat">
            <img src="../../assets/imgs/index/weixin.png" />
            <img src="../../assets/imgs/index/wechat.png"   class="code"/>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
    export default {
        name: "home"
    }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .home{
    width : 100% ;

    .content{
      text-align: center;
      float : left ;
    }

    /*顶部图片*/
    .banner{
      /*min-width: 1200px;*/
      width: 100%;
      position : relative;
      overflow: hidden;
    }
    .banner img{
      width: 100%;
      height: auto;
    }
    .banner a{
      position : absolute;
      width : 1.5rem ;
      height : .5rem ;
      background : url('../../assets/imgs/index/join.png') no-repeat;
      background-size : 100% ;
      top : 50% ;
      left : 50% ;
      margin-left : -.75rem ;
      /*right : -150px;*/
    }
    .banner .promise{
      width:12.30rem ;
      margin-top: -.8rem;
    }
    .video_play{
      margin-top : 2% ;
      width : 100% ;
      height : 9% ;
      background : #f9f9f9 ;
    }
    .video_play video{
      margin : 32px auto ;

    }
    .mtb80{margin: .80rem 0; }
    .chat{padding:.1rem 0 0;position: fixed;text-align: center;width: 1.2rem;background-color:#333;color:white;right: 0;top: 70%;z-index: 222;}
    .chat div{font-size: .15rem;margin-bottom: .1rem;cursor: pointer;}
    .chat div img{width: 90%;}
    .wechat{position: relative;}
    .wechat:hover .code{display: block;}
    .code{position: absolute;right: 1rem;top: -.3rem;display: none;width: 1.2rem;}
    .footer{
      text-align: center;
    }
    .footer .code{
      text-align: center;
      margin: 0 auto;
      width: 12rem;
      height: auto;
      overflow: hidden;
    }
    .code ul{
      margin-left: .3rem;
    }
    .code ul li{
      margin-right: .6rem;
    }
    .code ul li:last-child{
      margin-right: 0;
    }
    .code p{
      margin: .35rem 0;
    }
    .info{
      height: .8rem;
      font-size: .14rem;
      line-height: .2rem;
      margin : .2rem 0 .4rem;
    }
    .info>div{margin-bottom: .1rem;text-align: center;}
    .info a{margin-bottom: .2rem;text-align: center;}
    .info a:hover{
      color: #1A9DF3;

    }
    .info p{
      width : 100% ;
      height : .2rem;
      line-height : .2rem;
      text-align : center;
    }
  }
</style>
