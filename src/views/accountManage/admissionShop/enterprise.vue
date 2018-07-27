<template>
    <div class="enterprise admission">
      <ul class="admissionStep">
        <li class="isActive"><span>1</span><span>身份信息</span></li>
        <li class="icon" :class="{isActive:show !== '1' }">＞＞＞＞＞＞＞＞＞</li>
        <li :class="{isActive:show !== '1' }"><span>2</span><span>店铺信息</span></li>
        <li class="icon" :class="{isActive:show === '3' }">＞＞＞＞＞＞＞＞＞</li>
        <li :class="{isActive:show === '3' }"><span>3</span><span>入驻成功</span></li>
      </ul>
      <div class="wrap" >
        <component  :is="tabView" @stepObj="getStep" :last-step = status></component>
      </div>
    </div>
</template>

<script>
  import Enterprise1 from "@/views/accountManage/admissionShop/enterprise1"
  import Enterprise2 from "@/views/accountManage/admissionShop/enterprise2"
  import SuccessAdd from "@/views/accountManage/admissionShop/successAdd"

  export default {
      name: "enterprise",
      components: {

        Enterprise1,
        Enterprise2,
        SuccessAdd

      },
        data() {
            return {
              isActive : false,
              tabView : 'enterprise1',
              show: '1',
              stepObj: '',
              status:''
            }
        },
        mounted() {
        },
        methods: {
          getStep(res){
            this.show = res.index ;
            // this.store.dispatch('GetUserInfo',this.user);
            this.tabView = res.component ;
            this.status = res.status;
          },
        }
    }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import '../../../styles/step';

</style>
