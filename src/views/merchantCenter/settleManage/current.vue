<template>
  <div class="current tableBox" v-loading="loading"  element-loading-text="拼命加载中">
    <h1 class="h_title">结算管理</h1>
    <div class="description">
      <h2 class="p_title">结算说明</h2>
      <ul>
        <li>1、平台为日结算. 每天凌晨1点进行结算；</li>
        <li>2、结算金额 = 未结算已收货订单 - 未结算已退款退款单；</li>
        <li>3、平台服务费为交易金额的0% ；</li>
        <li>4、结算审批通过以后，如果退款金额大于订单金额，则从保证金中扣除；</li>
        <li>5、本次结算未审批通过时，不允许二次结算。</li>
      </ul>
    </div>
    <div class="show">
      <div>
        <p>结算金额</p><p>{{ money }}元</p>
      </div>
      <div>
        <p>服务费</p><p>{{ serviceFee }}元</p>
      </div>
      <el-button type="warning" size="small" @click="dialogVisible= true ">结算申请</el-button>
    </div>
    <h3 class="p_title">未结算列表</h3>
    <div class="type_wrap">
      <el-button size="small"  :class="{ current_btn:orderType === '1' }" @click="getOrder('1')">发货单</el-button>
      <el-button  size="small" :class="{ current_btn:orderType === '2' }" @click="getOrder('2')">退款单</el-button>
    </div>


    <el-table :data="tableData"  border fit>
        <el-table-column label="订单类型" width="85">
          <template slot-scope="scope">
            <!--<span v-if="scope.row.orderType != ''">-->
              <span v-if="scope.row.orderType === '1'">发货单</span>
              <span v-else-if="scope.row.orderType == '2'">退款单</span>
            <!--</span>-->
          </template>
        </el-table-column>
        <el-table-column  prop="orderCode" label="订单号/退款单号" width="110"></el-table-column>
        <el-table-column prop="payOrderCode" label="子订单" width="180"></el-table-column>
        <el-table-column prop="goods" label="商品" min-width="500">
          <template slot-scope="scope">
            <!--<el-table :data="scope.row.size"  border fit :header-row-class-name="thColor" :row-style="tbColor">-->
            <!--<el-table-column prop="size" label="尺码" ></el-table-column>-->
            <!--<el-table-column prop="color" label="颜色"></el-table-column>-->
            <!--<el-table-column prop="num" label="库存" ></el-table-column>-->
            <!--</el-table>-->
            <table class="tableC">
              <tr class="thColor"><th>商品编号</th><th>商品名称</th><th>品牌</th><th>分类</th><th>规格</th><th>价格</th><th>数量</th></tr>
              <tr class="tbColor" v-for="(item,index) in scope.row.ybProductResDtos" :key="index">
                <td>{{item.code}}</td>
                <td>{{item.productName}}</td>
                <td>{{item.brandCnName}}</td>
                <td>
                  <span v-if="item.cateGoryMap != ''">
                    <span v-if="item.cateGoryMap.categoryName1">{{item.cateGoryMap.categoryName1}}</span>/
                    <span v-if="item.cateGoryMap.categoryName2">{{item.cateGoryMap.categoryName2}}</span>/
                    <span v-if="item.cateGoryMap.categoryName3">{{item.cateGoryMap.categoryName3}}</span>
                    <!--<span v-if="item.cateGoryMap.categoryName4">{{// item.cateGoryMap.categoryName4}}</span>-->
                  </span>
                </td>
                <td><span v-if="item.productItems!==null">{{item.productItems[0].size}}</span><span class="subOrder" v-if="item.productItems!==null">{{item.productItems[0].color}}</span></td>
                <td>{{item.price}}</td>
                <td>{{item.quantity}}</td>
              </tr>
            </table>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="结算金额（元）"  width="100"></el-table-column>
        <el-table-column label="状态"  width="100">
          <template slot-scope="scope">
            <el-button plain v-if="scope.row.status !== ''" size="mini"  :type="statusList[scope.row.status-0].type" class="paddingButton">{{ statusList[scope.row.status-0].name }}</el-button>
          </template>
        </el-table-column>
    </el-table>
    <div class="block2">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-sizes="[10, 15, 20]"
        :page-size="pageSize"
        layout=" sizes, prev, pager, next, jumper"
        :total="totalElements">
      </el-pagination>
      <span class="totalItems">共{{totalPages }}页，{{ totalElements }}条记录</span>
    </div>
    <el-dialog title="结算申请" :visible.sync="dialogVisible" width="50%" center>
      <el-form  label-position="right" class="expForm">
        <el-form-item   labelWidth="150px"  label="结算金额（元）：" >
          <el-input class="inputInfo" size="small" v-model.trim="money" disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item   labelWidth="150px"  label="服务费：" >
          <el-input class="inputInfo" size="small" v-model.trim="serviceFee" disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item   labelWidth="150px"  label="结算方式：" >
          <div >支付宝</div>
        </el-form-item>
        <!--<el-form-item   labelWidth="150px"  label="结算账号："  >-->
          <!--<div >{{ mobile }}</div>-->
        <!--</el-form-item>-->
        <!-- <el-form-item   labelWidth="130px"  label="确认密码：" prop="checkPsw">
          <el-input class="inputInfo" size="small" v-model.trim="form.checkPsw" placeholder="请输入登录密码"></el-input>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer" >
        <el-button type="primary" size="small" @click="confirm">确认</el-button>
        <el-button plain size="small" @click="close">关闭</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
    import { getMobile } from '@/utils/auth'
    import ElForm from "element-ui/packages/form/src/form";
    import {  validPassWord } from '@/utils/validate'
    import { deliveryOrder, refundOrder ,amountDetail, settlementApple} from "@/api/merchant"
    export default {
      components: {
        ElForm},
      name: "current",
      data(){
        const validPassword = ( rule,value,callback) => {
          if(value === ''){
            callback(new Error('请输入登录密码'))
          }else{
            if (!validPassWord(value)) {
              callback(new Error('密码为6-12位的数字、字母组合'))
            }
            callback();
          }
        };

        return{
            mobile : getMobile() ,
            tableData : [
              {
                orderType:'',
                orderCode:'',
                payOrderCode:'',
                ybProductResDtos:[
                  {
                    code:'',
                    productName:'',
                    brandCnName:'',
                    cateGoryMap:'',
                    productItems:[
                      {
                        size:'',
                        color:''
                      }
                    ],
                    price:'',
                    quantity:''
                  }
                ],
                amount:'',
                status:''
              }
            ],
            totalPages : 0,
            totalElements : 0,
            currentPage : 1,
            pageSize : 10,
            dialogVisible: false ,
            money: '0',
            serviceFee: '0',
            // formRule: {
            //   checkPsw: [
            //     {
            //       required : true ,trigger : 'blur',validator : validPassword

            //     }
            //   ]
            // },
            statusList: [
              {
                value: '0',
                name : '未支付',
                type: 'danger'
              },
              {
                value: '1',
                name: '已支付',
                type: 'success'
              },
              {
                value: '2',
                name: '已发货',
                type: 'primary'
              },
              {
                value: '3',
                name: '确认收货',
                type: 'success'
              },
              {
                value: '4',
                name: '退款中',
                type: 'warning'
              },
              {
                value: '5',
                name: '已退款',
                type: 'danger'
              },
              {
                value: '6',
                name: '已取消',
                type: 'info'
              },
              {
                value: '7',
                name: '退款已拒绝',
                type: 'primary'
              },
              {
                value: '9',
                name: '已删除',
                type: 'primary'
              },

            ],
            loading : true ,
            orderType: '1',

        }
      },
      mounted(){
        this.getOrder('1');
        this.getSettlement();
      },
      methods : {
        getSettlement(){
          this.loading = true ;

          amountDetail().then(res => {
            this.loading = false ;
         this.serviceFee = res.data.data.serviceAmount ;
              this.money = res.data.data.settlementAmount ;
          })
        },
        getOrder(type){
          // this.pageSize = 10 ;
          // this.currentPage = 1 ;
          this.orderType = type ;
          let formData = new FormData();
          formData.append('currentPage', this.currentPage);
          formData.append('pageSize', this.pageSize);
          if( type=== '1'){

            this.loading = true ;
            deliveryOrder(formData).then(res => {
              this.loading = false ;

             this.tableData = res.data.data ;
                this.totalPages = res.data.totalPages;
                this.totalElements = res.data.totalElements
            })
          }else{

            this.loading = true ;

            refundOrder(formData).then(res => {
              this.loading = false ;

              this.tableData = res.data.data ;
                this.totalPages = res.data.totalPages;
                this.totalElements = res.data.totalElements;
            })
          }
        },
        handleSizeChange(val) {

          this.pageSize = val ;
          this.getOrder(this.orderType);
        },

        handleCurrentChange(val) {

          this.currentPage = val ;
          this.getOrder(this.orderType);
        },
        //  结算相关操作
        confirm(){
              if( this.money == '0'){
                this.$message({
                    message : '结算金额为0,无需进行结算申请',
                    center: true ,
                    type: 'error'
                  })
              }else{

                settlementApple().then(res => {

                  if(res.data.status === '000000000'){
                  this.$message({
                    message : '您的申请已提交，请稍后确认结算进度',
                    center: true ,
                    type: 'success'
                  });
                  this.dialogVisible = false ;

                }else{
                  this.dialogVisible = false ;
                }
              })
              }


        },
        //关闭弹窗
        close(){
          this.dialogVisible = false ;
          // this.$refs[formName].resetFields();
        },
      }
    }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import '../../../styles/table';
  .description{
    margin :  0.4rem auto ;

    ul{
      /*width : 95%;*/
      margin : 0  auto 0.5rem;
      background : #b0ebca ;
      padding : 0.15rem ;
      box-sizing: border-box;
      color : #3c763d ;
      li{
        font-size : 0.14rem;
        line-height: 0.25rem ;
        text-indent : 0.85rem ;

      }
    }
  }
  .p_title{
    width : 100% ;
    height : 40px ;
    font-size : 0.2rem ;
    color : #fff ;
    background : #242a30;
    line-height : 40px;
    text-indent : 0.6rem ;
  }
  .type_wrap{
    display: flex;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
    margin : 0.2rem 0 ;
    .el-button:nth-child(1){
      margin-right: 0.2rem ;

    }
  }
  .show{
    /*height : 1rem ;*/
    padding : 0.1rem 0;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    margin-bottom : 0.5rem ;
    div{
      width : 24% ;
      height : 1.2rem ;
      border-bottom : 0.25rem  solid rgba(0,0,0,.4) ;
      color : #fff ;
      padding : 0.1rem 0.2rem;
      box-sizing: border-box;
      margin-right : 0.5rem ;
      border-radius: 0.05rem ;
      p:nth-child(1){
        font-size : 0.16rem ;
        line-height : 0.3rem ;
      }
      p:nth-child(2){
        font-size : 0.28rem ;
        line-height : 0.6rem ;
      }

    }
    div:nth-child(1){
      background : #00acac!important ;
    }
    div:nth-child(2){
      background : #348fe2!important ;

    }
    .el-button{
      height : 32px;
      /*margin : auto 0;*/
    }
  }
  .el-table{
    width : 100% !important;
    .tableC{
      width: 100%;
    }
  }
  .el-form-item{
    width : 80% ;
    margin : 0.2rem auto ;
  }
  .paddingButton{
    padding: 0.08rem 0.12rem !important;
  }
  .current_btn{
    background : #409EFF;
    color: #fff ;
  }
</style>
