<template>
  <div class="newShop">
    <div class="content">
      <p class="tips">绑定店铺</p>
      <!--<p class="tips" v-show="tips">绑定新店铺（请认真填写绑定信息，一经提交无法修改）-->
        <!--<img class="close" src="../../assets/imgs/close.png" @click="close" alt="" />-->
      <!--</p>-->
      <el-form ref="sizeForm" :model="sizeForm" label-width="160px" size="mini" :rules="rules">
        <el-form-item label="平台类型：" prop="platformType">
          <el-radio-group style="width:218px" v-model="sizeForm.platformType" @change="resetShop">
            <el-radio v-for="item in platform" :disabled="type!=''?type!==item.value:false" :key="item.value"
                      :label="item.value">{{ item.name }}</el-radio>
            <!--<el-radio :disabled="sizeForm.platformType!=''?sizeForm.platformType!==label:false" label="1">淘宝</el-radio>-->
            <!--<el-radio :disabled="sizeForm.platformType!==label" label="2">天猫</el-radio>-->
            <!--<el-radio :disabled="sizeForm.platformType!==label" label="3">京东</el-radio>-->
          </el-radio-group>
        </el-form-item>
        <el-form-item label="店铺首页网址：" prop="shopUrl">
          <el-input v-model.trim="sizeForm.shopUrl" class="big"></el-input>
        </el-form-item>
        <el-form-item label="店铺名称：" prop="shopName">
          <el-input v-model.trim="sizeForm.shopName"  class="big"></el-input>
        </el-form-item>
        <el-form-item label="店铺旺旺/咚咚ID："  prop="messageId">
          <el-input v-model.trim="sizeForm.messageId" class="big"></el-input>
        </el-form-item>
        <el-form-item label="验证码：" prop="captcha">
          <span  class="small">{{ sizeForm.captcha }}</span>
          <el-button class="copyBtn" type="primary" plain  @click="copy(sizeForm.captcha,$event)">复制</el-button>
        </el-form-item>
        <ul>
          <li>1、将验证码加到您的店铺某个上架商品的标题上，如下图:</li>
          <img src="../../assets/imgs/u445.png" alt=""/>
          <li>2、再将这个商品的详情页链接，复制到下面输入框中进行验证。</li>
        </ul>
        <el-form-item label="待验证商品链接：" label-width="160px" prop="productUrl">
          <el-input v-model.trim="sizeForm.productUrl" class="big"></el-input>
        </el-form-item>
        <el-form-item label="负责人QQ：" prop="managerQq">
          <el-input v-model.trim="sizeForm.managerQq" class="big"></el-input>
        </el-form-item>
        <el-form-item label="负责人微信：" prop="managerWechat">
          <el-input v-model.trim="sizeForm.managerWechat" class="big"></el-input>
        </el-form-item>
        <el-form-item label="负责人手机：" prop="managerMobile">
          <el-input v-model.number="sizeForm.managerMobile" class="big"></el-input>
        </el-form-item>
        <el-form-item size="large" class="submit">
          <el-button type="primary" v-if="editor === '1'" @click="onSubmit('sizeForm' ,'1')" >确认修改</el-button>
          <el-button type="primary" v-else @click="onSubmit('sizeForm')" >提交</el-button>
        </el-form-item>
      </el-form>

    </div>

  </div>
</template>

<script>
  import clip from '@/utils/clipboard' // use clipboard directly
  import { shopDetail , shopInfo ,changeInfo ,shopCaptcha } from "@/api/shop"
  import ElButton from "element-ui/packages/button/src/button";
  import { validateURL ,validateWX ,validatePhone ,validQQ , checkInput } from '@/utils/validate'
  import ElFormItem from "element-ui/packages/form/src/form-item";
  import ElRadioGroup from "element-ui/packages/radio/src/radio-group";
  export default {
    name: "Newshop" ,

    components: {
      ElRadioGroup,
      ElFormItem,
      ElButton
    },
    data(){
      var validateAddr = (rule,value,callback) => {
        if(value === ''){
          callback(new Error('请输入店铺首页网址'))
        }else{
          if(!validateURL(value) ){
            callback(new Error('请输入正确的网址链接'))

          }else if(value.length > 512){
            callback(new Error('网址链接过长，请重新选择后进行输入'))

          }
          callback();
        }
      }
      var validateName = (rule,value,callback) => {
        if(value === ''){
          callback(new Error('请输入店铺名称'))
        }else{
          if(value.length > 100){
            callback(new Error('店铺名称不得超过100个字符'))
          }
          if(checkInput(value)){
            callback(new Error('请输入正确格式的店铺名称'))
          }
          callback();

        }

      }
      var validateID = (rule,value,callback) => {
        if(value === ''){
          callback(new Error('请输入旺旺/咚咚ID'))

        }else{
          if(value.length > 40){
            callback(new Error('旺旺/咚咚ID不得超过40个字符'))
          }
          if(checkInput(value)){
            callback(new Error('请输入正确格式的旺旺/咚咚ID'))
          }
          callback();

        }

      }
      var validGoodsAddr = (rule,value,callback) => {
        if(value === ''){
          callback(new Error('请输入待验证商品链接'))
        }else{
          if(!validateURL(value)){
            callback(new Error('请输入正确格式的链接'))
          }else if(value.length > 512){
            callback(new Error('网址链接过长，请重新选择后进行输入'))

          }
          callback();

        }
      }
      var validateQQ = (rule,value ,callback) => {
        if(value === ''){
          callback(new Error('请输入负责人QQ号'))
        }else {
          if( !validQQ(value)){
            callback(new Error('请输入正确格式的QQ号'))
          }
          callback();
        }
      }
      var validateWx = (rule,value ,callback) => {
        if(value === ''){
          callback(new Error('请输入负责人微信号'))
        }else{
          if(!validateWX(value) && !validatePhone(value)){
            callback(new Error('请输入正确格式的微信号'))
          }
          callback();

        }
      }
      var validateTel = (rule ,value ,callback) => {
        if(value === ''){
          callback(new Error('请输入负责人的手机号'))
        }else{
          if(!validatePhone(value)){
            callback(new Error('请输入正确格式的手机号'))
          }
          callback();

        }
      }
      return{
        tips : true ,
        editor : '',
        sizeForm : {
          platformType : '1',
          shopUrl : '',
          shopName: '',
          messageId : '',
          captcha : '',
          productUrl : '',
          managerQq : '',
          managerWechat : '',
          managerMobile : ''
        },
        rules : {
          platformType : [{ required : true , message : '请选择平台类型' , trigger : 'change'}],
          shopUrl : [
            {
              validator : validateAddr , trigger : 'blur' , required: true
            }
          ],
          shopName : [
            {
              validator : validateName , trigger : 'blur' , required : true
            }
          ],
          messageId : [
            {
              validator : validateID , trigger : 'blur',required : true
            }
          ],
          productUrl : [
            {
              validator : validGoodsAddr , trigger : 'blur',required : true
            }
          ],
          managerQq : [
            {
              validator : validateQQ , trigger : 'blur',required : true
            }
          ],
          managerWechat : [
            {
              validator : validateWx , trigger : 'blur',required : true
            }
          ],
          managerMobile : [
            {
              validator : validateTel , trigger : 'blur',required : true
            }
          ]

        },
        shopId : '' ,
        platform : [
          {
            value : '1',
            name : '淘宝'
          },
          {
            value : '2',
            name : '天猫'
          },
          {
            value : '3',
            name : '京东'
          }
        ] ,
        type : ''
      }
    },

    mounted(){
      if(this.$route.query.editor !== undefined){
        this.editor = this.$route.query.editor ;
        this.shopId = this.$route.query.id ;
        shopDetail(this.shopId).then( res => {
          // console.log(res);
          if( res.data.status === '000000000'){
            this.sizeForm = res.data.data ;
            this.type = this.sizeForm.shopUrl ;
          }else{
            this.$message({
              message : res.data.message ,
              center : true ,
              type : 'error'
            })
          }
        }).catch( err => {
          alert('服务器开小差啦，请稍等~')
        })

      }else{
        shopCaptcha().then( res => {
          if(res.data.status === '000000000'){
            this.sizeForm.captcha = res.data.data ;
          }
        }).catch( err => {
          alert('服务器开小差啦，请稍等~')
        })
      }

    },
    methods : {
      copy(text,event){
        clip(text, event)
        this.$message({
          message: '复制成功',
          type: 'success',
          duration: 1500
        })
      },
      onSubmit(form,type){
        this.$refs[form].validate((valid) => {
          if(valid){
            let formData = new FormData();
            formData.append('shopName' , this.sizeForm.shopName);
            formData.append('messageId' , this.sizeForm.messageId) ;
            formData.append('productUrl' ,this.sizeForm.productUrl) ;
            formData.append('managerQq' ,this.sizeForm.managerQq);
            formData.append('managerWechat' , this.sizeForm.managerWechat) ;
            formData.append('managerMobile' ,this.sizeForm.managerMobile) ;
            formData.append('shopUrl',this.sizeForm.shopUrl);
            formData.append('platformType',this.sizeForm.platformType);
            formData.append('captcha' ,this.sizeForm.captcha);
            if(type === '1'){
              formData.append('shopId',this.shopId);
              changeInfo(formData).then( res => {
                if(res.data.status === '000000000'){
                  this.$message({
                    type : 'success',
                    message : '提交成功',
                    center : true ,
                    duration : 500
                  })
                  this.$router.push('/shop')
                }else{
                  this.$message({
                    type : 'error' ,
                    message : res.data.message,
                    center : true
                  })
                }
              }).catch( err => {
                alert('服务器开小差啦，请稍等~')
              })
            }else{

              shopInfo(formData).then( res => {
                if(res.data.status === '000000000'){
                  this.$message({
                    type : 'success',
                    message : '提交成功',
                    center : true ,
                    duration : 500

                  })
                  this.$router.push('/shop')
                }else{
                  this.$message({
                    type : 'error' ,
                    message : res.data.message,
                    center : true
                  })
                }
              }).catch( err => {
                alert('服务器开小差啦，请稍等~')
              })

            }


          }
          // else{
          //   this.$message({
          //     type :'error' ,
          //     message : '提交失败，请重新确认信息',
          //     center : true
          //   })
          //   return false ;
          // }
        })
      },

      //切换平台相关信息重置
      resetShop(){
        this.sizeForm.shopUrl = '' ;
        this.sizeForm.productUrl = '' ;

      },

      close(){
        this.tips = false
      }
    }
    }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .newShop{
    width : 100% ;
    margin : 0 auto ;
    padding : 0 0.2rem 0.3rem;
    box-sizing: border-box;
    .content{
      width : 75% ;
      margin : 0 auto ;
      padding : 0.4rem  0.8rem ;
      border : 1px solid #bbb ;
      border-radius : 0.05rem ;
      font-size : 0.14rem ;
      color : #666;
      .tips{
        width : 90% ;
        height : 0.6rem ;
        line-height : 0.6rem ;
        color : #555 ;
        background : #f1f1f1 ;
        font-size : 0.22rem ;
        font-weight : bold ;
        /*text-indent : 0.1rem ;*/
        text-align: center;
        margin : 0 auto 0.3rem ;

        /*position : relative ;*/
       /* .close{
          width : 0.14rem ;
          height : 0.14rem ;
          position : absolute ;
          top : 50% ;
          right  : 0.08rem ;
          margin-top : -0.07rem ;
        }*/
      }
      .el-form{
        margin : 0 auto ;
        width : 55% ;

        .el-radio-group{
          /* width : 3.2rem ; */
        }

      }
     label{
       text-align : left ;

     }
      .el-form-item__label{
        text-align : left ;
      }

      /*.ipt{*/
        /*width : 2rem ;*/
      /*}*/
      .small{
        width : 160px ;
        height : 28px ;
        border : 1px solid #dcdfe6;
        border-radius : 0.04rem ;
        display : block ;
        float : left ;
        text-align : center;
        line-height : 28px ;
        color : #666 ;
      }
      .big{
        width : 240px ;
      }
      .copyBtn{
        margin-left : 0.2rem ;
      }
      ul{
        margin-left : 160px;
        font-size : 0.12rem ;
        color : #555 ;
        width : 60% ;

        li{
          line-height : 0.25rem ;
          width : 100% ;

        }
        img{
          width : 80% ;
          margin-left : 0.15rem ;
        }
      }
      .submit{
        /*width : 0.7rem ;*/
        margin : 0 auto ;
      }
    }
  }
</style>
