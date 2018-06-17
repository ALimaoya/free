<template>
  <div class="bond">
    <h1>保证金详情</h1>
    <el-form :model="form" ref="form"  label-position="right" >
      <h2>您当前已经缴纳保证金{{ form.bond }}元整</h2>
      <el-form-item  labelWidth="130px" label="姓名：" >
        <div class="inputInfo">{{ form.name }}</div>
      </el-form-item>
      <el-form-item  labelWidth="130px" label="身份证号：" >
        <div class="inputInfo">{{ form.id }}</div>
      </el-form-item>
      <el-form-item  labelWidth="130px" label="缴纳额度：" >
        <div class="inputInfo">{{ form.payment }}元</div>
      </el-form-item>
      <el-form-item  labelWidth="130px" label="当前额度：" >
        <div class="inputInfo tipWrap">
            <span>{{ form.current }}元</span>
            <span class="tips">保证金少于8000元时，所有商品下架，不可售卖</span>
            <el-button type="primary" size="mini" @click="dialogVisible= true;">申请解冻（{{form.bond}}元）</el-button>
        </div>
      </el-form-item>
      <el-form-item  labelWidth="130px" label="缴纳时间：" >
        <div class="inputInfo">{{ form.time }}</div>
      </el-form-item>
      <el-form-item  labelWidth="130px" label="缴纳方式：" >
        <div class="inputInfo">{{ form.payWay }}</div>
      </el-form-item>
    </el-form>
    <el-dialog title="申请解冻保证金" :visible.sync="dialogVisible" width="60%" >
      <div class="dialog_content">
        <h3>确定进行保证金解冻操作？</h3>
        <p>保证金解冻以后，所有商品自动下架，不可售卖。</p>
        <p>只有缴纳保证金以后才可重新上架，解冻操作审核通过以后，金额会转到您的支付宝账户中。</p>
      </div>
      <div slot="footer" class="dialog-footer" >
        <el-button type="primary" size="mini" @click="confirmApply">确定</el-button>
        <el-button plain size="mini" @click="dialogVisible= false;">取消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
    export default {
      name: "bond",
      data(){
          return{
            form : {
              bond : '10000',
              name : '年青人',
              id : '',
              payment : '',
              current: '',
              time: '',
              payWay: ''
            },
            // formRule : {
            //
            // },
            dialogVisible : false ,
          }
      },
      monted(){
        this.getForm();
      },
      methods : {
        //  获取保证金详情
        getForm(){

        },
          //确定申请保证金解冻操作
          confirmApply(){

        }
      }
    }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  h1{
    margin : 0 ;
    padding : 0.2rem  0.4rem ;
    border-bottom : 1px solid #666 ;
    font-size : 0.22rem ;
    line-height : 0.4rem ;
  }
  .el-form{
    margin : 0.5rem auto;
    width : 80% ;
    color: #666 ;
    h2{
      font-size : 22px ;
      text-align : center ;
    }
    .el-form-item{
      width : 60% ;
      margin :0.2rem  auto;
      .tipWrap{
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        justify-content: flex-start;
        span{
          margin-bottom : 0.2rem ;
          display: inline-block;
        }
        .tips{
          height : 0.4rem ;
          padding : 0 0.2rem ;
          color : #fff ;
          text-align : center ;
          line-height : 0.4rem ;
          background : #ff0011 ;
          font-size : 0.14rem ;
          border-radius : 0.05rem ;
        }
        .el-button{
          width : 160px ;
        }

      }
    }
  }
  .dialog_content{
    h3{
      height : 0.7rem ;

    }
    p{
      font-size : 0.14rem ;
      height : 0.4rem ;
      line-height : 0.4rem ;
    }
  }
</style>
