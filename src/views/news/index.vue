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
          <td>{{ item.content}}</td>
          <td><span class="detail" @click="detail(index)">查看详情</span></td>
        </tr>
      </table>
      <table border="1" bordercolor="#D3D3D3" v-else="isRead==='2'">
        <tr v-for="(item,index) in oldItems" >
          <td>{{ item.name}}</td>
          <td>{{ item.date}}</td>
          <td>{{ item.content}}</td>
          <td><span class="detail" @click="detail(index)">查看详情</span></td>
        </tr>
      </table>
    </div>
    <div class="detailBox" v-if="detailInfo">
    <div class="detailTitle">公告标题<img src="../../assets/imgs/close.png" alt="" @click="detailInfo= false"/></div>
      <div class="detailContent">
        <p></p>
        <div>
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
                content : '公告标题',

              }
            ],
            newItems : [
              {
                name : '系统通知',
                date : '111111' ,
                content : '公告标题',

              }
            ] ,
            isRead : '1',
            detailInfo: false
          }
      },
      create(){


      },
      methods : {
        reading(index){
          this.isRead = index ;

        },
        detail(index){
          this.detailInfo = true ;
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
            border-radius : 0.05rem ;
            display: inline-block;
            background : #f0f0f0 ;
        }
      }
      .detailContent{
        div{
          display : flex ;
          justify-content: center;
        }
      }
    }

  }

</style>
