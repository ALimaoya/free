<template>
  <div class="order">
    <h1>订单查询</h1>
    <template>
      <div class="search">
        <el-input v-model.trim="order.taobaoID" placeholder="请输入试客淘宝号"></el-input>
        <el-input v-model.trim="order.orderID" placeholder="请输入淘宝订单编号"></el-input>
        <el-select v-model="order.conditions" filterable placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.name"
            :value="item.value">
          </el-option>
        </el-select>
        <el-button @click="searchOrder(order)">查询</el-button>
      </div>
      <div class="note">备注：以上搜索条件可根据单一条件进行搜索，当单独试客淘宝号搜索不到有用信息时，可尝试输入淘宝订单编号，反之亦然</div>
      <el-table
          :data="tableData"
          border
          style="width: 100%;border-color:#aaa ;border-radius : 0.05rem ;">
          <el-table-column
            prop="taskID"
            label="试客任务编号"
            width="180">
          </el-table-column>
          <el-table-column
            prop="subOrderID"
            label="试客子订单编号"
            width="180">
          </el-table-column>
          <el-table-column
            prop="goods"
            label="商品">
          </el-table-column>
          <el-table-column
            prop="taobaoID"
            label="试客淘宝账号">
          </el-table-column>
          <el-table-column
            prop="orderID"
            label="淘宝订单编号">
          </el-table-column>
          <el-table-column
            prop="status"
            label="状态">
          </el-table-column>
          <el-table-column
            prop="action"
            label="操作">
            <template slot-scope="scope">
              <el-button round type="primary" @click="handleComplaint(scope.$index,scope.rpw)">投诉</el-button>
              <el-button round type="primary" @click="changePrice(scope.$index,scope.row)">改价</el-button>
            </template>
          </el-table-column>
        </el-table>

    </template>
  </div>
</template>

<script>
  import ElButton from "element-ui/packages/button/src/button";

  export default {
    name: "order" ,
    components: {
      ElButton,
    },
    data(){
      return{
        options : [
          {
            name : '待申请',
            value : '1'
          },
          {
            name : '待抽奖',
            value : '2'

          },
          {
            name : '待领奖',
            value : '3'

          },
          {
            name : '待确认收货',
            value : '4'

          }
        ],
        order : [
          {
            conditions : '',
            taobaoID : '',
            orderID : ''
          }
        ],
        tableData : []
      }
    },
    methods : {
      handleComplaint(index,row){
        console.log(index,row)
      },
      changePrice(index,row){
        console.log(index,row)

      },
      searchOrder(order){
        console.log(order)
      }
    }
    }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .order{

    h1{
      margin : 0.3rem 0 ;
      padding : 0.2rem  0.4rem ;
      border-bottom : 1px solid #666 ;
    }
    .search{
      width : 100% ;
      padding : 0.2rem 0.3rem ;
      box-sizing: border-box;
      .el-input{
        width : 1.8rem ;
        margin-right :  0.3rem ;
        font-size : 0.14rem ;
        color : #8f949a;

      }
      .el-select{
        margin-left : 0.1rem ;
        width : 1.4rem ;
        background : #eee ;
      }
      .el-button{
        width : 1rem ;
        height : 0.4rem ;
        border-radius : 0.2rem ;
        font-size : 0.14rem ;
        color : #fff;
        background : #009dda;
        margin-left : 0.2rem ;
      }
    }
    .note{
      width : 100% ;
      border-bottom : 1px solid #aaa ;
      height : 0.4rem ;
      line-height : 0.4rem ;
      font-size : 0.14rem ;
      text-indent : 0.32rem ;
      color : #999 ;
    }

    .el-table{
      margin-top : 0.4rem ;
        .el-button{
          width : 0.6rem ;
          height : 0.25rem ;

        }
    }
  }
</style>
