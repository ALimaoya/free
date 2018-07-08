<template>
    <div class="personal admission">
        <ul class="admissionStep">
          <li class="isActive"><span>1</span><span>身份信息</span></li>
          <li class="icon" :class="{isActive:show !== '1' }">＞＞＞＞＞＞＞＞＞</li>
          <li :class="{isActive:show !== '1' }"><span>2</span><span>店铺信息</span></li>
          <li class="icon" :class="{isActive:show === '3' }">＞＞＞＞＞＞＞＞＞</li>
          <li :class="{isActive:show === '3' }"><span>3</span><span>入驻成功</span></li>
        </ul>
      <div class="wrap" >

        <component  :is="tabView" @stepObj="getStep"></component>

      </div>
    </div>
</template>

<script>
  import {  getUser,getToken } from '@/utils/auth'
  import Personal1 from "@/views/merchantCenter/userCenter/admissionShop/personal1"
  import Personal2 from "@/views/merchantCenter/userCenter/admissionShop/personal2"
  import SuccessAdd from "@/views/merchantCenter/userCenter/admissionShop/successAdd"


  export default {
      name: "personal",
      components: {
        Personal1,
        Personal2,
        SuccessAdd
      },
        data() {
            return {
              show: '1',
              isActive : false,
              tabView : 'Personal1',
              stepObj: '',
            }
        },
        mounted() {

        },
        methods: {
          getStep(res){
            this.show = res.index ;
            // this.store.dispatch('GetUserInfo',this.user);
            this.tabView = res.component ;
          },
        }
    }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import '../../../../styles/step';

</style>
