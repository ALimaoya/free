<template>
  <div class="news">
    <div class="title">平台公告</div>
    <div class="btn">
      <button class="read" :class="isRead==='1'?'isActive':''" @click="reading('1')">未读</button>
      <button class="read" :class="isRead==='2'?'isActive':''" @click="reading('2')">已读</button>
      <!--<el-button size="small" autofocus>未读</el-button>-->
      <!--<el-button size="small">已读</el-button>-->
    </div>
    <div v-show="detailInfo==false">
      <table border="1" bordercolor="#D3D3D3" v-if="isRead==='1'">
        <tr v-for="(item,index) in newItems" >
          <td>{{ item.name}}<b></b></td>
          <td>{{ item.date}}</td>
          <td>{{ item.title}}</td>
          <td><span class="detail" @click="detail(newItems[news],1)">查看详情</span></td>
        </tr>
      </table>
      <table border="1" bordercolor="#D3D3D3" v-else="isRead==='2'">
        <tr v-for="(item,index) in oldItems" >
          <td>{{ item.name}}</td>
          <td>{{ item.date}}</td>
          <td>{{ item.title}}</td>
          <td><span class="detail" @click="detail(oldItems[news],2)">查看详情</span></td>
        </tr>
      </table>
    </div>
    <div class="detailBox" v-if="detailInfo">
    <div class="detailTitle">公告标题<img src="../../assets/imgs/close.png" @click="detailInfo= false"/></div>
      <div class="detailContent">
        <span>{{ inforDate }}</span>
        <div class="passage">{{ content }}</div>
        <div class="readBtn">
          <el-button type="primary" size="small" @click="detailInfo= false">确认已读</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
      name: "index" ,
      data(){
          return{
            oldItems : [
              {
                name : '系统通知',
                date : '222' ,
                title : '公告标题',
                content : '2008年FLOAT以“发声”为品牌精\n' +
                'YUZUKI.S\n' +
                'YUZUKI.S(6张)\n' +
                ' 神，推出对社会现象批判性的一系列产品，获得潮流界的一致好评。当年产品被刊登于国内各大潮流杂志。后来FLOAT设计理念跟随设计师思想的转变，向着功能性和运动性方向发展，试图融入更多的元素，但坚持产品的简单性，摒弃复杂和口号性的图案印花。\n' +
                'FLOAT的服装设计并非只着重于男装，女装系列也十分出色。相对于男装的简约多变，女装系列则以夸张、特别剪裁、细腻的品质感、和天马行空的嬗变为主体风格。2011年，沈梦云（YUZUKI SENG）将FLOAT的女装系列从品牌中分裂出去，独立成为新的设计师女性品牌，并以她自己的名字为品牌名——“YUZUKI.S”，中文名“沈梦云”。品牌的LOGO以罂粟花配上品牌名，寓意YUZUKI.S的产品都充满了一种“让人疯狂迷恋的诱惑”。'
              },
              {
                name : '撒把人各施工',
                date : 'cdsfa' ,
                title : '法国砂锅饭',
                content : '都是来看分水岭DA发F 相对于男装的简约多变，女装系列则以夸张、特别剪裁、细腻的品质感、和天马行空的嬗变为主体风格。2011年，沈梦云（YUZUKI SENG）将FLOAT的女装系列从品牌中分裂出去，独立成为新的设计师女性品牌，并以她自己的名字为品牌名——“YUZUKI.S”，中文名“沈梦云”。品牌的LOGO以罂粟花配上品牌名，寓意YUZUKI.S的产品都充满了一种“让人疯狂迷恋的诱惑”。'
              },
              {
                name : '打发房产税',
                date : '43242323' ,
                title : '供电公司',
                content : 'FLOAT的服装设计分身乏术并非只着重于男装，女装系列也十分出色。相对于男装的简约多变，女装系列则以夸张、特别剪裁、细腻的品质感、和天马行空的嬗变为主体风格。2011年，沈梦云（YUZUKI SENG）将FLOAT的女装系列从品牌中分裂出去，独立成为新的设计师女性品牌，并以她自己的名字为品牌名——“YUZUKI.S”，中文名“沈梦云”。品牌的LOGO以罂粟花配上品牌名，寓意YUZUKI.S的产品都充满了一种“让人疯狂迷恋的诱惑”。'
              }
            ],
            newItems : [
              {
                name : '系统通知',
                date : '3455425' ,
                title : '高档辅导费',
                content : '大部分撒开发费bbfbb KLNF A对方根本看不卡女大三理念防守打法两年 '

              },
              {
                name : '系统通知',
                date : '111111' ,
                title : '公告标题',
                content : '水电费包括办法看卡瓦看吧爱吧吧，厉无畏比开办费看可不可不呗，v附件二百万安保费个案阿飞宝宝健康吧， 版本费吧， '
              },
              {
                name : '系统通知',
                date : '4252523452' ,
                title : 'GV的方式广告',
                content : '尜尜飞娃儿额外保温玻璃东方走了我帮你我不可能吧您好你咯嗯咯为你来吧来了两部分'

              },
              {
                name : '系统通知',
                date : '111111' ,
                title : '公告标题',

              }
            ] ,
            isRead : '1',
            detailInfo: false ,
            content : '',
            inforDate : ''
          }
      },
      create(){


      },
      methods : {
        reading(index){
          this.isRead = news ;
          this.detailInfo = false  ;

        },
        detail(item,type){
          this.detailInfo = true ;
          this.content = item.content ;
          this.inforDate = item.date ;
          if(type === 1 ){
            var num = this.newItems.indexOf(item) ;
            if(num != -1){
              this.newItems.splice(num,1);
              this.oldItems.push(item);
            }
          }
        }
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
        border : 1px solid #dedede ;
        font-size : 0.12rem ;
        text-align : center ;
        line-height : 0.3rem ;
        display : inline-block;
        margin-right : 0.1rem ;
        border-radius : 0.03rem ;
        color : #666;
        background: none;
        padding : 0;
      }
      .isActive{
        border-color : #1890FF;
        color : #1890FF;
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

  }

</style>
