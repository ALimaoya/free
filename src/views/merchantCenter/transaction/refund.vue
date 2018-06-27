<template>
  <div class="refund activityTable">
    <h1 class="h_title">退款管理</h1>
    <div class="search">
      <el-input size="small" :maxlength="20" v-model.trim="refund.orderId" placeholder="退货单号"></el-input>
      <el-input size="small" :maxlength="20" v-model.trim="refund.subOrderId" placeholder="子订单号"></el-input>
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
        <el-date-picker size="small" v-model="refund.startDate" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择退款开始时间">
        </el-date-picker>
      </div>
      <div class="block">
        <!--<span class="demonstration">退款结束时间：</span>-->
        <el-date-picker size="small" v-model="refund.endDate" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择退款结束时间">
        </el-date-picker>
      </div>
      <el-button type="primary" size="mini" @click="search">查询</el-button>
    </div>
    <el-table :data="tableData"  border  align="center" fit>
      <el-table-column prop="orderId" label="退款单号"></el-table-column>
      <el-table-column prop="subOrder" label="子订单" ></el-table-column>
      <el-table-column label="商品" >
        <template slot-scope="scope">
          <span>{{ scope.row.goods }}</span>
          <span class="subOrder">({{ scope.row.subOrderId }})</span>

        </template>
      </el-table-column>
      <el-table-column prop="brand" label="品牌" ></el-table-column>
      <el-table-column prop="type" label="分类" ></el-table-column>
      <el-table-column prop="size" label="规格" ></el-table-column>
      <el-table-column prop="num" label="数量" ></el-table-column>
      <el-table-column prop="price" label="单价" ></el-table-column>
      <el-table-column prop="money" label="退款金额" ></el-table-column>
      <el-table-column prop="time" label="申请时间"></el-table-column>
      <el-table-column label="状态" width="100">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status ==='5'" type='primary' size="mini">待审批</el-button>
          <el-button v-if="scope.row.status ==='5'" type='warning' size="mini">退款中</el-button>
          <el-button v-else-if="scope.row.status ==='6'" type='danger' size="mini">已退款</el-button>
          <el-button v-else-if="scope.row.status ==='7'" type='info' size="mini">已取消</el-button>
          <el-button v-else-if="scope.row.status ==='8'" type='warning' size="mini">已拒绝</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="action" label="操作" width="100">
        <template slot-scope="scope">
          <el-button type='primary' @click="goDetail(scope.$index,scope.row.orderId)" size="mini">详情</el-button>
          <el-button type='warning' @click="handleCheck(scope.$index,scope.row.orderId)" size="mini">审核</el-button>
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
    <el-dialog title="确认退款" :visible.sync="dialogVisible" width="50%" center >
      <div class="tips">
        <h3>注意：</h3>
        <p>确认退款后退款金额回退到买家支付账户中。</p>
      </div>
      <el-form :model="form" ref="form" :rules="formRule" label-position="right" class="expForm">
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
        <el-form-item   labelWidth="130px"  label="商品名称：" prop="expressOrder">
          <el-input class="inputInfo" size="small" v-model.trim="form.expressOrder" disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item   labelWidth="130px"  label="商品数量："  prop="goodsNum">
          <el-input class="inputInfo" size="small" v-model.trim="form.goodsNum" disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item   labelWidth="130px"  label="退款金额："   prop="refund">
          <el-input class="inputInfo" size="small" v-model.trim="form.refund" disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item   labelWidth="130px"  label="确认密码：" prop="checkPsw">
          <el-input class="inputInfo" size="small" v-model.trim="form.checkPsw" placeholder="请输入登录密码"></el-input>
        </el-form-item>
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
  import { refusedList } from '@/api/merchant'

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
              value : ''
            },
            {
              name : '退款中',
              value : '1'
            },
            {
              name : '已退款',
              value : '2'
            },
            {
              name : '已拒绝',
              value : '3'
            },
            {
              name : '已取消',
              value : '4'
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
            expressOrder:'',
            goodsNum: '',
            refund: '',
            checkPsw: ''
          },
          formRule : {

            checkPsw: [
              {
                required : true ,trigger : 'blur',validator : validPassword

              }
            ]
          },
          checkList: [
            {
              value : '1',
              name : '通过并退款'
            },
            {
              value : '2',
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
          let data = { ... this.refund } ;
          data.currentPage = this.currentPage ;
          data.pageSize = this.pageSize ;
          refusedList(data).then( res => {
            if(res.data.message === '000000000'){
              this.tableData = res.data.data ;
            }else{
              this.$message({
                message : res.data.message ,
                center : true ,
                type : 'error'
              })
            }
          }).catch(err => {

          })

        },
        search(){

        },
        goDetail(index,order){
          this.$router.push('/merchantCenter/transaction/refundOrder/'+ 1)

        },
        //审核订单
        handleCheck(index,order){
          this.dialogVisible = true ;
        },
        //  确认退款相关操作
        confirm(formName){
          this.$refs[formName].validate((valid) => {
            if(valid){
              this.dialogVisible = false ;

            }else{

            }
          })
        },
        //关闭弹窗
        close(formName){
          this.dialogVisible = false ;
          this.$refs[formName].resetFields();
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
