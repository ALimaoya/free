<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
    <breadcrumb></breadcrumb>
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
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },

  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 0.50rem;
  line-height: 0.50rem;
  border-radius: 0 !important;
  position: fixed ;
  top : 0.6rem;
  width : 100% ;
  background : #fff ;
  z-index : 1500 ;

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

}
</style>

