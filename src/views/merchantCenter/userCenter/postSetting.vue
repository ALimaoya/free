<template>
  <div class="postSetting activityTable">
    <!--<div class="top">-->
      <h1 class="h_title">运费设置<el-button type="primary" size="mini" @click="newRule">新增运费规则</el-button></h1>
    <!--</div>-->
    <el-form :model="carriageForm" ref="carriageForm" label-position="left">
      <ul >
        <li v-for="(item ,index) in carriageForm.regulation" :key="index">
          
          <el-form-item :prop="'regulation.' + index + '.reachQuantity'"
                          :rules="{
                                    required: true, message: '件数不能为空', trigger: 'blur'
                                  }">
              满<el-input class="inputInfo" size="small" type="number" v-model="item.reachQuantity"></el-input>件
          </el-form-item>

          <el-form-item :prop="'regulation.' + index + '.carriageAmount'"
                          :rules="{
                                    required: true, message: '运费不能为空', trigger: 'blur'
                                  }">
              运费<el-input class="inputInfo" size="small" type="number" v-model="item.carriageAmount"></el-input>元
          </el-form-item>

          <el-form-item class="btnWrap">
            <el-button  type="primary" size="mini" @click="deleteRule(item.id)">删除</el-button>
          </el-form-item>
        </li>
      </ul>
      <el-form-item class="btnWrap">
        <el-button  type="primary" size="mini" @click="submitForm('carriageForm')">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
    import {  int } from '@/utils/validate'
    import ElFormItem from "element-ui/packages/form/src/form-item";
    import { carriageList , deleteCarriage,  addCarriage } from "@/api/userCenter"
    export default {
      components: {ElFormItem},
      name: "post-setting",
      data(){
        const int = ( rule,value,callback) => {
          if(value === ''){
            callback(new Error('请输入运送货物的件数'))
          }else{
            console.log('valur',value)
            let reg = /^[1-9][0-9]*$/
            if (!reg.test(value)) {
              callback(new Error('货物件数只能为大于0的整数'))
            }
            callback();
          }
        }
        const int1 = ( rule,value,callback) => {
          if(value === ''){
            callback(new Error('请输入运费'))
          }else{
            if (!/^[1-9][0-9]*$/.test(value)) {
              callback(new Error('运费为大于0的整数'))
            }
            callback();
          }
        }
        return{
          carriageForm : {
            regulation:[
              {id:'',reachQuantity:'',carriageAmount:''}
            ]


          }
            
          
        }
      },
      mounted(){
        this.getCarriage();
      },
      methods : {
        getCarriage(){
          carriageList().then( res => {
            console.log('data',res)
            if(res.data.status === "000000000"){
              if(res.data.data.length >0){
                this.carriageForm.regulation= res.data.data
              }
            }
          })
        },
        submitForm(formName){
          // console.log(this.carriageForm)
          this.$refs[formName].validate((valid) => {
            if(valid){
              addCarriage(this.carriageForm.regulation).then( res => {
                console.log(res)
                if(res.data.status == "000000000"){
                  this.$message({
                    message: res.data.message,
                    center: true,
                    type: 'success'
                  })
                }
              })
            }else{
                this.$message({
                    message: res.data.message,
                    center: true,
                    type: 'error'
                  })
            }
          })
        },
        newRule(){
          if (this.carriageForm.regulation.length < 5) {
            this.carriageForm.regulation.push({
              'id':'',
              'reachQuantity': '',
              'carriageAmount': '',

            })

          } else {
            this.$message({
              message: '您添加的运费规则太多啦，不能再加啦~',
              center: true,
              type: 'error'
            })
          }
        },
        deleteRule(item){
          console.log(item)
          let index = this.carriageForm.indexOf(item);
          if (index !== -1 && this.carriageForm.post.length > 1) {
            this.carriageForm.splice(index, 1)
          }
          deleteCarriage(item).then( res => {
            if(res.data.message === '000000000'){

            }else{
              this.$message({
                message : res.data.message ,
                center : true ,
                type : 'error'
              })
            }
          }).catch(err => {

          })
        }
      }
    }
</script>


<style scoped lang="scss" rel="stylesheet/scss">
  @import '../../../styles/step';
  @import '../../../styles/activityTable';

  /*.top{*/
    /*border-bottom*/
    h1{
      height : 0.7rem ;
      .el-button{
        float : right ;

      }
    }

  /*}*/
  .el-form{
    width : 60% ;
    margin-top : 0.5rem ;

    ul{
      width : 100% ;
      display: flex;
      flex-direction: column;
      li{
        width :100% ;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        .el-form-item{
          width :20% ;

          /*justify-content: center;*/
          margin-left : 0.6rem ;
          .inputInfo{
            width : 50% ;
            margin : 0 0.1rem ;


          }

        }
      }
    }
    /*justify-content: flex-start;*/

    .btnWrap{
      margin : 0 0.9rem;
    }

  }
</style>
