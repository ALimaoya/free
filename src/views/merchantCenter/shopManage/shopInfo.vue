<template>
  <div class="shopInfo">
    <ul class="menuBar">
      <li v-for="(item,index) in menu" :key="index" :class="{isActive:show == index }" @click="changeTab(index)">{{ item }}</li>
    </ul>
    <component  :is="tabView "></component>
  </div>
</template>

<script>
  import {  getUser,getToken } from '@/utils/auth'
  import Tab1 from "@/views/merchantCenter/shopManage/tab1"
  import Tab2 from "@/views/merchantCenter/shopManage/tab2"
  import Tab3 from "@/views/merchantCenter/shopManage/tab3"
  import Tab4 from "@/views/merchantCenter/shopManage/tab4"

  export default {
        name: "shop-info",
      components:{
        Tab1,
        Tab2,
        Tab3,
        Tab4
      },
      data(){
          return{
            menu :['基本信息（个人）','资质信息（个人）','基本信息（企业）','资质信息（企业）'],
            isActive : false,
            tabView : 'tab1',
            show : '',

          }
      },
      mounted(){

      },
      methods : {
        changeTab(index){
          this.show = index ;
          // this.store.dispatch('GetUserInfo',this.user);
          this.tabView = 'tab'+ (index+1)*1 ;
        }
      }
    }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .shopInfo{
    .menuBar{
      width : 90% ;
      margin : 0.5rem auto ;
      display: flex;
      flex-direction: row;
      border-bottom : 1px solid #aaa ;
      li{
        width : 10% ;
        height : 0.5rem ;
        color : #aaa ;
        font-weight : bold ;
        text-align: center;
        line-height : 0.5rem ;
      }
    }
  }
  .isActive{
    color : #333!important ;
    border-bottom : 2px solid #ff0011;
  }

</style>
