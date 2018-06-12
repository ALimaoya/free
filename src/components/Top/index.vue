<template>
  <div class="top">
    <img src="../../assets/imgs/logo.png"  alt="" />
    <h1>商家中心</h1>
    <el-dropdown class="avatar-container" trigger="click">
      <div class="avatar-wrapper">
        您好！{{  userInfo }}
        <!--<img  class="user-avatar" src="../../assets/imgs/logo.png">-->
        <i class="el-icon-caret-bottom"></i>
      </div>
      <el-dropdown-menu class="user-dropdown" slot="dropdown">
        <router-link class="inlineBlock" to="/">
          <el-dropdown-item>
            首页
          </el-dropdown-item>
        </router-link>
        <el-dropdown-item divided>
          <span @click="logout" style="display:block;">退出登录</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { getMobile } from '@/utils/auth'

  export default {
      name: "top" ,
      data(){
        return {
           userInfo : getMobile()
        }
      },
      computed: {
        ...mapGetters([
          'avatar',

        ])
      },
    // mounted(){
    //   this.userInfo = this.$store.state.user.userInfo.name ;
    //
    // },
      methods : {
        logout() {
          this.$store.dispatch('LogOut').then(() => {
            location.reload()
          })
          //   .catch( err => {
          //   console.log(err) ;
          // })
        }
      }
    }
</script>

<style lang="scss" scoped rel="stylesheet/scss" >
  .top{
    width : 100% ;
    box-sizing: border-box;
    margin : 0 auto ;
    /*padding : 0.1rem 0;*/
    font-size : 0.15rem ;
    height : 60px ;
    position : fixed ;
    top : 0;
    z-index : 2000 ;
    background : #fff ;
    /*border-radius : 0.05rem ;*/
    border-bottom : 1px solid #d8dce5 ;
    img,h1{
      float : left;
    }
    img{
      width : 30px ;
      height : 30px ;
      margin : 15px ;
    }
    h1{
      line-height : 60px ;
      font-size : 22px ;
    }

    .avatar-container {
      height: 50px;
      line-height : 50px;
      display: inline-block;
      position: absolute;
      right: 30px;
      top : 0 ;
      z-index : 10000 ;
      .avatar-wrapper {
        cursor: pointer;
        /*margin-top: 0.05rem;*/
        position: relative;
        line-height : 60px ;
        /*.user-avatar {*/
          /*width: 0.40rem;*/
          /*height: 0.40rem;*/
          /*border-radius: 0.10rem;*/
          /*margin : 0 ;*/
        /*}*/
        .el-icon-caret-bottom {
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }

      }

    }

  }

</style>

