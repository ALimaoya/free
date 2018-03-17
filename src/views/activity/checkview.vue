<template>
  <div class="checkbonus">
    <h1>评价审核</h1>
    <div class="search">
      <el-select size="small"  v-model="order.platformType" filterable placeholder="请选择试用平台">
        <el-option
          v-for="item in platformOptions"
          :key="item.value"
          :label="item.name"
          :value="item.value">
        </el-option>
      </el-select>
      <el-input size="small" v-model.trim="order.activityCode" placeholder="请输入试客试用活动编号"></el-input>
      <el-input size="small" v-model.trim="order.thirdOrderCode" placeholder="请输入第三方订单编号"></el-input>
      <el-button size="small"  @click="getList()" class="searchOrder">查询</el-button>
    </div>
    <el-table :data="tableData" border>
      <el-table-column prop="activityCode" label="试客任务编号" width="180"></el-table-column>
      <el-table-column prop="orderCode" label="试客订单编号" width="180"></el-table-column>
      <el-table-column prop="activityTitle" label="商品名称"></el-table-column>
      <el-table-column prop="platform" label="平台类型">
        <template slot-scope="scope">
          {{ platformOptions[scope.row.platform].name }}
        </template>
      </el-table-column>
      <el-table-column prop="thirdAccount" label="试客第三方账号"></el-table-column>
      <el-table-column prop="thirdOrderCode" label="第三方订单编号"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button  type="text" @click="goDetail(scope.$index,scope.row.orderId)">查看详情</el-button>
          <el-button  type="text" @click="handleOrder(scope.$index, scope.row.orderId)">审核</el-button>
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

    <el-dialog width="60%" :visible.sync="detailInfo" center top="3%" title="评价审核">
      <dl>
        <dt>评价截图</dt>
        <dd>
          <img :src=" imageDomain + viewImg" alt="" />
        </dd>
      </dl>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="check('1')">审核成功</el-button>
        <el-button type="error" @click="check('2')">审核失败</el-button>
        <el-button type="info" @click="detailInfo = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="拒绝原因" :visible.sync="reasonBox" center top="15%"  width="50%" >
      <span>备注：</span>
      <el-input :rows="4" type="textarea" v-model.trim="reason" placeholder="审核拒绝时不能为空，可输入字符最大长度为100"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitReason">提 交</el-button>
        <el-button type="info" @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { getOrderList , orderDetail , checkOrder  } from "@/api/activity"

  export default {
    name: "checkview" ,
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
          // currentPage : 1,
          // pageSize : 10
        },
        tableData : [],
        currentPage : 1 ,
        pageSize : 10 ,
        totalPages : '',
        totalElements : 0 ,
        viewImg : '' ,
        detailInfo : false ,
        imageDomain : 'http://lgf8953.oss-cn-beijing.aliyuncs.com/' ,
        // imageDomain : 'http://yabei.oss-cn-beijing.aliyuncs.com/',
        orderId : '' ,
        reason : '' ,
        refuseReason : '' ,
        status : '' ,
        reasonBox : false

      }
    },
    mounted(){
      this.getList();
    },
    methods : {

      //  获取订单列表
      getList(){
        let formData = new FormData();
        formData.append('EQ_tryoutActivity.platformType',this.order.platformType);
        formData.append('EQ_tryoutActivity.activityCode', this.order.activityCode);
        formData.append('EQ_tryoutOrderWin.thirdOrderCode',this.order.thirdOrderCode);
        formData.append('currentPage', this.currentPage);
        formData.append('EQ_status','6');
        formData.append('pageSize', this.pageSize);
        getOrderList(formData).then( res=> {
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

      //查看订单详情
      goDetail(index,order){
        this.$router.push('/activity/detail/'+ order) ;

      },


      // 评价审核详情
      handleOrder(index ,order){
        this.orderId = order ;
        this.detailInfo = true ;

        orderDetail(order).then( res => {
          // console.log(res);
          if( res.data.status === '000000000'){
            this.viewImg = res.data.data.orderImageList.slice(3,4)[0].imageUrl ;

          }else{
            this.$message({
              message : res.data.message ,
              center : true ,
              type : 'error'
            })
          }
        }).catch( err => {
           alert('服务器开小差啦，请稍等~')
        })
      },

      //审核操作
      check(type){

        if(type === '1'){
          this.status = '12' ;
          this.handelRefuse();
        }else{
          this.status = '9' ;
          this.reasonBox = true ;

        }
        // console.log(this.orderId ,  this.status , this.refuseReason);


      },

      handelRefuse(){
        checkOrder({ orderId : this.orderId , status : this.status ,reason : this.refuseReason }).then( res => {
          if(res.data.status === '000000000'){
            this.$message({
              message : '审核提交成功，请稍后确认' ,
              center : true ,
              type : 'success'
            });
            window.location.reload();
          }else{
            this.$message({
              message : res.data.message ,
              center : true ,
              type : 'error'
            })
          }

        }).catch( err => {
          alert('服务器开小差啦，请稍等~')
        });
        this.detailInfo = false ;

      },

      //提交拒绝原因
      submitReason(){

        this.refuseReason = this.reason ;
        // console.log(this.orderId ,  this.status , this.refuseReason ,2);

        if(this.refuseReason === ''){
          this.$message({
            message : '请填写拒绝原因',
            type : 'error' ,
            center : 'true'
          });
          return false ;
        }else{
          this.handelRefuse();
          this.reasonBox = false ;
          // this.reason = '' ;

        }

      },

      //关闭窗口
      cancel(){
        this.reasonBox = false ;
        this.reason = '' ;
      },

      handleSizeChange(val) {
        this.pageSize = val ;
        this.getList();
      },
      handleCurrentChange(val) {
        // console.log(val);
        this.currentPage = val ;
        this.getList();
      }
    }
  }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "src/styles/table.scss" ;

  .checkbonus{
    .search{
      border-bottom : 1px solid #aaa ;

    }

    .el-dialog {

      dl{
        width : 50% ;
        margin : 0 auto ;
        dt{
          width : 100% ;
          height : 0.5rem ;
          line-height : 0.5rem ;
          color : #456 ;
          text-align : center ;

        }
        dd{
          max-height : 5rem ;
          width : 80% ;
          height : 5rem ;
          margin : 0.3rem auto ;
          img{
            max-width : 100% ;
            max-height : 100% ;

            margin : 0 auto ;

          }
        }
      }
      p {
        display: inline-block;
        margin-bottom: 0.1rem;
      }
      .dialog-footer{
        .el-button {
          width : 0.9rem ;
          padding : 0;
          text-align : center ;
          line-height : 0.35rem ;
        }
      }

    }
  }
</style>
