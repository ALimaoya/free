<template>
    <div class="choose-date">
        <h1 class="h_title">选择活动日期</h1>
        <div class="content">
            <div class="left">
                <el-date-picker v-model="activity.date" value-format="yyyy-MM-dd" type="date" placeholder="选择日期">
                </el-date-picker>
            </div>
            <div class="right">
                <h1>选择秒杀时段</h1>
                <el-radio-group v-model="activity.time">
                    <el-radio :label="item.id" v-for="(item,index) in timeList" :key="index">{{ item.name }}</el-radio>

                </el-radio-group>
                <div class="condition">
                    <p>报名时间：活动开始前第16天-活动开始前2天，报名时间一共14天</p>
                    <div class="button">
                        <el-button size="mini"  :type="statusList[0].type">{{ statusList[0].name }}</el-button>
                    </div>
                </div>
                <el-button type="primary" @click="goShop">下一步，选择报名商品</el-button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "choose-date",
        data() {
            return {
              activity:{
                date : '',
                time : '',
              },
              timeList: [],
              statusList: [
                {
                  name : '进行中',
                  type : 'danger'
                },
                {
                  name : '报名中',
                  type: 'success'
                },
                {
                  name : '已结束',
                  type : 'info'
                }
              ]
            }
        },
        mounted() {
        },
        methods: {
            goShop(){
                this.$emit('getContent', 'signContent')
            }
        }
    }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
.choose-date{
  padding : 0.2rem ;
  width : 100% ;
  box-sizing: border-box;
  .content{
    margin-top: 0.4rem;
    display: flex;
    .left{
        width: 35%;
    }
    .right{
        width: 65%;
        border: 1px solid #ccc;
        padding : 0.2rem ;
        box-sizing: border-box;
        h1{
        margin-bottom : 1rem ;
        padding : 0.2rem  0 ;
        border-bottom : 1px solid #999 ;
        font-size : 0.24rem ;
        line-height : 0.3rem ;
        text-align: center;
        }
        .el-radio-group{
            width: 100%;
            margin-bottom: 0.6rem;
            .el-radio{
                width: 20%;
                text-align: center;
                margin-left: 0;
            }
        }
        .condition{
            width: 100%;
            height: 100px;
            display:flex;
            p{
                width: 75%;
                font-size : 0.18rem ;
                line-height: 90px;
                padding : 0.2rem ;
                box-sizing: border-box;
            }
            .button{
                width: 25%;
            }
        }
        .el-button{
            margin: 0.6rem auto;
            display: block;
        }
    }
  }
}
</style>
