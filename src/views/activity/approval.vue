<template>
  <div class="approval">
    <div class="search">
      <el-input v-model.trim="activity.ID" placeholder="请输入试用活动编号"></el-input>
      <el-select v-model="activity.status" filterable placeholder="请选择活动状态">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.name"
          :value="item.value">
        </el-option>
      </el-select>
      <div class="block">
        <span class="demonstration">选择日期：</span>
        <el-date-picker
          v-model="activity.date"
          type="daterange" unlink-panels format="yyyy - MM - dd " value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </div>
      <el-button round type="primary" @click="search(activity)">查询</el-button>

    </div>
    <el-table
      :data="tableData"
      border height="0.3rem">
      <el-table-column
        prop="order"
        label="序号"
        width="180">
      </el-table-column>
      <el-table-column
        prop="activityID"
        label="试用活动编号"
        width="180">
      </el-table-column>
      <el-table-column
        prop="type"
        label="平台类型">
      </el-table-column>
      <el-table-column
        prop="status"
        label="活动状态">
      </el-table-column>
      <el-table-column
        prop="number"
        label="试用品份数">
      </el-table-column>
      <el-table-column
        prop="money"
        label="担保金">
      </el-table-column>
      <el-table-column
        prop="date"
        label="活动时间">
      </el-table-column>
      <el-table-column
        prop="progress"
        label="活动进度">
      </el-table-column>
      <el-table-column
        prop="action"
        label="操作">
        <template slot-scope="scope">
          <el-button round type="primary" v-if="action.detail" @click="detail(scope.$index,scope.row)">查看详情</el-button>
          <el-button round type="primary" v-if="action.handle" @click="handle(scope.$index,scope.row)">修改</el-button>
          <el-button round type="primary" v-if="action.reason" @click="reason(scope.$index,scope.row)">查看原因</el-button>
          <el-button round type="primary" v-if="action.off" @click="off(scope.$index,scope.row)">下架</el-button>
          <el-button round type="primary" v-if="action.shelves" @click="shelves(scope.$index,scope.row)">重新上架</el-button>
          <el-button round type="primary" v-if="action.applyAccounts" @click="applyAccounts(scope.$index,scope.row)">申请结算</el-button>
          <el-button round type="primary" v-if="action.cancelAccounts" @click="cancelAccounts(scope.$index,scope.row)">取消结算</el-button>
          <el-button round type="primary" v-if="action.publish" @click="publish(scope.$index,scope.row)">重新发布</el-button>

        </template>
      </el-table-column>
    </el-table>
    <div class="block2">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 15, 20]"
        :page-size="order.page"
        layout="total, sizes, prev, pager, next, jumper"
        :total="order.totalItems">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import ElButton from "element-ui/packages/button/src/button";

  export default {
    name: "approval",
    components: {
      ElButton,
    },
    data(){
      return{
        activity :[
          {
            ID : '',
            status : '',
            date : ''
          }
        ],
        options : [
          {
            name : '待审试用',
            value : '1'
          },
          {
            name : '未通过',
            value : '2'
          },
          {
            name : '通过审核',
            value : '3'
          },
          {
            name : '已上架',
            value : '4'
          },
          {
            name : '已下架',
            value : '5'
          },
          {
            name : '结算中',
            value : '6'
          },
          {
            name : '已完成',
            value : '7'
          }
        ],
        tableData : [],
        order : [
          {
            page : '',
            totalItems : ''
          }
        ] ,
        currentPage : 1,
        action : {
          detail : false ,
          handle : false ,
          reason : false ,
          off : false ,
          shelves : false ,
          applyAccounts : false ,
          cancelAccounts : false ,
          publish : false
        }
      }

    },
    methods : {
      search(order){
        console.log(order)
      },
      detail(index){
        console.log(index)
      },
      handle(index){
        console.log(index)
      },
      reason(index){
        console.log(index)
      },
      off(index){
        console.log(index)
      },
      shelves(index){
        console.log(index)
      },
      applyAccounts(index){
        console.log(index)
      },
      cancelAccounts(index){
        console.log(index)
      },
      publish(index){
        console.log(index)
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      }
    }
    }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .approval{

    .search{
      width : 100% ;
      padding : 0.3rem 0.5rem 0.5rem;
      .el-input{
        width : 20% ;
        margin-right : 0.25rem ;
        margin-bottom : 0.2rem ;
        float : left;

      }
      .el-select{
        width : 1.6rem ;
        float : left;
        margin-bottom : 0.2rem ;

      }
      .block{
        width : 40% ;
        float : left;
        margin-bottom : 0.2rem ;

        span{
          width : 1rem ;
          height : 100% ;
          line-height : 0.4rem ;
          display : block ;
          float : left;
          text-align : right ;
        }
        .el-date-editor, .el-range-editor, .el-input__inner, .el-date-editor--daterange, .is-active{
          width : 70% ;
        }
      }

      .el-button {
        width : 0.85rem ;
        margin-bottom : 0.2rem ;
        margin-left : 0.15rem ;
      }
    }
    .el-table{
      width: 95%;
      margin : 0 auto ;
      border-color:#aaa ;
      border-radius : 0.05rem ;
    }
    .block2{
      padding : 0.3rem ;
      width : 100% ;
      box-sizing: border-box;
    }
  }
</style>
