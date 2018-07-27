<template>
  <div class="failAdd">
    <div class="boxWrap">
      <div class="success_icon"></div>
      <div class="box_content">
        <p class="box_title">店铺信息被拒绝</p>
        <div class="tips_warn">{{ shopName }}</div>
        <div class="box_note">
          <p class="refuseNote">拒绝原因</p>
          <p class="refuseDetail">{{ refusedReason}}</p>
        </div>
        <div class="box_footer">
          <el-button type="danger" @click="goHomeEditor">前往修改</el-button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import { getBasicInfo } from "@/api/userCenter"

  export default {
    name: "failAdd",
    data() {
      return {
        shopName: '',
        status : ''
      }
    },
    mounted() {

    },
    methods: {

      getUserInfo() {
        getBasicInfo().then( res => {
          if(res.data.status === '000000000'){
            let type = res.data.data.belongType ;
            this.goHomeEditor(type)
          }
        })
      },
      goHomeEditor(type) {
        if(type === '1'){
          this.$router.push('/accountManage/admission/admissionShop/personal')

        }else if( type === '2'){
          this.$router.push('/accountManage/admission/admissionShop/enterprise')

        }
      }
    }
  }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .failAdd {
    width: 60%;
    margin: 0.7rem auto;
    .boxWrap {
      width: 60%;
      height: 40%;
      margin: 1.5rem auto;
      background: #fff;
      position: relative;
      padding: 1rem 0.4rem;
      border : 1px solid #dcdfe6;
      box-shadow: 0 0.1rem 0.2rem #dcdfe6;
      .success_icon {
        width: 1.3rem;
        height: 1.3rem;
        background: url('../../../assets/imgs/wrong.png') no-repeat center #fff;
        background-size: 70%;
        position: absolute;
        left: 0;
        right: 0;
        top: -0.65rem;
        margin: auto;
        border-radius: 50%;
        border-top : 1px solid #dcdfe6;
        box-shadow: 0 0.1rem   0.2rem  #dcdfe6;

      }
      .box_content {
        margin: auto;
        width: 80%;
        p {
          text-align: center;
          font-size: 0.24rem;
          line-height: 0.8rem;

        }
        .box_title {
          font-size: 0.3rem !important;
          font-weight: bold;
          line-height: 0.8rem;
          color: #333;
        }
        .box_note{
          color: #999;

          .refuseNote{
            font-size : 0.26rem ;
          }
        }
        .box_footer {
          width: 60%;
          margin: 0.3rem auto;
          text-align: center;
          /*.el-button {*/
            /*margin: 0.3rem ;*/
          /*}*/
          /*.box_close{*/
          /**/
          /*}*/
        }
      }
    }

  }
</style>
