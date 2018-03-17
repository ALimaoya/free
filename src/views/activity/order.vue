<template>
  <div class="order">
    <h1>订单查询</h1>
      <div class="search">
        <el-select size="small" clearable v-model="order.platformType" filterable placeholder="请选择试用平台">
          <el-option
            v-for="item in platformOptions"
            :key="item.value"
            :label="item.name"
            :value="item.value">
          </el-option>
        </el-select>
        <el-input size="small" v-model.trim="order.activityCode" placeholder="请输入试客试用活动编号"></el-input>
        <el-input size="small" v-model.trim="order.thirdOrderCode" placeholder="请输入第三方订单编号"></el-input>
        <el-select clearable size="small"  v-model="order.EQ_status" filterable placeholder="请选择订单状态">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.name"
            :value="item.value">
          </el-option>
        </el-select>
        <el-button size="small"  @click="getList()" class="searchOrder">查询</el-button>
      </div>
      <div class="note">备注：以上搜索条件可根据单一条件进行搜索，当单独试客淘宝号搜索不到有用信息时，可尝试输入淘宝订单编号，反之亦然</div>
      <el-table :data="tableData" border>
          <el-table-column prop="activityCode" label="试客任务编号" width="180"></el-table-column>
          <el-table-column prop="orderCode" label="试客子订单编号" width="180"></el-table-column>
          <el-table-column prop="activityTitle" label="商品名称"></el-table-column>
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
    <!--投诉弹窗-->
    <!--<el-dialog title="投诉" :visible.sync="complainBox" :before-close="close">-->
      <!--<el-form :model="complaintForm" ref="complaintForm" :rules="complaintRules">-->
        <!--<el-form-item prop="reason">-->
          <!--<span class="reason">选择投诉原因：</span>-->
          <!--<el-select size="small" v-model="complaintForm.reason" placeholder="请选择">-->
            <!--<el-option v-for="item in reasonOptions" :key="item.value" :label="item.name" :value="item.value"></el-option>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
        <!--<el-form-item prop="detail">-->
          <!--<p>备注：</p>-->
          <!--<el-input type="textarea" :rows="4" v-model.trim="complaintForm.detail" placeholder="请输入具体原因"></el-input>-->
        <!--</el-form-item>-->
        <!--&lt;!&ndash;<div slot="footer" class="dialog-footer">&ndash;&gt;-->
        <!--<el-form-item>-->
          <!--<el-button size="small" @click="cancel('complaintForm')">取 消</el-button>-->
          <!--<el-button size="small" type="primary" @click="submit('complaintForm')">确认提交</el-button>-->
        <!--</el-form-item>-->
        <!--&lt;!&ndash;</div>&ndash;&gt;-->
      <!--</el-form>-->

    <!--</el-dialog>-->
  </div>
</template>

<script>
  import ElButton from "element-ui/packages/button/src/button";
  import { getOrderList ,changeStatus } from "@/api/activity"
  // import ElDialog from "element-ui/packages/dialog/src/component";

  export default {
    name: "order" ,
    components: {
      // ElDialog,
      ElButton,
    },
    data(){
      return{
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
            name : '未中奖',
            value : '1'
          },
          {
            name : '待抽奖',
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
          {
            name : '投诉处理中',
            value : '10'
          },
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
        reasonOptions : [
            {
              value : '1',
              name : '试客操作违规'
            },
            {
              value : '2',
              name : '试客订单未付款'
            },
            {
              value : '3',
              name : '试客订单未查到'
            }
        ],
        complaintForm : {
          reason : '',
          detail : ''
        },
        complaintRules : {
          reason : [
            {
              required : true ,message : '请选择投诉原因', trigger : 'change'
            }
          ],
          detail : [
            {
              required : true , message : '请填写具体投诉原因', trigger : 'blur'
            }
          ]
        }
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
          formData.append('EQ_tryoutActivity.activityCode', this.order.activityCode);
          formData.append('EQ_tryoutOrderWin.thirdOrderCode',this.order.thirdOrderCode);
          formData.append('EQ_status',this.order.EQ_status);
          formData.append('currentPage', this.currentPage);
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

      //修改订单状态
      changeStatus(index,order){
        changeStatus({ data : { orderId : order }}).then( res => {

        }).catch( err => {
          alert('服务器开小差啦，请稍等~')
        })
      },

      //打开投诉操作弹窗
      // handleComplaint(index,row){
      //   this.complainBox = true ;
      //   this.complaintOrder = row ;
      //   console.log(index,row)
      // },
      //修改价格
      // 提交投诉问题
      // submit(formName){
      //   this.$refs[formName].validate((valid) => {
      //     if(valid){
      //       this.$message({
      //         center : true ,
      //         message : '提交成功',
      //         type : 'success'
      //       });
      //       console.log(this.complaintForm);
      //       this.$refs[formName].resetFields();
      //       this.complainBox = false ;
      //     }else{
      //       this.$message({
      //         type : 'error',
      //         message : '提交失败，请重新确认信息',
      //         center : true
      //       });
      //       return false ;
      //     }
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

  .order{


    .note{
      padding-left : 0.3rem ;
      width : 100% ;
      border-bottom : 1px solid #aaa ;
      height : 0.4rem ;
      line-height : 0.4rem ;
      font-size : 0.14rem ;
      text-indent : 0.32rem ;
      color : #999 ;
    }


    .el-dialog{
      .el-form{
        padding : 0  0.3rem ;
        .reason{
          width : 100% ;
          color : #666;
          display : inline-block ;
        }
        .el-textarea{
          width : 80% ;
        }
      }
    }
  }
</style>
