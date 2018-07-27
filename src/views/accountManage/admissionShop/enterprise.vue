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
        <component  :is="tabView" @stepObj="getStep" :last-step = 'status' :editor-info="editorDetail"></component>
      </div>
    </div>
</template>

<script>
  import Enterprise1 from "@/views/accountManage/admissionShop/enterprise1"
  import Enterprise2 from "@/views/accountManage/admissionShop/enterprise2"
  import SuccessAdd from "@/views/accountManage/admissionShop/successAdd"
  import { getApprovedStatus } from "@/api/userCenter"
  import { getRegisterInfo } from "@/api/enter"

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
              status:'',
              editorDetail: '',
            }
        },
        mounted() {
          this.getUserInfo();

        },
        methods: {
          getUserInfo() {
            getApprovedStatus().then( res => {
              if(res.data.status === '000000000'){

                if(res.data.data.status !== '0'){
                  if(res.data.data.status === '3'){
                    this.$router.push('/accountManage/admission/admissionShop/failAdd');
                    getRegisterInfo().then( res => {
                      if( res.data.status === '000000000'){
                        let data1 =  res.data.data.merchantAptitudeDto ;
                        let data2 = res.data.data.merchantShopResDto ;
                        let data3 = res.data.data.merchantBrandinfoResDtoList;
                        let form = { ...data2,...data1,...data3 };
                        this.$store.commit('addForm',form);
                        this.editorDetail = 1 ;

                      }
                    })

                  }
                  if( res.data.data.status === '1'){
                    this.$router.push('/accountManage/admission/admissionShop/successAdd?checking=1')

                  }

                }
                // this.goHomeEditor
              }
            })
          },
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
