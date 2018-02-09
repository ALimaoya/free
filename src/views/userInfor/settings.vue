<template>
  <div class="settings">
    <p class="title">基本设置</p>
    <table border="1" bordercolor="#aaa">
      <tr>
        <td>登录密码</td>
        <td>互联网账号存在被盗号风险，建议您定期修改密码以保证账号安全</td>
        <td><span class="set" @click="changeSetting('1')">修改</span></td>
      </tr>
      <tr>
        <td>支付密码</td>
        <td>设置密码后开启提现功能，可将平台资产转出</td>
        <td><span class="set rightnow" @click="setting" v-if="user.payPassword==''">立即设置</span><span class="set" v-else @click="changeSetting('2')">修改</span></td>
      </tr>
      <tr class="warn">
        <td>联系方式</td>
        <td>完善以下信息有助于平台及时联系您</td>
        <td></td>
      </tr>
      <tr v-for="item in contactType">
        <td>{{item.type}}</td>
        <td>{{item.value}}</td>
        <td><span class="set rightnow" @click="setting(item.type)" v-if="item.value==''">立即设置</span><span class="set" v-else @click="changeSetting(item.type)">修改</span></td>
      </tr>

      <tr>
        <td>手机</td>
        <td class="telTips"><span  @click="tips">
          <el-popover ref="popover"
            placement="bottom"
            title="说明"
            width="300"
            trigger="click"
            content="此手机号默认为注册手机号，修改之后将使用新手机号作为登录号码">
          </el-popover>
          <el-button class="tipBox" slot="reference" v-popover:popover ></el-button>
        </span></td>
        <td><span class="set" @click="changeSetting('手机')">修改</span></td>
      </tr>
    </table>
    <!--设置密码-->
    <el-dialog title="设置支付密码" :visible.sync="pswVisible" center :before-close="close">
      <el-form ref="pswForm" :model="pswForm" :rules="pswRule">
        <el-form-item label="密码：" :label-width="pswWidth" prop="payPsw">
          <el-input placeholde="请输入密码" v-model.trim="pswForm.payPsw"></el-input>
        </el-form-item>
        <el-form-item label="确认密码：" :label-width="pswWidth" prop="payPsw2">
          <el-input placeholde="请再次输入密码" v-model.trim="pswForm.payPsw2"></el-input>
        </el-form-item>
        <el-form-item class="paynum">
          <el-button type="primary" @click="onSubmitPsw('pswForm')">确 认</el-button>
          <el-button @click="cancel('pswForm')">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--修改密码-->
    <el-dialog :title="pswType" :visible.sync="dialogFormVisible" center :before-close="close">
        <el-form :model="changePsw" ref="changePsw" :rules="changePswRules">
          <p class="tel" >绑定手机号：</p>
          <el-form-item label="验证码：" :label-width="formLabelWidth" prop="pswVerify">
            <el-input placeholder="请输入验证码" v-model.trim="changePsw.pswVerify"></el-input><el-button class="getNum" @click="getNum" :disabled="disabled">{{ btntext }}</el-button>
          </el-form-item>
          <!--<div v-if="pswType==='修改登录密码'">-->
            <el-form-item label="新密码：" :label-width="formLabelWidth" prop="newPsw">
              <el-input placeholder="请输入新密码" v-model.trim="changePsw.newPsw"></el-input>
            </el-form-item>
            <el-form-item label="确认新密码：" :label-width="formLabelWidth" prop="checkPsw">
              <el-input placeholder="请再次输入新密码" v-model.trim="changePsw.checkPsw"></el-input>
            </el-form-item >
        </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onSubmit('changePsw',pswType)">确 定</el-button>
        <el-button @click="cancel('changePsw')">取 消</el-button>
      </div>
    <!--</div>-->
      </el-dialog>
    <!--设置||修改qq/微信/email-->
    <el-dialog :title="concatType" :visible.sync="contactVisible" center width="5rem" top="18%" :before-close="close">
      <!---->
      <el-form :model="QQ" :rules="QQrule" ref="QQ" v-if="ways==='QQ'">
        <el-form-item :label="labelname" :label-width="formLabelWidth" prop="qqNum" >
          <el-input placeholder="请输入内容" v-model.number="QQ.qqNum"></el-input>
        </el-form-item>
      </el-form>
      <el-form :model="wx" :rules="wxRule" ref="wx" v-else-if="ways==='wx'">
        <el-form-item :label="labelname" :label-width="formLabelWidth" prop="wechat" >
          <el-input placeholder="请输入内容" v-model.trim="wx.wechat"></el-input>
        </el-form-item>
      </el-form>
      <el-form :model="email" :rules="emailRule" ref="email" v-else-if="ways==='email'">
        <el-form-item :label="labelname" :label-width="formLabelWidth" prop="emailStr" >
          <el-input placeholder="请输入内容" v-model.trim="email.emailStr"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onSubmitCon(ways)">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
      <!--</div>-->
    </el-dialog>
    <!--修改手机号-->
    <el-dialog :title="phonetitle" :visible.sync="phoneVisible" center width="5rem" top="18%" :before-close="cancel">
      <el-form v-if="oldNumber">
        <p class="tel tel2" >验证原绑定手机号码：</p>
        <el-form-item label="验证码：" >
          <el-input v-model="oldnum" placeholder="请输入验证码" @blur="verifyNum(oldnum)"></el-input>
          <el-button class="getNum" @click="getNum" :disabled="disabled">{{btntext}}</el-button>
        </el-form-item>
        <span v-if="isYZM" class="noipt">请输入验证码</span>

        <el-form-item  class="nextBtn">
          <el-button type="primary" @click="next">下一步</el-button>
          <el-button @click="cancel">取 消</el-button>
        </el-form-item>
      </el-form>
        <el-form ref="phoneForm" :model="phoneForm" :rules="phoneRule" v-else-if="newNumber">
          <el-form-item label="新手机：" prop="newnumber" >
            <el-input v-model.number="phoneForm.newnumber" placeholder="请输入手机号"></el-input>
          </el-form-item>
          <el-form-item label="验证码：" prop="verify">
            <el-input :model.number="phoneForm.verify" placeholder="请输入验证码"></el-input>
            <el-button class="getNum" @click="getNum" :disabled="disabled">{{btntext}}</el-button>
          </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" v-if="newNumber">
        <el-button type="primary" @click="onsubmitTel('phoneForm')">确定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import ElButton from "element-ui/packages/button/src/button";
  import {  validateWX ,validatePhone ,validQQ ,validateEmail } from '@/utils/validate'

  export default {
      name: "settings",
      components: {
        ElButton,
      },
    data(){
      const validateQQ = (rule,value ,callback) => {
        if(value === ''){
          callback(new Error('请输入QQ号'))

        } else{
          if( !validQQ(value)){
            callback(new Error('请输入正确格式的QQ号'))
          }
          callback();
        }
      };
      const validateWx = (rule,value ,callback) => {
        if(value === ''){
          callback(new Error('请输入微信号'))
        }else{
          if(!validateWX(value)){
            callback(new Error('请输入正确格式的微信号'))
          }
          callback();
        }

      };
      const validateEml = (rule ,value ,callback) => {
        if( value === ''){
          callback(new Error('请输入邮箱地址'))
        }else{
          if(!validateEmail(value)){
            callback(new Error('请输入正确格式的邮箱'))
          }
          callback();
        }

      };
      const validateYZM = (rule,value,callback) => {
        if(value === ''){
          callback(new Error('请输入验证码'))
        }else{
          if(value !== this.verifyNumber){
            callback(new Error('验证码有误，请重新输入'))
          }
          callback();
        }
      };
      const validateTel = (rule ,value ,callback) => {
        if(value === ''){
          callback(new Error('请输入手机号'))
        }else{
          if(!validatePhone(value)){
            callback(new Error('请输入正确格式的手机号'))
          }
          callback();

        }
      };
      const validPsw =(rule,value ,callback) => {
        if(value===''){
          callback(new Error('请输入新密码'))
        }else{
          if( rule.field === 'payPsw'){
            if(this.pswForm.payPsw2 !==''){
              this.firstPsw = value ;
              this.$refs.pswForm.validateField('payPsw2')
            }
            callback();
          }else
            if( rule.field === 'newPsw'){
            if(this.changePsw.checkPsw !==''){
              this.firstPsw = value;
              this.$refs.changePsw.validateField('checkPsw')
            }
            callback();
          }

        }
      };
      const validPsw2 =(rule,value ,callback) => {
        if(value===''){
          callback(new Error('请再次输入新密码'))
        }else{
          if(value !== this.firstPsw){
            callback(new Error('两次输入的密码不一致，请重新确认'))

          }
          callback();
        }
      };
        return{
          telTips : false ,
          // setBox : false ,
          // changeBox : false ,
          popover : false ,
          dialogFormVisible: false,
          contactVisible : false ,
          formLabelWidth: '1.2rem',
          pswWidth : '1.65rem',
          pswVisible : false,
          pswForm : {
            payPsw : '',
            payPsw2 : ''
          },
          pswRule : {
            payPsw : [{ validator : validPsw  , trigger : 'blur' ,required : true  }],
            payPsw2 : [{ validator : validPsw2  ,trigger : 'blur' ,required : true  }]
            },
          pswType : '',
          changePsw : {
            pswVerify : '',
            newPsw : '',
            checkPsw : '',
          },
          changePswRules :{
            pswVerify : [{ validator : validateYZM  , trigger : 'blur' ,required : true  }],
            newPsw : [{ validator : validPsw  , trigger : 'blur' ,required : true  }],
            checkPsw : [{ validator : validPsw2  ,trigger : 'blur' ,required : true  }],

          },
          concatType : '',
          ways : '',
          contactType :[
            {
              type : 'QQ',
              value : '',
            },
            {
              type : '微信',
              value : '',
            },
            {
              type : '邮箱',
              value : '',
            }
          ],
            QQ: { qqNum : ""},
            wx : { wechat : ''},
            email : { emailStr : ''},
          labelname :'',
          QQrule : {
            qqNum : [
              {
                validator : validateQQ , trigger : 'blur',required : true
              }
            ]
          },
          wxRule : {
            wechat : [
              {
                validator : validateWx , trigger : 'blur',required : true
              }
            ]},
          emailRule:{
            emailStr : [
              {
                validator : validateEml , trigger : 'blur',required : true
              }
            ]},
          phonetitle : '修改已绑定的手机号码',
          oldNumber : false ,
          newNumber : false ,
          phoneVisible : false ,
          phoneForm : {
            newnumber : '',
            verify : ''
          },
          phoneRule: {
            newnumber : [
              {
                validator : validateTel , trigger : 'blur',required : true
              }
            ],
            verify : [
              {
                validator : validateYZM , trigger : 'blur',required : true
              }
            ]
          },
          btntext : ' 获取验证码',
          isYZM : false ,
          oldnum : '',
          firstPsw : '',
          disabled : false ,
          getNew : false ,
          verifyNumber : '',
          user : {
            mobile: '',
            qq : '',
            wechat : '',
            payPassword : ''
          }
        }
    },
    computed : {
      userInfo(){
        this.user.modile = this.$store.state.mobile ,
        this.user.qq = this.$store.state.qq ,
        this.user.wechat = this.$store.state.wechat
        return this.user
      }
    },
    methods:{
        tips(){
          this.telTips = true ;
        },
      //设置支付密码/QQ/微信/邮箱弹窗
      setting(type){
        if(type === 'QQ'){
            this.concatType = '设置绑定QQ号';
            this.labelname = 'QQ：';
            this.contactVisible = true ;
            this.ways = 'QQ' ;

        }else if(type === '微信'){
            this.concatType = '设置绑定微信号';
            this.labelname = '微信：';
            this.contactVisible = true ;
            this.ways = 'wx' ;

          }else if( type === '邮箱'){
            this.concatType = '设置绑定邮箱';
            this.labelname = '邮箱：';
            this.contactVisible = true ;
            this.ways = 'email' ;

          }else{
            this.pswVisible = true ;

          }
      },

      //修改密码/绑定手机号/联系方式
      changeSetting(index){
        if(index==='1'|| index==='2') {
          this.dialogFormVisible = true;
          if (index === '1') {
            this.pswType = '修改登录密码'
          } else if (index === '2') {

            this.pswType = '修改支付密码'
          }
        }else if(index==='手机'){
          this.oldNumber = true ;
          this.phoneVisible = true ;
        }
        else {
          this.contactVisible = true ;
          if(index === 'QQ'){
            this.concatType = '修改绑定QQ号';
            this.labelname = '新的QQ：' ;
            this.ways = 'QQ' ;

          }else if(index=== '微信'){
            this.concatType = '修改绑定微信号';
            this.labelname = '新的微信：' ;
            this.ways = 'wx' ;


          }else{
            this.concatType = '修改绑定邮箱';
            this.labelname = '新的邮箱：';
            this.ways = 'email' ;


          }
        }
        // this.changeBox =true ;
      },

      //设置支付密码提交
      onSubmitPsw(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$message({
              message: '设置成功',
              type: 'success',
              center: true
            });
            this.pswVisible = false;
            this.user.payPassword = this.pswForm.payPsw ;
            console.log(this.pswForm)
          } else {
            this.$message({
              message: '设置失败',
              type: 'error',
              center: true
            });
            return false ;

          }
          this.$refs[formName].resetFields();

        })
      },

      //提交密码修改
      onSubmit(formName,type){
        this.getNew = true ;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$message({
              message: '修改成功',
              type: 'success',
              center: true
            });
            if(type === '修改登录密码'){
              console.log('修改登录密码')

            }else if(type === '修改支付密码'){
              console.log('修改支付密码');
              this.user.payPassword = this.changePsw.payPsw ;

            }
            this.$refs[formName].resetFields();
            this.dialogFormVisible = false ;
            // this.pswVisible = false;
            console.log(this.pswForm)
          } else {
            this.$message({
              message: '修改失败，请重新尝试',
              type: 'error',
              center: true
            });
            return false ;

          }

        });
      },

      //提交QQ/微信/邮箱的修改
      onSubmitCon(ways){
        this.$refs[ways].validate((valid) => {
          if(valid){
            this.$message({
              message: '修改成功',
              type: 'success',
              center : true
            });
            // this.user.qq = this.contactInfo.QQ ;
            // this.user.wechat = this.contactInfo.wechat ;
            // this.user.email = this.contactInfo.email ;
            this.contactVisible = false ;
            if(ways === 'QQ'){
              this.user.qq = this.QQ.qqNum ;
              this.contactType[0].value = this.QQ.qqNum ;
              console.log(this.QQ)
            }else if( ways === 'wx'){
              this.contactType[1].value = this.wx.wechat ;
              console.log(this.wx,this.contactType[1].value)

            }else if(ways === 'email'){
              this.contactType[2].value = this.email.emailStr ;
              console.log(this.email)

            }
            this.$refs[ways].resetFields();

          }else{
            this.$message({
              message : '提交失败',
              type : 'error',
              center : true
            });
            return false ;
          }
        })
        // console.log(formName)
      },

      //校验手机号
      onsubmitTel(formName){
        this.$refs[formName].validate((valid) => {
          if(valid){
            this.$message({
              message: '修改成功',
              type: 'success',
              center : true
            });
            this.phoneVisible = false ;
            this.newNumber = false ;
            console.log(this.phoneForm)
          }else{
            this.$message({
              message : '提交失败',
              type : 'error',
              center : true
            });
            return false ;
          }
        })
        // console.log(formName)
      },

      //获取验证码
      getNum(){
        var num = 60 ;
        this.getNew = false ;
        this.verifyNumber = '1234' ;
        var timer = setInterval(()=>{
          this.btntext = `重新发送(${num}s)` ;
          num-- ;
          this.disabled = true ;

          if(this.getNew==true){
            this.btntext = "获取验证码" ;
            clearInterval(timer) ;
            this.disabled = false ;


          } else if(num === 0){
            this.btntext = "获取验证码" ;
            clearInterval(timer) ;
            this.disabled = false ;

          }

        },1000)
      },

      //核对修改绑定手机号时的验证码
      verifyNum(num){
        if(num == ''){
          this.isYZM = true ;
        }else{
          this.isYZM = false ;
        }
      },


      next(){
        this.verifyNum(this.oldnum);
            if(this.isYZM == true){
              return false
            }else{
              this.getNew = true ;
              setTimeout(() =>{
                this.oldNumber = false ;
                this.newNumber = true ;
                this.phonetitle = '设置新手机号码' ;
                console.log(this.newNumber)
              },800)

            }


      },

      //取消按钮关闭弹窗
      cancel(formName){
        this.phoneVisible = false;
        this.newNumber= false ;
        this.contactVisible = false ;
        this.phonetitle = '修改已绑定的手机号码';
        this.pswVisible = false;
        this.dialogFormVisible = false;
        this.getNew = true ;
        this.$refs[formName].resetFields()

      },

      //叉号关闭弹窗
      close(){
        this.$confirm('确认关闭？')
          .then(_ => {
            this.pswVisible = false;
            this.dialogFormVisible = false;
            this.getNew = true ;
            location.reload();
          })
          .catch(_ => { });

      }
    }
    }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .settings{
    width : 100% ;
    margin : 0 auto ;
    padding : 0.3rem 0.2rem ;
    box-sizing: border-box;
    font-size : 0.15rem ;
    color : #333 ;
    .title{
      width : 100% ;
      height : 0.5rem ;
      line-height : 0.5rem ;
      text-indent : 0.3rem ;
      font-size : 0.2rem ;
      color : #333;
      font-weight : bold ;
      border-bottom : 1px solid #aaa;

    }
    table{
      width : 95% ;
      margin : 0.5rem auto ;
      border-radius : 0.05rem ;
      border-collapse: collapse;
      tr{
        height : 0.35rem ;
        line-height : 0.35rem ;

        td{
          &:nth-child(1){
            width : 20% ;
          }
          &:nth-child(2){
            width : 45% ;
          }
          &:nth-child(3){
            width : 35% ;
          }
          font-size : 0.14rem ;
          color : #333 ;
          text-align : center;
          height : 100% ;

        }
        .telTips{
          position : relative ;

          span{
            position : absolute ;
            top : 0;
            right : 0;
            width : 0.2rem ;
            display : block ;
            .tipBox{
              background : url('../../assets/imgs/tips2.png')  no-repeat center;
              background-size : 70% ;
              width : 100% ;
              height : 0.2rem ;
              padding : 0;
              margin : 0;
              border  : 0;
            }
          }
        }
        .set{
          width : 0.7rem ;
          height : 0.28rem ;
          margin : auto ;
          line-height : 0.28rem ;
          padding : 0;
          border : 1px solid #eaeaea ;
          border-radius : 0.07rem ;
          display : block ;
          text-align : center ;
          color : #1890FF;
        }
        .rightnow{
          background : #1890FF;
          color : #fff ;
        }
        .set:hover{
          background : #f3f3f3 ;
        }
        .rightnow:hover{
          background : rgba(18,90,256,0.8) ;
        }
      }
      .warn{
        td{
          color : #ff0331;
        }
      }

    }
    .el-dialog{
       .paynum{
         padding-left : 1.85rem ;
       }
      .tel{
        padding-left : 0.25rem ;
        height : 0.4rem ;
        line-height : 0.4rem ;
        display : block ;
        margin-bottom : 0.22rem ;
      }
      .tel2{
        padding-left : 0.02rem;
      }
      .nextBtn{
        padding: 0 1.28rem ;
      }
      .noipt{
        width : 100% ;
        height : 0.2rem ;
        line-height : 0.2rem ;
        font-size : 0.12rem ;
        color : #ff001f ;
      }
      /*.el-form-item__label{*/
        /*text-align : left ;*/
      /*}*/
      .getNum{
        width : 1.1rem ;
        margin-left : 0.3rem ;
        padding :  0.12rem 0.15rem;

      }
      .el-input{
        width : 2rem ;
      }
      /*}*/

    }
  }
</style>
