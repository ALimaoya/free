<template>
  <div class="shopInfo">
    <ul class="menuBar">
      <li v-for="(item,index) in menu" :key="index" :class="{isActive:show == index }" @click="changeTab(index)">{{ item }}</li>
    </ul>
    <component  :is="tabView "></component>
  </div>
</template>

<script>
  import { getAptitudeInfo } from "@/api/userCenter"
  import {  getUser,getToken } from '@/utils/auth'
  import Tab1 from "@/views/merchantCenter/userCenter/shopManage/tab1"
  import Tab2 from "@/views/merchantCenter/userCenter/shopManage/tab2"
  import Tab3 from "@/views/merchantCenter/userCenter/shopManage/tab3"
  import Tab4 from "@/views/merchantCenter/userCenter/shopManage/tab4"

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
            // form:'',
            menu :['基本信息','资质信息'],
            isActive : false,
            tabView : 'tab1',
            show : '0',
            userType: '',
          }
      },
      mounted(){
        this.getInfo();
        // this.userType = '1';
        this.changeTab(0);
      },
      methods : {
        getInfo(){
            getAptitudeInfo().then( res => {
              if(res.data.status === '000000000'){
                this.userType = res.data.data.belongType;
                if(this.userType==='1'){
                  this.tabView = 'tab'+ 1 ;
                }else if(this.userType==='2'){
                  this.tabView = 'tab'+ 3 ;
                }
              }
            })
          },

        changeTab(index){
          this.show = index ;
          // this.store.dispatch('GetUserInfo',this.user);
          if(this.userType==='1'){
            this.tabView = 'tab'+ (index+1)*1 ;

          }else if(this.userType==='2'){
            this.tabView = 'tab'+ (index+3)*1 ;

          }
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
        width : 15% ;
        height : 0.5rem ;
        color : #aaa ;
        font-weight : bold ;
        text-align: center;
        line-height : 0.5rem ;
        cursor: pointer;
      }
    }
  }
  .isActive{
    color : #333!important ;
    border-bottom : 2px solid #ff0011;
  }

</style>
