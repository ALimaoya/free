<template>
    <div class="merchantCenterHome">
      <div class="mainInfo">
        <div class="userInfo">
          <div><img src="../../assets/imgs/logo.png" /><dl><dd>童趣母婴店</dd><dt>主营类目：</dt></dl></div>
          <ul>
            <li><span>描述相符</span><span class="tips_warn">5.0</span></li>
            <li><span>服务态度</span><span class="tips_warn">5.0</span></li>
            <li><span>物流服务</span><span class="tips_warn">5.0</span></li>
          </ul>
        </div>
        <ul class="flowDetail">
          <li><span><img src="../../assets/imgs/home1.png" alt="" /></span><span>今日成交金额</span><span class="tips_warn"></span></li>
          <li><span><img src="../../assets/imgs/home2.png" alt="" /></span><span>近20天出货量</span><span class="tips_warn"></span></li>
          <li><span><img src="../../assets/imgs/home3.png" alt="" /></span><span>近20天成交金额</span><span class="tips_warn"></span></li>
          <li><span><img src="../../assets/imgs/home4.png" alt="" /></span><span>今日访客数</span><span class="tips_warn"></span></li>
          <li><span><img src="../../assets/imgs/home5.png" alt="" /></span><span>今日浏览量</span><span class="tips_warn"></span></li>
          <li></li>
        </ul>
      </div>

    </div>
</template>

<script>
    export default {
        name: "merchantCenter-home",
        data() {
            return {

            }
        },
        mounted() {
        },
        methods: {}
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
      .userInfo{
        width: 35% ;
        display: flex;
        flex-direction: column;
        background : #eee ;
        padding : 0.2rem ;
        box-sizing: border-box;
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
        justify-content: space-around;
        li{
          flex : 1 ;
          height : 1rem ;
          display: flex;
          flex-direction: column;

          span{
            display: inline-block;
            width: 100%;
            font-size : 0.2rem ;
            color : #333 ;
            line-height : 0.4rem ;
            text-align: center ;
          }
          span:nth-child(1){
            height : 40% ;
            img{
              width : 30% ;

            }
          }
        }
      }
    }
  }

</style>
