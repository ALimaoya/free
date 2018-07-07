<template>
    <div class="transitionOrder"  v-loading="loading"  element-loading-text="拼命加载中">
      <h1 class="h_title">交易详情</h1>
      <el-form  :model="form" ref="form"  label-position="right">
        <el-form-item   labelWidth="130px"  label="单号：" >
          <table class="tableC">
            <tr class="thColor">
              <th>订单号</th><th>子订单号</th>
            </tr>
            <tr class="tbColor">
              <td>{{form.deliverOrder.orderCode}}</td><td>{{form.deliverOrder.code}}</td></tr>
          </table>
        </el-form-item>
        <el-form-item   labelWidth="130px"  label="买方：" >
          <table class="tableC">
            <tr class="thColor">
              <th>账号</th><th>名称</th>
            </tr>
            <tr class="tbColor">
              <td>{{form.deliverOrder.buyAccountName}}</td><td>{{form.deliverOrder.buyRealName}}</td>
            </tr>
          </table>
        </el-form-item>
        <el-form-item   labelWidth="130px"  label="状态：">
          <table class="tableC">
            <tr class="thColor">
              <th>订单状态</th><th>下单时间</th><th>支付方式</th><th>支付时间</th>
            </tr>
            <tr class="tbColor">
              <td><el-button plain size="mini" disabled="disabled" v-if="form.deliverOrder.status!==null" :type="statusList[form.deliverOrder.status*1].type">{{ statusList[form.deliverOrder.status*1].name }}</el-button></td>
              <td>{{form.deliverOrder.createTime}}</td>
              <td>支付宝</td>
              <td v-if="form.deliverOrder.payTime!==null">{{form.deliverOrder.payTime}}</td>
              <td v-else></td>
              </tr>
          </table>
        </el-form-item>
        <el-form-item   labelWidth="130px"  label="商品：" >
          <table class="tableC">
            <tr class="thColor">
              <th>商品编号</th><th>商品名称</th><th>品牌</th><th>分类</th><th>规格</th><th>数量</th><th>价格（元）</th><th>状态</th>
            </tr>
            <tr class="tbColor" v-for="(item,index) in form.deliverOrder.orderProducts" :key="index">
              <td>{{item.productItem.code}}</td>
              <td>{{item.productItem.productName}}</td>
              <td>{{item.productItem.brandCnName}}</td>
              <td>
                <span v-if="item.productItem.categoryMap != ''">
                   <!--&lt;!&ndash;&ndash;&gt;<span v-for="(item1,index) in item.productItem.categoryMap " :key="index">-->
                  <span v-if="item.productItem.cateGoryMap.categoryName1">{{item.productItem.cateGoryMap.categoryName1}}</span>/
                  <span v-if="item.productItem.cateGoryMap.categoryName2">{{item.productItem.cateGoryMap.categoryName2}}</span>/
                  <span v-if="item.productItem.cateGoryMap.categoryName3">{{item.productItem.cateGoryMap.categoryName3}}</span>
                  <!--<span v-if="item.productItem.cateGoryMap.categoryName4">{{item.productItem.cateGoryMap.categoryName4}}</span>-->

                </span>
              </td>
              <td><span>{{item.productItem.size}}</span><span class="subOrder">{{item.productItem.color}}</span></td>
              <td>{{item.quantity}}</td>
              <td>{{item.price}}</td>
              <td>
                <el-button plain size="mini" disabled="disabled"  v-if="item.productItem.status!==null" :type="statusList[item.productItem.status*1].type">{{ statusList[item.productItem.status*1].name }}</el-button>
                <span v-else></span>
              </td>
            </tr>
          </table>
        </el-form-item>
        <el-form-item   labelWidth="130px"  label="金额：">
          <table class="tableC">
            <tr class="thColor">
              <th>订单金额（元）</th><th>下单时间</th>
            </tr>
            <tr class="tbColor"><td>{{form.price}}</td><td>{{form.deliverOrder.createTime}}</td></tr>
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
    import { getOrderDetail } from "@/api/merchant"
    export default {
      components: {
        ElFormItem,
        ElForm
        },
      name: "transitionOrder",
        data() {
            return {
              form : {
                city:'',
                deliverOrder:{
                  orderCode:'',
                  code:'',
                  buyAccountName:'',
                  buyRealName:'',
                  status:'',
                  createTime:'',
                  payType:'',
                  payTime:'',
                  orderProducts:[
                    {
                      productItem:{
                        code:'',
                        productName:'',
                        brandCnName:'',
                        cateGoryMap:{},
                        size:'',
                        color:'',
                        status:''
                      },
                      quantity:'',
                      price:'',
                    }
                  ],
                },

                province:'',
                region:'',
                street:''
              },

            payList:[
              {
                  name : '支付宝',
                },
                {
                  name : '微信支付',
                },
            ],
              statusList:[
                {
                  name:'',
                  type: ''
                },
              {
                name:'已支付',
                type: 'primary'
              },
              {
                name:'已发货',
                type: 'info'
              },
              {
                name:'确认收货',
                type: 'success'
              },
              {
                name:'退款中',
                type: 'warning'
              },
              {
                name:'已退款',
                type: 'danger'
              },
              {
                name:'已取消',
                type: 'info'
              },
              {
                name:'退款已拒绝',
                type: 'warning'
              },
              {
                name:'已删除',
                type: 'info'
              },
              {
                name:'未支付',
                type:' '
              },
            ],
              loading: true,
            }
        },
        mounted() {
        this.getDetail();
        },
        methods: {
          getDetail(){
            let order = this.$route.params.id ;
            getOrderDetail(order).then( res => {
              this.loading= false;
              if( res.data.status === '000000000'){
                this.form = res.data.data ;
              }else{
                this.$message({
                  message: res.data.message ,
                  center : true ,
                  type: 'error'
                })
              }
            }).catch( err => {
              alert('服务器开小差啦，请稍等~')
            })
          },
          goBack(){
            window.history.go(-1);
          }
        }
    }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .el-form{
    margin :0.5rem auto ;
    width : 70% ;
    .el-form-item{
      .backBtn{
        margin-left : 1.8rem  ;
      }
      .tableC{
        width : 100% ;
        th{
          font-weight : 100 ;
        }
        td{
          color : #666 ;
          text-align: center;
        }
      }
    }
  }
</style>
