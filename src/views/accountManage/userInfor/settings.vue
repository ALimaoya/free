<template>
  <div class="settings">
    <h1 class="title">基本设置</h1>
    <table border="1" bordercolor="#aaa">
      <tr>
        <td>登录密码</td>
        <td>互联网账号存在被盗号风险，建议您定期修改密码以保证账号安全</td>
        <td>
          <span class="set" @click="changeSetting('1')">修改</span>
        </td>
      </tr>
      <tr>
        <td>支付密码</td>
        <td>设置密码后开启提现功能，可将平台资产转出</td>
        <td>
          <span class="set rightnow" @click="setting" v-if="!user.bindPayPassword">立即设置</span>
          <span class="set " v-else @click="changeSetting('2')" >修改</span>
        </td>
      </tr>
      <tr class="warn">
        <td>联系方式</td>
        <td>完善以下信息有助于平台及时联系您</td>
        <td></td>
      </tr>
      <tr v-for="item in contactType">
        <td>{{item.type}}</td>
        <td>{{item.value}}</td>
        <td>
          <span class="set rightnow" @click="setting(item.type)" v-if="item.value==''||!item.value">立即设置</span>
          <span class="set" v-else @click="changeSetting(item.type)">修改</span>
        </td>
      </tr>

      <tr>
        <td>手机</td>
        <td class="telTips">{{ this.user.mobile }}
          <!-- <span @click="tips">
            <el-popover ref="popover" placement="bottom" title="说明" width="300" trigger="click" content="此手机号默认为注册手机号，修改之后将使用新手机号作为登录号码">
            </el-popover>
            <el-button class="tipBox" slot="reference" v-popover:popover></el-button>
          </span> -->
        </td>
        <td></td>
        <!-- <td><span class="set" @click="changeSetting('手机')">修改</span></td> -->
      </tr>
    </table>
    <!--设置/修改支付密码-->
    <el-dialog :title="pswType" width="750px" :visible.sync="pswVisible" center :before-close="close">
      <el-form ref="pswForm" :model="pswForm" :rules="pswRule">
        <div class="phoneNum">
          <p class="tel" style="width : 182px">绑定手机号：</p>
          <span>{{ user.mobile}}</span>
        </div>
        <el-form-item label="验证码：" style="width:508px ;"  label-width="178px" prop="pswVerify">
          <el-input placeholder="请输入验证码" v-model.trim="pswForm.pswVerify"></el-input>
          <el-button class="getNum" @click="getNum" style="padding: 0;line-height: 0.4rem;text-align:center;font-size:0.12rem;" :disabled="disabled">{{ btntext }}</el-button>
        </el-form-item>
        <el-form-item label="支付密码：" style="width:480px ;height:40.5px;"  :label-width="formLabelWidth" prop="payPsw">
          <el-input class="pswIpt" :type="pwdType1" placeholder="请输入六位数字支付密码" v-model.trim="pswForm.payPsw"></el-input>
          <!--<div class="getNum" style="width : 1.5rem ;float : right ;"></div>-->
          <span class="show-pwd" @click="showPwd('1')">
            <svg-icon v-if="pwdType1==='password'" icon-class="eyeclose"></svg-icon>
            <svg-icon icon-class="eyeopen" v-else="pwdType1===''" ></svg-icon>
          </span>
        </el-form-item>
        <el-form-item label="确认支付密码：" style="width:480px ;height:40.5px;"  :label-width="formLabelWidth" prop="payPsw2">
          <el-input class="pswIpt" :type="pwdType2" placeholder="请再次确认支付密码" v-model.trim="pswForm.payPsw2"></el-input>
          <!--<div class="getNum" style="width : 1.5rem ;float : right ;"></div>-->
          <span class="show-pwd" @click="showPwd('2')">
            <svg-icon v-if="pwdType2==='password'" icon-class="eyeclose"></svg-icon>
            <svg-icon icon-class="eyeopen" v-else="pwdType2===''" ></svg-icon>
          </span>
        </el-form-item>
        <el-form-item class="paynum" style="margin-top:10px">
          <el-button type="primary" @click="onSubmitPsw('pswForm')" style="margin-right:50px">确 认</el-button>
          <el-button @click="cancel('pswForm')">取 消</el-button>
          <div class="getNum" style="width : 1.1rem ;float : right ;"></div>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--修改登录密码-->
    <el-dialog title="修改登录密码" width="750px" :visible.sync="dialogFormVisible" center :before-close="close">
      <el-form :model="changePsw" width="696px" ref="changePsw" :rules="changePswRules">
        <div class="phoneNum">
          <p class="tel">绑定手机号：</p>
          <span>{{ user.mobile}}</span>
        </div>
        <el-form-item label="验证码：" style="width : 495px;" :label-width="formLabelWidth"   prop="pswVerify">
          <el-input placeholder="请输入验证码" v-model.trim="changePsw.pswVerify"></el-input>
          <el-button class="getNum" @click="getNum" style="padding: 0;line-height: 0.4rem;text-align:center;font-size:0.12rem;" :disabled="disabled">{{ btntext }}</el-button>
        </el-form-item>
        <el-form-item label="新密码：" style="width : 495px;height:40.5px;" :label-width="formLabelWidth" prop="newPsw">
          <el-input class="pswIpt" :type="pwdType1" placeholder="请输入新密码" v-model.trim="changePsw.newPsw"></el-input>
          <!--<div class="getNum" style="width : 1.1rem ;float : right ;"></div>-->
          <span class="show-pwd" @click="showPwd('1')">
            <svg-icon icon-class="eyeclose" v-if="pwdType1==='password'" ></svg-icon>
            <svg-icon v-else="pwdType1===''" icon-class="eyeopen"></svg-icon>
          </span>
          <p class="blank"></p>
        </el-form-item>
        <el-form-item label="确认新密码：" style="width : 495px;height:40.5px;" :label-width="formLabelWidth" prop="checkPsw">
          <el-input class="pswIpt" :type="pwdType2" placeholder="请再次确认新密码" v-model.trim="changePsw.checkPsw"></el-input>
          <!--<div class="getNum" style="width : 1.1rem ;float : right ;"></div>-->
          <span class="show-pwd" @click="showPwd('2')">
            <svg-icon v-if="pwdType2==='password'" icon-class="eyeclose"></svg-icon>
             <svg-icon icon-class="eyeopen" v-else="pwdType2===''" ></svg-icon>
          </span>
          <p class="blank"></p>

        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onSubmit('changePsw')">确 定</el-button>
        <el-button @click="cancel('changePsw')">取 消</el-button>
      </div>
      <!--</div>-->
    </el-dialog>
    <!--设置||修改qq/微信/email-->
    <el-dialog :title="concatType" :visible.sync="contactVisible" center width="500px" top="18%" :before-close="close">
      <!---->
      <el-form :model="QQ" :rules="QQrule" ref="QQ" v-if="ways==='QQ'" class="contactInfo">
        <el-form-item :label="labelname" label-width="95px" prop="qqNum">
          <el-input placeholder="请输入内容" v-model.trim="QQ.qqNum"></el-input>
        </el-form-item>
      </el-form>
      <el-form :model="wx" :rules="wxRule" ref="wx" v-else-if="ways==='wx'" class="contactInfo">
        <el-form-item :label="labelname" label-width="95px" prop="wechat">
          <el-input placeholder="请输入内容" v-model.trim="wx.wechat"></el-input>
        </el-form-item>
      </el-form>
      <el-form :model="email" :rules="emailRule" ref="email" v-else-if="ways==='email'" class="contactInfo">
        <el-form-item :label="labelname" label-width="95px" prop="emailStr">
          <el-input placeholder="请输入内容" v-model.trim="email.emailStr"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onSubmitCon(ways)">确 定</el-button>
        <el-button @click="cancel(ways)">取 消</el-button>
      </div>
      <!--</div>-->
    </el-dialog>
    <!--修改手机号-->
    <!--<el-dialog :title="phonetitle" :visible.sync="phoneVisible" center top="18%">-->
      <!--<el-form v-if="oldNumber" :model="verifyForm" ref="verifyForm" :rules="verifyRules" class="phoneBox">-->
        <!--<p class="tel tel2">验证原绑定手机号码：{{user.mobile}}</p>-->
        <!--<el-form-item label="验证码：" prop="oldnum">-->
          <!--<el-input v-model="verifyForm.oldnum" placeholder="请输入验证码"></el-input>-->
          <!--<el-button class="getNum" @click="getNum" :disabled="disabled">{{btntext}}</el-button>-->
        <!--</el-form-item>-->
        <!--<el-form-item class="nextBtn">-->
          <!--<el-button type="primary" @click="next('verifyForm')">下一步</el-button>-->
          <!--<el-button @click="cancel('verifyForm')">取&nbsp;&nbsp;&nbsp;&nbsp;消</el-button>-->
        <!--</el-form-item>-->
      <!--</el-form>-->
      <!--<el-form ref="phoneForm" :model="phoneForm" :rules="phoneRule" v-else-if="newNumber" class="phoneBox">-->
        <!--<el-form-item label="新手机：" prop="newnumber">-->
          <!--<el-input v-model.trim="phoneForm.newnumber" placeholder="请输入手机号"></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="验证码：" prop="verify">-->
          <!--<el-input v-model="phoneForm.verify" placeholder="请输入验证码"></el-input>-->
          <!--<el-button class="getNum" @click="getNum" :disabled="disabled">{{btntext}}</el-button>-->
        <!--</el-form-item>-->
        <!--<el-form-item class="nextBtn">-->
          <!--<el-button type="primary" @click="onsubmitTel('phoneForm')">确&nbsp;&nbsp;&nbsp;&nbsp;定</el-button>-->
          <!--<el-button @click="cancel('phoneForm')">取&nbsp;&nbsp;&nbsp;&nbsp;消</el-button>-->
        <!--</el-form-item>-->
      <!--</el-form>-->

    <!--</el-dialog>-->
  </div>
</template>

<script>
  import ElButton from "element-ui/packages/button/src/button";
  import {
    validateWX,
    validatePhone,
    validQQ,
    validateEmail,
    validPassWord,
    validateCode
  } from '@/utils/validate'
  import ElFormItem from "element-ui/packages/form/src/form-item";
  import {
    getThirdAccount,
    setThirdAccount,
    editLoginPsw,
    getCaptcha,
    editPayPsw
  } from "@/api/userInfor"

  export default {
    name: "settings",
    components: {
      ElFormItem,
      ElButton,
    },
    data() {
      const validateQQ = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入QQ号'))

        } else {
          if (!validQQ(value)) {
            callback(new Error('请输入正确格式的QQ号'))
          }
          callback();
        }
      };
      const validateWx = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入微信号'))
        } else {
          if (!validateWX(value)) {
            callback(new Error('请输入正确格式的微信号'))
          }
          callback();
        }

      };
      const validateEml = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入邮箱地址'))
        } else {
          if (!validateEmail(value)) {
            callback(new Error('请输入正确格式的邮箱'))
          }
          callback();
        }

      };
      const validateYZM = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入验证码'))
        } else {
          if (!validateCode(value)) {
            callback(new Error('验证码有误，请重新输入'))
          } else {
            callback();
          }

        }
      };
      const validateTel = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入手机号'))
        } else {
          if (!validatePhone(value)) {
            callback(new Error('请输入正确格式的手机号'))
          }
          callback();

        }
      };
      const validPsw = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入新密码'))
        } else {
          if (rule.field === 'payPsw') {
            if (!validateCode(this.pswForm.payPsw)) {
              callback(new Error('请输入6位数字组合的支付密码'))
            } else {
              if (this.pswForm.payPsw2 !== '') {
                this.$refs.pswForm.validateField('payPsw2')
              }
            }
            callback();
          } else if (rule.field === 'newPsw') {
            // console.log(this.changePsw)
            // console.log(validPassWord(this.changePsw.checkPsw))
            if (!validPassWord(this.changePsw.newPsw)) {
              callback(new Error('密码应为为8-16位的数字、字母组合'))
            } else {
              this.$refs.changePsw.validateField('checkPsw')
            }
            callback();
          }
        }
      };
      const validPsw2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入新密码'))
        } else {
          if (rule.field === 'payPsw2') {
            if (this.pswForm.payPsw !== value) {
              callback(new Error('两次输入的密码不一致，请重新确认后再次输入'))
            } else {
              callback();
            }
          } else if (rule.field === 'checkPsw') {
            if (this.changePsw.newPsw !== value) {
              callback(new Error('两次输入的密码不一致，请重新确认后再次输入'))
            } else {
              callback();
            }
          }
        }

      };
      return {
        telTips: false,
        popover: false,
        dialogFormVisible: false,
        contactVisible: false,
        formLabelWidth: '165px',
        pswVisible: false,
        pswForm: {
          payPsw: '',
          payPsw2: '',
          pswVerify: '',
        },
        pswRule: {
          payPsw: [{
            validator: validPsw,
            trigger: 'blur',
            required: true
          }],
          payPsw2: [{
            validator: validPsw2,
            trigger: 'blur',
            required: true
          }],
          pswVerify: [{
            validator: validateYZM,
            trigger: 'blur',
            required: true
          }],
        },
        pswType: '设置登录密码',
        changePsw: {
          pswVerify: '',
          newPsw: '',
          checkPsw: '',
        },
        changePswRules: {
          pswVerify: [{
            validator: validateYZM,
            trigger: 'blur',
            required: true
          }],
          newPsw: [{
            validator: validPsw,
            trigger: 'blur',
            required: true
          }],
          checkPsw: [{
            validator: validPsw2,
            trigger: 'blur',
            required: true
          }],

        },
        concatType: '',
        ways: '',
        contactType: [{
            type: 'QQ',
            value: '',
          },
          {
            type: '微信',
            value: '',
          },
          {
            type: '邮箱',
            value: '',
          }
        ],
        QQ: {
          qqNum: ""
        },
        wx: {
          wechat: ''
        },
        email: {
          emailStr: ''
        },
        labelname: '',
        QQrule: {
          qqNum: [{
            validator: validateQQ,
            trigger: 'blur',
            required: true
          }]
        },
        wxRule: {
          wechat: [{
            validator: validateWx,
            trigger: 'blur',
            required: true
          }]
        },
        emailRule: {
          emailStr: [{
            validator: validateEml,
            trigger: 'blur',
            required: true
          }]
        },
        // phonetitle: '修改已绑定的手机号码',
        oldNumber: false,
        newNumber: false,
        phoneVisible: false,
        phoneForm: {
          newnumber: '',
          verify: ''
        },
        // phoneRule: {
        //   newnumber: [{
        //     validator: validateTel,
        //     trigger: 'blur',
        //     required: true
        //   }],
        //   verify: [{
        //     validator: validateYZM,
        //     trigger: 'blur',
        //     required: true
        //   }]
        // },
        btntext: ' 获取验证码',
        isYZM: false,
        isWrong: false,
        // verifyForm: {
        //   oldnum: '',
        // },
        // verifyRules: {
        //   oldnum: [{
        //     validator: validateYZM,
        //     trigger: 'blur',
        //     required: true
        //
        //   }]
        // },
        disabled: false,
        getNew: false,
        user: {
          mobile: '',
          qq: '',
          wechat: '',
          isBindPayPassword: false,
        },
        payPassword: '',
        pwdType1: 'password',
        pwdType2: 'password',



      }
    },
    created() {
      this.getThirdInfo();
    },
    methods: {
      tips() {
        this.telTips = true;
      },
      // 获取第三方账号信息
      getThirdInfo() {
        getThirdAccount().then(res => {
          this.user = res.data.data;
            this.contactType[0].value = this.user.qq;
            this.contactType[1].value = this.user.wechat;
            this.contactType[2].value = this.user.email;
        })
      },
      //设置支付密码/QQ/微信/邮箱弹窗
      setting(type) {
        if (type === 'QQ') {
          this.concatType = '设置绑定QQ号';
          this.labelname = 'QQ：';
          this.contactVisible = true;
          this.ways = 'QQ';

        } else if (type === '微信') {
          this.concatType = '设置绑定微信号';
          this.labelname = '微信：';
          this.contactVisible = true;
          this.ways = 'wx';

        } else if (type === '邮箱') {
          this.concatType = '设置绑定邮箱';
          this.labelname = '邮箱：';
          this.contactVisible = true;
          this.ways = 'email';

        } else {
          this.pswVisible = true;

        }
      },

      //修改密码/绑定手机号/联系方式
      changeSetting(index) {
        if (index === '1' ) {
          this.dialogFormVisible = true;

        }else if (index === '2') {
          this.pswVisible = true ;
          this.pswType = '修改支付密码'
        } else if (index === '手机') {
          this.oldNumber = true;
          this.phoneVisible = true;
        } else {
          this.contactVisible = true;
          if (index === 'QQ') {
            this.concatType = '修改绑定QQ号';
            this.labelname = '新的QQ：';
            this.ways = 'QQ';

          } else if (index === '微信') {
            this.concatType = '修改绑定微信号';
            this.labelname = '新的微信：';
            this.ways = 'wx';


          } else {
            this.concatType = '修改绑定邮箱';
            this.labelname = '新的邮箱：';
            this.ways = 'email';


          }
        }
        // this.changeBox =true ;
      },

      //设置/修改支付密码提交
      onSubmitPsw(formName) {
        // console.log(formName)
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let formdata = new FormData();
            formdata.append('captcha', this.pswForm.pswVerify);
            formdata.append('payPassword', this.pswForm.payPsw);
            editPayPsw(formdata).then(res => {
              if(res.data.status === '000000000'){
                this.$message({
                  message: '支付密码设置成功',
                  type: 'success',
                  center: true
                });
              }
                this.$refs[formName].resetFields();
                this.getThirdInfo();
                this.pswVisible = false;
                this.getNew = true ;
            })


          }
        })
      },

      //提交密码修改
      onSubmit(formName) {
        this.getNew = true;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let formdata = new FormData();
            formdata.append('password', this.changePsw.newPsw);
            formdata.append('captcha', this.changePsw.pswVerify);
              editLoginPsw(formdata).then(res => {
                if(res.data.status === '000000000'){
                  this.$message({
                    message : '登录密码已修改成功，请重新登录',
                    center : true ,
                    type : 'success'
                  });
                  setTimeout(() => {
                    this.$store.dispatch('LogOut').then(() => {
                      location.reload()
                    })
                  });

                }
              })

          }

        });
      },

      //提交QQ/微信/邮箱的修改
      onSubmitCon(ways) {
        this.$refs[ways].validate((valid) => {
          if (valid) {
            let _typeId = "";
            let _account = "";
            this.contactVisible = false;
            if (ways === 'QQ') {
              _account = this.QQ.qqNum;
              _typeId = '1';
            } else if (ways === 'wx') {
              _account = this.wx.wechat;
              _typeId = '2'

            } else if (ways === 'email') {
              _account = this.email.emailStr;
              _typeId = '3'

            }
            let formdata = new FormData();
            formdata.append('account', _account);
            formdata.append('type', _typeId);
            setThirdAccount(formdata).then(res => {
              this.$message({
                  message: '修改成功',
                  type: 'success',
                  center: true
                });
                this.getThirdInfo();
                this.$refs[ways].resetFields();
            })

          }
        })
        // console.log(formName)
      },

      //校验手机号
      // onsubmitTel(formName) {
      //   this.$refs[formName].validate((valid) => {
      //     if (valid) {
      //       this.$message({
      //         message: '修改成功',
      //         type: 'success',
      //         center: true
      //       });
      //       this.phoneVisible = false;
      //       this.newNumber = false;
      //       this.user.mobile = this.phoneForm.newnumber;
      //       // console.log(this.phoneForm);
      //       this.$refs[formName].resetFields();
      //
      //     } else {
      //       this.$message({
      //         message: '提交失败',
      //         type: 'error',
      //         center: true
      //       });
      //       return false;
      //     }
      //   })
      //   // console.log(formName)
      // },

      //获取验证码
      getNum() {
        var num = 60;
        this.getNew = false;
        var timer = setInterval(() => {
          this.btntext = `重新发送(${num}s)`;
          num--;
          this.disabled = true;

          if (this.getNew == true || num === 0) {
            this.btntext = "获取验证码";
            clearInterval(timer);
            this.disabled = false;

          }

        }, 1000);
        getCaptcha().then(
          res => {
            if (res.data.status == '000000000') {
              this.$message({
                message: '短信验证码发送成功',
                type: 'success',
                center: true
              });
              return
            } else {
              clearInterval(timer);
              this.disabled = false;
            }
          }
        ).catch(err => {
          clearInterval(timer);
          this.disabled = false;
        })
      },

      //修改绑定手机号第一步：验证输入验证码
      // next(formName) {
      //   this.$refs[formName].validate((valid) => {
      //     if (valid) {
      //       this.getNew = true;
      //       setTimeout(() => {
      //         this.oldNumber = false;
      //         this.newNumber = true;
      //         this.phonetitle = '设置新手机号码';
      //         // console.log(this.newNumber)
      //       }, 500);
      //       this.$refs[formName].resetFields()
      //
      //     } else {
      //       return false;
      //     }
      //   })
      //
      // },

      //取消按钮关闭弹窗
      cancel(formName) {
        this.phoneVisible = false;
        this.newNumber = false;
        this.contactVisible = false;
        this.phonetitle = '修改已绑定的手机号码';
        this.pswVisible = false;
        this.dialogFormVisible = false;
        this.getNew = true;
        this.pwdType1 = "password";
        this.pwdType2 = "password";
        this.$refs[formName].resetFields()

      },

      //叉号关闭弹窗
      close() {
        this.pswVisible = false;
        this.dialogFormVisible = false;
        this.getNew = true;
      },

      showPwd(type) {
        if(type === '1'){
          if (this.pwdType1 === 'password') {
            this.pwdType1 = ''
          } else {
            this.pwdType1 = 'password'
          }
        }else{
          if (this.pwdType2 === 'password') {
            this.pwdType2 = ''
          } else {
            this.pwdType2 = 'password'
          }
        }

      },
    }
  }

</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .settings {
    width: 100%;
    margin: 0 auto;
    /*padding: 0.3rem 0.2rem;*/
    box-sizing: border-box;
    font-size: 0.15rem;
    color: #333;
    .el-dialog__headerbtn {
      display: none
    }
    .title {

      margin : 0 ;
      padding : 0.2rem  0.4rem ;
      border-bottom : 1px solid #666 ;
      font-size : 0.22rem ;
      line-height : 0.4rem ;

      /*width: 100%;*/
      /*height: 0.5rem;*/
      /*line-height: 0.5rem;*/
      /*text-indent: 0.3rem;*/
      /*font-size: 0.22rem;*/
      /*color: #333;*/
      /*font-weight: bold;*/
      /*border-bottom: 1px solid #aaa;*/

    }
    table {
      width: 95%;
      margin: 0.5rem auto;
      border-radius: 0.05rem;
      border-collapse: collapse;
      tr {
        height: 35px;
        line-height: 35px;

        td {
          &:nth-child(1) {
            width: 20%;
          }
          &:nth-child(2) {
            width: 45%;
          }
          &:nth-child(3) {
            width: 35%;
          }
          font-size: 0.14rem;
          color: #333;
          text-align: center;
          height: 100%;

        }
        .telTips {
          position: relative;

          span {
            position: absolute;
            top: 0;
            right: 0;
            width: 0.2rem;
            display: block;
            .tipBox {
              background: url('../../../assets/imgs/tips2.png') no-repeat center;
              background-size: 70%;
              width: 100%;
              height: 0.2rem;
              padding: 0;
              margin: 0;
              border: 0;
            }
          }
        }
        .set {
          width: 80px;
          height: 30px;
          margin: auto;
          line-height: 20px;
          padding: 5px;
          border: 1px solid #eaeaea;
          border-radius: 0.07rem;
          display: block;
          text-align: center;
          color: #1890FF;
        }
        .rightnow {
          background: #1890FF;
          color: #fff;
        }
        .set:hover {
          background: #f3f3f3;
        }
        .rightnow:hover {
          background: rgba(18, 90, 256, 0.8);
        }
      }
      .warn {
        td {
          color: #ff0331;
        }
      }

    }
    .el-dialog {
      .el-form {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
      .el-form-item{
        /*float: left;*/
      }

      .pswIpt {
        position: relative;
      }
      .show-pwd {
        position: absolute;
        left: 180px;
        top: 3px;
        font-size: 0.16rem;
        color: #889aa4;
        cursor: pointer;
        user-select: none;
      }
      .paynum {
        padding-left: 1.85rem;
      }
      .phoneNum {
        width: 505px;
        margin: 0 auto;
        p {
          width: 173px;
          float: left;
          text-align : right ;
          padding-right : 15px ;
        }
        span {
          width: 60%;
          /*float : right ;*/
          height: 40px;
          line-height: 40px;
          display: inline-block;
          color: #333;
        }
      }
      .tel {
        padding-left: 25px;
        height: 40px;
        line-height: 40px;
        display: block;
        margin-bottom: 22px;
      }
      .tel2 {
        padding-left: 2px;
      }
      /*.phoneBox {*/
        /*display: flex;*/
        /*align-items: center;*/
        /*.tel {*/
          /*width: 80%;*/
          /*text-align: left;*/
        /*}*/
        /*.el-form-item {*/
          /*width: 80%;*/
          /*!*margin : 0.1rem auto ;*!*/
          /*display: flex;*/
          /*flex-direction: row;*/
          /*!*justify-content: center;*!*/
        /*}*/

      /*}*/
      .nextBtn {
        display: flex;
        flex: 1;
        justify-content: center;
        flex-direction: row;
      }
      .noipt {
        width: 100%;
        height: 0.2rem;
        line-height: 0.2rem;
        font-size: 0.12rem;
        color: #ff001f;
      }
      /*.el-form-item__label{*/
      /*text-align : left ;*/
      /*}*/
      .getNum ,.blank{
        width: 100px;
        margin-left: 30px;
        padding: 12px 15px;
        line-height : 40px;
        height : 40px;
        box-sizing: border-box;
        float: right;

      }
      .contactInfo {
        .el-form-item {
          width: 80%;
        }
      }
      .el-input {
        width: 200px;
        height: 40px;

      }
      /*}*/
    }
  }

</style>
