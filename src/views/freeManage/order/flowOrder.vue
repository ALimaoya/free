<template>
  <div class="flowOrder tableBox"    v-loading="loading"  element-loading-text="拼命加载中">
    <h1>流量订单查询</h1>
    <search-bar @searchobj="getData" :platform-type="true" :activity-shop="true" :activity-code="true" :flow-status="true" :flow="'flowOrder'" :flow-way="true"></search-bar>
    <el-table :data="tableData" border>
      <el-table-column label="序号" width="80" prop="orderId" ></el-table-column>
      <el-table-column prop="orderCode" label="订单流水号" ></el-table-column>
      <el-table-column prop="shopName" label="店铺名称" ></el-table-column>
      <el-table-column prop="activityCode" label="活动编号" ></el-table-column>
      <el-table-column prop="platform" label="平台类型">
        <template slot-scope="scope">
          {{ platformOptions[scope.row.platform].name }}
        </template>
      </el-table-column>
      <el-table-column prop="addServiceType" label="流量方式"></el-table-column>
      <el-table-column prop="thirdAccount" label="试客第三方账号"></el-table-column>
      <el-table-column prop="createTime" label="订单创建时间" ></el-table-column>
      <el-table-column prop="searchImageUrl" label="搜索截图">
        <template slot-scope="scope">
          <img v-if="scope.row.searchImageUrl!==null" class="showPic" @click="showImg( scope.row.searchImageUrl )" :src=" imageDomain + scope.row.searchImageUrl " :onerror="errorImg"/>
          <img :src="failImg"  v-else class="showPic">
        </template>
      </el-table-column>
      <el-table-column prop="collectImageUrl" label="收藏截图">
        <template slot-scope="scope">
          <img v-if="scope.row.collectImageUrl !== null" class="showPic" @click="showImg( scope.row.collectImageUrl)" :src=" imageDomain + scope.row.collectImageUrl" :onerror="errorImg"/>
          <img :src="failImg"  v-else class="showPic">
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
  import userPhoto from '@/assets/404_images/fail.png'

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
            order : {},
            tableData : [],
            currentPage : 1 ,
            pageSize : 10 ,
            totalPages : 0,
            totalElements : 0 ,
            complaintOrder : '',
            complainBox : false ,
            imageDomain : process.env.IMAGE_DOMAIN ,
            mask : false ,
            bigImg : '',
            loading : true ,
            errorImg:'this.src="' + userPhoto + '"',
            failImg: userPhoto,
          }
      },
      mounted(){
        this.order = this.$store.state.searchBar.flowOrder.order;
        this.currentPage = this.$store.state.searchBar.flowOrder.currentPage;
        this.pageSize = this.$store.state.searchBar.flowOrder.pageSize;
        this.getList();
      },
      methods : {
        //获取订单列表
        getList(){
          let formData = new FormData();
          let flowWayArr = ['0','0','0','0','0'];
            if(this.order.LIKE_addServiceType.indexOf('A') != -1 ){
              flowWayArr[0]='A';
            }
            if(this.order.LIKE_addServiceType.indexOf('B') != -1 ){
              flowWayArr[1]='B';
            }
            if(this.order.LIKE_addServiceType.indexOf('C') != -1 ){
              flowWayArr[2]='C';
            }
            if(this.order.LIKE_addServiceType.indexOf('D') != -1 ){
              flowWayArr[3]='D';
            }
            if(this.order.LIKE_addServiceType.indexOf('E') != -1 ){
              if(this.order.LIKE_addServiceType2 === '' || this.order.LIKE_addServiceType2 === undefined || this.order.LIKE_addServiceType2 === null){
                this.$message.error('请选择浏览店内其他宝贝个数');
                return false
              }else{
                if(this.order.LIKE_addServiceType2 === 1){
                  flowWayArr[4]='E-1'
                }
                if(this.order.LIKE_addServiceType2 === 2){
                  flowWayArr[4]='E-2'
                }
                if(this.order.LIKE_addServiceType2 === 3){
                  flowWayArr[4]='E-3'
                }
              }
            }else{
              this.$set(this.order,'LIKE_addServiceType2','')
            }
            // console.log('this.order',this.order)
          formData.append('LIKE_tryoutActivity.addServiceType',flowWayArr);
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
          if(this.order.activityStartTime === null){
            formData.append('GT_tryoutActivity.activityStartTime','');

          }else{
            formData.append('GT_tryoutActivity.activityStartTime',this.order.activityStartTime);

          }
          if(this.order.activityEndTime === null){
            formData.append('LT_tryoutActivity.activityEndTime','');

          }else{
            formData.append('LT_tryoutActivity.activityEndTime',this.order.activityEndTime);

          }
          formData.append('currentPage', this.currentPage);
          formData.append('pageSize', this.pageSize);
          this.loading = true ;
          let dataStorage = {
            order : {
              ...this.order,
            },
            currentPage :this.currentPage,
            pageSize : this.pageSize,
          };
          // console.log('dataStorage',dataStorage)
          this.$store.commit('saveFlowOrder',dataStorage);
          getOrderList(formData).then( res=> {
              //  console.log(res)
              this.loading = false ;
              if( res.data.status === '000000000'){
                this.tableData = res.data.data ;
                this.totalPages = res.data.totalPages ;
                this.totalElements = res.data.totalElements ;
              }
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
          })
        },
        //根据搜索条件获取订单列表
        getData(res){
          // this.order ={
            this.order.EQ_status= res.EQ_status===undefined?'':res.EQ_status,
            this.order.platformType =  res.platformType===undefined?'':res.platformType ,
            this.order.activityCode =  res.activityCode===undefined?'':res.activityCode,
            this.order.EQ_activityShop =  res.EQ_activityShop===undefined?'':res.EQ_activityShop,
            this.order.activityStartTime =  res.activityStartTime===undefined?'':res.activityStartTime ,
            this.order.activityEndTime =  res.activityEndTime===undefined?'':res.activityEndTime,
            this.order.EQ_activityType =  res.EQ_activityType===undefined?'':res.EQ_activityType,
            this.order.LIKE_addServiceType = res.LIKE_addServiceType===undefined?[]:res.LIKE_addServiceType,
            this.order.LIKE_addServiceType2 = res.LIKE_addServiceType2===undefined?'':res.LIKE_addServiceType2,
          // }  ;

          // this.currentPage = 1 ;

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
