<template>
  <div class="activityOrder tableBox"  v-loading="loading"  element-loading-text="拼命加载中">
    <h1>试用订单查询</h1>
    <search-bar @searchobj="getData" :platform-type="true" :activity-type="true" :third-order-code="true" :activity-code="true" :eq_status="true" :activity="true"></search-bar>

    <!--<div class="search">-->
        <!--<el-select size="small" clearable v-model="order.platformType" filterable placeholder="请选择试用平台">-->
          <!--<el-option-->
            <!--v-for="item in platformOptions"-->
            <!--:key="item.value"-->
            <!--:label="item.name"-->
            <!--:value="item.value">-->
          <!--</el-option>-->
        <!--</el-select>-->
        <!--<el-select size="small" clearable v-model="order.platformType" filterable placeholder="请选择试用类型">-->
          <!--<el-option-->
            <!--v-for="item in activityType"-->
            <!--:key="item.value"-->
            <!--:label="item.name"-->
            <!--:value="item.value">-->
          <!--</el-option>-->
        <!--</el-select>-->
        <!--<el-input size="small" :maxlength="20" v-model.trim="order.activityCode" placeholder="请输入试客试用活动编号"></el-input>-->
        <!--<el-input size="small" :maxlength="20" v-model.trim="order.thirdOrderCode" placeholder="请输入第三方订单编号"></el-input>-->
        <!--<el-select clearable size="small"  v-model="order.EQ_status" filterable placeholder="请选择订单状态">-->
          <!--<el-option-->
            <!--v-for="item in options"-->
            <!--:key="item.value"-->
            <!--:label="item.name"-->
            <!--:value="item.value">-->
          <!--</el-option>-->
        <!--</el-select>-->
        <!--<el-button size="small"  @click="getList()" class="searchOrder" style="padding: 0 0.05rem;">查询</el-button>-->
      <!--</div>-->
      <div class="note">备注：以上搜索条件可根据单一条件进行搜索，当单独试客淘宝号搜索不到有用信息时，可尝试输入淘宝订单编号，反之亦然</div>
      <el-table :data="tableData" border>
        <el-table-column prop="activityType" label="试客任务类型" width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.activityType === '1'">超级试用</span>
            <span v-else-if="scope.row.activityType === '3'">拼团试用</span>
          </template>
        </el-table-column>
        <el-table-column prop="activityCode" label="试客活动编号" width="180"></el-table-column>
          <el-table-column prop="orderCode" label="试客订单编号" width="180"></el-table-column>
          <el-table-column prop="activityTitle" label="商品名称"></el-table-column>
          <el-table-column prop="" label="宝贝主图">
            <template slot-scope="scope">
              <img class="mainPic" @click="showImg( scope.row.mainImageUrl)" :src=" imageDomain + scope.row.mainImageUrl " alt="" />
            </template>
          </el-table-column>

        <el-table-column prop="platform" label="平台类型">
            <template slot-scope="scope">
              {{ platformOptions[scope.row.platform].name }}
            </template>
          </el-table-column>
          <el-table-column prop="thirdAccount" label="试客第三方账号"></el-table-column>
          <el-table-column prop="thirdOrderCode" label="第三方订单编号"></el-table-column>
          <el-table-column prop="status" label="状态">
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
              <!--<el-button  type="text" @click="changeStatus(scope.$index)">修改状态</el-button>-->
              <!--<el-button size="small"   @click="handleComplaint(scope.$index,scope.row)">投诉</el-button>-->
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
  import ElButton from "element-ui/packages/button/src/button";
  import { getOrderList ,changeStatus } from "@/api/activity";
  import searchBar from "@/components/searchBar"
  // import ElDialog from "element-ui/packages/dialog/src/component";

  export default {
    name: "activity-order" ,
    components: {
      // ElDialog,
      ElButton,
      searchBar
    },
    data(){
      return{
        activityTitle : ['超级试用','','拼团试用'],
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
            name : '待开奖',
            value : '1'
          },
          {
            name : '未中奖',
            value : '2'
          },

          {
            name : '中奖待领取',
            value : '3'
          },
          {
            name : '领奖审核中',
            value : '4'
          },
          {
            name : '待评价',
            value : '5'
          },  {
            name : '评价审核中',
            value : '6'
          },
          {
            name : '中奖已取消',
            value : '7'
          },
          {
            name : '领奖审核拒绝',
            value : '8'
          },
          {
            name : '评价审核拒绝',
            value : '9'
          },
          // {
          //   name : '投诉处理中',
          //   value : '10'
          // },
          {
            name : '订单失败',
            value : '11'
          },
          {
            name : '结算中',
            value : '12'
          },
          {
            name : '已完成',
            value : '99'
          }
        ],
        order : {
          EQ_status: '',
          // thirdAccount: '',
          EQ_activityType:'',
          platformType : '' ,
          activityCode : '',
          thirdOrderCode: '',
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
          if( reg.test(this.order.thirdOrderCode)){
            formData.append('EQ_tryoutOrderWin.thirdOrderCode', this.order.thirdOrderCode);
          }else{
            formData.append('EQ_tryoutOrderWin.thirdOrderCode', '');
          }
          formData.append('EQ_activityType',this.order.EQ_activityType);
          if(this.order.EQ_activityType === ''){
            formData.append('IN_activityType','1,3');
          }else{
            formData.append('IN_activityType','');

          }
          formData.append('EQ_status',this.order.EQ_status);
          formData.append('currentPage', this.currentPage);
          formData.append('pageSize', this.pageSize);
        this.loading = true ;

        getOrderList(formData).then( res=> {
          this.loading = false ;

          if(res.data.status === '000000000'){
            this.tableData = res.data.data ;
            this.totalPages = res.data.totalPages ;
            this.totalElements = res.data.totalElements ;
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
      //查看宝贝大图
      showImg(url){
        this.mask = true ;
        this.bigImg = url ;
      },
      close(){
        this.mask = false ;
        this.bigImg = '' ;
      },
      //查看订单详情
      goDetail(index,order){
        this.$router.push('/freeManage/order/tryoutDetail/'+ order) ;
      },

      //修改订单状态
      // changeStatus(index,order){
      //   changeStatus({ data : { orderId : activityOrder }}).then(res => {
      //
      //   }).catch( err => {
      //     alert('服务器开小差啦，请稍等~')
      //   })
      // },



      // 清空弹窗内容值
      // close(){
      //   location.reload();
      // },
      // cancel(formName){
      //   this.$refs[formName].resetFields();
      //   this.complainBox = false ;
      //
      // } ,

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
  @import "src/styles/table.scss" ;

  .activityOrder{

    .search{
      border: 0!important;
    }
  }
</style>
