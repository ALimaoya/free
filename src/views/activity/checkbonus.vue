<template>
  <div class="checkbonus">
    <h1>领奖审核</h1>
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
          <el-button  type="text" @click="handleOrder(scope.$index,scope.row.orderId)">审核</el-button>
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
    <el-dialog class="detailContent" width="80%" :visible.sync="detailInfo" center top="5%" title="领奖审核">
      <div>
        <ul>
          <p>领奖第一步：</p>
          <li class="imageShow">
            <dl v-for="(item,index) in imgList" :key="index">
              <dt>{{ imageType[item.type] }}</dt>
              <dd><img :src=" imgUrl + item.imageUrl" alt="" /></dd>
            </dl>
          </li>
        </ul>
        <ul>
          <p>领奖第二步：</p>
          <li v-for="(item ,index) in goodsShare">
            <span>宝贝分享{{(index + 1)*1}}：</span>
            <span>{{ item.shareUrl }}</span>
          </li>
        </ul>
        <ul>
          <p>领奖第三步：</p>
          <li class="imageShow">
            <dl>
              <dt>订单截图</dt>
              <dd><img :src=" imgUrl + orderImg" alt="" /></dd>
            </dl>
          </li>
        </ul>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="check('1')">审核成功</el-button>
        <el-button type="error" @click="check('2')">审核失败</el-button>
        <el-button type="info" @click="detailInfo = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="拒绝原因" :visible.sync="reasonBox" center top="15%"  width="50%" >
      <p>备注：</p>
      <el-input :rows="4" type="textarea" v-model.trim="reason" placeholder="审核拒绝时不能为空，可输入字符最大长度为100"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitReason">提 交</el-button>
        <el-button type="info" @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { getOrderList , orderDetail , checkOrder   } from "@/api/activity"
  import ElDialog from "element-ui/packages/dialog/src/component";

  export default {
    components: { ElDialog },
    name: "checkbonus" ,
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
            detailInfo : false ,
            reasonBox : false ,
            imgList : [] ,
            imageType : [ '' , '商品收藏截图' , '店铺收藏截图'] ,
            goodsShare : [] ,
            orderImg : '' ,
            orderId : '' ,
            reason : '' ,
            refuseReason : '' ,
            status : '' ,
            imgUrl : 'http://lgf8953.oss-cn-beijing.aliyuncs.com/'

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
          formData.append('EQ_status','4');
          formData.append('pageSize', this.pageSize);
          getOrderList(formData).then( res=> {
            if(res.data.status === '000000000'){
              this.tableData = res.data.data ;
              this.totalPages = res.data.totalPages ;
              this.totalElements = res.data.totalElements ;
              console.log( this.totalElements)
            }
          }).catch( err => {
            alert('服务开小差啦，请稍等~');

          })
        },

        //查看订单详情
        goDetail(index,order){

          this.$router.push('/activity/detail/'+ order) ;

        },

        //订单详情审核
        handleOrder(index ,order){
          this.orderId = order ;
          this.detailInfo = true ;
          orderDetail(order).then( res => {
            console.log(res);

            if( res.data.status === '000000000'){
              this.imgList = res.data.data.orderImageList.slice(0,2) ;
              this.orderImg = res.data.data.orderImageList.slice(2,3)[0].imageUrl ;
              this.goodsShare = res.data.data.shareList ;
            }else{
              this.$message({
                message : res.data.message ,
                center : true ,
                type : 'error'
              })
            }
          }).catch( err => {
            console.log(err);
            alert('服务器开小差啦，请稍等~')
          })
        },

        //审核操作
        check(type){
          if(type === '1'){
            this.status = '5' ;
            this.handelRefuse();
          }else{
            this.status = '8' ;
            this.reasonBox = true ;

          }

        },

        //提交审核
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
          console.log(this.orderId ,  this.status , this.refuseReason ,2);

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
            this.reason = '' ;

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
          console.log(val);
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
    .detailContent{
      height : 80% ;
      overflow : hidden ;
      div{
        height : 5rem ;
        overflow-y:  auto ;
        overflow-x : hidden ;
        ul{
          width : 85% ;
          margin : 0.1rem auto ;

          li{
            margin-left : 0.3rem ;

          }
          .imageShow{
            display: flex ;
            flex-direction: row;
            justify-content: space-between;
            dl{
              width : 40% ;
              dt{
                text-align : center ;
                height : 0.5rem ;
                line-height : 0.5rem ;
              }
              dd{
                flex : 1 ;
                height : 3rem ;
                display : flex ;
                align-items: center;
                justify-content: center;
                img{
                  max-height : 100% ;
                  max-width : 100% ;
                  margin : 0 auto ;
                }
              }
            }
          }
        }

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
      .el-dialog{

        p{
          margin-bottom : 0.1rem ;
          font-size : 0.15rem ;
          font-weight : bold ;
          color : #8f949a;
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
