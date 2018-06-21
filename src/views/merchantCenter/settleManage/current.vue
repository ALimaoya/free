<template>
  <div class="current tableBox">
    <h1 class="h_title">结算管理</h1>
    <div class="description">
      <h2 class="p_title">结算说明</h2>
      <ul>
        <li>1、平台为日结算. 每天凌晨1点进行结算；</li>
        <li>2、结算金额 = 未结算已收货订单 - 未结算已退款退货单；</li>
        <li>3、平台服务费为交易金额的 5%；</li>
        <li>4、结算审批通过以后，如果退货金额大于订单金额，则从保证金中扣除；</li>
        <li>5、本次结算未审批通过时，不允许二次结算。</li>
      </ul>
    </div>
    <div class="show">
      <div>
        <p>结算金额</p><p>100</p>
      </div>
      <div>
        <p>服务费</p><p>100</p>
      </div>
      <el-button type="warning" size="small" @click="dialogVisible= true ">结算申请</el-button>
    </div>
    <h3 class="p_title">未结算列表</h3>
    <el-table :data="tableData"  border fit>
        <el-table-column prop="type" label="订单类型"></el-table-column>
        <el-table-column prop="orderId" label="订单号/退款单号" ></el-table-column>
        <el-table-column prop="subOrderId" label="子订单" ></el-table-column>
        <el-table-column prop="goods" label="商品" show-overflow-tooltip>
          <template slot-scope="scope">
            <!--<el-table :data="scope.row.size"  border fit :header-row-class-name="thColor" :row-style="tbColor">-->
            <!--<el-table-column prop="size" label="尺码" ></el-table-column>-->
            <!--<el-table-column prop="color" label="颜色"></el-table-column>-->
            <!--<el-table-column prop="num" label="库存" ></el-table-column>-->
            <!--</el-table>-->
            <table class="tableC">
              <tr class="thColor"><th>商品编号</th><th>商品名称</th><th>品牌</th><th>分类</th><th>规格</th><th>价格</th><th>数量</th></tr>
              <tr class="tbColor"><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
            </table>
          </template>
        </el-table-column>
        <el-table-column prop="money" label="结算金额" ></el-table-column>
        <el-table-column prop="status" label="状态" >
          <template slot-scope="scope">
            <el-button size="mini" v-if="scope.row.status === '1'" type="success">确认收货</el-button>
            <el-button size="mini" v-if="scope.row.status === '2'" type="primary">已退款</el-button>
            <el-button size="mini" v-if="scope.row.status === '3'" type="error">已退款</el-button>

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
      <el-form :model="form" ref="form" :rules="formRule" label-position="right" class="expForm">
        <el-form-item   labelWidth="130px"  label="结算金额：" prop="money">
          <el-input class="inputInfo" size="small" v-model.trim="form.money" disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item   labelWidth="130px"  label="服务费："  prop="service">
          <el-input class="inputInfo" size="small" v-model.trim="form.service" disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item   labelWidth="130px"  label="结算方式："   prop="method">
          <div >支付宝</div>
        </el-form-item>
        <el-form-item   labelWidth="130px"  label="结算账号："   prop="account">
          <div >{{ form.account }}</div>
        </el-form-item>
        <el-form-item   labelWidth="130px"  label="确认密码：" prop="checkPsw">
          <el-input class="inputInfo" size="small" v-model.trim="form.checkPsw" placeholder="请输入登录密码"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" >
        <el-button type="primary" size="small" @click="confirm('form')">确认</el-button>
        <el-button plain size="small" @click="close('form')">关闭</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
    import ElForm from "element-ui/packages/form/src/form";
    import {  validPassWord } from '@/utils/validate'

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
        }

        return{

            tableData : [],
            totalPages : '',
            totalElements : 0,
            currentPage : 1,
            pageSize : 10,
            dialogVisible: false ,
            form: {
              money: '',
              service: '',
              account: '',
              checkPsw: '',
            },
            formRule: {
              checkPsw: [
                {
                  required : true ,trigger : 'blur',validator : validPassword

                }
              ]
            }
          }
      },
      mounted(){
        this.getList();

      },
      methods : {
        getList(){

        },

        handleSizeChange(val) {

          this.pageSize = val ;
          this.getList();
        },

        handleCurrentChange(val) {

          this.currentPage = val ;
          this.getList();
        },
        //  结算相关操作
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

  }
  .el-form-item{
    width : 80% ;
    margin : 0.2rem auto ;
  }
</style>
