<template>
  <div class="flow activityTable">
    <search-bar @searchobj="getSearchData" :platform-type="true" :activity-shop="true" :task-status="true" :activity-code="true" :flow="'flowTask'" ></search-bar>
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
          <span v-else-if="scope.row.payStatus==='0'">待支付</span>
          <span v-else-if="scope.row.status==='5'&& scope.row.startTime > time">待开始</span>
          <span v-else-if="scope.row.status==='5'&& scope.row.startTime <= time&&time< scope.row.endTime&&scope.row.payStatus === '1'">进行中</span>
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
          <el-button class="check" style="padding : 0 ;" type="text" v-if="scope.row.status==='5'&& scope.row.endTime > time&& scope.row.payStatus==='1'" @click="handleShelves(scope.row.activityId,scope.row.status)">下架</el-button>
          <el-button class="check" style="padding : 0 ;" type="text" v-if="scope.row.status==='6'&& scope.row.endTime > time&&scope.row.payStatus === '1'" @click="handleShelves(scope.row.activityId,scope.row.status)">上架</el-button>
          <el-button class="check" style="padding : 0 ;" type="text" v-if="(scope.row.status==='6'|| (scope.row.status==='5'&& scope.row.endTime < time )) && scope.row.payStatus==='1'" @click="applyAccounts(scope.$index,scope.row.activityId)">申请结算</el-button>
          <el-button class="check" style="padding : 0 ;" type="text" v-if="scope.row.status==='7'" @click="cancelAccounts(scope.$index,scope.row.activityId)">取消结算</el-button>
          <!--<el-button class="check" style="padding : 0 ;" type="text" @click="publish(scope.$index,scope.row.activityId)">克隆活动</el-button>-->
          <!--<el-button class="check" style="padding : 0 ;" type="text" @click="handleCancel(scope.$index,scope.row.activityId)">删除任务</el-button>-->

          <!--<el-button class="check" style="padding : 0 ;" type="text" v-if="scope.row.status ==='2' || scope.row.status==='4'" @click="handleCancel(scope.$index,scope.row.activityId)">取消发布</el-button>-->
          <el-button class="check" style="padding : 0 ;" type="text" v-if="scope.row.payStatus==='0'" @click="toPay(scope.$index,scope.row.activityId)">去支付</el-button>
          <el-button class="check" style="padding : 0 ;" type="text" @click="changeKeys(scope.$index,scope.row.activityId)">修改关键词</el-button>

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
    <!--修改对应活动关键词弹窗-->
    <el-dialog class="key_dialog" width="65%" center title="修改活动关键词" :visible.sync="keyBox" >
      <el-form :model="form" ref="form" :rules="formRule" label-position="left">
        <el-form-item label="APP关键词：" labelWidth="130px">
          <span >{{ choosePlat }}</span>
        </el-form-item>
        <el-form-item class="size" v-for="(keyItem,index) in form.keyword" :label="'APP端关键词'+(index+1)*1+'：'"
                      :key="index" :prop="'keyword.'+ index + '.searchKeyword'" labelWidth="130px">
          <el-select class="searchType" @focus="getType(form.platformType)" v-model="keyItem.searchId" placeholder="搜索平台" size="small">
            <el-option
              v-for="(item ,index) in searchOptions"
              :key="index"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <el-select  class="searchType" v-model="keyItem.sortType" placeholder="综合排序" size="small">
            <el-option v-for="item in topOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
          <el-input  class="key" placeholder="填写搜索关键词" style="width : 200px;"
                     :maxlength="100"  v-model.trim="keyItem.searchKeyword" size="small" ></el-input>
          <span>筛选条件：</span>
          <el-input :maxlength="100" class="key" style="width : 200px;"  placeholder="如价格区间、销量区间等" size="small" v-model.trim="keyItem.searchCondition" ></el-input>
          <el-button slot size="small" @click="deleteKey(keyItem)">删除</el-button>
        </el-form-item>
        <el-form-item labelWidth="120px" >
          <el-button type="primary" @click="addKey">添加一个APP关键词</el-button>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button size="small" style="width:80px" type="primary" @click="submitChange(form.keyword)">确定修改</el-button>
        <el-button style="width:80px" size="small"  @click="cancelSubmit">关&nbsp;&nbsp;闭</el-button>
      </div>
    </el-dialog>
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
            formRule : {},
            choosePlat : '',
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
            keyBox : false ,
            reasonDetail : '',
            searchOptions : [],
            platForm : [
              {
                name : '淘宝',
                id : '1',
              },
              {
                name : '天猫',
                id : '2'
              },
              {
                name : '京东',
                id : '3'
              },
              // {
              //   name : '拼多多',
              //   id : '4'
              // }
            ],
            topOptions : [
              {
                label : '综合排序',
                value : '1'
              },
              {
                label : '人气排序',
                value : '2',
              },
              {
                label : '销量排序',
                value : '3'
              },
              {
                label : '信用排序',
                value : '4'
              }
            ],
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
        this.currentPage = 1 ;

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

      //修改关键词
      changeKeys(index,order){
        this.keyBox = true ;
        this.$store.dispatch('getPublishDetail',order).then( res => {

          if (res.data.status === '000000000') {
            this.form = res.data.data;
            this.choosePlat = this.platForm[this.form.platformType-1].name ;
            this.getType(this.form.platformType);

          } else {
            this.$message({
              message: res.data.message,
              center: true,
              type: 'error'
            })
          }
        }).catch( err => {
          alert('服务器开小差啦，请稍等~')
        })
      },
      //获取平台类型
      getType(value){

        searchTypeList(value).then( res => {
          if(res.data.status === '000000000'){
            this.searchOptions = res.data.data ;
          }else{
            this.$message({
              message : res.data.message ,
              type : 'error',
              center : true,
            })
          }
        }).catch( err => {
          // console.log(err);
        })
      },
      //删除APP端关键词
      deleteKey(item){
        let index = this.form.keyword.indexOf(item);
        if(index !== -1 && this.form.keyword.length> 1){
          this.form.keyword.splice(index,1)
        }


      },
      //添加app端关键词
      addKey(){
        if(this.form.keyword.length <10){
          this.form.keyword.push({
            'searchId' : '',
            'sortType' : '',
            'searchKeyword' : '',
            'searchCondition': '',
          })

        }else{
          this.$message({
            message : '您添加的关键词太多啦，不能再加啦~',
            center : true ,
            type : 'error'
          })
        }
      },
      //提交关键词修改
      submitChange(key){
        let keyArr = [];
        let keyWarn = false ;
        if(key.length){
          key.some(i=>{
            if(i.searchKeyword!==''){
              if(i.searchId===''){
                this.$message({
                  message : '请选择关键词对应搜索平台',
                  center : true ,
                  type : 'error'
                });
                keyWarn = true ;
                return false ;
              }
              else if(i.sortType === ''){
                this.$message({
                  message : '请选择关键词排序方式',
                  center : true ,
                  type : 'error'
                });
                keyWarn = true ;
                return false ;

              }
              keyArr.push(i);

            }

          });
          if(!keyWarn){
            let data = {
              activityId : this.form.activityId ,
              keyword : keyArr
            };
            if(keyArr.length){
              updateKeyword(data).then((res)=>{
                if(res.data.status === '000000000'){
                  this.$message({
                    message : '修改成功',
                    center : true ,
                    type : 'success'
                  });
                  this.keyBox = false ;
                }else{
                  this.$message({
                    message : res.data.message ,
                    center : true ,
                    type : 'error'
                  })
                }
              }).catch((err)=>{
                alert('服务器开小差啦，请稍等~')
              })

            }else{
              this.$message({
                message : '请填写活动关键词',
                center : true ,
                type : 'error'
              })
            }
          }

        }else{
          this.$message({
            message : '请填写活动关键词',
            center : true ,
            type : 'error'
          })
        }

      },
      //取消关键词修改
      cancelSubmit(){
        this.keyBox = false ;
        this.form = {};
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
