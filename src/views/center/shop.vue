<template>
  <div class="shopContent">
    <div class="new">
      <p>店铺管理<button @click="toNew">绑定新店铺</button></p>
    </div>

    <el-table class="list" :data="tableData" stripe border style="width: 100%">
        <el-table-column prop="shop" label="店铺" width="180"></el-table-column>
        <el-table-column prop="type" label="平台类型" width="180"></el-table-column>
        <el-table-column prop="ID" label="旺旺ID/咚咚ID"></el-table-column>
        <el-table-column prop="status" label="状态">
          <!--<template slot-scope="scope">-->
            <!--<el-button size="mini" @click="tips(scope.$index)" class="tips"></el-button>-->
          <!--</template>-->
          <!--<div class="pop">-->
            <!--<p><img src="../../assets/imgs/close.png" alt="" /></p>-->
            <!--<h2>说明</h2>-->
            <!--<span>绑定的第一个店铺加入会员后不收费，状态变化为（审核中>>>>&#45;&#45;审核通过），第二个店铺起，中间增加支付（审核中>>>>&#45;&#45;待支付>>>>&#45;&#45;审核通过）</span>-->
          <!--</div>-->
        </el-table-column>
        <el-table-column prop="action" label="操作">
          <template slot-scope="scope" >
            <div v-if="scope.row.action==='1'">
              <el-button size="mini" @click="reason(scope.$index)" class="tips" style="width : 0.6rem ;padding : 0.07rem;">查看原因</el-button>
              <el-button size="mini" @click="change(scope.$index)" class="tips" style="width: 0.6rem ;">修改</el-button>
            </div>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="绑定时间"></el-table-column>
      </el-table>
    <el-dialog title="详情" :visible.sync="reasonBox" class="detail" top="22%">
      <span>招商审核备注</span>
      <el-input type="textarea" :rows="3" v-model="reasonInfo"></el-input>
      <el-button class="close" type="info" size="small" @click="reasonBox=false ;" >关闭</el-button>
    </el-dialog>
  </div>
</template>

<script>

  export default {
        name: "Shop",

        data(){
          return{
            tableData : [
              {
                shop : '淘宝',
                type : '淘宝',
                ID : '旺旺',
                status : '需更新资料',
                action : '1' ,
                date : '1232-32-22'
              },
              {
                shop : '淘宝',
                type : '淘宝',
                ID : '旺旺',
                status : '需更新资料',
                action : '2' ,
                date : '1232-32-22'
              }
            ],
            reasonBox : false ,
            reasonInfo : ''
          }
        },
        methods : {
          toNew(){
            this.$router.push('/newshop')
          },
          reason(index){
            console.log(index);
            this.reasonBox = true ;
            this.reasonInfo = 'blnanlab';
          }
        }
    }
</script>

<style rel="stylesheet/scss" scoped lang="scss">
  .shopContent{

    .new{
      width : 100% ;
      height : 0.8rem ;
      border : 1px solid #aaa ;
      border-radius : 0.05rem ;
      p{
        font-size : 0.22rem ;
        font-weight : bold ;
        line-height : 0.8rem ;
        text-indent : 1.2rem ;
        button{
          width : 1rem ;
          height : 0.34rem ;
          border-radius: 0.05rem ;
          background : rgba(22, 155, 213, 1) ;
          color : #fff ;
          font-size : 0.14rem ;
          text-align: center;
          line-height : 0.34rem ;
          border : 0;
          float : right ;
          margin : 0.23rem 0.8rem ;

        }
      }
    }
    .list{
      border : 1px solid #aaa ;
      margin-top : 0.4rem ;
      border-radius : 0.05rem ;

    }
    .detail{
      /*.el-dialog__header{*/
        /*background : #d3d3d3 ;*/
      /*}*/
        span{
          color : #ff0000 ;
          margin-bottom : 0.15rem ;
          display : inline-block;
        }

      .close{
        margin-top : 0.2rem ;
      }
    }
  }
</style>
