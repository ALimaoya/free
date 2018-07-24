<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <span class="home">{{ title }}</span>
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item,index)  in levelList" :key="item.path" v-if="item.meta.title">
        <span class="no-redirect">{{item.meta.title}}</span>
        <!--<router-link v-else="item.redirect!=='noredirect'||index!==0" :to="item.redirect||item.path">{{item.meta.title}}</router-link>-->
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>

export default {
  created() {
    this.getBreadcrumb()
  },
  data() {
    return {
      levelList: null ,
    }
  },
  watch: {
    $route() {
      this.getBreadcrumb()
    }
  },
  mounted(){
    this.getTitle();
  },
  computed:{
    title: function(){
      if(this.$route.path.indexOf('merchantCenter') !== -1){

          return  '特卖商城'
      }

      if(this.$route.path.indexOf('freeManage') !== -1){

        return '试用中心'
      }
    }
  },
  methods: {
    getBreadcrumb() {
      let matched = this.$route.matched.filter(item => item.name)

      this.levelList = matched
    },
    getTitle(){

    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .app-breadcrumb.el-breadcrumb {
    .home{
      float : left ;
      margin-right: 20px;

    }
    display: inline-block;
    font-size: 14px;
    line-height: 50px;
    margin-left: 10px;
    float : left;
    .no-redirect {
      color: #97a8be;
      cursor: text;
    }
  }
</style>
