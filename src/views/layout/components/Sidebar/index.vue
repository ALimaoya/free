<template>
  <scroll-bar>
    <el-menu mode="vertical" unique-opened :default-active="$route.path" :collapse="isCollapse" background-color="#2d3a4b" text-color="#fff" active-text-color="#409EFF">
      <sidebar-item :routes="routes"></sidebar-item>
    </el-menu>
  </scroll-bar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import ScrollBar from '@/components/ScrollBar'

export default {
  components: { SidebarItem, ScrollBar },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    routes(){
        if(this.$route.path.indexOf('merchantCenter') !== -1){
          return this.$router.options.routes[1].children;

        }

      if(this.$route.path.indexOf('freeManage') !== -1){
          return this.$router.options.routes[0].children;

        }

    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },

}
</script>

