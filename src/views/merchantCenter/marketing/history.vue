<template>
    <div class="history activityTable" v-loading="loading"  element-loading-text="拼命加载中">
      <h1 class="h_title">{{ typeLabel }}活动报名记录</h1>
      <div class="search">
        <div class="block">
          <el-date-picker size="small" v-model="history.GTE_startDate" value-format="yyyy-MM-dd hh:00:00" type="datetime" placeholder="选择活动开始日期" ></el-date-picker>
        </div>
        <div class="block">
          <el-date-picker size="small" v-model="history.LTE_endDate" value-format="yyyy-MM-dd hh:00:00" type="datetime" placeholder="选择活动结束日期" ></el-date-picker>
        </div>
        <el-input class="sub_search" size="small" :maxlength="40" v-model.trim="history.EQ_product" clearable placeholder="商品编号"></el-input>
        <el-select class="sub_search"  size="small" clearable v-model="history.EQ_status" filterable placeholder="请选择审核状态">
          <el-option
            v-for="item in checkStatus"
            :key="item.value"
            :label="item.name"
            :value="item.value">
          </el-option>
        </el-select>
        <el-button  size="mini" type="primary"  @click="getList()" class="searchOrder">查询</el-button>
        <el-button  size="mini" type="primary"  @click="reset()" class="searchOrder">重置</el-button>
      </div>

        <el-table  :data="tableData"  border fit >
          <el-table-column prop="id" label="商品ID" width="75"></el-table-column>
          <el-table-column prop="productName" label="商品名称" ></el-table-column>
          <el-table-column label="商品白底图" v-if="type !== '3'">
            <template slot-scope="scope">
              <img v-if="scope.row.image !== ''&&scope.row.image !== null" :src=" imageDomain + scope.row.image " alt="" @click="showImg(scope.row.image)"  :onerror="errorImg" />
              <img :src="failImg" v-else />
            </template>
          </el-table-column>
          <el-table-column prop="sourcePrice" label="原价（元）" ></el-table-column>
          <el-table-column v-if="type !=='3'" prop="price" label="活动价（元）" ></el-table-column>
          <el-table-column prop="totalStock" label="线上库存" ></el-table-column>
          <el-table-column label="审核状态">
            <template slot-scope="scope" v-if="scope.row.status !== undefined">
              <span>{{ checkStatus[(scope.row.status*1+1)*1].name}}</span>
            </template>
          </el-table-column>
          <el-table-column  label="活动时间" width="100">
            <template slot-scope="scope" >
              <span v-if="type==='1'">
                {{ scope.row.startDate + ' '+ scope.row.startTime}}
              </span>
              <span v-else-if="type === '2'">
                {{ scope.row.startTime}}
              </span>
              <span v-if="type === '3'">
                {{ scope.row.startTime}}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" v-if="scope.row.status === '0'|| (scope.row.status === '1'&& scope.row.startDate > now)" @click="cancelActivity(scope.$index,scope.row)">取消活动</el-button>
              <el-button type="text" @click="detail(scope.$index,scope.row.id)">详情</el-button>
              <el-button type="text" v-if="scope.row.status === '2'" @click="refuseReason(scope.$index,scope.row.id)">拒绝原因</el-button>
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
      <el-dialog  title="审核拒绝原因" :visible.sync="refuseVisible" width="50%" center>
        <div class="refuse_wrap">审核拒绝原因：{{ reason }}</div>
      </el-dialog>
      <el-dialog  title="报名活动详情" :visible.sync="detailVisible" width="70%" center>
        <div class="box_content">
          <p class="time">活动时间：
            <span v-if="type ==='1'">{{ activityInfo.startDate + ' ' + activityInfo.startTime }} 场</span>
            <span v-else-if="type === '2' || type === '3'">{{ activityInfo.startTime + '  ——  ' + activityInfo.endTime}}</span>
          </p>
          <div class="goods_wrap">
            <div class="goods">
              <p class="title">商品信息</p>
              <dl><dd><img v-if="activityInfo.mainImage !== ''&& activityInfo.mainImage!== null" :src="imageDomain + activityInfo.mainImage" alt="" :onerror="errorImg" />
                <img :src="failImg" v-else />
              </dd>
                <dt><span>{{ activityInfo.productName}}</span><span>商品编号：{{ activityInfo.productCode}}</span><span>￥{{ activityInfo.sourcePrice}}</span></dt></dl>
            </div>
            <div class="goods" v-if="type !== '3'">
              <p class="title">白底图</p>
              <img  class="mainImg" v-if="activityInfo.image !== ''&& activityInfo.image!== null" :src="imageDomain + activityInfo.image" alt="" @click="showImg(activityInfo.image)" :onerror="errorImg">
              <img :src="failImg" v-else >
            </div>
            <div class="goods" v-else-if="type === '3'">
              <p class="title">商品视频</p>
              <video class="mainVideo" v-if="activityInfo.videoInfoMap !== '' && activityInfo.videoId !== ''" :src="activityInfo.videoInfoMap.playUrl" :onerror="errorImg" controls></video>
              <img :src="failImg" v-else />
            </div>
          </div>
          <div class="goodsInfo" v-if="type !== '3'">
            <div>
              <span v-if="type==='1'">活动秒杀价格：</span><span v-else-if="type==='2'">分享购价格：</span><span>￥{{ activityInfo.price}}</span>
            </div>
            <div>
              <span>报名活动库存数量：<span v-if="type=== '1'">{{ activityInfo.eachStock }}</span>
                <span v-else-if="type=== '2'">{{ activityInfo.stock }}</span>
                件</span>
            </div>
          </div>
          <div class="goodsInfo" v-else-if="type === '3'">
            <div><span>商品介绍:</span></div>
            <div>{{activityInfo.videoDescribe}}</div>
          </div>
          <div v-if="isCancel" class="btn_wrap">
            <el-button type="primary" size="small"  @click="handleCancel">取消活动</el-button>
          </div>
        </div>
      </el-dialog>
      <div class="mask" v-if="bigImg !== ''" @click="bigImg = '' ">
        <img :src="imageDomain+ bigImg" alt="" />
      </div>
    </div>
</template>

<script>
  import userPhoto from '@/assets/404_images/fail.png'
  import { getShopStatus,getActivityGoods,getShareDetail,getBrandRecommend,getActivityHistory,getShareHistory,getBrandHistory,editSecStatus, editShareStatus, editBrandRecommend} from "@/api/enter"
  import { parseTime } from "@/utils"

  export default {
        name: "SignHistory",
        data() {
            return {
              tableData: [],
              type : '',
              history: {},
              currentPage : 1 ,
              pageSize : 10 ,
              totalPages : 0,
              totalElements : 0,
              checkStatus: [
                {
                  name : '全部状态',
                  value : ''
                },
                {
                  name : '审核中',
                  value : '0'
                },
                {
                  name : '审核通过',
                  value : '1'
                },
                {
                  name : '审核拒绝',
                  value : '2'
                },
                {
                  name : '已取消',
                  value : '3'
                }
              ],
              refuseVisible: false,
              detailVisible: false,
              reason: '',
              activityInfo: {videoInfoMap:{}},
              isCancel: false,
              bigImg: '',
              imageDomain: process.env.IMAGE_DOMAIN,
              errorImg:'this.src="' + userPhoto + '"',
              failImg: userPhoto,
              loading: true ,
              cancelId : '',
              now : '',
              typeLabel :'',
            }
        },
        mounted() {
          this.type = this.$route.query.type ;

          if(this.type === '1'){
            this.typeLabel = '秒杀';
            this.history = this.$store.state.searchBar.secKillList.history ;
            this.currentPage = this.$store.state.searchBar.secKillList.currentPage ;
            this.pageSize = this.$store.state.searchBar.secKillList.pageSize ;
          }else if( this.type === '2'){
            this.typeLabel = '分享购';
            this.history = this.$store.state.searchBar.shareList.history ;
            this.currentPage = this.$store.state.searchBar.shareList.currentPage ;
            this.pageSize = this.$store.state.searchBar.shareList.pageSize ;
          }else if(this.type === '3'){
            this.typeLabel = '品牌推荐';
            this.history = this.$store.state.searchBar.brandRecommendList.history ;
            this.currentPage = this.$store.state.searchBar.brandRecommendList.currentPage ;
            this.pageSize = this.$store.state.searchBar.brandRecommendList.pageSize ;
          }
          this.getList();


          this.now = new Date();
          this.now = parseTime(this.now) ;
        },
        methods: {
          getList() {
            if(this.history.GTE_startDate=== null){
              this.history.GTE_startDate = ''
            }
            if(this.history.LTE_endDate=== null){
              this.history.LTE_endDate = ''
            }

            let formData = new FormData() ;
            formData.append('EQ_product.code',this.history.EQ_product);
            formData.append('EQ_status',this.history.EQ_status);
            formData.append('currentPage',this.currentPage);
            formData.append('pageSize',this.pageSize);
            let data = {
              history : { ...this.history },
              currentPage : this.currentPage ,
              pageSize: this.pageSize,
              type : this.type
            };
            this.loading = true ;
            if( this.type === '1'){
              this.$store.commit('saveSecKill',data);
              formData.append('GTE_startDate',this.history.GTE_startDate===''?'':this.history.GTE_startDate.split(' ')[0]);
              formData.append('LTE_endDate',this.history.LTE_endDate===''?'':this.history.LTE_endDate.split(' ')[0]);
              getActivityHistory(formData).then( res => {
                this.loading = false ;
                if( res.data.status === '000000000'){
                  this.tableData = res.data.data ;
                  this.totalPages = res.data.totalPages;
                  this.totalElements = res.data.totalElements;

                }
              })
            }else if(this.type === '2'){
              this.$store.commit('saveShare',data);

              formData.append('GTE_startTime',this.history.GTE_startDate);
              formData.append('LTE_endTime',this.history.LTE_endDate);
              getShareHistory(formData).then( res => {
                this.loading = false ;
                if( res.data.status === '000000000'){
                  this.tableData = res.data.data ;
                  this.totalPages = res.data.totalPages;
                  this.totalElements = res.data.totalElements;

                }
              })
            }else if(this.type === '3'){
              this.$store.commit('savebrandRecommend',data);
              formData.append('GTE_startTime',this.history.GTE_startDate);
              formData.append('LTE_endTime',this.history.LTE_endDate);
              getBrandHistory(formData).then( res => {
                console.log('获得列表',res)
                this.loading = false ;
                if( res.data.status === "000000000"){
                  this.tableData = res.data.data ;
                  this.totalPages = res.data.totalPages;
                  this.totalElements = res.data.totalElements;

                }    
              })
            }

          },
          cancelActivity(index, item) {

            if(item.status !== '0'|| (item.status !== '1'&& item.startDate < this.now)){
              this.$message({
                message : '该活动状态不符合取消条件，无法取消',
                type : 'error',
                center : true
              });
              return false ;
            }else{
              this.isCancel = true;
              this.getGoodsDetail(item.id);
              this.cancelId = item.id ;
              this.detailVisible = true;
            }


          },
          detail(index, id) {
            this.getGoodsDetail(id);
            this.detailVisible = true;
            this.isCancel = false;
          },
          getGoodsDetail(id){
            if( this.type === '1'){
              getActivityGoods(id).then( res =>{
                if( res.data.status === '000000000'){
                  this.activityInfo = res.data.data ;
                  this.reason = res.data.data.reason ;

                }
              })
            }else if(this.type === '2'){
              getShareDetail(id).then( res => {
                if (res.data.status === '000000000') {
                  this.activityInfo = res.data.data ;
                  this.reason = res.data.data.reason ;

                }
              })
            }else if(this.type === '3'){
              getBrandRecommend(id).then( res => {
                if (res.data.status === '000000000') {
                  console.log('获得详情',res)
                  this.activityInfo = res.data.data ;
                  this.reason = res.data.data.reason ;

                }
              })
            }

          },
          refuseReason(index, id) {
            this.getGoodsDetail(id);
            this.refuseVisible = true;
          },
          handleCancel() {
            if(this.type ==='1'){
              editSecStatus(this.cancelId).then( res => {
                if( res.data.status === '000000000'){
                  this.$message({
                    message : '该活动已成功取消，请稍后查看~',
                    center : true ,
                    type : 'success'
                  });
                  this.detailVisible = false;
                  this.getList();

                }
              })
            }else if( this.type ==='2'){
              editShareStatus(this.cancelId).then( res => {
                if( res.data.status === '000000000'){
                  this.$message({
                    message : '该活动已成功取消，请稍后查看~',
                    center : true ,
                    type : 'success'
                  });
                  this.detailVisible = false;
                  this.getList();

                }
              })
            }else if(this.type === '3'){
              editBrandRecommend(this.cancelId).then( res =>{
                if( res.data.status === '000000000'){
                  this.$message({
                    message : '该活动已成功取消，请稍后查看~',
                    center : true ,
                    type : 'success'
                  });
                  this.detailVisible = false;
                  this.getList();

                }
              })
            }
            

          },
          showImg(src) {
            this.bigImg = src ;

          },
          handleSizeChange(val) {
            this.pageSize = val ;
            this.getList();
          },
          handleCurrentChange(val) {
            this.currentPage = val ;
            this.getList();
          },
          reset(){
            this.history = {
              GTE_startDate: '',
              LTE_endDate:'',
              EQ_product: '',
              EQ_status:'',

            };
            this.currentPage = 1 ;
            this.pageSize = 10 ;
            this.getList();

          }
        }
    }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import 'src/styles/activityTable';
  .search{
    height : 100px!important;
  .block{
    width : auto!important;
    .el-date-editor{
      margin-right : 0.25rem!important ;

    }
    .el-input{
      width : 190px!important;

    }
  }
    .sub_search{
      margin-left : 0!important ;
      width : 190px!important;
    }
  }
  .el-table{
    img{
      max-width : 1rem ;
      max-height: 1rem;
      margin: auto ;
    }
    .el-button{
      width : 100% ;
      padding : 0 ;
      text-align: center;
      margin : 0;
    }
  }
  .box_content{
    padding : 0.3rem 0.2rem ;
    font-size : 0.16rem ;
    line-height : 2 ;
    .goods_wrap{
      display: flex;
      flex-direction: row;
      margin-top : 0.3rem ;
      .goods{
        .title{
          font-size :0.28rem ;
          font-weight: bold ;
          text-align: center;
          line-height : 0.4rem ;
        }
        dl{
          margin : 0.2rem 0;
          display: flex;
          flex-direction: row;
          dd,dt{
            float : left ;
            margin : 0.1rem ;

          }
          dd{
            width : 1rem ;
            height : 1rem ;
            float : left ;
            img{
              width : 100% ;
              height : 100% ;
            }
          }
          dt{
            display: flex;
            flex-direction: column;

          }
        }
        .mainImg , .mainVideo{
          width : 2rem ;
          height : 2rem ;
          margin: 0.25rem auto ;
          display: block;
        }
        
      }
      .goods:nth-child(1){
        flex : 1 ;
      }
      .goods:nth-child(2){
        width: 30% ;
      }
    }
    .goodsInfo{
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      font-size : 0.22rem ;
      div:nth-child(1){
        margin-right : 0.3rem ;
      }
    }
    .btn_wrap{
      margin-top : 0.5rem ;
      text-align: center;
    }

  }
  .refuse_wrap{
    margin : 0.5rem ;
    font-size: 0.24rem ;
  }
</style>
