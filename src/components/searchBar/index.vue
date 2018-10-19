<template>
  <div class="search">
    <el-select v-if="groupActivityType" size="small" clearable v-model="order.groupActivityType" @change="group&&getShop()" filterable placeholder="请选择试用平台">
      <el-option
        v-for="item in groupActivityTypeList"
        :key="item.value"
        :label="item.name"
        :value="item.value">
      </el-option>
    </el-select>
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

    <el-input v-if="activityCode" size="small" type="tel" :maxlength="20" v-model.trim="order.activityCode" @change="checkInput(order.activityCode,1)" clearable placeholder="请输入活动编号"></el-input>
    <el-input v-if="orderCode" size="small" type="tel" :maxlength="20" v-model.trim="order.orderCode" @change="checkInput(order.orderCode,2)" clearable placeholder="请输入订单编号"></el-input>
    <el-input v-if="thirdOrderCode" size="small" type="tel" :maxlength="20" v-model.trim="order.thirdOrderCode" @change="checkInput(order.thirdOrderCode,3)" placeholder="请输入第三方订单编号"></el-input>
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
    <el-select v-if="flowStatus || groupStatus" size="small" clearable v-model="order.EQ_status" filterable placeholder="请选择订单状态">
      <el-option
        v-for="item in flowOptions"
        :key="item.value"
        :label="item.name"
        :value="item.value">
      </el-option>
    </el-select>
    <div class="block" v-if="flowWay">
      <span>流量方式：</span>
      <el-checkbox-group v-model="order.LIKE_addServiceType" @change='getFlowWay'>
        <el-checkbox v-for="item in flowwayList" :label="item.id" :key="item.id">{{item.name}}</el-checkbox>
      </el-checkbox-group>
      <el-select v-model="order.LIKE_addServiceType2" size="small" :disabled="elseNumber">
        <el-option
          v-for="elseDotey in elseDoteys"
          :key="elseDotey.id"
          :label="elseDotey.val"
          :value="elseDotey.val">
        </el-option>
      </el-select>
      个
    </div>
    <div class="block" v-if="flow||date">
      <span class="demonstration">选择日期：</span>
      <el-date-picker  value-format="yyyy-MM-dd hh:mm:ss" size="small"
                      v-model="order.GT_activityEndTime" clearable type="datetime"
                      placeholder="开始时间" >
      </el-date-picker>
      <span class="demonstration2">~</span>
      <el-date-picker size="small" v-model="order.LT_activityStartTime"  clearable
                      type="datetime"  value-format="yyyy-MM-dd hh:mm:ss"
                      placeholder="结束时间">
      </el-date-picker>
      <!--<el-button v-if="activity&&!date" size="small" type="primary" round  @click="getList()" class="searchOrder" >查询</el-button>-->

    </div>
    <!--<div class="note" v-if="!flow">备注：以上搜索条件可根据单一条件进行搜索，当单独试客淘宝号搜索不到有用信息时，可尝试输入淘宝订单编号，反之亦然</div>-->
    <el-button  size="small" type="primary" round @click="getList()" class="searchOrder">搜索</el-button>

  </div>

</template>

<script>
  // import {  getActivity ,getDetail ,getOrderList } from '@/api/activity'
  import { getShopList  } from "@/api/activity";

  export default {
        name: "index",
      data(){
          return {
            flowwayList:[{id:'A',name:'浏览'},{id:'B',name:'收藏宝贝'},{id:'C',name:'关注店铺'},{id:'D',name:'加入购物车'},{id:'E',name:'浏览店内其他宝贝'}],
            elseDoteys:[{id:1,val:1},{id:2,val:2},{id:3,val:3}],
            elseDotey:'',
            order:{},
            groupActivityTypeList : [
              {
                value: '',
                name : '全部平台'
              },
              {
                value: '5',
                name : '淘抢购'
              },
              {
                value : '6',
                name : '聚划算'
              },
              {
                value : '7',
                name : '京东秒杀'
              },
            ],
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
              {
                name : '已取消',
                value : '10'
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
            flowMode : this.flow,
            groupMode : this.group,
            elseNumber:true,
            isActivity: this.activityCode,
            isOrder : this.orderCode
            // currentPage : 1 ,
            // pageSize : 10 ,
            // totalPages : '',
            // totalElements : 0 ,
          }
      },
      props : ['groupActivityType','platformType','activityCode','orderCode','activityType','thirdOrderCode','eq_status','activity','activityShop','activityStatus','taskStatus','flowStatus','groupStatus','flow','group','date','flowWay'],
      mounted(){
          if(this.activityMode === 'freeActivity'){
            this.order = this.$store.state.searchBar.approval.activity;
          }else if( this.activityMode === 'freeActivityOrder'){
            this.order = this.$store.state.searchBar.activityOrder.order;
          }else if( this.activityMode === 'bonus'){
            this.order = this.$store.state.searchBar.bonus.order;

          }else if(this.activityMode === 'view'){
            this.order = this.$store.state.searchBar.view.order;

          }
          if(this.flowMode === 'flowTask'){
            this.order = this.$store.state.searchBar.flow.activity;

          }else if( this.flowMode === 'flowOrder'){
            this.order = this.$store.state.searchBar.flowOrder.order;

          }else if( this.flowMode === 'checkFlow'){
            this.order = this.$store.state.searchBar.checkFlow.order;

          }
          if(this.groupMode === "groupActivity"){
            this.order = this.$store.state.searchBar.group.activity;
          }else if(this.groupMode === "groupOrder"){
            this.order = this.$store.state.searchBar.groupOrder.order;
          }

        this.getShop();
      },
      methods : {
        getFlowWay(val){
          if(val.indexOf("E") !== -1){
            this.elseNumber = false
          }
        },
        //获取店铺列表
        getShop(){
          let num = '';
          if(this.order.platformType !== ''){
            num = this.order.platformType
          }
          if(this.order.groupActivityType !== ''){
            if(this.order.groupActivityType === "5"){
              num = "1"
            }else if(this.order.groupActivityType === "6"){
              num = "2"
            }else if(this.order.groupActivityType === "7"){
              num = "3"
            }
          }
          getShopList(num).then( res => {
             this.shopList = res.data.data ;
          })
        },
        //  获取搜索条件内容
        getList(){
          //  判断时间范围是否正确
          if(this.order.LT_activityStartTime !== '' && this.order.LT_activityStartTime !== undefined && this.order.LT_activityStartTime !== null){
            // if(this.order.GT_activityEndTime === '' || this.order.GT_activityEndTime === undefined || this.order.GT_activityEndTime === null){
            //   this.$message({
            //     message: "请选择开始时间",
            //     type: "error",
            //     center: true
            //   });
            //   this.order.LT_activityStartTime = '';
            //   return false
            // }
            if(this.order.GT_activityEndTime !== '' && this.order.GT_activityEndTime !== undefined && this.order.GT_activityEndTime !== null){
              let start = (this.order.LT_activityStartTime).replace(/-/g, "/");
              let end = (this.order.GT_activityEndTime).replace(/-/g,"/");
              if(new Date(end).getTime()-0 > new Date(start).getTime()-0){
                this.$message({
                message: "结束时间不能小于开始时间",
                type: "error",
                center: true
              });
              this.order.LT_activityStartTime = '';
              this.order.GT_activityEndTime = '';
              return false
              }
            }
          }
          if(this.order.GT_activityEndTime !== '' && this.order.GT_activityEndTime !== undefined && this.order.GT_activityEndTime !== null){
            // if(this.order.LT_activityStartTime === '' || this.order.LT_activityStartTime === undefined || this.order.LT_activityStartTime === null){
            //   this.$message({
            //     message: "请选择结束时间",
            //     type: "error",
            //     center: true
            //   });
            //   this.order.GT_activityEndTime = '';
            //   return false
            // }
            if(this.order.LT_activityStartTime !== '' && this.order.LT_activityStartTime !== undefined && this.order.LT_activityStartTime !== null){
              let start = (this.order.LT_activityStartTime).replace(/-/g, "/");
              let end = (this.order.GT_activityEndTime).replace(/-/g,"/");
              if(new Date(end).getTime()-0 > new Date(start).getTime()-0){
                this.$message({
                message: "结束时间不能小于开始时间",
                type: "error",
                center: true
              });
              this.order.LT_activityStartTime = '';
              this.order.GT_activityEndTime = '';
              return false
              }
            }
          }
          let searchobj = {
            platformType : this.order.platformType,
            thirdOrderCode : this.order.thirdOrderCode,
            EQ_status : this.order.EQ_status,
            LIKE_addServiceType : this.order.LIKE_addServiceType,
            LIKE_addServiceType2 : this.order.LIKE_addServiceType2,
          // EQ_activityType : this.order.EQ_activityType
        };
          if (this.isActivity) {
            searchobj.activityCode = this.order.activityCode ;
          }
          if (this.isOrder) {
            searchobj.orderCode = this.order.orderCode ;
          }

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
          if(this.groupMode){
            if(this.groupMode === "groupActivity"){
              searchobj.EQ_activityStatus = this.order.EQ_activityStatus ;
            }
            if(this.order.EQ_activityShop !== undefined){
              searchobj.EQ_activityShop =this.order.EQ_activityShop ;
            }else{
              searchobj.EQ_activityShop = '' ;
            }
            searchobj.groupActivityType = this.order.groupActivityType ;
            searchobj.activityStartTime = this.order.GT_activityEndTime ;
            searchobj.activityEndTime = this.order.LT_activityStartTime ;
            searchobj.EQ_status = this.order.EQ_status ;
          }
          this.$emit('searchobj',searchobj);

        },
        //检查输入单号是否为数字
        checkInput(val,type){
          let reg = /^[0-9]+$/;
          if (!reg.test(val)) {
            this.$message({
              message: '请输入数字',
              type: 'error',
              center: true
            });
            if ( type ===1 ) {
              this.order.activityCode = ''
            } else if (type === 2) {
              this.order.orderCode = ''

            } else if ( type === 3) {
              this.order.thirdOrderCode = ''
            }
          }

        }
      }

    }
</script>

<style scoped lang="scss" rel="stylesheet/scss">

  @import '../../styles/search';
</style>
