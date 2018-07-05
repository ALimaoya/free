<template>
  <div class="flowOrder tableBox"  :data="tableData" border  v-loading="loading"  element-loading-text="拼命加载中">
    <h1>流量订单查询</h1>
    <search-bar @searchobj="getData" :platform-type="true" :activity-shop="true" :activity-code="true" :flow-status="true" :flow="true"></search-bar>
    <!--<div class="note">备注：以上搜索条件可根据单一条件进行搜索，当单独试客淘宝号搜索不到有用信息时，可尝试输入淘宝订单编号，反之亦然</div>-->
    <el-table>
      <el-table-column label="序号" width="80" prop="orderId" ></el-table-column>
      <el-table-column prop="orderCode" label="订单流水号" ></el-table-column>
      <el-table-column prop="shopName" label="店铺名称" ></el-table-column>
      <el-table-column prop="activityCode" label="活动编号" ></el-table-column>
      <el-table-column prop="platform" label="平台类型">
        <template slot-scope="scope">
          {{ platformOptions[scope.row.platform].name }}
        </template>
      </el-table-column>
      <el-table-column prop="thirdAccount" label="试客第三方账号"></el-table-column>
      <el-table-column prop="receiveTime" label="订单创建时间" ></el-table-column>
      <el-table-column prop="searchImageUrl" label="搜索截图">
        <template slot-scope="scope">
          <img v-if="scope.row.searchImageUrl!==null" class="showPic" @click="showImg( scope.row.searchImageUrl )" :src=" imageDomain + scope.row.searchImageUrl " alt="" />
        </template>
      </el-table-column>
      <el-table-column prop="collectImageUrl" label="收藏截图">
        <template slot-scope="scope">
          <img v-if="scope.row.collectImageUrl !== null" class="showPic" @click="showImg( scope.row.collectImageUrl)" :src=" imageDomain + scope.row.collectImageUrl" alt="" />
        </template>
      </el-table-column>
      <el-table-column prop="status" label="订单状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status==99">已完成</span>
          <span v-else-if="scope.row.status==11">订单失败</span>
          <span v-else-if="scope.row.status==4">审核中</span>
          <span v-else-if="scope.row.status==3">已接单</span>

          <!--<span v-else>{{ options[scope.row.status].name}}</span>-->
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button  type="text" @click="goDetail(scope.$index,scope.row.orderId)">查看详情</el-button>
          <!--<el-button  type="text" @click="handleCheck(scope.$index,'1')">审核成功</el-button>-->
          <!--<el-button  type="text"  @click="handleCheck(scope.$index,'2')">审核失败</el-button>-->
          <!--<el-button  type="text"  @click="refuseReason(scope.$index)">查看拒绝原因</el-button>-->

        </template>
      </el-table-column>
    </el-table>
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
  import { getOrderList ,changeStatus } from "@/api/activity";
  import  searchBar  from "@/components/searchBar";

  export default {
      name: "flow-order",
    components : {
      searchBar
    },

      data(){
          return {
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
            order : {
              EQ_status: '',
              // thirdAccount: '',
              platformType : '' ,
              activityCode : '',
              thirdOrderCode: '',
              EQ_activityShop : '',
              activityStartTime : '',
              activityEndTime : '',
              EQ_activityType : '4'
              // currentPage : 1,
              // pageSize : 10
            },
            tableData : [],
            currentPage : 1 ,
            pageSize : 10 ,
            totalPages : '',
            totalElements : 0 ,
            complaintOrder : '',
            complainBox : false ,
            imageDomain : process.env.IMAGE_DOMAIN ,
            mask : false ,
            bigImg : '',
            loading : true ,

          }
      },
      mounted(){
        this.getList();
      },
      methods : {
        //获取订单列表
        getList(){
          let formData = new FormData();
          formData.append('EQ_tryoutActivity.platformType',this.order.platformType);
          let reg = /^[0-9]*$/;
          if( reg.test(this.order.activityCode)){
            formData.append('EQ_tryoutActivity.activityCode', this.order.activityCode);
          }else{
            formData.append('EQ_tryoutActivity.activityCode', '');
          }
          // if( reg.test(this.order.thirdOrderCode)){
          //   formData.append('EQ_tryoutOrderWin.thirdOrderCode', this.order.thirdOrderCode);
          // }else{
          //   formData.append('EQ_tryoutOrderWin.thirdOrderCode', '');
          // }

          formData.append('EQ_status',this.order.EQ_status);
          formData.append('EQ_activityType',this.order.EQ_activityType);
          formData.append('EQ_tryoutActivity.tryoutMerchantShop.shopId',this.order.EQ_activityShop);
          formData.append('GT_tryoutActivity.activityStartTime',this.order.activityStartTime);
          formData.append('LT_tryoutActivity.activityEndTime',this.order.activityEndTime);
          formData.append('currentPage', this.currentPage);
          formData.append('pageSize', this.pageSize);
          this.loading = true ;

          getOrderList(formData).then( res=> {
            this.loading = false ;

            if(res.data.status === '000000000'){
              // console.log(res)

              this.tableData = res.data.data ;
              this.totalPages = res.data.totalPages ;
              this.totalElements = res.data.totalElements ;
              // let imgList = res.data.data.imageList
              // imgList.map( i => {
              //   if(i.type === '5'){
              //     this.tableData.searchImg = i.imageUrl ;
              //   }
              //   if(i.type === '1'){
              //     this.tableData.likeImg = i.imageUrl ;
              //
              //   }
              // })
              // console.log( this.totalElements)
            }
          }).catch( err => {
            alert('服务开小差啦，请稍等~');

          })
        },
        //根据搜索条件获取订单列表
        getData(res){
          this.order ={...res }  ;
          // console.log(this.order);
          this.currentPage = 1 ;
          this.getList();
        },
        //查看订单详情
        goDetail(index,order){
          this.$router.push('/freeManage/order/flowDetail/'+ order) ;

        },
        //查看宝贝大图
        showImg(url){
          this.mask = true ;
          this.bigImg = url ;
        },
        close(){
          this.mask = false ;
          this.bigImg = '' ;
        },
        handleSizeChange(val) {
          this.pageSize = val ;
          this.getList();
        },
        handleCurrentChange(val) {
          this.currentPage = val ;
          this.getList();
        },

      },

    }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "src/styles/table";
</style>
