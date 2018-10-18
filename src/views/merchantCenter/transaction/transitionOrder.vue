<template>
  <div class="transitionOrder" v-loading="loading" element-loading-text="拼命加载中">
    <h1 class="h_title">交易详情</h1>
    <el-form :model="form" ref="form" label-position="right">
      <el-form-item labelWidth="130px" label="单号：">
        <table class="tableC">
          <tr class="thColor">
            <th>订单号</th>
            <th>子订单号</th>
          </tr>
          <tr class="tbColor">
            <td>{{form.deliverOrder.orderCode}}</td>
            <td>{{form.deliverOrder.code}}</td>
          </tr>
        </table>
      </el-form-item>
      <el-form-item labelWidth="130px" label="买方：">
        <table class="tableC">
          <tr class="thColor">
            <th>账号</th>
            <th>名称</th>
          </tr>
          <tr class="tbColor">
            <td>{{form.deliverOrder.buyAccountName}}</td>
            <td>{{form.deliverOrder.buyRealName}}</td>
          </tr>
        </table>
      </el-form-item>
      <el-form-item labelWidth="130px" label="状态：">
        <table class="tableC">
          <tr class="thColor">
            <th>订单状态</th>
            <th>下单时间</th>
            <th>支付方式</th>
            <th>支付时间</th>
          </tr>
          <tr class="tbColor">
            <td>
              <el-button plain v-if="form.deliverOrder.status === '21'" size="mini" type="warning">已支付拼团中</el-button>
              <el-button plain v-else-if="form.deliverOrder.status === '22'" size="mini" type="success">拼团成功待抽奖</el-button>
              <el-button plain v-else-if="form.deliverOrder.status === '23'" size="mini" type="danger">未中奖退款中</el-button>
              <el-button plain v-else-if="form.deliverOrder.status === '24'" size="mini" type="info">未中奖已退款</el-button>
              <el-button plain v-else-if="form.deliverOrder.status === '25'" size="mini" type="danger">拼团失败退款中</el-button>
              <el-button plain v-else-if="form.deliverOrder.status === '26'" size="mini" type="info">拼团失败已退款</el-button>
              <el-button plain size="mini" disabled="disabled" v-else-if="form.deliverOrder.status!==null"
                         :type="statusList[form.deliverOrder.status*1].type">{{
                statusList[form.deliverOrder.status*1].name }}
              </el-button>
            </td>
            <td>{{form.deliverOrder.createTime}}</td>
            <td v-if="form.deliverOrder.status!='0'&&form.deliverOrder.status!='6'">{{
              payList[form.deliverOrder.payType-0] }}
            </td>
            <td v-else>--</td>
            <td v-if="form.deliverOrder.payTime!==null">{{form.deliverOrder.payTime}}</td>
            <td v-else></td>
          </tr>
        </table>
      </el-form-item>
      <el-form-item labelWidth="130px" label="发货：" v-if="form.deliverOrder.status !== '0'">
        <table class="tableC">
          <tr class="thColor">
            <th>收货人姓名</th>
            <th>收货人电话</th>
            <th>收货地址</th>
            <th>运费（元）</th>
            <th>发货时间</th>
            <th>快递名称</th>
            <th>快递单号</th>
            <th>收货时间</th>
          </tr>
          <tr class="tbColor">
            <td>{{form.deliverOrder.receiverName}}</td>
            <td>{{form.deliverOrder.receiverMobile}}</td>
            <td>{{form.deliverOrder.receiverAddress}}</td>
            <td>{{form.deliverOrder.carriageAmount}}</td>
            <td>{{form.deliverOrder.deliveryTime}}</td>
            <td>{{form.deliverOrder.expressName}}</td>
            <td>{{form.deliverOrder.expressNumber}}</td>
            <td>{{form.deliverOrder.receiveTime}}</td>

          </tr>
        </table>
      </el-form-item>

      <el-form-item labelWidth="130px" label="商品：">
        <table class="tableC">
          <tr class="thColor">
            <th>商品编号</th>
            <th>商品名称</th>
            <th>品牌</th>
            <th>分类</th>
            <th>规格</th>
            <th>数量</th>
            <th>价格（元）</th>
            <th>状态</th>
          </tr>
          <tr class="tbColor" v-for="(item,index) in form.deliverOrder.orderProducts" :key="index">
            <td>{{item.productItem.code}}</td>
            <td>{{item.productItem.productName}}</td>
            <td>{{item.productItem.brandCnName}}</td>
            <td>
                <span v-if="item.productItem.categoryMap != ''">
                   <!--&lt;!&ndash;&ndash;&gt;<span v-for="(item1,index) in item.productItem.categoryMap " :key="index">-->
                  <span
                    v-if="item.productItem.cateGoryMap.categoryName1">{{item.productItem.cateGoryMap.categoryName1}}</span>/
                  <span
                    v-if="item.productItem.cateGoryMap.categoryName2">{{item.productItem.cateGoryMap.categoryName2}}</span>/
                  <span
                    v-if="item.productItem.cateGoryMap.categoryName3">{{item.productItem.cateGoryMap.categoryName3}}</span>
                  <!--<span v-if="item.productItem.cateGoryMap.categoryName4">{{item.productItem.cateGoryMap.categoryName4}}</span>-->

                </span>
            </td>
            <td><span>{{item.productItem.size}}</span><span class="subOrder">{{item.productItem.color}}</span></td>
            <td>{{item.quantity}}</td>
            <td>{{item.price}}</td>
            <td>
              <!--<el-button plain v-if="item.productItem.status === '21'" size="mini" type="warning">已支付拼团中</el-button>-->
              <!--<el-button plain v-else-if="item.productItem.status === '22'" size="mini" type="success">拼团成功待抽奖</el-button>-->
              <!--<el-button plain v-else-if="item.productItem.status === '23'" size="mini" type="danger">未中奖退款中</el-button>-->
              <!--<el-button plain v-else-if="item.productItem.status === '24'" size="mini" type="info">未中奖已退款</el-button>-->
              <!--<el-button plain v-else-if="item.productItem.status === '25'" size="mini" type="danger">拼团失败退款中</el-button>-->
              <!--<el-button plain v-else-if="item.productItem.status === '26'" size="mini" type="info">拼团失败已退款</el-button>-->
              <el-button plain size="mini" disabled="disabled" v-if="item.productItem.status!==null"
                         :type="statusList[item.productItem.status*1].type">{{
                statusList[item.productItem.status*1].name }}
              </el-button>
              <span v-else></span>
            </td>
          </tr>
        </table>
      </el-form-item>
      <el-form-item labelWidth="130px" label="金额：">
        <table class="tableC">
          <tr class="thColor">
            <th>订单总金额（元）</th>
            <th>优惠券</th>
            <th>实付金额（元）</th>
            <th>下单时间</th>
          </tr>
          <tr class="tbColor">
            <td>{{form.price}}</td>
            <td v-if="form.deliverOrder.parValue !== null">优惠券：{{form.deliverOrder.parValue}}元</td>
            <td v-else>--</td>
            <td>{{form.deliverOrder.payAmount}}</td>
            <td>{{form.deliverOrder.createTime}}</td>
          </tr>
        </table>
      </el-form-item>
      <el-form-item>
        <el-button class="backBtn" type="primary" size="small" @click="goBack">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import ElForm from "element-ui/packages/form/src/form";
  import ElFormItem from "element-ui/packages/form/src/form-item";
  import {getOrderDetail} from "@/api/merchant"

  export default {
    components: {
      ElFormItem,
      ElForm
    },
    name: "transitionOrder",
    data() {
      return {
        form: {
          city: '',
          deliverOrder: {
            orderCode: '',
            code: '',
            buyAccountName: '',
            buyRealName: '',
            status: '',
            createTime: '',
            payType: '',
            payTime: '',
            orderProducts: [
              {
                productItem: {
                  code: '',
                  productName: '',
                  brandCnName: '',
                  cateGoryMap: {},
                  size: '',
                  color: '',
                  status: ''
                },
                quantity: '',
                price: '',
              }
            ],
          },

          province: '',
          region: '',
          street: ''
        },

        payList: ['支付宝', '微信支付','微信小程序支付'],
        statusList: [
          // {
          //   name:'',
          //   type:' '
          // },
          {
            name: '未支付',
            type: 'warning'
          },
          {
            name: '已支付',
            type: 'success'
          },
          {
            name: '已发货',
            type: 'primary'
          },
          {
            name: '确认收货',
            type: 'success'
          },
          {
            name: '退款中',
            type: 'warning'
          },
          {
            name: '已退款',
            type: 'danger'
          },
          {
            name: '已取消',
            type: 'info'
          },
          {
            name: '退款已拒绝',
            type: 'warning'
          },
          {
            name: '',
            type: ' '
          },
          {
            name: '已删除',
            type: 'info'
          },

        ],
        loading: true,
      }
    },
    mounted() {
      this.getDetail();
    },
    methods: {
      getDetail() {
        let order = this.$route.params.id;
        getOrderDetail(order).then(res => {
          this.loading = false;
          if( res.data.status === '000000000'){
            this.form = res.data.data;

          }
        })
      },
      goBack() {
        window.history.go(-1);
      }
    }
  }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .el-form {
    margin: 0.5rem auto;
    width: 85%;
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
