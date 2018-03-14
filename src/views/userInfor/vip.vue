<template>
  <div class="vip">
    <!--<top></top>-->
    <div class="title">会员管理</div>
    <div class="content">
      <p>会员状态：</p>
      <el-table :data="statusData" border style="width: 100%">
        <el-table-column prop="vipLevel" label="会员类型">
          <template slot-scope="scope">
            <span v-if="scope.row.vipLevel==0||!scope.row.vipLevel">非会员</span>
            <span v-else>
              <span style="color:red">vip:{{scope.row.vipLevel}}</span> 会员</span>
          </template>
        </el-table-column>
        <el-table-column prop="vipTime" label="到期时间"></el-table-column>
        <el-table-column prop="action" label="操作">
          <template slot-scope="scope">
            <el-button v-if="scope.row.vipLevel==0||!scope.row.vipLevel" @click="handleVip()" type="text" size="small">购买正式会员</el-button>
            <el-button v-else @click="handleVip()" type="text" size="small">续费会员</el-button>
          </template>
        </el-table-column>
      </el-table>
      <p>会员充值记录：</p>
      <el-table border :data="historyData.data" stripe style="width: 100%">
        <el-table-column prop="creatTime" label="时间"></el-table-column>
        <el-table-column prop="usefulMonth" label="开通时间长(月)"></el-table-column>
        <el-table-column prop="amount" label="充值金额"></el-table-column>
        <el-table-column prop="type" label="充值类型">
          <template slot-scope="scope">
            <span v-if="scope.row.type==1"  size="small">支付宝</span>
            <span v-else-if="scope.row.type==2"  size="small">微信</span>
            <span v-else size="small">押金</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status==0" size="small">未支付</span>
            <span v-else size="small">已支付</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="block2" v-if="historyData.totalElements>0">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 15, 20]"
          :page-size="pageSize" layout=" sizes, prev, pager, next, jumper" :total="historyData.totalElements">
        </el-pagination>
        <span class="totalItems">共{{historyData.totalPages}}页，{{historyData.totalElements}}条记录</span>
      </div>
    </div>

  </div>
</template>

<script>
  import {
    getMember,
    getMemberOrder
  } from "@/api/userInfor"
  export default {
    name: "vip",
    data() {
      return {
        statusData: [],
        historyData: [],
        pageSize: 10,
        currentPage: 1,
        vipInfo: {}
      }
    },
    mounted() {
      this.getVipInfo();
      this.getOrderList();
    },
    methods: {
      //购买vip
      handleVip() {
        this.$router.push('/userInfor/buyVip');
      },
      getVipInfo() {
        getMember().then(res => {
          if (res.data.status == '000000000') {
            this.statusData.push(res.data.data)
            console.log(this.statusData)
          } else {
            this.$message({
              message: res.data.message,
              type: 'error',
              center: true
            });
          }
        }).catch(err => {
          alert('服务器开小差啦，请稍等~')
        })
      },
      getOrderList() {
        let formdata = new FormData();
        formdata.append('currentPage', this.currentPage)
        formdata.append('pageSize', this.pageSize)
        getMemberOrder(formdata).then(res => {
          if (res.data.status == '000000000') {
            this.historyData = res.data
          } else {
            this.$message({
              message: res.data.message,
              type: 'error',
              center: true
            });
          }
        }).catch(err => {
          alert('服务器开小差啦，请稍等~')
        })
      },
      handleSizeChange(val) {
        this.pageSize = val
        this.getOrderList();
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getOrderList();
      }
    }
  }

</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .vip {
    color: #333;
    .title {
      width: 100%;
      height: 0.4rem;
      line-height: 0.4rem;
      font-size: 0.22rem;
      margin: 0.4rem 0;
      border-bottom: 1px solid #aaa;
      text-indent: 0.3rem;
      font-weight : bold ;
    }

    .content {
      width: 80%;
      margin: 0 auto;
      p {
        width: 100%;
        height: 0.4rem;
        font-size: 0.16rem;
        line-height: 0.4rem;
        text-indent: 0.4rem;
        margin-top: 0.2rem;
      }
      .el-table--border,
      .el-table--group {
        border-color: #D3D3D3;
        border-radius: 0.05rem;
      }
      .el-table__row {
        padding: 0.08rem 0;
      }
      .block2 {
        padding: 0.3rem;
        width: 100%;
        box-sizing: border-box;
        .totalItems {
          display: block;
          height: 0.3rem;
          color: #666;
          text-align: right;
          margin-top: 0.3rem;
        }
      }
    }



  }

</style>
