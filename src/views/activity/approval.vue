<template>
  <div class="approval">
    <h1>试用管理</h1>
    <div class="search">
      <el-select size="small" clearable v-model="activity.EQ_platformType" filterable placeholder="请选择活动平台">
        <el-option
          v-for="item in platformOptions"
          :key="item.value"
          :label="item.name"
          :value="item.value">
        </el-option>
      </el-select>
      <el-input size="small" v-model.trim="activity.EQ_activityCode" placeholder="请输入试用活动编号"></el-input>
      <el-select size="small" clearable v-model="activity.EQ_activityStatus" filterable placeholder="请选择活动状态">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.name"
          :value="item.value">
        </el-option>
      </el-select>
      <div class="block">
        <span class="demonstration">选择日期：</span>
          <el-date-picker format="yyyy - MM - dd " value-format="yyyy-MM-dd" size="small"
            v-model="activity.GT_activityStartTime" clearable type="date"
            placeholder="开始时间" >
          </el-date-picker>
        <span class="demonstration">~</span>
        <el-date-picker size="small" v-model="activity.LT_activityEndTime"  clearable
          type="date" format="yyyy - MM - dd " value-format="yyyy-MM-dd"
          placeholder="结束日期">
        </el-date-picker>
      </div>
      <el-button round size="small" type="primary" @click="getData()">查询</el-button>

    </div>
    <el-table :data="tableData"  border>
      <el-table-column prop="activityId" label="序号" width="70"></el-table-column>
      <el-table-column prop="code" label="试用活动编号" width="140"></el-table-column>
      <el-table-column prop="platform" label="平台类型">
        <template slot-scope="scope">
          {{ platformOptions[scope.row.platform].name}}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="活动状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status==9">已完成</span>
          <span v-else-if="scope.row.status===10">已取消</span>
          <span v-else>{{ options[scope.row.status-1].name}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="tryoutQuantity" label="试用品份数"></el-table-column>
      <el-table-column prop="deposit" label="担保金"></el-table-column>
      <el-table-column prop="date" label="活动时间" width="300">
        <template slot-scope="scope">
          <span class="time">{{ scope.row.startTime}} ~ {{ scope.row.endTime}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="progress" label="活动进度"></el-table-column>
      <el-table-column prop="payStatus" label="支付状态">
        <template slot-scope="scope">
          <span v-if="scope.row.payStatus === '0'">未支付</span>
          <span v-else>支付完成</span>
        </template>
      </el-table-column>
      <el-table-column  label="操作">
        <template slot-scope="scope">
          <el-button class="check" type="text"  v-if="scope.row.status!=='4'" @click="detail(scope.$index,scope.row.activityId)">查看详情</el-button>
          <el-button class="check" type="text" v-if="scope.row.status==='4'" @click="editor(scope.$index,scope.row.activityId)">修改</el-button>
          <el-button class="check" type="text" v-if="scope.row.status==='4'" @click="reason(scope.$index,scope.row.reason)">查看原因</el-button>
          <el-button class="check" type="text" v-if="scope.row.status==='5'" @click="handle(scope.row.activityId,scope.row.status)">下架</el-button>
          <el-button class="check" type="text" v-if="scope.row.status==='6'&& scope.row.endTime< time" @click="handle(scope.row.activityId,scope.row.status)">重新上架</el-button>
          <el-button class="check" type="text" v-if="scope.row.status==='6'|| (scope.row.status==='2'&&scope.row.payStatus === '1')" @click="applyAccounts(scope.$index,scope.row.activityId)">申请结算</el-button>
          <el-button class="check" type="text" v-if="scope.row.status==='7'" @click="cancelAccounts(scope.$index,scope.row.activityId)">取消结算</el-button>
          <el-button class="check" type="text" v-if="scope.row.status==='2'" @click="publish(scope.$index,scope.row.activityId)">重新发布</el-button>
          <el-button class="check" type="text" @click="handleCancel(scope.$index,scope.row.activityId)">取消发布</el-button>
          <el-button class="check" type="text" v-if="scope.row.payStatus==='0'" @click="toPay(scope.$index,scope.row.activityId)">去支付</el-button>
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
    <el-dialog  title="查看原因" :visible.sync="reasonBox" >
        <el-input type="textarea" :rows="4" v-model.trim="reasonDetail" ></el-input>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="reasonBox=false">关 闭</el-button>
        </div>

    </el-dialog>

  </div>
</template>

<script>
  import { getActivity ,getDetail , changeStatus , applyPay , cancelActivity } from '@/api/activity'
  import { parseTime } from "@/utils"
  import ElButton from "element-ui/packages/button/src/button";

  export default {
    name: "approval",
    components: {
      ElButton,
    },
    data(){
      return{
        activity : {
            EQ_platformType : '',
            EQ_activityCode : '',
            EQ_activityStatus : '',
            LT_activityEndTime: '',
            GT_activityStartTime : '',
            // currentPage : 1,
            // pageSize : 10
          },
        date : '',
        options : [
        {
            name : '全部试用活动状态',
            value : ''
          },
          // {
          //   name : '待付款',
          //   value : '1'
          // },
          {
            name : '待审批',
            value : '2'
          },
          {
            name : '审批通过',
            value : '3'
          },
          {
            name : '审批拒绝',
            value : '4'
          },
          {
            name : '已上架',
            value : '5'
          },
          {
            name : '已下架',
            value : '6'
          },
          {
            name : '结算中',
            value : '7'
          },
          {
            name : '已完成',
            value : '9'
          },
          {
            name : '已取消',
            value : '10'
          }
        ],
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
        tableData : [],
        totalPages : '',
        totalElements : 0,
        currentPage : 1,
        pageSize : 10,
        // clearable : true ,
        reasonBox : false ,
        reasonDetail : '',
        activityDetail : {} ,
        time : ''

      }

    },
    mounted(){
      this.getData();
      let now = new Date();
      this.time = parseTime(now);
    },
    methods : {

      //请求数据
      getData() {
        // console.log(form);
        let formData = new FormData();
          formData.append('EQ_platformType', this.activity.EQ_platformType);
          formData.append('EQ_activityCode', this.activity.EQ_activityCode);
          formData.append('EQ_activityStatus',this.activity.EQ_activityStatus);
          formData.append('LT_activityEndTime',this.activity.LT_activityEndTime);
          formData.append('GT_activityStartTime',this.activity.GT_activityStartTime);
          formData.append('currentPage',this.currentPage);
          formData.append('pageSize',this.pageSize);
        getActivity(formData).then(res => {
          console.log(res);
          if (res.data.status === '000000000') {
            this.tableData = res.data.data;
            this.totalPages = res.data.totalPages ;
            this.totalElements = res.data.totalElements ;
          }
        }).catch(err => {
          alert('服务开小差啦，请稍等~')
        });
      },
      //获取活动详情数据
      detail( index,order ){
        getDetail(order).then( res =>{
          if(res.data.status === '000000000'){
            this.activityDetail = res.data.data ;
            this.$router.push({ path : '/publish/step1' ,query : { editor : '2', order : order }})

          }

        }).catch( err => {
          alert('服务开小差啦，请稍等~')
        });
      },

      //修改指定试用发布内容
      editor(index ,order){
            this.$router.push({ path : '/publish/step1' ,query : { editor : '1', order : order }});
        console.log(order) ;

      },
      reason(index ,word){
        this.reasonBox = true ;
        this.reasonDetail = word ;
          console.log(index,word)
      },
      //上架/下架操作
      handle(id , status  ){
        console.log(id,status,);
        let formData = new FormData();
        formData.append('activityId',id);
        formData.append('activityStatus',status);
        changeStatus(formData).then( res => {
          if(res.data.status === '000000000'){
            this.$message({
              message : '操作成功',
              type : 'success',
              center : true
            })
          }else{
            this.$message({
              message : res.data.message ,
              type : 'error',
              center : true
            })
          }
        }).catch( err => {
          alert('服务器开小差啦，请稍等~')
        });
      },

      //申请结算
      applyAccounts(index ,id){
        applyPay(id).then( res => {
          if( res.data.status === '000000000'){
            this.$message({
              message : '申请结算成功，请稍后确认',
              center : true ,
              type : 'success'
            })
          }else{
            this.$message({
              message :  res.data.message ,
              center : true ,
              type : 'error'
            })
          }
        }).catch( err =>{
          alert('服务器开小差啦，请稍等~')
        });
        console.log(index)
      },

      //取消结算
      cancelAccounts(index){
        console.log(index)
      },

      //重新发布
      publish(index ,id){
        this.$router.push({ path : '/publish/step1' , query : { order : id } });

        console.log(index)
      },

      //取消发布
      handleCancel(index, id){
        cancelActivity(id).then( res=> {
          if( res.data.status === '000000000'){
            this.$message({
              message : '取消成功',
              type : 'success' ,
              center : true
            })
          }else{
            this.$message({
              message : res.data.message ,
              type : 'error' ,
              center : true
            })
          }
        }).catch( err =>{
          alert('服务器开小差啦，请稍等~')
        })
      },


      //去支付
      toPay(index,order){
        this.$router.push({ name : 'Pay',params : { id : order} })
      },

      handleSizeChange(val) {

        this.pageSize = val ;
        this.getData();
      },

      handleCurrentChange(val) {

        this.currentPage = val ;
        this.getData();
      }
    }
    }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .approval{
    h1{
      margin : 0.3rem 0 ;
      padding : 0.2rem  0.4rem ;
      border-bottom : 1px solid #666 ;
      font-size : 0.22rem ;
      line-height : 0.4rem ;
    }
    .search{
      width : 100% ;
      padding : 0.3rem 0.5rem 0.2rem;
      height : 1.5rem ;
      border-bottom : 1px solid #aaa ;
      margin-bottom : 0.3rem ;
      .el-input{
        width : 20% ;
        margin :0 0.25rem 0.2rem ;
        float : left;

      }
      .el-select{
        width : 1.6rem ;
        float : left;
        margin-bottom : 0.2rem ;

      }
      .block{
        width : 60% ;
        float : left;
        margin-bottom : 0.2rem ;

        span{
          width : 0.9rem ;
          height : 100% ;
          line-height : 0.4rem ;
          display : block ;
          float : left;
          text-align : left ;
          color : #333;
          &:nth-last-child(2){
            width : 0.2rem ;
            text-align : center ;
          }
        }
        .el-date-editor, .el-range-editor, .el-input__inner, .el-date-editor--daterange, .is-active{
          width : 30% ;
          padding : 0 0.03rem;

        }
      }

      .el-button {
        width : 0.85rem ;
        margin-bottom : 0.2rem ;
        margin-left : 0.15rem ;
        float : left;

      }
    }
    .el-table{
      width: 95%;
      margin : 0 auto ;
      border-color:#aaa ;
      border-radius : 0.05rem ;
      .check{
        padding : 0;
        margin : 0;
      }
      .time{
        font-size : 0.13rem ;
      }
    }
    .block2{
      padding : 0.3rem ;
      width : 100% ;
      box-sizing: border-box;
      .totalItems{
        display : block ;
        height : 0.3rem ;
        color : #666 ;
        text-align : right ;
        margin-top : 0.3rem ;
      }
    }
  }
</style>
