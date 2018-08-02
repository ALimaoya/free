<template>
    <div class="sign-content">
        <h1 class="h_title">商品报名</h1>
        <div class="main">
            <h3>已选择报名分享购商品</h3>
            <el-button @click="dialogVisible = true">选择商品</el-button>
            <el-form ref="form" :model="form" label-width="80px">
                
            </el-form>
        </div>
        <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="30%"
            :before-close="handleClose">
            <span>这是一段信息</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
    export default {
        name: "sign-content",
        data() {
            return {
                 dialogVisible: false,
                form:{

                }
            }
        },
        mounted() {
        },
        methods: {}
    }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
.sign-content{
  padding : 0.2rem ;
  width : 100% ;
  box-sizing: border-box;
  .main{
      margin-top: 0.4rem;
      border: 1px solid #ccc;
      width: 100%;
      padding: 0px 0.8rem;
      box-sizing: border-box;
      h3{
          font-size: 0.18rem;
          line-height: 0.6rem;
      }
  }
}
</style>
