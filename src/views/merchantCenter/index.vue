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
          <li><span><img src="../../assets/imgs/home1.png" alt="" /></span><span>今日成交金额</span><span class="tips_warn">1231221</span></li>
          <li><span><img src="../../assets/imgs/home2.png" alt="" /></span><span>近20天出货量</span><span class="tips_warn">123212</span></li>
          <li><span><img src="../../assets/imgs/home3.png" alt="" /></span><span>近20天成交金额</span><span class="tips_warn">342312</span></li>
          <li><span><img src="../../assets/imgs/home4.png" alt="" /></span><span>今日访客数</span><span class="tips_warn">1312321</span></li>
          <li><span><img src="../../assets/imgs/home5.png" alt="" /></span><span>今日浏览量</span><span class="tips_warn">423422</span></li>
          <li></li>
        </ul>
      </div>
      <div class="manage_wrap">
        <div class="manage">
          <p class="title">宝贝管理</p>
          <ul>
            <li><span>出售中的宝贝</span><span>15件</span></li>
            <li><span>待上架的宝贝</span><span>15件</span></li>
          </ul>
        </div>
        <div class="manage">
          <p class="title">订单提醒</p>
          <ul>
            <li><span>待付款</span><span>15单</span></li>
            <li><span>待发货</span><span>15单</span></li>
            <li><span>待评价</span><span>15单</span></li>
            <li><span>退款/退货</span><span>待处理</span><span>15单</span></li>
            <li><span>已退货</span><span>待处理</span><span>15单</span></li>
          </ul>
        </div>
      </div>
      <div class="flowInfo">
        <p class="title">宝贝管理</p>
        <div><span @click="getType('1')">近7天数据</span><span @click="getType('1')">近30天数据</span></div>
        <div id="myChart" ></div>
      </div>
    </div>
</template>

<script>
  import echarts from 'echarts'
    export default {
        name: "merchantCenter-home",
        data() {
            return {
              dateArr: [],
            }
        },
        mounted() {
          this.getType('1');
          this.initChart();
        },
      beforeDestroy() {
        if (!this.chart) {
          return
        }
        this.chart.dispose();
        this.chart = null
      },
        methods: {
          getType(type){
            let arr = [];
            for(let i = 0 ; i< 30 ;i++){
              let num = this.getDate(i);
              arr.unshift(num);
            }
            let subDateArr = arr.slice(0,7);
            if(type ==='1'){
              this.dateArr = subDateArr ;
            }else if(type === '2'){
              this.dateArr = arr ;

            }
          },
          getDate(index){
            let now = new Date();
            let date = new Date(now.getTime() - index * 24 * 3600 * 1000);
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let day = date.getDate();
            return month+ '/'+ day;
          },
          initChart(){

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
                boundaryGap: false,
                data: this.dateArr
              }],
              yAxis: [{
                type : 'value',
                name: '金额/件数',
                date : [200,400,600,800,1000]
              }],
              series: [
                {
                  type : 'line',
                },

              ]
            })
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
          height : 1.75rem ;
          display: flex;
          flex-direction: column;
          border-left: 1px solid #dcdfe6;
          border-bottom: 1px solid #dcdfe6;
          padding : 0.15rem ;

          span{
            display: inline-block;
            width: 100%;
            font-size : 0.26rem ;
            color : #333 ;
            line-height : 0.4rem ;
            text-align: center ;
          }
          span:nth-child(1){
            height : 40% ;
            img{
              width : 15% ;

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
      #myChart{
        width : 100% ;
        height: 6rem ;
      }
    }
  }

</style>
