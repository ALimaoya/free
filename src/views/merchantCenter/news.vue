<template>
  <div class="news">
    <div class="title">消息中心</div>
    <div class="btn">
      <button class="read" :class="isRead==='1'?'isActive':''" @click="reading('1')">未读</button>
      <button class="read" :class="isRead==='2'?'isActive':''" @click="reading('2')">已读</button>
      <!--<el-button size="small" autofocus>未读</el-button>-->
      <el-button plain size="mini" @click="readAll" style="float: right ;">全部标为已读</el-button>
    </div>
    <!--<div v-show="detailInfo==false">-->
        <ul class="news_box">
          <li v-for="(item,index) in newItems" :key="index">
            <span class="tips_icon" :class="item.checkStatus === '1'?'success_icon':'wrong_icon'"></span>
            <ul class="news_content">
              <li><p class="news_title">{{ item.title }}<span>{{ item.date }}</span></p></li>
              <li><p class="news_detail">您的商品<span class="order" :class="item.checkStatus === '3'?'tips_warn':'success_order'">（{{ item.order }}）</span>提交审核<span v-if="item.checkStatus === '1'">通过</span><span v-else="item.checkStatus === '3'">拒绝</span></p></li>
              <li v-if="item.checkStatus === '3'"><p class="news_detail">拒绝原因：<span class="tips_warn">{{ item.refuse }}</span></p></li>
            </ul>
            <el-button type="text" v-if="item.status=== '0'" class="mark tips_warn" @click="readIt(item)">标为已读</el-button>
          </li>
        </ul>
      <!--<table border="1" bordercolor="#D3D3D3" v-if="isRead==='1'">-->
        <!--<tr v-for="(item,index) in newItems" :key="index">-->
          <!--<td>{{ item.name}}<b></b></td>-->
          <!--<td>{{ item.date}}</td>-->
          <!--<td>{{ item.title}}</td>-->
          <!--<td><span class="detail" @click="detail(newItems[index],1)">查看详情</span></td>-->
        <!--</tr>-->
      <!--</table>-->
      <!--<table border="1" bordercolor="#D3D3D3" v-else="isRead==='2'">-->
        <!--<tr v-for="(item,index) in oldItems" :key="index">-->
          <!--<td>{{ item.name}}</td>-->
          <!--<td>{{ item.date}}</td>-->
          <!--<td>{{ item.title}}</td>-->
          <!--<td><span class="detail" @click="detail(oldItems[index],2)">查看详情</span></td>-->
        <!--</tr>-->
      <!--</table>-->
    <!--</div>-->
    <!--<div class="detailBox" v-if="detailInfo">-->
    <!--<div class="detailTitle">公告标题<img src="../../assets/imgs/close.png" @click="detailInfo= false"/></div>-->
      <!--<div class="detailContent">-->
        <!--<span>{{ inforDate }}</span>-->
        <!--<div class="passage">{{ content }}</div>-->
        <!--<div class="readBtn">-->
          <!--<el-button type="primary" size="small" @click="detailInfo= false">确认已读</el-button>-->
        <!--</div>-->
      <!--</div>-->
    <!--</div>-->
  </div>
</template>

<script>
    export default {
      name: "index" ,
      data(){
          return{
            newItems:[],
            tableData1 : [
              {
                order : '234242',
                date : '222' ,
                title : '公告标题',
                checkStatus : '1',
                refuse : '2008年FLOAT以“发声”为品牌精\n' +
                'YUZUKI.S\n' +
                'YUZUKI.S(6张)\n' +
                ' 神，推出对社会现象批判性的一系列产品，获得潮流界的一致好评。当年产品被刊登于国内各大潮流杂志。后来FLOAT设计理念跟随设计师思想的转变，向着功能性和运动性方向发展，试图融入更多的元素，但坚持产品的简单性，摒弃复杂和口号性的图案印花。\n' +
                'FLOAT的服装设计并非只着重于男装，女装系列也十分出色。相对于男装的简约多变，女装系列则以夸张、特别剪裁、细腻的品质感、和天马行空的嬗变为主体风格。2011年，沈梦云（YUZUKI SENG）将FLOAT的女装系列从品牌中分裂出去，独立成为新的设计师女性品牌，并以她自己的名字为品牌名——“YUZUKI.S”，中文名“沈梦云”。品牌的LOGO以罂粟花配上品牌名，寓意YUZUKI.S的产品都充满了一种“让人疯狂迷恋的诱惑”。'
              },
              {
                order : '3243242',
                date : 'cdsfa' ,
                title : '法国砂锅饭',
                checkStatus : '3',
                refuse : '都是来看分水岭DA发F 相对于男装的简约多变，女装系列则以夸张、特别剪裁、细腻的品质感、和天马行空的嬗变为主体风格。2011年，沈梦云（YUZUKI SENG）将FLOAT的女装系列从品牌中分裂出去，独立成为新的设计师女性品牌，并以她自己的名字为品牌名——“YUZUKI.S”，中文名“沈梦云”。品牌的LOGO以罂粟花配上品牌名，寓意YUZUKI.S的产品都充满了一种“让人疯狂迷恋的诱惑”。'
              },
              {
                order : '75463634543',
                date : '43242323' ,
                title : '供电公司',
                checkStatus : '1',
                refuse : 'FLOAT的服装设计分身乏术并非只着重于男装，女装系列也十分出色。相对于男装的简约多变，女装系列则以夸张、特别剪裁、细腻的品质感、和天马行空的嬗变为主体风格。2011年，沈梦云（YUZUKI SENG）将FLOAT的女装系列从品牌中分裂出去，独立成为新的设计师女性品牌，并以她自己的名字为品牌名——“YUZUKI.S”，中文名“沈梦云”。品牌的LOGO以罂粟花配上品牌名，寓意YUZUKI.S的产品都充满了一种“让人疯狂迷恋的诱惑”。'
              }
            ],
            tableData2 : [
              {
                order : '6545635452',
                date : '3455-4-25' ,
                title : '高档辅导费',
                checkStatus : '3',
                status : '0',
                refuse : '大部分撒开发费bbfbb KLNF A对方根本看不卡女大三理念防守打法两年 '

              },
              {
                order : '4243242',
                date : '1111-11-11' ,
                title : '公告标题',
                checkStatus : '3',
                status : '0',
                refuse : '水电费包括办法看卡瓦看吧爱吧吧，厉无畏比开办费看可不可不呗，v附件二百万安保费个案阿飞宝宝健康吧， 版本费吧， '
              },
              {
                order : '324324324',
                date : '4252-52-52' ,
                title : 'GV的方式广告',
                checkStatus : '1',
                status : '0',
                refuse : '尜尜飞娃儿额外保温玻璃东方走了我帮你我不可能吧您好你咯嗯咯为你来吧来了两部分'

              },
              {
                order : '4324242342342',
                date : '1111-11-11' ,
                checkStatus : '1',
                title : '公告标题',
                status : '0',

              }
            ] ,
            isRead : '1',
            // detailInfo: false ,
            content : '',
            inforDate : ''
          }
      },
      mounted(){
        this.reading('1');

      },
      methods : {
        //获取消息条目
        reading(type){
          this.isRead = type ;

          if(type === '1'){
            this.newItems = this.tableData2 ;
          }else if( type === '2'){
            this.newItems = this.tableData1 ;

          }
          // console.log(this.newItems)
        },
        //标记已读
        readIt(){

        },
        //全部标记已读
        readAll(){

        },
        detail(item,type){
          // this.detailInfo = true ;
          // this.content = item.content ;
          // this.inforDate = item.date ;
          // if(type === 1 ){
          //   var num = this.newItems.indexOf(item) ;
          //   if(num != -1){
          //     this.newItems.splice(num,1);
          //     this.oldItems.push(item);
          //   }
          // }
        },

      }
    }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .news{
    width : 90% ;
    margin : 0 auto ;

    .title{
      width : 100% ;
      height : 0.6rem ;
      line-height : 0.6rem ;
      font-size :0.22rem ;
      font-weight : bold ;
      color : #333 ;
      border-bottom : 1px solid #aaa ;
      text-indent : 0.3rem ;
      margin-bottom : 0.3rem ;
    }
    .btn{
      margin : 0.2rem 0 ;
      padding-left : 0.8rem ;
      .read{
        width : 0.6rem ;
        height : 0.3rem ;
        border : 0 ;
        font-size : 0.12rem ;
        text-align : center ;
        line-height : 0.3rem ;
        display : inline-block;
        margin-right : 0.1rem ;
        border-radius : 0.03rem ;
        color : #169Bff;
        background: none;
        padding : 0;
      }
      .isActive{
        border-color : #f56c6c;
        background : #f56c6c ;
        color : #fff;
      }
    }
    table{
        border-collapse: collapse;
        width : 90% ;
        margin : auto ;
        tr{
          height : 0.4rem ;
          width : 100% ;
          td{
            width : 25% ;
            text-align : center;
            font-size : 0.14rem ;
            color : #444 ;
            position : relative ;

            b{
              position : absolute ;
              top : 0.08rem ;
              right : 26% ;
              width : 0.08rem ;
              height : 0.08rem ;
              border-radius : 50% ;
              background-color : #ff1100 ;
              display : inline-block;
            }
            .detail{
              color : #169Bff;
            }
          }
        }
      }
    .detailBox{
      width : 80% ;
      margin : 0.2rem auto ;
      border : 1px solid #D3D3D3 ;
      border-radius : 0.05rem ;

      .detailTitle{
        width : 100% ;
        height : 0.5rem ;
        border-bottom : 1px solid #D3D3D3 ;
        font-size : 0.2rem ;
        font-weight : bold ;
        color : #456 ;
        text-align : center ;
        line-height : 0.5rem ;
        position : relative ;
          img{
            position : absolute ;
            right : 0.05rem ;
            top : 0.05rem ;
            width : 0.25rem ;
            height : 0.25rem ;
            display: inline-block;
            /*background : #f0f0f0 ;*/
        }
      }
      .detailContent{
        span{
          width : 70% ;
          text-align : center ;
          color : #999 ;
          font-size : 0.14rem ;
          height : 0.5rem ;
          line-height : 0.5rem;
          display : block ;
          margin : 0 auto ;
        }

        .readBtn{
          display : flex ;
          justify-content: center;
          margin-bottom : 0.3rem ;
        }
        .passage{
          margin : 0.3rem auto ;
          width : 90% ;
          text-indent : 0.34rem ;
          font-size : 0.14rem ;
          color : #333 ;
          /*height : 2rem ;*/
          line-height : 0.3rem ;
          display: block;

        }

      }
    }
    .news_box{
      width : 90% ;
      margin : 0.5rem auto ;
      display: flex;
      flex-direction: column;
      border : 1px solid #dcdfe6 ;
      padding: 0.3rem ;
      border-radius : 0.05rem ;

      li{
        display: flex;
        flex-direction: row;
        margin-bottom : 0.1rem ;
        border-bottom: 1px solid #dcdfe6;

        .tips_icon{
          width : 0.4rem  ;
          height : 0.4rem ;
          display: inline-block;
          margin : auto 0.2rem ;
        }
        .success_icon{
          background : url('../../assets/imgs/success.png') no-repeat center ;
          background-size : contain;
        }
        .wrong_icon{
          background : url('../../assets/imgs/wrong.png') no-repeat center ;
          background-size : contain;
        }
        .news_content{
          width : 80% ;
          display: flex;
          flex-direction: column;
          li{
            color : #333 ;
            line-height : 0.4rem ;
            margin : 0!important;

            border-bottom: 0;
            .news_title{
              font-size : 0.2rem ;
              font-weight : bold ;
              span{
                font-size : 0.12rem ;
                font-weight : 100 ;
                color : #aaa ;
                margin-left : 0.3rem ;
                display: inline-block;
              }
            }
            .news_detail{
              font-size : 0.14rem ;
              .order{
                text-decoration: underline;
              }
              .success_order{
                color : #67c23a;
              }
            }
          }
        }
        .mark{
          float : right ;

        }
      }
      li:nth-last-child(1){
        border-bottom : 0;
      }

    }
  }

</style>
