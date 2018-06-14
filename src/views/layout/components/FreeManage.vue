<template>
    <div class="freeManage" :class="{hideSidebar:!sidebar.opened}">
      <sidebar class="sidebar-container"></sidebar>
      <div class="sub-container">
        <navbar></navbar>
        <tags-view></tags-view>
        <app-main></app-main>
      </div>
    </div>
</template>

<script>
  import { Navbar, Sidebar, AppMain , TagsView  } from '@/views/layout/components';

  export default {
    name: "free-manage",
    components: {
      Navbar,
      Sidebar,
      AppMain ,
      TagsView ,
    },
    computed: {
      sidebar() {
        return this.$store.state.app.sidebar
      }
    },

    }
</script>

<!--<style scoped lang="scss" rel="stylesheet/scss">-->
  <!--@import "src/styles/mixin.scss";-->
  <!--@include clearfix;-->
<!--</style>-->
