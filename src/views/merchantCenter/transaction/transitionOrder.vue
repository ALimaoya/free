<template>
    <div class="transitionOrder">
      <h1 class="h_title">交易详情</h1>
      <el-form  :model="form" ref="form"  label-position="right">
        <el-form-item   labelWidth="130px"  label="单号：" >
          <table class="tableC">
            <tr class="thColor">
              <th>订单号</th><th>子订单号</th>
            </tr>
            <tr class="tbColor"><td></td><td></td></tr>
          </table>
        </el-form-item>
        <el-form-item   labelWidth="130px"  label="买方：" >
          <table class="tableC">
            <tr class="thColor">
              <th>账号</th><th>名称</th>
            </tr>
            <tr class="tbColor"><td></td><td></td></tr>
          </table>
        </el-form-item>
        <el-form-item   labelWidth="130px"  label="状态：">
          <table class="tableC">
            <tr class="thColor">
              <th>订单状态</th><th>下单时间</th><th>支付方式</th><th>支付时间</th>
            </tr>
            <tr class="tbColor"><td>
              <el-button size="mini" disabled="disabled">{{ status[form.status].name }}</el-button>
            </td><td></td><td></td><td></td></tr>
          </table>
        </el-form-item>
        <el-form-item   labelWidth="130px"  label="商品：" >
          <table class="tableC">
            <tr class="thColor">
              <th>商品编号</th><th>商品名称</th><th>品牌</th><th>分类</th><th>规格</th><th>数量</th><th>价格</th><th>状态</th>
            </tr>
            <tr class="tbColor"><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
              <td>
                <el-button size="mini" disabled="disabled">{{ status[form.status].name }}</el-button>

              </td>
            </tr>
          </table>
        </el-form-item>
        <el-form-item   labelWidth="130px"  label="金额：">
          <table class="tableC">
            <tr class="thColor">
              <th>订单金额</th><th>下单时间</th>
            </tr>
            <tr class="tbColor"><td>111</td><td>郭德纲的风格</td></tr>
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
        ElForm},
      name: "transitionOrder",
        data() {
            return {
              form : {
                status : '1'
              },
              status:[

                {
                  name : '未支付',
                },
                {
                  name : '已支付',
                },
                {
                  name : '已发货',
                },
                {
                  name : '确认收货',
                },
                {
                  name : '退款中',
                },
                {
                  name : '已退款',
                },
                {
                  name : '已取消',
                },
                {
                  name : '退款拒绝',
                }
              ],

            }
        },
        mounted() {
        this.getDetail();
        },
        methods: {
          getDetail(){
            let order = this.$route.params.id ;
            getOrderDetail(order).then( res => {
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
