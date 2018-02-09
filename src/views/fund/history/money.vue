<template>
  <div class="money">
    <div class="title">
      <p>类型：</p>
      <el-select v-model="detail" placeholder="全部明细" size="small">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <p class="timeSetting">时间设置：</p>
      <div class="block">
        <span class="demonstration">开始时间：</span>
        <el-date-picker size="small"
          v-model="date.startDate" value-format="yyyy-MM-dd HH:mm:ss"
          type="datetime"
          placeholder="选择日期时间">
        </el-date-picker>
      </div>
      <div class="block">
        <span class="demonstration">结束时间：</span>
        <el-date-picker size="small"
            v-model="date.endDate" value-format="yyyy-MM-dd HH:mm:ss"
          type="datetime"
          placeholder="选择日期时间">
        </el-date-picker>
      </div>
      <el-button type="primary" size="small" @click="search">查询</el-button>
    </div>
    <el-table :data="tableData" style="width: 100%" border height="0.3rem">
      <el-table-column prop="ID" label="编号"></el-table-column>
      <el-table-column prop="type" label="交易类型"></el-table-column>
      <el-table-column prop="money" label="金额"></el-table-column>
      <el-table-column prop="note" label="资金备注"></el-table-column>
      <el-table-column prop="rest" label="当前结余"></el-table-column>
      <el-table-column prop="status" label="交易状态"></el-table-column>
      <el-table-column prop="time" label="操作时间"></el-table-column>
    </el-table>
  </div>
</template>

<script>

  export default {
      name: "money",
      data(){
          return{
            date:{
              startDate : '',
              endDate : ''
            },
            options : [
              {
                label : '账户充值',
                value : '1'
              },
              {
                label : '活动付款',
                value : '2'
              },
              {
                label : '活动结算',
                value : '3'
              },
              {
                label : '购买会员',
                value : '4'
              },
              {
                label : '账户提现',
                value : '5'
              },
            ],
            detail : '',
            tableData : []
          }
      },

      methods : {
        search(){


          console.log(this.date,this.detail)
        }
      }

    }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .money{
    width : 95% ;
    margin : 0 auto ;
    .title{
      width : 100% ;
      margin : 0.2rem 0 0.4rem ;
      height : 0.7rem ;
      line-height : 0.7rem ;
      border-bottom : 1px solid #aaa ;
      color : #444455 ;
      display : flex ;
      flex-direction: row;
      p{
        font-size : 0.18rem ;
        font-weight : bold ;
        width : 0.8rem ;
        margin-left : 0.1rem ;

      }
      .timeSetting{
        width : 1.2rem ;
        margin-left : 0.2rem ;
      }

      .demonstration{
        font-size : 0.14rem ;
        margin-left : 0.15rem ;
      }
      .el-date-editor{
        width : 60% ;
      }
      .el-button{
        width : 1rem ;
        height : 0.36rem ;
        margin-left : 0.25rem ;
        margin-top : 0.17rem ;
      }
    }
    .el-table{
      border-color : #aaa ;
      border-radius : 0.05rem ;

    }
  }
</style>
