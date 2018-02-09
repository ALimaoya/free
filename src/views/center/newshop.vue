<template>
  <div class="newShop">
    <div class="content">
      <p class="tips" v-show="tips">绑定新店铺（请认真填写绑定信息，一经提交无法修改）
        <img class="close" src="../../assets/imgs/close.png" @click="close" alt="" />
      </p>
      <el-form ref="sizeForm" :model="sizeForm" label-width="1.4rem" size="mini" :rules="rules">
        <el-form-item label="店铺首页网址：" prop="address">
          <el-input v-model.trim="sizeForm.address" class="ipt"></el-input>
        </el-form-item>
        <el-form-item label="店铺名称：" prop="name">
          <el-input v-model.trim="sizeForm.name"  class="ipt"></el-input>
        </el-form-item>
        <el-form-item label="店铺旺旺/咚咚ID："  prop="ID">
          <el-input v-model.trim="sizeForm.ID" class="ipt"></el-input>
        </el-form-item>
        <el-form-item label="验证码："  prop="val">
          <el-input v-model.trim="sizeForm.val" class="small"></el-input>
          <el-button class="copyBtn" type="primary" plain  @click="copy(sizeForm.val,$event)">复制</el-button>
        </el-form-item>
        <ul>
          <li>1、将验证码加到您的店铺某个上架商品的标题上，如下图:</li>
          <img src="../../assets/imgs/u445.png" alt=""/>
          <li>2、再将这个商品的详情页链接，复制到下面输入框中进行验证。</li>
        </ul>
        <el-form-item label="待验证商品链接：" label-width="1.4rem" prop="addr">
          <el-input v-model.trim="sizeForm.addr" class="big"></el-input>
        </el-form-item>
        <el-form-item label="负责人QQ：" prop="QQ">
          <el-input v-model.trim="sizeForm.QQ" class="big"></el-input>
        </el-form-item>
        <el-form-item label="负责人微信：" prop="wx">
          <el-input v-model.trim="sizeForm.wx" class="big"></el-input>
        </el-form-item>
        <el-form-item label="负责人手机：" prop="phone">
          <el-input v-model.number="sizeForm.phone" class="big"></el-input>
        </el-form-item>
        <el-form-item size="large" class="submit">
          <el-button type="primary" @click="onSubmit('sizeForm')" >提交</el-button>
        </el-form-item>
      </el-form>

    </div>

  </div>
</template>

<script>
  import clip from '@/utils/clipboard' // use clipboard directly

  import ElButton from "element-ui/packages/button/src/button";
  import { validateURL ,validateWX ,validatePhone ,validQQ } from '@/utils/validate'
  export default {
    name: "Newshop" ,

    components: {
      ElButton
    },
    data(){

      var validateAddr = (rule,value,callback) => {
        if(value === ''){
          callback(new Error('请输入店铺首页网址'))
        }else{
          if(!validateURL(value) ){
            callback(new Error('请输入正确的网址链接'))

          }
          callback();
        }
      }
      var validateName = (rule,value,callback) => {
        if(value === ''){
          callback(new Error('请输入店铺名称'))
        }
        // else{
          callback();
        // }
      }
      var validateID = (rule,value,callback) => {
        if(value === ''){
          callback(new Error('请输入旺旺/咚咚ID'))

        }
        callback();

      }
      // var validateVal = (rule,value ,callback) => {
      //   if(value === ''){
      //     callback(new Error('请输入验证码'))
      //   }
      //
      //     callback();
      // }
      var validGoodsAddr = (rule,value,callback) => {
        if(value === ''){
          callback(new Error('请输入待验证商品链接'))
        }else{
          if(!validateURL(value)){
            callback(new Error('请输入正确格式的链接'))
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
          if(!validateWX(value)){
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
        sizeForm : {
          address : '',
          name : '',
          ID : '',
          val : '',
          addr : '',
          QQ : '',
          wx : '',
          phone : ''
        },
        rules : {
          address : [
            {
              validator : validateAddr , trigger : 'blur' , required: true
            }
          ],
          name : [
            {
              validator : validateName , trigger : 'blur' , required : true
            }
          ],
          ID : [
            {
              validator : validateID , trigger : 'blur',required : true
            }
          ],
          val : [
            {
               trigger : 'blur', required : true
            }
          ],
          addr : [
            {
              validator : validGoodsAddr , trigger : 'blur',required : true
            }
          ],
          QQ : [
            {
              validator : validateQQ , trigger : 'blur',required : true
            }
          ],
          wx : [
            {
              validator : validateWx , trigger : 'blur',required : true
            }
          ],
          phone : [
            {
              validator : validateTel , trigger : 'blur',required : true
            }
          ]

        }
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
      onSubmit(formName){
        // console.log(formName)
        this.$refs[formName].validate((valid) => {
          if(valid){
            this.$message({
              type : 'success',
              message : '提交成功',
              center : true
            })
            this.$router.push('/shop')
            // alert('提交成功')
          }else{
            this.$message({
              type :'error' ,
              message : '提交失败，请重新确认信息',
              center : true
            })
            return false ;
          }
        })
        console.log(this.sizeForm)
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
        height : 0.4rem ;
        line-height : 0.4rem ;
        color : #333 ;
        background : #f1f1f1 ;
        font-size : 0.18rem ;
        text-indent : 0.1rem ;
        margin : 0 auto 0.3rem ;
        position : relative ;
        .close{
          width : 0.14rem ;
          height : 0.14rem ;
          position : absolute ;
          top : 50% ;
          right  : 0.08rem ;
          margin-top : -0.07rem ;


        }
      }
      .el-form{
        margin : 0 auto ;
        width : 70% ;
      }
     label{
       text-align : left ;

     }
      .el-form-item__label{
        text-align : left ;
      }
      .ipt{
        width : 2rem ;
      }
      .small{
        width : 1.6rem ;
      }
      .big{
        width : 2.4rem ;
      }
      .copyBtn{
        margin-left : 0.2rem ;
      }
      ul{
        margin-left : 1.4rem;
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
