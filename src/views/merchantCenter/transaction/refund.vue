<template>
  <div class="refund activityTable">
    <h1 class="h_title">退款管理</h1>
    <div class="search">
      <el-input size="small" :maxlength="40" v-model.trim="refund.orderId" placeholder="退货单号"></el-input>
      <el-input size="small" :maxlength="40" v-model.trim="refund.subOrderId" placeholder="子订单号"></el-input>
      <el-select  size="small" clearable v-model="refund.status" filterable placeholder="退款状态">
        <el-option
          v-for="item in statusList"
          :key="item.value"
          :label="item.name"
          :value="item.value">
        </el-option>
      </el-select>
      <div class="block">
        <!--<span class="demonstration">退款开始时间：</span>-->
        <el-date-picker size="small" v-model="refund.startDate" value-format="yyyy-MM-dd" type="date" placeholder="选择退款开始时间">
        </el-date-picker>
      </div>
      <div class="block">
        <!--<span class="demonstration">退款结束时间：</span>-->
        <el-date-picker size="small" v-model="refund.endDate" value-format="yyyy-MM-dd" type="date" placeholder="选择退款结束时间">
        </el-date-picker>
      </div>
      <el-button type="primary" size="mini" @click="getList()">查询</el-button>
    </div>
    <el-table :data="tableData"  border  align="center" fit>
      <el-table-column prop="code" label="退款单号"></el-table-column>
      <el-table-column prop="deliveryOrderCode" label="子订单" ></el-table-column>
      <el-table-column label="商品" >
        <template slot-scope="scope">
          <span>{{ scope.row.productName }}</span>
          <span class="subOrder">({{ scope.row.productCode }})</span>

        </template>
      </el-table-column>
      <!-- <el-table-column prop="brandEnName" label="商品" >

      </el-table-column> -->
      <el-table-column prop="brandCnName" label="品牌" ></el-table-column>
      <el-table-column  label="分类" >
        <template slot-scope="scope">
          <!-- <span>{{ scope.row.categoryMap.categoryName1 }}/{{ scope.row.categoryMap.categoryName2 }}/{{ scope.row.categoryMap.categoryName3 }}</span> -->
          <span v-if="scope.row.categoryMap != undefined">
          <span v-if="scope.row.categoryMap.categoryName1">{{scope.row.categoryMap.categoryName1}}</span>/
          <span v-if="scope.row.categoryMap.categoryName2">{{scope.row.categoryMap.categoryName2}}</span>/
          <span v-if="scope.row.categoryMap.categoryName3">{{scope.row.categoryMap.categoryName3}}</span>/
          <span v-if="scope.row.categoryMap.categoryName4">{{scope.row.categoryMap.categoryName4}}</span>
          </span>

        </template>
      </el-table-column>
      <el-table-column prop="size" label="规格" ></el-table-column>
      <el-table-column prop="quality" label="数量" ></el-table-column>
      <el-table-column prop="price" label="单价" ></el-table-column>
      <el-table-column prop="returnAmount" label="退款金额" ></el-table-column>
      <el-table-column prop="createTime" label="申请时间"></el-table-column>
      <el-table-column label="状态" width="100">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status !==''" :type='statusList[(scope.row.status*1+1)].type' size="mini">{{ statusList[(scope.row.status*1+1)].name }}</el-button>
          <!--<el-button v-else-if="scope.row.status ==='1'" type='danger' size="mini">已退款</el-button>-->
          <!--<el-button v-else-if="scope.row.status ==='2'" type='info' size="mini">已取消</el-button>-->
          <!--<el-button v-else-if="scope.row.status ==='3'" type='warning' size="mini">已拒绝</el-button>-->
        </template>
      </el-table-column>
      <el-table-column prop="action" label="操作" width="100">
        <template slot-scope="scope">
          <el-button type='primary' @click="goDetail(scope.$index,scope.row.id)" size="mini">详情</el-button>
          <el-button v-if="scope.row.status ==='0'" type='warning' @click="handleCheck(scope.$index,scope.row)" size="mini">审核</el-button>
          <!-- <el-button type='warning' @click="handleCheck(scope.$index,scope.row)" size="mini">审核</el-button> -->
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
    <el-dialog title="确认退款" :visible.sync="dialogVisible" width="50%" center :before-close="close2">
      <div class="tips">
        <h3>注意：</h3>
        <p>确认退款后退款金额回退到买家支付账户中。</p>
      </div>
      <el-form :model="form" ref="form"  label-position="right" class="expForm">
        <el-form-item  labelWidth="130px" label="审批结果：" prop="result">
          <el-select  size="small" clearable v-model="form.result" filterable>
            <el-option
              v-for="item in checkList"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item   labelWidth="130px"  label="商品名称：" prop="productName">
          <el-input :maxLength="100" class="inputInfo" size="small" v-model.trim="form.productName" disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item   labelWidth="130px"  label="商品数量："  prop="goodsNum">
          <el-input  class="inputInfo" size="small" v-model.trim="form.goodsNum" disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item   labelWidth="130px"  label="退款金额："   prop="refund">
          <el-input class="inputInfo" size="small" v-model.trim="form.refund" disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item   labelWidth="130px"  label="退款原因：" prop="reason">
          <el-input :maxLength="400" class="inputInfo" size="small" v-model.trim="form.reason" placeholder="请输入退款原因"></el-input>
        </el-form-item>
        <!--<el-form-item   labelWidth="130px"  label="确认密码：" prop="checkPsw">-->
          <!--<el-input class="inputInfo" size="small" v-model.trim="form.checkPsw" placeholder="请输入登录密码"></el-input>-->
        <!--</el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer" >
        <el-button type="primary" size="mini" @click="confirm('form')">确认</el-button>
        <el-button plain size="mini" @click="close('form')">关闭</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import {  validPassWord } from '@/utils/validate'
  import { refusedList , refusedAffirm} from '@/api/merchant'

  export default {
        name: "refund",

      data(){
        const validPassword = ( rule,value,callback) => {
          if(value === ''){
            callback(new Error('请输入登录密码'))
          }else{
            if (!validPassWord(value)) {
              callback(new Error('密码为8-16位的数字、字母组合'))
            }
            callback();
          }
        }

        return{
          refund: {
            orderId: '',
            subOrderId:'',
            status:'',
            startDate:'',
            endDate:''
          },
          statusList : [
            {
              name : '全部状态',
              value : '',
              type: ''
            },
            {
              name : '退款中',
              value : '0',
              type: 'primary'
            },
            {
              name : '已退款',
              value : '1',
              type: 'success'

            },
            {
              name : '已取消',
              value : '2',
              type: 'info'

            },
            {
              name : '已拒绝',
              value : '3',
              type: 'danger'

            },
          ],
          tableData : [],
          totalPages : '',
          totalElements : 0,
          currentPage : 1,
          pageSize : 10,
          dialogVisible: false ,
          form : {
            result: '1',
            productName:'',
            goodsNum: '',
            refund: '',
            reason:'',
            // checkPsw: '',
            id: ''
          },
          formModel : {
            result: '1',
            productName:'',
            goodsNum: '',
            refund: '',
            reason:'',
            // checkPsw: '',
            id: ''
          },
          // formRule : {
          //
          //   checkPsw: [
          //     {
          //       required : true ,trigger : 'blur',validator : validPassword
          //
          //     }
          //   ]
          // },
          checkList: [
            {
              value : '1',
              name : '通过并退款'
            },
            {
              value : '3',
              name : '拒绝'
            }
          ]
        }
      },
      mounted(){
        this.getList();
      },
      methods : {
        getList(){
          let formData = new FormData();
          formData.append('currentPage', this.currentPage);
          formData.append('pageSize', this.pageSize);
          formData.append('LIKE_code', this.refund.orderId);
          formData.append('EQ_ybDeliveryProduct.deliveryOrder.code',this.refund.subOrderId);
          formData.append('EQ_status',this.refund.status)
          formData.append('GT_createTime',this.refund.startDate)
          formData.append('LT_createTime',this.refund.endDate)
          refusedList(formData).then( res => {
            console.log('data',res)
            if(res.data.status === "000000000"){
              this.tableData = res.data.data ;
              this.totalPages = res.data.totalPages ;
              this.totalElements = res.data.totalElements ;
            }else{
              this.$message({
                message : res.data.message ,
                center : true ,
                type : 'error'
              })
            }
          }).catch(err => {
              alert('服务器开小差啦，请稍等~')
          })

        },

        goDetail(index,id){
          this.$router.push('/merchantCenter/transaction/refundOrder/'+ id)

        },
        //审核订单
        handleCheck(index,row){
          console.log('row',row)
          this.dialogVisible = true ;
          this.form.productName = row.productName
          this.form.goodsNum = row.quality
          this.form.refund = row.returnAmount
          this.form.id = row.id
        },
        //  确认退款相关操作
        confirm(formName){
          this.$refs[formName].validate((valid) => {
            if(valid){
              let formData = new FormData();
              formData.append('refundId', this.form.id);
              // formData.append('confirmPwd', this.form.checkPsw);
              formData.append('status', this.form.result);
              formData.append('refuseReason', this.form.reason);
              refusedAffirm(formData).then( res =>{
                if(res.data.status === "000000000"){
                this.$message({
                  message : res.data.message ,
                  center : true ,
                  type : 'success'
                });
                setTimeout(() => {
                  this.getList();
                },1500)
                }else{
                  this.$message({
                    message : res.data.message ,
                    center : true ,
                    type : 'error'
                })
              }

              })
            }else{

            }
            this.dialogVisible = false ;
            this.form = Object.assign({}, this.formModel);
          })
        },
        //关闭弹窗
        close(formName){
          this.dialogVisible = false ;
          this.$refs[formName].resetFields();
        },
        //叉号关闭弹窗
        close2(){
          this.dialogVisible = false ;
          this.form = Object.assign({}, this.formModel);
        },
        handleSizeChange(val) {

          this.pageSize = val ;
          this.getList();
        },

        handleCurrentChange(val) {

          this.currentPage = val ;
          this.getList();
        },
      }
    }
</script>
<style scoped lang="scss" rel="stylesheet/scss">
  @import '../../../styles/activityTable';
  @import '../../../styles/table';
  .search{
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    flex-wrap: wrap;
    .el-input,.el-select,.block{
      width : 25%!important;
      margin-left : 0!important;
      margin-right : 0.25rem!important;

    }
    .block{
      .el-input{
        width : 100%!important;
      }
    }
    .el-button{
      height : 32px;
      margin-left : 0!important;
    }
  }
  .el-table{
    .el-button{
      margin : 0.05rem auto ;
    }
  }
  .el-dialog{
    .tips{
      /*width : 80% ;*/
      height : 1rem ;
      margin : 0.2rem auto ;
      color : #a94442 ;
      background : rgb(248, 178, 178);
      border-radius : 0.05rem;
      padding : 0.1rem 0.2rem;
      box-sizing: border-box;
      h3{
        font-size : 0.26rem ;
        /*font-weight : 100 ;*/
      }
      p{
        font-size : 0.14rem ;
        line-height : 0.3rem ;
      }
    }
    .el-form-item{
      width : 80% ;
      margin : 0.2rem auto ;
    }
  }

</style>
