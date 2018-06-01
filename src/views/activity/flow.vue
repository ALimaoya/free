<template>
  <div class="flow activityTable">
    <search-bar @searchobj="getSearchData" :platform-type="true" :activity-shop="true" :task-status="true" :activity-code="true" :flow="'flowTask'" ></search-bar>

    <!--<div class="search">-->
      <!--<el-select size="small" clearable v-model="activity.EQ_platformType" filterable placeholder="请选择活动平台">-->
        <!--<el-option-->
          <!--v-for="item in platformOptions"-->
          <!--:key="item.value"-->
          <!--:label="item.name"-->
          <!--:value="item.value">-->
        <!--</el-option>-->
      <!--</el-select>-->
      <!--<el-input size="small" :maxlength="20"  v-model.trim="activity.EQ_activityShop" placeholder="请输入店铺名称"></el-input>-->
      <!--<el-input size="small" :maxlength="20"  v-model.trim="activity.EQ_activityCode" placeholder="请输入活动编号"></el-input>-->
      <!--<el-select size="small" clearable v-model="activity.EQ_activityStatus" filterable placeholder="请选择任务状态">-->
        <!--<el-option-->
          <!--v-for="item in options"-->
          <!--:key="item.value"-->
          <!--:label="item.name"-->
          <!--:value="item.value">-->
        <!--</el-option>-->
      <!--</el-select>-->
      <!--<div class="block">-->
        <!--<span class="demonstration">选择日期：</span>-->
        <!--<el-date-picker format="yyyy - MM - dd " value-format="yyyy-MM-dd" size="small"-->
                        <!--v-model="activity.GT_activityEndTime" clearable type="date"-->
                        <!--placeholder="开始时间" >-->
        <!--</el-date-picker>-->
        <!--<span class="demonstration2">~</span>-->
        <!--<el-date-picker size="small" v-model="activity.LT_activityStartTime"  clearable-->
                        <!--type="date" format="yyyy - MM - dd " value-format="yyyy-MM-dd"-->
                        <!--placeholder="结束日期">-->
        <!--</el-date-picker>-->
        <!--<el-button round size="small" type="primary" @click="getData()">搜索</el-button>-->

      <!--</div>-->
    <!--</div>-->
    <el-table :data="tableData"  border fit>
      <el-table-column prop="activityId" label="序号"></el-table-column>
      <el-table-column prop="shopName" label="商铺名称" ></el-table-column>
      <el-table-column prop="code" label="活动编号" ></el-table-column>
      <el-table-column prop="platform" label="平台类型" >
        <template slot-scope="scope">
          {{ platformOptions[scope.row.platform].name}}
        </template>
      </el-table-column>
      <el-table-column prop="mainImageUrl" label="活动图片" >
        <template slot-scope="scope">
          <img v-if="scope.row.mainImageUrl" class="showImg" @click="showImg(scope.row.mainImageUrl)" :src="imageDomain + scope.row.mainImageUrl" alt="" />
        </template>
      </el-table-column>
      <el-table-column prop="date" label="任务时间" >
        <template slot-scope="scope">
          <span class="time">{{ scope.row.startTime}}<br/> ~<br/>{{ scope.row.endTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="总单量" width="85" prop="tryoutQuantity"></el-table-column>
      <!--<el-table-column label="待接取" width="85"></el-table-column>-->
      <el-table-column prop="payStatus" label="支付状态">
        <template slot-scope="scope">
          <span v-if="scope.row.payStatus === '0'">未支付</span>
          <span v-else>支付完成</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="任务状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status==='9'">结算成功</span>
          <span v-else-if="scope.row.status==='5'&& scope.row.startTime > time">待开始</span>
          <span v-else-if="scope.row.status==='5'&& scope.row.startTime <= time&&time< scope.row.endTime">进行中</span>
          <span v-else-if="scope.row.status==='5'&& scope.row.endTime <= time">已结束</span>
          <span v-else-if="scope.row.status==='6'">下架</span>
          <span v-else-if="scope.row.status==='7'">申请结算</span>
        </template>
      </el-table-column>
      <el-table-column  label="操作">
        <template slot-scope="scope">
          <el-button class="check" style="padding : 0 ;" type="text"  @click="detail(scope.$index,scope.row.activityId)">查看详情</el-button>
          <el-button class="check" style="padding : 0 ;" type="text" v-if="scope.row.payStatus==='0'" @click="editor(scope.$index,scope.row.activityId, scope.row.payStatus)">修改</el-button>
          <!--<el-button class="check" style="padding : 0 ;" type="text" v-if="scope.row.status==='4'" @click="reason(scope.$index,scope.row.reason)">查看原因</el-button>-->
          <el-button class="check" style="padding : 0 ;" type="text" v-if="scope.row.status==='5'&& scope.row.startTime <= time" @click="handleShelves(scope.row.activityId,scope.row.status)">下架</el-button>
          <el-button class="check" style="padding : 0 ;" type="text" v-if="scope.row.status==='6'&& scope.row.endTime > time" @click="handleShelves(scope.row.activityId,scope.row.status)">上架</el-button>
          <el-button class="check" style="padding : 0 ;" type="text" v-if="(scope.row.status==='6'|| (scope.row.status==='5'&& scope.row.endTime < time )) && scope.row.payStatus==='1'" @click="applyAccounts(scope.$index,scope.row.activityId)">申请结算</el-button>
          <el-button class="check" style="padding : 0 ;" type="text" v-if="scope.row.status==='7'" @click="cancelAccounts(scope.$index,scope.row.activityId)">取消结算</el-button>
          <!--<el-button class="check" style="padding : 0 ;" type="text" @click="publish(scope.$index,scope.row.activityId)">克隆活动</el-button>-->
          <!--<el-button class="check" style="padding : 0 ;" type="text" @click="handleCancel(scope.$index,scope.row.activityId)">删除任务</el-button>-->

          <!--<el-button class="check" style="padding : 0 ;" type="text" v-if="scope.row.status ==='2' || scope.row.status==='4'" @click="handleCancel(scope.$index,scope.row.activityId)">取消发布</el-button>-->
          <el-button class="check" style="padding : 0 ;" type="text" v-if="scope.row.payStatus==='0'" @click="toPay(scope.$index,scope.row.activityId)">去支付</el-button>
          <!--<el-button class="check" style="padding : 0 ;" type="text" @click="changeKeys(scope.$index,scope.row.activityId)">修改关键词</el-button>-->

        </template>
      </el-table-column>
    </el-table>
    <div class="block2">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-sizes="[10, 15, 20]"
        :page-size="pageSize"
        layout=" sizes, prev, pager, next, jumper"
        :total="totalElements">
      </el-pagination>
      <span class="totalItems">共{{totalPages }}页，{{ totalElements }}条记录</span>
    </div>
    <div v-if="mask" @click="close" class="mask">
      <img :src=" imageDomain + bigImg" alt="" />
    </div>
  </div>
</template>

<script>
  import { searchTypeList, getActivity ,getDetail , changeStatus , applyPay ,cancelPay , cancelActivity,updateKeyword } from '@/api/activity'
  import SearchBar from "@/components/searchBar"
  import { parseTime } from "@/utils"

  export default {
      name: "flow",
      components : {
        SearchBar
      },
      data(){
          return {
            activity : {
              EQ_platformType : '',
              EQ_activityCode : '',
              EQ_activityStatus : '',
              GT_activityEndTime: '',
              LT_activityStartTime : '',
              shopId : '',
              EQ_activityType: '4'
              // currentPage : 1,
              // pageSize : 10
            },
            form : {},
            tableData : [],
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
              }
              // {
              //   value : '4',
              //   name : '拼多多'
              // }
            ],
            totalPages : '',
            totalElements : 0,
            currentPage : 1,
            pageSize : 10,
            activityDetail : {} ,
            time : '' ,
            imageDomain : process.env.IMAGE_DOMAIN, //获取图片的外链域名
            mask : false ,
            bigImg : '',

          }
      },
      mounted(){
        this.getData();
        let now = new Date();
        this.time = parseTime(now);
        // console.log(this.time)
      },
    methods : {
      //请求数据
      getData() {
        // console.log(form);
        let formData = new FormData();
        formData.append('EQ_platformType', this.activity.EQ_platformType);
        let reg = /^[0-9]*$/;
        if( reg.test(this.activity.EQ_activityCode)){
          formData.append('EQ_activityCode', this.activity.EQ_activityCode);
        }else{
          formData.append('EQ_activityCode', '');

        }
        formData.append('EQ_activityStatus',this.activity.EQ_activityStatus);
        let start = '' ;
        let end = '' ;
        if(this.activity.GT_activityEndTime !== null){
          start = this.activity.GT_activityEndTime ;
        }
        if(this.activity.LT_activityStartTime !== null){
          end = this.activity.LT_activityStartTime ;
        }
        formData.append('EQ_tryoutMerchantShop.shopId',this.activity.shopId);
        formData.append('EQ_activityType',this.activity.EQ_activityType);
        formData.append('GT_activityEndTime',start);
        formData.append('LT_activityStartTime',end);
        formData.append('currentPage',this.currentPage);
        formData.append('pageSize',this.pageSize);
        getActivity(formData).then(res => {
          // console.log(res);
          if (res.data.status === '000000000') {
            this.tableData = res.data.data;
            this.totalPages = res.data.totalPages ;
            this.totalElements = res.data.totalElements ;
          }
        }).catch(err => {
          alert('服务开小差啦，请稍等~')
        });


      },
      //根据搜索条件获取订单列表
      getSearchData(res){
        this.activity.EQ_platformType = res.platformType ;
        this.activity.EQ_activityCode = res.activityCode ;
        // this.activity.EQ_activityType = res.EQ_activityType ;
        this.activity.EQ_activityStatus = res.EQ_activityStatus ;
        this.activity.GT_activityEndTime = res.activityStartTime ;
        this.activity.LT_activityStartTime = res.activityEndTime ;

        // console.log(this.activity);
        this.getData();
      },
      //获取活动详情数据
      detail( index,order ){
        getDetail(order).then( res =>{
          if(res.data.status === '000000000'){
            this.activityDetail = res.data.data ;
            this.$router.push({ path : '/publish/flow_step1' ,query : { editor : '2', order : order }})

          }

        }).catch( err => {
          alert('服务开小差啦，请稍等~')
        });
      },

      //去支付
      toPay(index,order){
        this.$router.push({ name : 'FlowPay',params : { id : order} })
      },

      //修改指定试用发布内容
      editor(index ,order ,payStatus){
        this.$router.push({ path : '/publish/flow_step1' ,query : { editor : '1', order : order ,payStatus : payStatus }});
        // console.log(order) ;

      },
      //上架/下架操作
      handleShelves(id , status ){
        let formData = new FormData();
        formData.append('activityId',id);
        formData.append('activityStatus',status);
        changeStatus(formData).then( res => {
          if(res.data.status === '000000000'){
            this.$message({
              message : '操作成功',
              type : 'success',
              center : true ,
              duration : 1000
            });
            window.location.reload();
          }else{
            this.$message({
              message : res.data.message ,
              type : 'error',
              center : true
            })
          }
        }).catch( err => {
          alert('服务器开小差啦，请稍等~')
        });
      },

      //申请结算
      applyAccounts(index ,id){
        applyPay(id).then( res => {
          if( res.data.status === '000000000'){
            this.$message({
              message : '申请结算成功，请稍后确认',
              center : true ,
              type : 'success',
              duration : 1000

            });
            window.location.reload() ;
          }else{
            this.$message({
              message :  res.data.message ,
              center : true ,
              type : 'error'
            })
          }
        }).catch( err =>{
          alert('服务器开小差啦，请稍等~')
        });
      },

      //取消结算
      cancelAccounts(index ,id){
        cancelPay(id).then( res => {
          if( res.data.status === '000000000'){
            this.$message({
              message : '取消结算成功，请稍后确认',
              type : 'success' ,
              center : true ,
              duration : 1000

            });
            window.location.reload();
          }else{
            this.$message({
              message : res.data.message ,
              type : 'error' ,
              center : true
            })
          }
        }).catch( err =>{
          alert('服务器开小差啦，请稍等~')
        })
      },
      //查看大图
      showImg(url){
        this.mask = true ;
        this.bigImg = url ;
      },
      close(){
        this.mask = false ;
      },

      handleSizeChange(val) {

        this.pageSize = val ;
        this.getData();
      },

      handleCurrentChange(val) {

        this.currentPage = val ;
        this.getData();
      },

    }
    }
</script>

<style scoped lang="scss">
  @import 'src/styles/activityTable';
</style>
