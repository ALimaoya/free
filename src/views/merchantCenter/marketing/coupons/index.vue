<template>
    <div class="coupons">
        <div class="coupons_title">
            <img src="../../../../assets/imgs/u2.svg"/>
            <div class="title_content">
                <h1>优惠券</h1>
                <p>包括店铺优惠券和商品优惠券，平台优质商家都在使用，平均提高客单价和转化率30%</p>
                <div class="btn_wrap">
                    <el-button type="primary" size="small" @click="newCoupons('1')">创建店铺优惠券</el-button>
                    <el-button type="primary" size="small" @click="newCoupons('2')">创建商品优惠券</el-button>
                </div>
            </div>
        </div>
        <ul class="category">
            <li v-for="(item,index) in couponList" :key="index" :class="target === index ?'active':''" @click="getList(index)">{{ item.name }}</li>
        </ul>
      <keep-alive>
        <component  :is="tabView" @getContent="coupons"></component>
      </keep-alive>
    </div>
</template>

<script>
import GoodsCouponList from "@/views/merchantCenter/marketing/coupons/goodsCouponList";
import ShopCouponList from "@/views/merchantCenter/marketing/coupons/shopCouponList";
export default {
  name: "coupons",
  components: {
    GoodsCouponList,
    ShopCouponList
  },
  data() {
    return {
      target: 0,
      couponList: [
        {
          name: "店铺优惠券"
        },
        {
          name: "商品优惠券"
        }
      ],
      tabView: ""
    };
  },
  mounted() {
    let type = this.$route.query.type;

    if (type !== undefined) {
      this.getList(type * 1);
    } else {

      this.getList(0);
    }
  },
  methods: {
    newCoupons(type) {
      if (type === "1") {
        this.$router.push("/merchantCenter/marketing/shopCoupon");
      } else if (type === "2") {
        this.$router.push("/merchantCenter/marketing/goodsCoupon");
      }
    },
    getList(type) {
      this.target = type;
      if (type === 0) {
        this.tabView = "ShopCouponList";
      } else if (type === 1) {
        this.tabView = "GoodsCouponList";
      }
    },
    coupons(res) {
      this.tabView = res;
    }
  }
};
</script>

<style scoped lang="scss" rel="stylesheet/scss">
.coupons {
  width: 90%;
  margin: 0.5rem auto;
}
.coupons_title {
  width: 100%;
  padding: 0.3rem;
  box-sizing: border-box;
  background: #eee;
  display: flex;
  flex-direction: row;
  align-items: center;
  img {
    width: 1rem;
    height: 1rem;
    margin-right: 0.4rem;
  }
}
.title_content {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  color: #333;
  h1 {
    font-size: 0.24rem;
    line-height: 0.6rem;
  }
  p {
    font-size: 0.14rem;
    line-height: 0.3rem;
  }
  .btn_wrap {
    flex-direction: row;
    justify-content: flex-start;
    margin-top: 0.2rem;
    .el-button:nth-child(1) {
      margin-right: 0.2rem;
    }
  }
}
.category {
  width: 100%;
  border-bottom: 1px solid #dcdfe6;
  margin: 0.6rem 0 0.2rem;
  padding-left: 0.3rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  li {
    font-size: 0.14rem;
    font-weight: bold;
    color: #666;
    height: 0.4rem;
    line-height: 0.4rem;
    padding: 0 0.2rem;
    cursor: pointer;
  }
}
.active {
  border-bottom: 2px solid #ff0011;
  color: #333;
}
</style>
