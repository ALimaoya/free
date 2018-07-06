<template>
  <div class="top">
    <img src="../../assets/imgs/logo.png"  alt="" />
    <h1>丫贝商家管理后台</h1>
    <ul class="menu">
      <li v-for="(item,index) in menuList" :key="index" @click="closeAllTags()">
        <router-link :to="item.path">{{ item.name }}</router-link>
      </li>
      <!--<li>hello</li>-->
      <!--<li>-->
        <!--<router-link to="/a">点这里</router-link>-->
      <!--</li>-->
      <!--<li>-->
        <!--<router-link to="/freeManage/index">去试用</router-link>-->
      <!--</li>-->
    </ul>

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
           userInfo : getMobile(),
          menuList : [
            {
              name : '首页',
              path : '/home'
            },
            {
              name : '试用中心',
              path : '/freeManage'
            },
            {
              name : '特卖商城',
              path : '/merchantCenter'
            },
            // {
            //   name : '规则中心',
            //   path : '/ruleCenter'
            // },
            {
              name : '账号管理',
              path : '/accountManage'
            }
          ]
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
            this.$router.push('/login')
          });

        },
        closeAllTags() {
          this.$store.dispatch('delAllViews')
          // this.$router.push('/')
        },
      }
    }
</script>

<style lang="scss" scoped rel="stylesheet/scss" >
  @import '../../styles/variables.scss';
  .top{
    width : 100% ;
    box-sizing: border-box;
    margin : 0 auto ;
    /*padding : 0.1rem 0;*/
    font-size : 0.15rem ;
    height : 60px ;
    position : fixed ;
    top : 0;
    z-index : 20000 ;
    background : $bg ;
    /*border-bottom : 1px solid #d8dce5 ;*/
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
      color : #fff ;
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
        color : #fff ;
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
    .menu{
      display : flex ;
      flex-direction: row;
      width: 50%;
      height : 100% ;
      align-items: center;
    }
    .menu li{
      flex : 1;
      text-align: center;
      color : #aaa ;
      a{
        font-size : 0.18rem ;

      }
    }

    .router-link-active{
      color : #fff ;
    }
  }

</style>

