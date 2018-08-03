<template>
    <div class="history activityTable" v-loading="loading"  element-loading-text="拼命加载中">
      <h1 class="h_title">报名记录</h1>
      <div class="search">
        <el-input size="small" :maxlength="40" v-model.trim="history.EQ_code" placeholder="商品编号"></el-input>
        <el-input size="small" :maxlength="40" v-model.trim="history.LIKE_productName" placeholder="商品名称"></el-input>


        <el-button  size="small" type="primary"  @click="getList()" class="searchOrder">查询</el-button>
        <el-button  size="small" type="primary"  @click="reset()" class="searchOrder">重置</el-button>
      </div>

        <el-table  :data="tableData"  border fit >
          <el-table-column prop="id" label="商品ID" ></el-table-column>
          <el-table-column prop="productName" label="商品名称" ></el-table-column>
          <el-table-column prop="oldPrice" label="原价" ></el-table-column>
          <el-table-column prop="activityPrice" label="活动价" ></el-table-column>
          <el-table-column prop="stock" label="线上库存" ></el-table-column>
          <el-table-column label="审核状态">
            <template slot-scope="scope">
              <span>{{ checkStatus[scope.row.status-1]}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="date" label="活动时间" ></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="cancelActivity(scope.$index,scope.row.id)">取消活动</el-button>
              <el-button type="text" @click="detail(scope.$index,scope.row.id)">详情</el-button>
              <el-button type="text" @click="refuseReason(scope.$index,scope.row.id)">拒绝原因</el-button>
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
        <div>{{ reason }}</div>
      </el-dialog>
      <el-dialog  title="报名活动详情" :visible.sync="detailVisible" width="70%" center>
        <div class="box_content">
          <p class="time">活动报名时间：</p>
          <div class="goods_wrap">
            <div class="goods">
              <p class="title">商品信息</p>
              <dl><dd><img src="" alt="" :onerror="errorImg">
                <!--<img :src="failImg" v-else >-->
              </dd>
                <dt><span></span><span>商品编号：</span><span>￥</span></dt></dl>
            </div>
            <div class="goods">
              <p class="title">白底图</p>
              <img  class="mainImg" src="" alt="" @click="showImg()" :onerror="errorImg">
              <!--<img :src="failImg" v-else >-->
            </div>
          </div>
          <div class="goodsInfo">
            <div>
              <span v-if="type==='1'">活动秒杀价格：</span><span v-else="type==='2'">分享购价格：</span><span>{{ activityInfo.price}}</span>
            </div>
            <div>
              <span>报名活动库存数量：{{ activityInfo.goodsNum }}件</span>
            </div>
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
  import { getShopStatus,getActivityGoods,getSecondsList } from "@/api/enter"

  export default {
        name: "history",
        data() {
            return {
              tableData: [],
              type : '',
              history: {},
              currentPage : 1 ,
              pageSize : 10 ,
              totalPages : 0,
              totalElements : 0,
              checkStatus: ['审核中', '审核拒绝', '审核通过', '已取消'],
              refuseVisible: false,
              detailVisible: false,
              reason: '',
              activityInfo: {},
              isCancel: false,
              bigImg: '',
              imageDomain: process.env.IMAGE_DOMAIN,
              errorImg:'this.src="' + userPhoto + '"',
              failImg: userPhoto,
              loading: true ,
            }
        },
        mounted() {
          this.type = this.$route.query.type ;
          this.history = this.$store.state.searchBar.signUpList.history ;
          this.currentPage = this.$store.state.searchBar.signUpList.currentPage ;
          this.pageSize = this.$store.state.searchBar.signUpList.pageSize ;
          this.getList();
        },
        methods: {
          getList() {
            let formData = new FormData() ;
            formData.append('EQ_code',this.history.EQ_code);
            formData.append('LIKE_productName',this.history.LIKE_productName);
            formData.append('currentPage',this.currentPage);
            formData.append('pageSize',this.pageSize);
            let data = {
              history : { ...this.history },
              currentPage : this.currentPage ,
              pageSize: this.pageSize
            };
            this.$store.commit('saveSignUp',data);
            if( this.type === '1'){

              getSecondsList(formData).then( res => {
                this.loading = false ;
                if( res.data.status === '000000000'){
                  this.tableData = res.data.data ;

                }
              })
            }

          },
          cancelActivity(index, id) {
            this.isCancel = true;
            this.getGoodsDetail(id);
            this.detailVisible = true;

          },
          detail(index, id) {
            this.getGoodsDetail(id);
            this.detailVisible = true;
            this.isCancel = false;
          },
          getGoodsDetail(id){
            getActivityGoods(id).then( res =>{
              if( res.data.status === '000000000'){
                console.log(res.data.data);

              }
            })
          },
          refuseReason(index, id) {
            this.refuseVisible = true;
            // this.reason =
          },
          handleCancel() {
            let now = new Date();
            now = parseTime(now) ;
            //获取当前活动状态
            this.detailVisible = false;

          },
          showImg() {
            // this.bigImg =
          },
          handleSizeChange(val) {

            this.pageSize = val ;
            this.getList();
          },

          handleCurrentChange(val) {

            this.currentPage = val ;
            this.getList();
          },
        }
    }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import 'src/styles/activityTable';
  .search{
    height : 100px!important;
  }
  .el-table{

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
        .mainImg{
          width : 1rem ;
          height : 1rem ;
          margin: auto ;
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
      div:nth-child(1){
        margin-right : 0.3rem ;
      }
    }
    .btn_wrap{
      margin-top : 0.5rem ;
      text-align: center;
    }
  }
</style>
