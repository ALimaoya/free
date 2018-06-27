<template>
  <div class="refundOrder">
    <h1 class="h_title">退款详情</h1>
    <el-form  :model="form" ref="form"  label-position="right">
      <el-form-item   labelWidth="130px"  label="退款单号：" >
        <table class="tableC">
          <tr class="thColor">
            <th>退款单号</th><th>订单号</th><th>子订单号</th>
          </tr>
          <tr class="tbColor"><td></td><td></td><td></td></tr>
        </table>
      </el-form-item>
      <el-form-item   labelWidth="130px"  label="退款信息：" >
        <table class="tableC">
          <tr class="thColor">
            <th>金额</th><th>退款时间</th><th>退款状态</th>
          </tr>
          <tr class="tbColor"><td></td><td></td>
            <td>
              <el-button size="mini" disabled="disabled">{{ status[form.status].name }}</el-button>
            </td>
          </tr>
        </table>
      </el-form-item>
      <el-form-item   labelWidth="130px"  label="买方：">
        <table class="tableC">
          <tr class="thColor">
            <th>账号</th><th>名称</th>
          </tr>
          <tr class="tbColor"><td></td><td></td></tr>
        </table>
      </el-form-item>
      <el-form-item   labelWidth="130px"  label="商品：" >
        <table class="tableC">
          <tr class="thColor">
            <th>商品编号</th><th>商品名称</th><th>品牌</th><th>分类</th><th>规格</th><th>数量</th><th>价格</th>
          </tr>
          <tr class="tbColor"><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
        </table>
      </el-form-item>
      <el-form-item   labelWidth="130px"  label="货物状态：">
        <div>{{ form.status}}</div>
      </el-form-item>
      <el-form-item labelWidth="130px"  label="退款原因：">
        <div>{{ form.reason}}</div>
      </el-form-item>
      <el-form-item   labelWidth="130px"  label="退款说明：">
        <div>{{ form.description}}</div>
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
  import { refuseOrder } from "@/api/merchant"
  export default {
    components: {
      ElFormItem,
      ElForm},
    name: "refundOrder",
    data() {
      return {
        form : {

          status : '1'
        },
        status:[
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
            name : '退款已拒绝',
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
        refuseOrder(order).then( res => {
          if(res.data.message === '000000000'){
            this.form = res.data.data ;
          }else{
            this.$message({
              message : res.data.message ,
              center : true ,
              type : 'error'
            })
          }
        }).catch(err => {

        });
        // this.form =
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
