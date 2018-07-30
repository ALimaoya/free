<template>
    <div class="admissionShop">
      <div class="personalAdd">
        <p class="title">个人入驻</p>
        <span>适合个人、个体户入驻，提供身份证即可入驻</span>
        <span class="blank" ></span>
        <span class="blank" ></span>
        <el-button type="danger" @click="goPersonal">马上入驻</el-button>
      </div>
      <div class="enterPriseAdd">
        <p class="title">企业入驻</p>
        <span>适合公司、企业入驻，提供营业执照等资料即可入驻</span>
        <el-radio-group v-model="shopType">
          <el-radio v-for="(item,index) in typeList" :label="item.value" :key="index">{{ item.name }}</el-radio>
        </el-radio-group>
        <el-button class="typeBtn" type="text" @click="dialogVisible = true ;">店铺类型说明</el-button>
        <el-button type="danger" @click="goEnterPrise">马上入驻</el-button>
      </div>
      <el-dialog title="店铺类型说明" :visible.sync="dialogVisible" width="60%" center>
        <div class="dialog_content">
          <p>1、店铺入驻时，选择“旗舰店”、“专卖店”、“专营店”时，必须上传品牌授权证明或独占授权证明， 否则会导致审核不通过</p>
          <p>2、以“旗舰店”、“官方”命名店铺名时，必须上传商标注册证明</p>
          <h1>不同店铺类型资质要求说明</h1>
          <table border="1">
            <tr><th><span>店铺类型</span><p></p><span>资质要求</span></th><th></th><th>企业三证</th><th>质检报告</th><th>商标注册证</th><th>授权书</th><th>开户证明</th></tr>
            <tr><td>旗舰店</td><td><span>品牌方</span><p></p><span>被授权方（一级授权）</span></td><td><span>√</span><p></p><span>√</span></td>
              <td><span>√</span><p></p><span>√</span></td><td><span>√</span><p></p>√<span></span></td>
              <td><span  class="wrong">×</span><p></p><span>√</span></td><td><span>√</span><p></p><span>√</span></td></tr>
            <tr><td>专卖店</td><td></td><td>√</td><td>√</td><td>√</td><td>√</td><td>√</td></tr>
            <tr><td>专营店</td><td></td><td>√</td><td>√</td><td>√</td><td>√</td><td>√</td></tr>
            <tr><td>普通店</td><td></td><td>√</td><td class="wrong">×</td><td class="wrong">×</td><td class="wrong">×</td><td>√</td></tr>
          </table>
          <span class="note">备注：打对号的表示不同类型店铺需要提供的证件</span>
        </div>
        <div slot="footer" class="dialog-footer" >
          <el-button type="warning" size="small" @click="dialogVisible= false;">知道了</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
    import { getStatus } from "@/api/enter"
    export default {

      name: "AdmissionShop",
        data() {
            return {
              typeList: [
                {
                  value : '0',
                  name : '旗舰店'
                },
                {
                  value : '1',
                  name : '专卖店'
                },
                {
                  value : '2',
                  name : '专营店'
                },
                {
                  value : '3',
                  name : '普通店'
                },
              ],
              shopType: '0',
              dialogVisible: false ,
              // registerType : '',
            }
        },


        mounted() {
          // let isNew = this.$route.params.new ;
          // if(isNew !== undefined && isNew === '0'){
          //   window.location.reload();
          // }

        },
        methods: {
          getUserInfo() {

          },

          goPersonal(){
            // if(this.registerType){
            getStatus().then( res => {
              if(res.data.status === '000000000'){

                if(res.data.data.status === '1'){
                  this.$router.push( '/accountManage/admission/admissionShop/successAdd')
                }else{
                  this.$store.commit('clearForm');
                  this.$router.push('/accountManage/admission/admissionShop/personal');
                }

              }
            })

          },
          goEnterPrise(){
            getStatus().then( res => {
              if(res.data.status === '000000000'){
                if(res.data.data.status === '1'){
                  this.$router.push( '/accountManage/admission/admissionShop/successAdd')
                }else{
                  this.$store.commit('clearForm2');
                  this.$store.commit('shopType',this.shopType);
                  this.$router.push('/accountManage/admission/admissionShop/enterprise?type='+this.shopType);
                }

              }
            })

            }


          },

        // }
    }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .admissionShop{
    width : 90% ;
    margin : 1rem auto ;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    .personalAdd,.enterPriseAdd{
      width :45% ;
      border : 1px solid #999;
      border-radius : 0.1rem ;
      justify-content: space-around;
      display: flex;
      flex-direction: column;
      padding : 0.5rem 0.3rem;
      box-sizing: border-box;
      p{
        font-size : 0.28rem ;
        line-height : 0.4rem ;
        text-align: center;
        color : #333;
        font-weight: bold;
      }
      span{
        display: inline-block;
        font-size : 0.16rem ;
        line-height : 0.3rem ;
        color : #999;
        margin : 0.2rem auto ;
      }
    }
    .personalAdd{
      .blank{
        width : 100% ;
        height : 40px ;
        margin : 0;
      }

    }
    .enterPriseAdd{
      .el-radio-group{
        margin : 0.3rem auto ;
        /*display: flex;*/
        /*flex-wrap: nowrap;*/
        /*flex-direction: row;*/
      }
      .typeBtn{
        text-align : right ;
        padding-top: 0;
      }
    }
    .dialog_content{
      p{
        font-size : 0.18rem ;
        line-height : 0.4rem ;
      }
      p:nth-child(2){
        margin-bottom : 0.3rem ;
      }
      h1{
        font-size : 0.3rem ;
        text-align: center;
        line-height : 0.5rem ;
        font-weight : 100 ;
      }
      table{
        border-collapse: collapse;
        margin : 0.2rem auto ;
        width : 90% ;
        border-radius : 0.05rem ;
        border-color : #aaa ;
        text-align: center;
        th{
          position : relative;
          height : 50px;
          span{
            height : 25px ;
            display: inline-block;
          }
          span:nth-child(1){
            position: absolute;
            left: 5px;
            top: 25px;
          }
          span:nth-last-child(1){
            position: absolute;
            right: 5px;
            top: 0;
          }
          p{
            width: 105%;
            height: 1px;
            background : #aaa ;
            -webkit-transform: rotate(22deg);
            -moz-transform: rotate(22deg);
            transform: rotate(22deg);
            position: absolute;
            left: -3px;
            top: 24px;
            margin : 0!important;

          }
        }
        th:nth-child(1){
          width : 120px;
        }
        td{
          height: 40px ;
          font-size : 0.18rem;
          p{
            border-bottom : 1px solid #aaa ;
            margin : 0!important;
          }
        }
        td:not(:nth-child(1)):not(:nth-child(2)){
          color : #66CC00;
        }
        .wrong{
          color : rgba(255, 0, 0, 0.6) !important ;
        }
      }
      .note{
        color : #aaa;
        font-size : 0.14rem ;
        margin-top : 0.3rem ;
        text-indent : 0.3rem ;
        display: inline-block;
      }
    }
  }
</style>
