<template>
  <div class="refundOrder">
    <h1 class="h_title">退款详情</h1>
    <el-form  :model="form" ref="form"  label-position="right">
      <el-form-item   labelWidth="130px"  label="退款单号：" >
        <table class="tableC">
          <tr class="thColor">
            <th>退款单号</th><th>订单号</th><th>子订单号</th>
          </tr>
          <tr class="tbColor"><td>{{form.code}}</td><td>{{form.payOrderCode}}</td><td>{{form.deliveryOrderCode}}</td></tr>
        </table>
      </el-form-item>
      <el-form-item   labelWidth="130px"  label="退款信息：" >
        <table class="tableC">
          <tr class="thColor">
            <th>金额</th><th>退款时间</th><th>退款状态</th>
          </tr>
          <tr class="tbColor">
            <td>{{form.returnAmount}}</td>
            <td>{{form.returnTime}}</td>
            <td>
              <el-button size="mini"  :type="statusList[form.status-0].type">{{ statusList[form.status-0].name }}</el-button>
            </td>
          </tr>
        </table>
      </el-form-item>
      <el-form-item   labelWidth="130px"  label="买方：">
        <table class="tableC">
          <tr class="thColor">
            <th>账号</th><th>名称</th>
          </tr>
          <tr class="tbColor"><td>{{form.buyAccountName}}</td><td>{{form.buyRealName}}</td></tr>
        </table>
      </el-form-item>
      <el-form-item   labelWidth="130px"  label="商品：" >
        <table class="tableC">
          <tr class="thColor">
            <th>商品编号</th><th>商品名称</th><th>品牌</th><th>分类</th><th>规格</th><th>数量</th><th>价格</th>
          </tr>
          <tr class="tbColor">
            <td>{{form.productCode}}</td>
            <td>{{form.productName}}</td>
            <td>{{form.brandCnName}}</td>
            <td>
              <span v-if="form.categoryMap.categoryName1">{{form.categoryMap.categoryName1}}</span>/
              <span v-if="form.categoryMap.categoryName2">{{form.categoryMap.categoryName2}}</span>/
              <span v-if="form.categoryMap.categoryName3">{{form.categoryMap.categoryName3}}</span></td>
            <td>{{form.size}}</td>
            <td>{{form.quality}}</td>
            <td>{{form.price}}</td></tr>
        </table>
      </el-form-item>
      <el-form-item   labelWidth="130px"  label="货物状态：">
        <div>{{ productStatus[form.productStatus-0].name}}</div>
      </el-form-item>
      <el-form-item labelWidth="130px"  label="退款原因：">
        <div>{{ form.reason}}</div>
      </el-form-item>
      <el-form-item   labelWidth="130px"  label="退款说明：">
        <div>{{ form.remark}}</div>
      </el-form-item>
      <el-form-item>
        <el-button class="backBtn" type="primary" size="small" @click="goBack">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// import ElForm from "element-ui/packages/form/src/form";
// import ElFormItem from "element-ui/packages/form/src/form-item";
import { refuseOrder } from "@/api/merchant";
export default {
  // components: {
  //   ElFormItem,
  //   ElForm
  // },
  name: "refundOrder",
  data() {
    return {
      form: {
        code:'',
        payOrderCode:'',
        deliveryOrderCode:'',
        returnAmount:'',
        returnTime:'',
        status:'',
        buyAccountName:'',
        buyRealName:'',
        productCode:'',
        productName:'',
        brandCnName:'',
        categoryMap:{},
        size:'',
        quality:'',
        price:'',
        productStatus:'',
        reason:'',
        remark:'',
      },
      statusList: [
        {
          name: "退款中",
          type: 'primary'
        },
        {
          name: "已退款",
          type: 'success'
        },
        {
          name: "已取消",
          type: 'info'
        },
        {
          name: "退款已拒绝",
          type: 'danger'
        }
      ],
      productStatus:[
        {
          name: "未收到货物"
        },
        {
          name: "已收到货物"
        },
      ]
    };
  },
  mounted() {
    this.getDetail();
  },
  methods: {
    getDetail() {
      let order = this.$route.params.id;
      refuseOrder(order)
        .then(res => {
          console.log("data", res);
          if (res.data.status === "000000000") {
            this.form = res.data.data;
          } else {
            this.$message({
              message: res.data.message,
              center: true,
              type: "error"
            });
          }
        })
        .catch(err => {});
      // this.form =
    },
    goBack() {
      window.history.go(-1);
    }
  }
};
</script>

<style scoped lang="scss" rel="stylesheet/scss">
.el-form {
  margin: 0.5rem auto;
  width: 70%;
  .el-form-item {
    .backBtn {
      margin-left: 1.8rem;
    }
    .tableC {
      width: 100%;
      th {
        font-weight: 100;
      }
      td {
        color: #666;
        text-align: center;
      }
    }
  }
}
</style>
