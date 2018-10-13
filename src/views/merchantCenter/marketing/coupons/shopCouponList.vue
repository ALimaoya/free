<template>
  <div class="shop-coupon-list tableBox" v-loading="loading"  element-loading-text="拼命加载中">
    <div class="search">
      <el-select size="mini" v-model="listStatus" clearable>
        <el-option v-for="item in statusList"
                   :key="item.value"
                   :label="item.name"
                   :value="item.value">
        </el-option>
      </el-select>
      <el-button type="primary" round size="mini" @click="getList">搜索</el-button>
    </div>
    <el-table :data="tableData" border>
      <el-table-column prop="name" label="优惠券名称" ></el-table-column>
      <el-table-column prop="price" label="面额" ></el-table-column>
      <el-table-column prop="conditions" label="门槛" ></el-table-column>
      <el-table-column prop="methods" label="推广渠道"></el-table-column>
      <el-table-column prop="activityTime" label="活动时间" width="100"></el-table-column>
      <el-table-column prop="givenMount" label="发行量" width="100"></el-table-column>
      <el-table-column prop="getMount" label="领取量" width="100"></el-table-column>
      <el-table-column prop="useMount" label="使用量" width="100"></el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template slot-scope="scope">

        </template>
      </el-table-column>
      <el-table-column label="操作" >
        <template slot-scope="scope">
          <el-button type="text" @click="getData">数据</el-button>
          <el-button type="text" @click="handleStop">结束</el-button>
          <el-button type="text" @click="handelEditor">修改</el-button>
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
    <div v-if="mask" @click="close" class="mask">
      <img :src=" imageDomain + bigImg"  />
    </div>
  </div>
</template>

<script>
import userPhoto from "@/assets/404_images/fail.png";
import { couponList } from "@/api/merchant";

export default {
  name: "shop-coupon-list",
  data() {
    return {
      statusList: [
        {
          name: "全部",
          value: ""
        },
        {
          name: "领取中",
          value: "1"
        },
        {
          name: "已领完",
          value: "2"
        },
        {
          name: "已结束",
          value: "3"
        }
      ],
      listStatus: "",
      tableData: [],
      imageDomain: process.env.IMAGE_DOMAIN,
      errorImg: 'this.src="' + userPhoto + '"',
      failImg: userPhoto,
      pageSize: 10,
      currentPage: 1,
      totalPages: 0,
      totalElements: 0,
      mask: false,
      bigImg: "",
      loading: false
      // EQ_type:'1'
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    getList() {
      let formData = new FormData();
      formData.append("EQ_type", '1');
      formData.append("EQ_activityType", this.listStatus);
      couponList(formData).then(res => {
        consoel.log(res);
      });
      // this.tableData =
    },
    getData() {},
    handleStop() {},
    handelEditor() {},
    handleSizeChange(val) {
      this.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getList();
    }
  }
};
</script>

<style scoped lang="scss" rel="stylesheet/scss">
@import "src/styles/table.scss";

.search {
  margin-bottom: 0.2rem;
  .el-select {
    margin-right: 0.4rem;
  }
}
.el-table {
  width: 100% !important;
  margin: 0;
}
</style>
