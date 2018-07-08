<template>
  <div class="flow-detail tableBox">
    <div class="taskInfo">
      <div class="taskImg">
        <el-upload  class="upload"  :action="imgUrl" :multiple="false" v-model.trim="activity.showImageUrl"
                    :on-success="handleGoodsSuccess"   :show-file-list="false"  :before-upload="beforeShowUpload"
                    :headers="{ 'Content-Type': 'multipart/form-data','yb-tryout-merchant-token':token}">
          <img v-if="showImg"  :src="showImg" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <el-button type="primary" @click="beforeShowUpload">更换图片</el-button>
      </div>
      <ul class="taskDetail">
        <li><span>活动类型：</span><span>流量模式</span></li>
        <li><span>平台类型：</span><span></span></li>
        <li><span>商品名称：</span><span></span></li>
        <li><span>商家账号：</span><span></span></li>
        <li><span>商铺名称：</span><span></span></li>
        <li><span>商品链接：</span><span></span></li>
        <li><span>关键词：</span><span><el-button type="primary" @click="showKey" v-if="this.key">点击显示关键词</el-button><span v-else="!this.key" ></span></span></li>
        <li><span>发布数量：</span><span></span></li>
        <li><span>支付状态：</span><span></span></li>
        <li><span>放单时间：</span><span></span></li>
        <li><span>放单间隔时间：</span><span></span></li>
        <li><span>完成数量：</span><span></span></li>
        <li><span>每单佣金：</span><span></span></li>
        <li><span>活动编号：</span><span></span></li>

      </ul>
    </div>
    <div class="taskOrder tableBox">
      <h1>任务查询</h1>
      <search-bar @searchobj="getData" :platform-type="true" :activity-shop="true" :activity-code="true" :activity-status="true" :flow="true"></search-bar>
      <el-table :data="tableData" border>
        <el-table-column label="序号" width="80"></el-table-column>
        <el-table-column prop="orderCode" label="订单流水号" ></el-table-column>
        <el-table-column prop="orderShop" label="店铺名称" ></el-table-column>
        <el-table-column prop="activityCode" label="活动编号" ></el-table-column>
        <el-table-column prop="platform" label="平台类型">
          <template slot-scope="scope">
            {{ platformOptions[scope.row.platform].name }}
          </template>
        </el-table-column>
        <el-table-column prop="thirdAccount" label="试客第三方账号"></el-table-column>
        <el-table-column prop="orderDate" label="订单创建时间" ></el-table-column>
        <el-table-column prop="search" label="搜索截图">
          <template slot-scope="scope">
            <img class="mainPic" @click="showImg( scope.row.mainImageUrl)" :src=" imageDomain + scope.row.mainImageUrl " alt="" />
          </template>
        </el-table-column>
        <el-table-column prop="" label="收藏截图">
          <template slot-scope="scope">
            <img class="mainPic" @click="showImg( scope.row.likeImageUrl)" :src=" imageDomain + scope.row.likeImageUrl " alt="" />
          </template>
        </el-table-column>
        <el-table-column prop="status" label="任务状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status==99">已完成</span>
            <span v-else-if="scope.row.status==11">订单失败</span>
            <span v-else-if="scope.row.status==12">结算中</span>
            <span v-else>{{ options[scope.row.status].name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button  type="text" @click="goDetail(scope.$index,scope.row.orderId)">查看详情</el-button>
            <el-button  type="text" @click="handleCheck(scope.$index,'1')">审核成功</el-button>
            <el-button  type="text"  @click="handleCheck(scope.$index,'2')">审核失败</el-button>
            <el-button  type="text"  @click="refuseReason(scope.$index)">查看拒绝原因</el-button>

          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="block2" v-if="tableData.length>0">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-size="pageSize"
        :current-page="currentPage"
        :page-sizes="[10, 15, 20]"
        layout=" sizes, prev, pager, next, jumper"
        :total="totalElements">
      </el-pagination>
      <span class="totalItems">共{{ totalPages }}页，{{totalElements}}条记录</span>
    </div>

    <div v-if="mask" @click="close" class="mask">
      <img :src=" imageDomain + bigImg" alt="" />
    </div>
  </div>
</template>

<script>
  import  searchBar  from "@/components/searchBar";
  import ElUpload from "element-ui/packages/upload/src/index";
  import { uploadImage } from "@/api/activity"
  import { getToken } from '@/utils/auth'

  export default {
      name: "flow-detail",
      data(){
        return{
          platformOptions : [
            {
              value: '',
              name : '全部平台'
            },
            {
              value: '1',
              name : '淘宝'
            },
            {
              value : '2',
              name : '天猫'
            },
            {
              value : '3',
              name : '京东'
            },
            // {
            //   value : '4',
            //   name : '拼多多'
            // }
          ],
          options : [
            {
              name : '全部状态',
              value : ''
            },
            {
              name : '暂停',
              value : '1'
            },
            {
              name : '进行中',
              value : '2'
            },

            {
              name : '申请退款',
              value : '3'
            },
            {
              name : '退款成功',
              value : '4'
            },
            {
              name : '待开始',
              value : '5'
            },  {
              name : '未支付',
              value : '6'
            }
          ],
          activity : {},
          order: {
            EQ_platformType : '',
            EQ_activityCode : '',
            thirdOrderCode : '',
            EQ_activityStatus : '',
            GT_activityEndTime: '',
            LT_activityStartTime : '',
          },
          tableData : [],
          currentPage : 1 ,
          pageSize : 10 ,
          totalPages : '',
          totalElements : 0 ,
          token : getToken(),
          imgUrl: process.env.BASE_API+'/tryout/file/upload',   // 上传图片的域名
          imageDomain : process.env.IMAGE_DOMAIN , //获取图片的外链域名
          showImg : '',
          mask : false ,
          bigImg : '',
          activityId : '',
          key:true
        }
      },
      components : {
        ElUpload,
        searchBar
      },
      mounted(){
        this.getActivityInfo();
      },
      methods : {
        //获取活动信息
        getActivityInfo(){
          this.activityId = this.$route.params.order;
          // this.showImg = this.imageDomain + this.activity.showImageUrl ;

          // console.log(this.activityId);
          this.getList(this.activityId);

        },
        //获取该活动所有订单
        getList(activityId){

          // let formData = new FormData();
          // formData.append('EQ_tryoutActivity.platformType',this.order.platformType);
          // let reg = /^[0-9]*$/;
          // if( reg.test(this.order.activityCode)){
          //   formData.append('EQ_tryoutActivity.activityCode', this.order.activityCode);
          // }else{
          //   formData.append('EQ_tryoutActivity.activityCode', '');
          // }
          // if( reg.test(this.order.thirdOrderCode)){
          //   formData.append('EQ_tryoutOrderWin.thirdOrderCode', this.order.thirdOrderCode);
          // }else{
          //   formData.append('EQ_tryoutOrderWin.thirdOrderCode', '');
          // }
          //
          // formData.append('EQ_status',this.order.EQ_status);
          // formData.append('currentPage', this.currentPage);
          // formData.append('pageSize', this.pageSize);
          // this.tableData = res.tableData ;
          // this.totalPages = res.totalPages ;
          // this.totalElements = res.totalElements ;
        },
        //判断需要上传的图片的尺寸
        beforeShowUpload(file) {
          let reader = new FileReader();
          let ret = [];
          let _this = this ;
          reader.onload = (e)=>{
            let image = new Image();
            image.onload = function() {
              const isHeight = this.height;
              const isWidth = this.width;
              if (isWidth > 800 || isHeight > 800) {
                _this.$message.error('图片尺寸过大，请重新选择后上传');
                return false;
              }else{
                let formData = new FormData();
                formData.append('image',file);
                uploadImage(formData).then( res => {
                  _this.showImg = res.data.data.filePath ;
                    _this.activity.showImageUrl = res.data.data.fileName ;
                })
              }
            };
            image.src = e.target.result ;
          };
          reader.readAsDataURL(file);



        },
        //上传商品主图
        handleGoodsSuccess(res, file) {
          // this.form.mainImageUrl = URL.createObjectURL(file.raw);
          // this.$refs.mainImageUrl.resetFields();

        },
        //显示关键词
        showKey(){
          this.key = !this.key ;
        },
        //搜索获取对应条件订单
        getData(res){
          this.order ={...res }  ;
          // console.log(this.order);
          this.getList();
        },
        handleSizeChange(val) {
          this.pageSize = val ;
          this.getList();
        },
        handleCurrentChange(val) {
          this.currentPage = val ;
          this.getList();
        }
      }
    }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import 'src/styles/table';
  .taskInfo{
    width : 100% ;
    display: block;
    height : 250px; ;
    padding : 0.5rem 0.6rem 0.2rem;
    box-sizing: border-box;
    .taskImg{
      width : 30% ;
      height : 100% ;
      float: left;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .upload{
        width : 45% ;
        margin : 0 auto ;
      }
      .el-button{
          width : 80px;
        margin-top : 10px;
      }
    }
    .taskDetail{
      float: left;
      display: flex;
      width : 70% ;
      /*flex : 1 ;*/
      flex-direction: row;
      flex-wrap: wrap;
      li{
        width : 33.3% ;
        height : 30px;
        color : #333;
        span{
          flex-direction: row;
          /*display: inline-block;*/
          height : 100% ;
          line-height : 30px;
          font-size : 0.12rem ;
          .el-button{
            margin-left : 20px;
          }
        }
      }
    }
    .el-button{
      /*width : 80px ;*/
      height : 25px;
      font-size : 0.12rem;
      padding : 0 10px;
      text-align : center ;
    }

  }
  .taskOrder{
    h1{
      width : 100% ;
      height : 50px;
      line-height : 50px;
      background : #eee;
      text-align : center;
      font-size : 0.22rem ;
      color : #666;
      border : 0;
      padding : 0;
    }
  }
</style>
