<template>
  <div class="searchOrder activityTable">
      <h1>交易管理</h1>
      <div class="search">
        <div class="inputWrap">
          <el-input size="small" :maxlength="20" v-model.trim="transition.orderId" placeholder="订单号"></el-input>
          <el-input size="small" :maxlength="20" v-model.trim="transition.subOrderId" placeholder="子订单号"></el-input>
          <el-input size="small" :maxlength="20" v-model.trim="transition.code" placeholder="商品编号"></el-input>
          <el-input size="small" :maxlength="20" v-model.trim="transition.buyAccount" placeholder="买方账号"></el-input>
        </div>
        <div class="inputWrap">
        <div class="block">
          <span class="demonstration">交易开始时间：</span>
          <el-date-picker size="small" v-model="transition.startDate" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择交易开始时间">
          </el-date-picker>
        </div>
        <div class="block">
          <span class="demonstration">交易结束时间：</span>
          <el-date-picker size="small" v-model="transition.endDate" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择结束时间">
          </el-date-picker>
        </div>
        <el-select  size="small" clearable v-model="transition.status" filterable placeholder="订单状态">
          <el-option
            v-for="item in statusList"
            :key="item.value"
            :label="item.name"
            :value="item.value">
          </el-option>
        </el-select>
        </div>
        <div class="inputWrap">
          <el-button  size="mini" type="primary"  @click="search()" class="searchOrder">查询</el-button>
          <el-button  size="mini" type="primary"  @click="exportOrder()" class="searchOrder">导出</el-button>
          <el-button  size="mini" type="primary" style="padding: 0;text-align: center;height : 28px;"  @click="importOrder()" class="searchOrder">导入发货</el-button>
          <el-button  size="mini" type="primary"  @click="reset()" class="searchOrder">重置</el-button>
        </div>
      </div>
      <div class="tableTitle">
        <h2>交易列表列表</h2>
      </div>
    <el-table  :data="tableData"  border  align="center" fit>
      <el-table-column prop="orderId" label="订单/子订单"  width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.orderId}}</span>
          <span class="subOrder">({{ scope.row.subOrderId }})</span>
        </template>
      </el-table-column>
      <el-table-column  label="商品" class="goodsInfo">
        <template slot-scope="scope">
          <table class="tableC">
            <tr class="thColor">
              <th>商品编号</th><th>商品名称</th><th>品牌</th>
              <th>分类</th><th>规格</th><th>价格</th><th>数量</th>
            </tr>
            <tr class="tbColor"><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
          </table>
        </template>
      </el-table-column>
      <el-table-column prop="num" label="总数量" width="100"></el-table-column>
      <el-table-column prop="price" label="总价" width="100"></el-table-column>
      <el-table-column prop="time" label="交易时间" width="100"></el-table-column>
      <el-table-column label="状态" width="100">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status ==='1'" type='warning' size="mini">未支付</el-button>
          <el-button v-else-if="scope.row.status ==='2'"  type='primary' size="mini">已支付</el-button>
          <el-button v-else-if="scope.row.status ==='3'" type='primary' size="mini">已发货</el-button>
          <el-button v-else-if="scope.row.status ==='4'"  type='success' size="mini">确认收货</el-button>
          <el-button v-else-if="scope.row.status ==='5'" type='warning' size="mini">退款中</el-button>
          <el-button v-else-if="scope.row.status ==='6'" type='danger' size="mini">已退款</el-button>
          <el-button v-else-if="scope.row.status ==='7'" type='info' size="mini">已取消</el-button>
          <el-button v-else-if="scope.row.status ==='8'" type='warning' size="mini">退款已拒绝</el-button>
          <el-button v-else="scope.row.status ==='9'" type='info' size="mini">已删除</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="action" label="操作" width="100">
        <template slot-scope="scope">
          <el-button type='primary' @click="goDetail(scope.$index,scope.row.orderId)" size="mini">详情</el-button>
          <el-button type="warning" @click="deliver(scope.$index,scope.row.orderId)" size="mini">发货</el-button>
          <el-button type='warning' @click="changeWay(scope.$index,scope.row.orderId)" size="mini">修改快递</el-button>
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
    <el-dialog title="填写快递信息" :visible.sync="dialogVisible" width="60%" >
      <el-form :model="expressForm" ref="expressForm" :rules="expressFormRule" label-position="right" class="expForm">
        <el-form-item  labelWidth="130px" label="快递公司：" prop="expressType">
          <el-select  size="small" clearable v-model="expressForm.expressType" filterable placeholder="快递公司">
            <el-option
              v-for="item in deliverList"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item   labelWidth="130px"  label="快递单号：" prop="expressOrder">
          <el-input class="inputInfo" size="small" v-model.trim="expressForm.expressOrder" placeholder="快递单号"></el-input>
        </el-form-item>
        <el-form-item   labelWidth="130px"  label="确认密码：" prop="checkPsw">
          <el-input class="inputInfo" size="small" v-model.trim="expressForm.checkPsw" placeholder="请输入登录密码"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer" >
        <el-button type="primary" size="mini" @click="confirm('expressForm')">确认</el-button>
        <el-button plain size="mini" @click="close('expressForm')">关闭</el-button>

      </div>
    </el-dialog>

  </div>


</template>

<script>
  import {  validPassWord } from '@/utils/validate'

    export default {
      name: "search",
      data(){
        const validOrder = ( rule,value,callback) => {
          if(value === ''){
            callback(new Error('请输入快递单号'))
          }else{
            var reg = /^d{7,20}$/;
            if(!reg.test(value)){
              callback(new Error('请输入正确格式的快递单号'))

            }
            callback();
          }
        }
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
            transition: {
              orderId: '',
              subOrderId: '',
              code: '',
              buyAccount: '',
              startDate: '',
              endDate: '',
              status: '',
            },
            statusList:[
              {
                name : '全部状态',
                value : ''
              },
              {
                name : '未支付',
                value : '1'
              },
              {
                name : '已支付',
                value : '2'
              },
              {
                name : '已发货',
                value : '3'
              },
              {
                name : '确认收货',
                value : '4'
              },
              {
                name : '退款中',
                value : '5'
              },
              {
                name : '已退款',
                value : '6'
              },
              {
                name : '已取消',
                value : '7'
              },
              {
                name : '退款拒绝',
                value : '8'
              }
            ],
            // thColor : true ,
            // tbColor : true,
            tableData : [],
            totalPages : '',
            totalElements : 0,
            currentPage : 1,
            pageSize : 10,
            dialogVisible : false ,
            expressForm :{
              expressType: '',
              expressOrder: '',
              checkPsw: '',
            },
            expressFormRule : {
              expressType : [
                {
                  required : true ,trigger : 'change',message : '请选择快递公司'
                }
              ],
              expressOrder : [
                {
                  required : true ,trigger : 'blur',validator : validOrder
                }
              ],
              checkPsw: [
                {
                  required : true ,trigger : 'blur',validator : validPassword

                }
              ]
            },
            deliverList : [],
            changeExpress : '',
            expressType : '',
          }
      },
      mounted(){
        this.getList();
        this.getExpressList();
      },
      methods: {
        //  获取交易列表
        getList(){
          this.tableData =[
            {
              time: '2016-05-02',
              subOrderId : '111',
              orderId: '王小虎',
              address: '上海市普陀区金沙江路 1518 弄'
            }, {
              time: '2016-05-04',
              orderId: '王小虎',
              subOrderId : '4535435354',
              address: '上海市普陀区金沙江路 1517 弄'
            }, {
              time: '2016-05-01',
              orderId: '王小虎',
              address: '上海市普陀区金沙江路 1519 弄'
            }, {
              time: '2016-05-03',
              orderId: '王小虎',
              address: '上海市普陀区金沙江路 1516 弄'
            }
          ]
        },
        //获取快递列表
        getExpressList(){
          this.deliverList= [];

        },
        //  查询交易
        search(){
          // this.transition =
          // this.tableData =
        },
        exportOrder(){

        },
        importOrder(){

        },
        reset(){
          this.transition = {
            orderId: '',
            subOrderId: '',
            code: '',
            buyAccount: '',
            startDate: '',
            endDate: '',
            status: '',
          }
        },
        //查看订单详情
        goDetail(index,order){
          this.$router.push('/merchantCenter/transaction/transitionOrder/'+ 1)
        },
        //发货
        deliver(index,order){
          this.changeExpress = order ;
          this.dialogVisible = true ;
          this.expressType= '1';
        },
        //修改快递
        changeWay(index,order){
          this.changeExpress = order ;
          this.dialogVisible = true ;
          this.expressType= '2';

        },

        //  确认快递相关操作
        confirm(formName){
          this.$refs[formName].validate((valid) => {
            if(valid){

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
    padding-bottom : 0!important;
    height : 160px!important;
    .inputWrap{
      width : 100% ;
      height: 32px;
      margin : 0 0.25rem 0.2rem ;
      .el-input{
        margin-left : 0!important;
        margin-bottom : 0!important;

        width : 160px!important;
      }
    }
    .inputWrap:nth-child(3){
      margin-left : 0!important;
    }
    .block{
      width : auto!important;
      .demonstration{
        width : 85px!important ;
        line-height : 32px!important;
        margin : 0 0 0 0.2rem!important ;
      }
      .el-input{
        width : 160px!important;

      }
    }
  }
  .el-table{


    .cell{
      height : 0.5rem ;
    }

    .el-button{
      margin : 0.05rem auto ;
    }

  }
  .expForm{
    .el-form-item{
      width : 50% ;
      margin : 0.2rem auto ;
    }
  }

</style>
