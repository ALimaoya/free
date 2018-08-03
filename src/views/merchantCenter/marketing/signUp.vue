<template>
    <div class="signUp">
      <div v-if="!goOther">
        <div class="topTitle">
          <img class="logo" v-if="content[type-1]!== undefined" :src="content[type-1].img" alt="" />
          <div class="titleContent">
            <p v-if="content[type-1]!== undefined">{{ content[type-1].title}}<span>{{ progress[0] }}</span></p>
            <div>活动时间：长期招商</div>
            <div><span>报名资质：</span>
              <div class="tips"><img  src="../../../assets/imgs/success.png"/><div>您的店铺已达到报名要求</div></div>
              <div class="tips"><img src="../../../assets/imgs/wrong.png"/><div>很抱歉，您的店铺还未达到报名要求</div></div>
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
            <tr><td>店铺无限制</td><td>活动期间商家不在店铺限制中</td><td><img  src="../../../assets/imgs/success.png"/></td></tr>
            <tr><td>店铺账户资金状态</td><td>店铺缴纳保证金方可报名活动</td><td><img src="../../../assets/imgs/wrong.png"/></td></tr>
          </table>
        </div>
        <div v-else="show == '2'">
          <p class="h_title">报名记录</p>
          <el-table  :data="tableData"  border fit >
            <el-table-column prop="id" label="商品ID" ></el-table-column>
            <el-table-column prop="productName" label="商品名称" ></el-table-column>
            <el-table-column prop="oldPrice" label="原价" ></el-table-column>
            <el-table-column prop="activityPrice" label="活动价" ></el-table-column>
            <el-table-column prop="stock" label="线上库存" ></el-table-column>
            <el-table-column label="审核状态">
              <template slot-scope="scope">
                <span>{{ checkStatus[scope.row.status-1]}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="date" label="活动时间" ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="cancelActivity(scope.$index,scope.row.id)">取消活动</el-button>
                <el-button type="text" @click="detail(scope.$index,scope.row.id)">详情</el-button>
                <el-button type="text" @click="refuseReason(scope.$index,scope.row.id)">拒绝原因</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <el-dialog  title="店铺需要符合报名要求如下：" :visible.sync="dialogVisible" width="50%" center>
        <div>1、店铺缴纳保证金方可报名活动。</div>
      </el-dialog>
      <el-dialog  title="审核拒绝原因" :visible.sync="refuseVisible" width="50%" center>
        <div>{{ reason }}</div>
      </el-dialog>
      <el-dialog  title="报名活动详情" :visible.sync="detailVisible" width="70%" center>
        <div class="box_content">
          <p class="time">活动报名时间：</p>
          <div class="goods_wrap">
            <div class="goods">
              <p class="title">商品信息</p>
              <dl><dd><img src="" alt=""/></dd>
                <dt><span></span><span>商品编号：</span><span>￥</span></dt></dl>
            </div>
            <div class="goods">
              <p class="title">白底图</p>
              <img class="mainImg" src="" alt="" @click="showImg()"/>
            </div>
            </div>
          <div class="goodsInfo">
            <div>
              <span v-if="type==='1'">活动秒杀价格：</span><span v-else="type==='2'">分享购价格：</span><span>{{ activityInfo.price}}</span>
            </div>
            <div>
              <span>报名活动库存数量：{{ activityInfo.goodsNum }}件</span>
            </div>
          </div>
          <div v-if="isCancel" class="btn_wrap">
            <el-button type="primary" size="small"  @click="handleCancel">取消活动</el-button>
          </div>
        </div>
      </el-dialog>
      <div class="mask" v-if="bigImg !== ''" @click="bigImg = '' ">
        <img :src="imageDomain+ bigImg" alt="" />
      </div>
      <component v-else="goOther" :is="tabView" @getContent="sign"></component>
    </div>

</template>

<script>
  import chooseDate from "@/views/merchantCenter/marketing/chooseDate";
  import signContent from "@/views/merchantCenter/marketing/signContent";
  import success from "@/views/merchantCenter/marketing/success"

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
        tabView: 'success',
        getContent: '',
        goOther: true,
        content: [
          {
            img: seconds,
            title: '首页—0.9元秒杀频道活动报名',

          },
          {
            img: share,
            title: '首页—0.9元秒杀频道活动报名',

          }
        ],
        progress: ['进行中'],
        list: ['活动介绍', '资质要求', '报名记录'],
        show: '0',
        dialogVisible: false,
        intro: [
          ['丫贝APP端首页—0.9秒杀频道', '活动时间：长期招商', '资源位：首页0.9秒杀频道', '收费方式：免费', '活动要求：', '品类要求：无特殊要求',
            '图片要求：高清图、缩略图、图上不得有字，不得有标；图片清晰美观', '价格要求：在特价时间内做5-8折的限时活动；低至0.9元', '名额有限，先到先得，请尽早提报！'],
          ['丫贝APP端首页—推荐商品分享购大图资源位频道', '活动时间：长期招商', '资源位：首页推荐商品分享购大图资源位频道', '收费方式：免费', '活动要求：', '品类要求：无特殊要求',
            '图片要求：高清图、缩略图、图上不得有字，不得有标；图片清晰美观', '价格要求：在特价时间内做5-8折的限时活动', '名额有限，先到先得，请尽早提报！']
        ],
        tableData: [],
        checkStatus: ['审核中', '审核拒绝', '审核通过', '已取消'],
        refuseVisible: false,
        detailVisible: false,
        reason: '',
        activityInfo: {},
        isCancel: false,
        bigImg: '',
        imageDomain: process.env.IMAGE_DOMAIN,


      }
    },
    mounted() {
      //获取活动类型
      this.type = this.$route.query.type;
      this.getList();

    },
    methods: {
      getList() {
        this.tableData = [
          {
            id: '1',
            productName: '的西城时代',
            oldPrice: '123',
            activityPrice: '333',
            stock: '345',
            status: '1',
            date: '2018-12-5-25'
          }
        ]
      },
      signNow() {
        this.tabView = 'chooseDate';
        this.goOther = true;
      },

      cancelActivity(index, id) {
        this.isCancel = true;
        this.detailVisible = true;

      },
      detail(index, id) {
        this.detailVisible = true;
        this.isCancel = false;

      },
      refuseReason(index, id) {
        this.refuseVisible = true;
        // this.reason =
      },
      handleCancel() {
        this.detailVisible = false;

      },
      showImg() {
        // this.bigImg =
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
    .el-table{
      width : 90% ;
      margin : auto ;
      .el-button{
        width : 100% ;
        padding : 0 ;
        text-align: center;
        margin : 0;
      }
    }
    .box_content{
      padding : 0.3rem 0.2rem ;
      font-size : 0.16rem ;
      line-height : 2 ;
      .goods_wrap{
        display: flex;
        flex-direction: row;
        margin-top : 0.3rem ;
        .goods{
          .title{
            font-size :0.28rem ;
            font-weight: bold ;
            text-align: center;
            line-height : 0.4rem ;
          }
          dl{
            dd,dt{
              float : left ;
              margin : 0.1rem ;

            }
            dd{
              width : 1rem ;
              height : 1rem ;
              float : left ;
              img{
                width : 100% ;
                height : 100% ;
              }
            }
            dt{
              display: flex;
              flex-direction: column;

            }
          }
          .mainImg{
            width : 1rem ;
            height : 1rem ;
            margin: auto ;
          }
        }
        .goods:nth-child(1){
          flex : 1 ;
        }
        .goods:nth-child(2){
          width: 30% ;
        }
      }
      .goodsInfo{
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        div:nth-child(1){
          margin-right : 0.3rem ;
        }
      }
      .btn_wrap{
        margin-top : 0.5rem ;
        text-align: center;
      }
    }
  }


</style>
