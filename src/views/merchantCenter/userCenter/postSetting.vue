<template>
  <div class="postSetting">
    <!--<div class="top">-->
      <h1>运费设置<el-button type="primary" size="mini" @click="newRule">新增运费规则</el-button></h1>
    <!--</div>-->
    <el-form :model="form" ref="form" label-position="left" :rules="formRule" >
      <ul >
        <li v-for="(item ,index) in form.post" :key="index">
          <el-form-item    label="" prop="goodsNum">
            满<el-input class="inputInfo"  size="small" :maxLength="10" type="number" v-model.number="item.goodsNum"  ></el-input>件，
          </el-form-item>
          <el-form-item     label="" prop="money">
            运费<el-input class="inputInfo" :maxLength="3" size="small" type="number" v-model.number="item.money" ></el-input>元
          </el-form-item>
          <el-form-item class="btnWrap">
            <el-button  type="primary" size="mini" @click="deleteRule(item)">删除</el-button>
          </el-form-item>
        </li>
      </ul>
      <el-form-item class="btnWrap">
        <el-button  type="primary" size="mini" @click="submitForm('form')">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
    import ElFormItem from "element-ui/packages/form/src/form-item";

    export default {
      components: {ElFormItem},
      name: "post-setting",
      data(){
        return{
          form : {
            post : [
              {
                goodsNum : '',
                money: ''
              }
            ]
          },
          formRule : {
            goodsNum : [
              {
                required : true ,trigger : 'blur',message : '请填写满足商品件数'
              }
            ],
            money : [
              {
                required : true ,trigger : 'blur',message : '请填写运费'
              }
            ],
          }
        }
      },
      methods : {
        submitForm(formName){
          console.log(this.form)
          this.$refs[formName].validate((valid) => {
            if(valid){

            }else{

            }
          })
        },
        newRule(){
          if (this.form.post.length < 5) {
            this.form.post.push({
              'goodsNum': '',
              'money': '',

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
          let index = this.form.post.indexOf(item);
          if (index !== -1 && this.form.post.length > 1) {
            this.form.post.splice(index, 1)
          }
        }
      }
    }
</script>


<style scoped lang="scss" rel="stylesheet/scss">
  @import '../../../styles/step';
  /*.top{*/
    /*border-bottom*/
    h1{
      /*width : 50% ;*/
      /*border : 0;*/
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
          width :30% ;

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
