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
  // import { getApprovedStatus } from "@/api/userCenter"
  import { getRegisterInfo,getStatus } from "@/api/enter"


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
          let type = this.$route.query.type ;
          if( type === undefined){
            for (const [i, v] of this.$store.state.tagsView.visitedViews.entries()) {
              if (v.path === this.$route.path) {
                this.$store.state.tagsView.visitedViews.splice(i, 1);
                // this.$router.push('/freeManage/publish/step3');
                this.$router.push('/accountManage/admission/admissionShop/index')

              }
            }
          }

          this.getUserInfo();

        },

        methods: {
          getUserInfo() {
            getStatus().then( res => {
              if(res.data.status === '000000000'){

                if(res.data.data.status !== '0'){
                  if(res.data.data.status === '3'){
                    // this.$router.push('/accountManage/admission/admissionShop/failAdd');
                    let shopType = this.$route.query.type ;
                    if(shopType == undefined){
                      shopType = ''
                    }
                    getRegisterInfo(2,shopType).then( res => {
                      if( res.data.status === '000000000'){

                        // this.$store.commit('addMerchantBrand',merchantBrandinfoReqDtos);
                        this.editorDetail = 1 ;
                        if(res.data.data !== null){
                          let data1 =  res.data.data.merchantAptitudeDto ;
                          let data2 = res.data.data.merchantShopResDto ;
                          let merchantBrandinfoReqDtos = res.data.data.merchantBrandinfoResDtoList;
                          let form = { ...data2,...data1 };
                          form['merchantBrandinfoReqDtos'] = merchantBrandinfoReqDtos;
                          // console.log(form);
                          let listId = [];
                          if(res.data.data.merchantBrandinfoResDtoList !== null ){
                            res.data.data.merchantBrandinfoResDtoList.map( i => {
                              listId.push(i.id);
                            });
                          }
                          let editorId = {
                            id1  : res.data.data.merchantAptitudeDto.id ,
                            id2 : res.data.data.merchantShopResDto.id,
                          };
                          this.$store.commit('addForm2',form);
                          this.$store.commit('addEditorId',editorId);
                          this.$store.commit('addListId',listId);
                        }else{
                          this.$store.commit('clearForm2');

                          // if(window.location.href.indexOf("#reloaded")===-1){
                          //   window.location.href=window.location.href+"#reloaded";
                          //   window.location.reload();
                          // }
                        }

                      }
                    })

                  }else if( res.data.data.status === '1'){
                    this.$router.push('/accountManage/admission/admissionShop/successAdd')

                  }else if(res.data.data.status === '2'|| res.data.data.status === '4'){
                    this.$message({
                      message : '您已成功入驻，无需再次入驻',
                      center : 'error',
                      type : true
                    });
                    this.$router.push( '/merchantCenter/index')

                  }

                }else{
                  // window.location.reload();

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
