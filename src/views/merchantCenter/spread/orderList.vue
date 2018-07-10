<template>
    <div class="order-list activityTable" v-loading="loading"  element-loading-text="拼命加载中">
        <h1>商品清单</h1>
        <div class="search">
            <div class="block">
                <el-date-picker size="small" v-model="search.startDate" value-format="yyyy-MM-dd" type="date" placeholder="选择退款开始时间">
                </el-date-picker>
            </div>
            <div class="block">
                <el-date-picker size="small" v-model="search.endDate" value-format="yyyy-MM-dd" type="date" placeholder="选择退款结束时间">
                </el-date-picker>
            </div>
            <el-select  size="small" clearable v-model="search.status" filterable placeholder="退款状态">
                <el-option
                v-for="item in statusList"
                :key="item.value"
                :label="item.name"
                :value="item.value">
                </el-option>
            </el-select>
            <el-button type="primary" size="mini" @click="getList()">查询</el-button>
        </div>
        <el-table :data="tableData"  border  align="center" fit>
            <el-table-column  label="商品信息">
                <template slot-scope="scope">
                    <div class="img">
                        <img src="" alt="">
                    </div>
                    <ul class="particulars">
                            <li>{{scope.row.commodity.name}}</li>
                            <li>商品编号：{{scope.row.commodity.code}}</li>
                            <li>￥{{scope.row.commodity.money}}</li>
                    </ul>
                </template>
            </el-table-column>
            <el-table-column prop="creationTime" label="创建时间"></el-table-column>
            <el-table-column prop="price" label="实际成交价格"></el-table-column>
            <el-table-column prop="num" label="成交商品数量"></el-table-column>
            <el-table-column prop="ratio" label="佣金比例"></el-table-column>
            <el-table-column prop="brokerage" label="佣金"></el-table-column>
            <el-table-column prop="gitTime" label="确认收货时间"></el-table-column>
            <el-table-column prop="closeTime" label="结算时间"></el-table-column>
            <el-table-column prop="statu" label="状态"></el-table-column>
        </el-table>
    </div>
</template>

<script>
export default {
  name: "order-list",
  data() {
    return {
      loading: false,
      search: {
        startDate: "",
        endDate: "",
        status: ""
      },
      tableData: [
        {
          commodity: {
              imgsrc:'',
              name:'xxxxxxx',
              code:'20181315',
              money:'10'
          },
          creationTime: "2018:01:01",
          price: "100",
          num: "10",
          ratio: "10%",
          brokerage: "10",
          gitTime: "2018:01:02",
          closeTime: "2018:01:03",
          statu: "yijiesuan"
        }
      ],
      statusList: [
        {
          name: "全部状态",
          value: "",
          type: ""
        },
        {
          name: "退款中",
          value: "0",
          type: "primary"
        },
        {
          name: "已退款",
          value: "1",
          type: "success"
        },
        {
          name: "已取消",
          value: "2",
          type: "info"
        },
        {
          name: "已拒绝",
          value: "3",
          type: "danger"
        }
      ]
    };
  },
  mounted() {},
  methods: {
    getList() {
      alert(111);
    }
  }
};
</script>

<style scoped lang="scss" rel="stylesheet/scss">
@import "../../../styles/activityTable";
@import "../../../styles/table";
.search {
  height: 100px !important;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  flex-wrap: wrap;
  .el-input,
  .el-select,
  .block {
    width: 25% !important;
    margin-left: 0 !important;
    margin-right: 0.25rem !important;
  }
  .block {
    .el-input {
      width: 100% !important;
    }
  }
  .el-button {
    height: 32px;
    margin-left: 0 !important;
  }
}
.el-table .particulars,.img{
    display: inline-block;
}
// .el-table .img{
//     width: 30px;
//     height: 30px;
// }
</style>
