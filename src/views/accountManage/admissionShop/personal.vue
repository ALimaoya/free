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

        <component  :is="tabView" @stepObj="getStep" :last-step= 'status' :editor-info="editorDetail"></component>

      </div>
    </div>
</template>

<script>
  import {  getUser,getToken } from '@/utils/auth'
  import Personal1 from "@/views/accountManage/admissionShop/personal1"
  import Personal2 from "@/views/accountManage/admissionShop/personal2"
  import SuccessAdd from "@/views/accountManage/admissionShop/successAdd"
  // import { getApprovedStatus } from "@/api/userCenter"
  import { getRegisterInfo , getStatus } from "@/api/enter"

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
              status:'',
              editorDetail: ''
            }
        },

        mounted() {
          this.getUserInfo();

        },
        methods: {
          getUserInfo() {
            getStatus().then( res => {
              if(res.data.status === '000000000'){

                if(res.data.data.status !== '0'){

                  if( res.data.data.status === '1'){
                    this.$router.push('/accountManage/admission/admissionShop/successAdd')
                  }
                  if(res.data.data.status === '3'){
                    getRegisterInfo(1,3).then( res => {
                      if( res.data.status === '000000000'){

                        this.editorDetail = 1 ;
                        if(res.data.data !== null){
                          let data1 =  res.data.data.merchantAptitudeDto ;
                          let data2 = res.data.data.merchantShopResDto ;
                          let form = { ...data2,...data1};
                          let editorId = {
                            id1  : res.data.data.merchantAptitudeDto.id ,
                            id2 : res.data.data.merchantShopResDto.id
                          };
                          this.$store.commit('addForm',form);
                          this.$store.commit('addEditorId',editorId);
                        }

                      }
                    })
                  }
                }else{
                  this.$store.commit('clearForm');

                  // window.location.reload();
                }
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
