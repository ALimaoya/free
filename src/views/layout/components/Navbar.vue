<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
    <breadcrumb></breadcrumb>
    <el-dropdown class="avatar-container" trigger="click">
      <div class="avatar-wrapper">
        <img  class="user-avatar" src="../../../assets/imgs/logo.png">
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
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
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

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 0.50rem;
  line-height: 0.50rem;
  border-radius: 0rem !important;
  .hamburger-container {
    line-height: 0.02rem;
    height: 0.50rem;
    float: left;
    padding: 0 0.10rem;
  }
  .screenfull {
    position: absolute;
    right: 0.90rem;
    top: 0.16rem;
    color: red;
  }
  .avatar-container {
    height: 0.50rem;
    display: inline-block;
    position: absolute;
    right: 0.35rem;
    .avatar-wrapper {
      cursor: pointer;
      margin-top: 0.05rem;
      position: relative;
      .user-avatar {
        width: 0.40rem;
        height: 0.40rem;
        border-radius: 0.10rem;
      }
      .el-icon-caret-bottom {
        position: absolute;
        right: -0.20rem;
        top: 0.25rem;
        font-size: 0.12rem;
      }

    }
  }
}
</style>

