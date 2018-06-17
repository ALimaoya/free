<template>
  <div class="search">
    <el-select v-if="platformType" size="small" clearable v-model="order.platformType" @change="flow&&getShop()" filterable placeholder="请选择试用平台">
      <el-option
        v-for="item in platformOptions"
        :key="item.value"
        :label="item.name"
        :value="item.value">
      </el-option>
    </el-select>
    <el-select v-if="activityType" size="small" clearable v-model="order.EQ_activityType" filterable placeholder="请选择试用类型">
      <el-option
        v-for="item in activityTypeList"
        :key="item.value"
        :label="item.name"
        :value="item.value">
      </el-option>
    </el-select>

    <el-input v-if="activityCode" size="small" :maxlength="20" v-model.trim="order.activityCode" placeholder="请输入活动编号"></el-input>
    <el-input v-if="thirdOrderCode" size="small" :maxlength="20" v-model.trim="order.thirdOrderCode" placeholder="请输入第三方订单编号"></el-input>
    <!--试用活动任务状态-->
    <el-select v-if="activityStatus" size="small" clearable v-model="order.EQ_activityStatus" filterable placeholder="请选择活动状态">
    <el-option
    v-for="item in activityOptions"
    :key="item.value"
    :label="item.name"
    :value="item.value">
    </el-option>
    </el-select>
    <!--试用活动订单状态-->
    <el-select v-if="eq_status" clearable size="small"  v-model="order.EQ_status" filterable placeholder="请选择订单状态">
      <el-option
        v-for="item in orderOptions"
        :key="item.value"
        :label="item.name"
        :value="item.value">
      </el-option>
    </el-select>
    <el-button v-if="activity&&!date" size="small" type="primary" round  @click="getList()" class="searchOrder" >查询</el-button>
    <el-select v-if="activityShop" clearable size="small"  v-model="order.EQ_activityShop"  filterable placeholder="请选择店铺">
      <el-option
        v-for="item in shopList"
        :key="item.id"
        :label="item.name"
        :value="item.id">
      </el-option>
    </el-select>
    <!--流量任务状态-->
    <el-select v-if="taskStatus" size="small" clearable v-model="order.EQ_activityStatus" filterable placeholder="请选择任务状态">
      <el-option
        v-for="item in taskOptions"
        :key="item.value"
        :label="item.name"
        :value="item.value">
      </el-option>
    </el-select>
    <!--流量订单状态-->
    <el-select v-if="flowStatus" size="small" clearable v-model="order.EQ_status" filterable placeholder="请选择订单状态">
      <el-option
        v-for="item in flowOptions"
        :key="item.value"
        :label="item.name"
        :value="item.value">
      </el-option>
    </el-select>

    <div class="block" v-if="flow||date">
      <span class="demonstration">选择日期：</span>
      <el-date-picker format="yyyy - MM - dd " value-format="yyyy-MM-dd" size="small"
                      v-model="order.GT_activityEndTime" clearable type="date"
                      placeholder="开始时间" >
      </el-date-picker>
      <span class="demonstration2">~</span>
      <el-date-picker size="small" v-model="order.LT_activityStartTime"  clearable
                      type="date" format="yyyy - MM - dd " value-format="yyyy-MM-dd"
                      placeholder="结束日期">
      </el-date-picker>
      <el-button  size="small" type="primary" round @click="getList()" class="searchOrder">搜索</el-button>

    </div>
    <!--<div class="note" v-if="!flow">备注：以上搜索条件可根据单一条件进行搜索，当单独试客淘宝号搜索不到有用信息时，可尝试输入淘宝订单编号，反之亦然</div>-->

  </div>

</template>

<script>
  // import {  getActivity ,getDetail ,getOrderList } from '@/api/activity'
  import { getShopList  } from "@/api/activity";

  export default {
        name: "index",
      data(){
          return {
            order:{
              EQ_status: '',
              // thirdAccount: '',
              platformType : '' ,
              activityCode : '',
              thirdOrderCode: '',
              GT_activityEndTime : '',
              LT_activityStartTime : '',
              EQ_activityType:'',
              EQ_activityStatus : ''
            },
            platformOptions : [
              {
                value: '',
                name : '全部平台'
              },
              {
                value: '1',
                name : '淘宝'
              },
              {
                value : '2',
                name : '天猫'
              },
              {
                value : '3',
                name : '京东'
              },
              // {
              //   value : '4',
              //   name : '拼多多'
              // }
            ],    //平台类型
            orderOptions : [
              {
                name : '全部状态',
                value : ''
              },
              {
                name : '待开奖',
                value : '1'
              },
              {
                name : '未中奖',
                value : '2'
              },

              {
                name : '中奖待领取',
                value : '3'
              },
              {
                name : '领奖审核中',
                value : '4'
              },
              {
                name : '待评价',
                value : '5'
              },  {
                name : '评价审核中',
                value : '6'
              },
              {
                name : '中奖已取消',
                value : '7'
              },
              {
                name : '领奖审核拒绝',
                value : '8'
              },
              {
                name : '评价审核拒绝',
                value : '9'
              },
              // {
              //   name : '投诉处理中',
              //   value : '10'
              // },
              {
                name : '订单失败',
                value : '11'
              },
              {
                name : '结算中',
                value : '12'
              },
              {
                name : '已完成',
                value : '99'
              }
            ],      //试用活动订单状态
            activityOptions : [
              {
                name : '全部试用活动状态',
                value : ''
              },
              {
                name : '待支付',
                value : '14'
              },
              // {
              //   name : '待付款',
              //   value : '1'
              // },
              {
                name : '待审批',
                value : '2'
              },
              {
                name : '审批通过',
                value : '3'
              },
              {
                name : '审批拒绝',
                value : '4'
              },
              {
                name : '待开始',
                value : '11'
              },
              {
                name : '进行中',
                value : '12'
              },
              {
                name : '已结束',
                value : '13'
              },
              {
                name : '已下架',
                value : '6'
              },
              {
                name : '结算中',
                value : '7'
              },
              {
                name : '已完成',
                value : '9'
              },
              {
                name : '已取消',
                value : '10'
              }
            ], //试用活动任务状态
            taskOptions:[
              {
                name : '全部状态',
                value : ''
              },
              {
                name : '待支付',
                value : '14'
              },
              {
                name : '待开始',
                value : '11'
              },
              {
                name : '进行中',
                value : '12'
              },
              {
                name : '已结束',
                value : '13'
              },
              {
                name : '下架',
                value : '6'
              },
              {
                name : '申请结算',
                value : '7'
              },
              {
                name : '结算成功',
                value : '9'
              },

            ] ,   //流量任务状态
            flowOptions :[
              {
                value : '',
                name : '全部订单状态'
              },
              {
                value : '3',
                name : '已接单'
              },
              {
                value : '4',
                name : '审核中'
              },
              {
                value :'11',
                name : '失败'
              },
              {
                value : '99',
                name : '已完成'
              }
            ],  //流量任务订单状态
            activityTypeList:[
              {
                value : '',
                name : '全部试用'
              },
              {
                value : '1',
                name : '超级试用'
              },
              {
                value : '3',
                name : '拼团试用'

              }
            ],  //试用类型
            shopList : [],
            activityMode : this.activity ,
            searchDate : this.date ,
            flowMode : this.flow
            // currentPage : 1 ,
            // pageSize : 10 ,
            // totalPages : '',
            // totalElements : 0 ,
          }
      },
      props : ['platformType','activityCode','activityType','thirdOrderCode','eq_status','activity','activityShop','activityStatus','taskStatus','flowStatus','flow','date'],
      mounted(){
        this.getShop();
      },
      methods : {
        //获取店铺列表
        getShop(){
          // let formData = new FormData();
          // formData.append('EQ_platformType' , this.order.platformType);
          // formData.append('EQ_status','2');
          // formData.append('currentPage' ,'2');
          // formData.append('pageSize' , this.pageSize);
          // formData.append('EQ_payStatus','1');
          getShopList(this.order.platformType).then( res => {

            if(res.data.status === '000000000'){
              this.shopList = res.data.data ;

            }
          }).catch(err => {
            alert('服务器开小差啦，请稍等~')
          })
        },
        //  获取搜索条件内容
        getList(){
          let searchobj = {
            platformType : this.order.platformType,
            activityCode : this.order.activityCode ,
            thirdOrderCode : this.order.thirdOrderCode,
            EQ_status : this.order.EQ_status

          // EQ_activityType : this.order.EQ_activityType
        };

          if(this.activityMode){
            searchobj.EQ_activityType = this.order.EQ_activityType ;
            if(this.searchDate){
              searchobj.GT_activityEndTime = this.order.GT_activityEndTime;
              searchobj.LT_activityStartTime = this.order.LT_activityStartTime;
              searchobj.EQ_activityStatus = this.order.EQ_activityStatus ;

            }
            if(this.activityMode === 'bonus'){

              searchobj.EQ_status = '4'
            }else if(this.activityMode === 'view'){
              searchobj.EQ_status = '6';

            }

          }
          if(this.flowMode){
            if(this.order.EQ_activityShop !== undefined){
              searchobj.EQ_activityShop =this.order.EQ_activityShop ;
            }else{
              searchobj.EQ_activityShop = '' ;

            }
            // searchobj.thirdOrderCode = this.order.thirdOrderCode ;
            searchobj.activityStartTime = this.order.GT_activityEndTime ;
            searchobj.activityEndTime = this.order.LT_activityStartTime ;
            searchobj.EQ_activityType = '4' ;
              if(this.flowMode === 'flowTask'){
              searchobj.EQ_activityStatus = this.order.EQ_activityStatus ;
            }
            if(this.flowMode === 'checkFlow'){
              searchobj.EQ_status = '4'

            }
          }
          this.$emit('searchobj',searchobj);

        },
      }

    }
</script>

<style scoped lang="scss" rel="stylesheet/scss">

  @import '../../styles/search';
</style>
