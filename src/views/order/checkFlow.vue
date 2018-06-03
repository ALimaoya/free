<template>
  <div class="checkflow tableBox">
    <h1>流量订单审核</h1>
    <search-bar @searchobj="getData" :platform-type="true" :activity-shop="true" :activity-code="true"  :flow="'checkFlow'"></search-bar>

    <!--<div class="search">-->
      <!--<el-select size="small" clearable v-model="order.platformType" filterable placeholder="请选择试用平台">-->
        <!--<el-option-->
          <!--v-for="item in platformOptions"-->
          <!--:key="item.value"-->
          <!--:label="item.name"-->
          <!--:value="item.value">-->
        <!--</el-option>-->
      <!--</el-select>-->
      <!--<el-input size="small" :maxlength="20" v-model.trim="order.activityCode" placeholder="请输入试客试用活动编号"></el-input>-->
      <!--<el-input size="small" :maxlength="20" v-model.trim="order.thirdOrderCode" placeholder="请输入第三方订单编号"></el-input>-->
      <!--<el-button size="small"  @click="getList()" class="searchOrder" style="padding: 0 0.05rem;">查询</el-button>-->
    <!--</div>-->
    <el-table :data="tableData" border>
      <el-table-column label="序号" width="80" prop="orderId" ></el-table-column>
      <el-table-column prop="orderCode" label="订单流水号" ></el-table-column>
      <el-table-column prop="shopName" label="店铺名称" ></el-table-column>
      <el-table-column prop="activityCode" label="活动编号" ></el-table-column>
      <el-table-column prop="platform" label="平台类型">
        <template slot-scope="scope">
          {{ platformOptions[scope.row.platform].name }}
        </template>
      </el-table-column>
      <el-table-column prop="thirdAccount" label="试客第三方账号"></el-table-column>
      <el-table-column prop="receiveTime" label="订单创建时间" ></el-table-column>
      <el-table-column prop="searchImageUrl" label="搜索截图">
        <template slot-scope="scope">
          <img class="showPic" @click="getImg( scope.row.searchImageUrl )" :src=" imageDomain + scope.row.searchImageUrl " alt="" />
        </template>
      </el-table-column>
      <el-table-column prop="collectImageUrl" label="收藏截图">
        <template slot-scope="scope">
          <img class="showPic" @click="getImg( scope.row.collectImageUrl)" :src=" imageDomain + scope.row.collectImageUrl" alt="" />
        </template>
      </el-table-column>
      <el-table-column prop="status" label="订单状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status==99">已完成</span>
          <span v-else-if="scope.row.status==11">订单失败</span>
          <span v-else-if="scope.row.status==4">审核中</span>
          <!--<span v-else>{{ options[scope.row.status].name}}</span>-->
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button  type="text" @click="goDetail(scope.$index,scope.row.orderId)">查看详情</el-button>
          <el-button  type="text" @click="handleOrder(scope.$index, scope.row.orderId)">审核</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block2" v-if="tableData.length>0">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-size="pageSize"
        :current-page="currentPage"
        :page-sizes="[10, 15, 20]"
        layout=" sizes, prev, pager, next, jumper"
        :total="totalElements">
      </el-pagination>
      <span class="totalItems">共{{ totalPages }}页，{{totalElements}}条记录</span>
    </div>

    <el-dialog width="50%" :visible.sync="detailInfo" center top="10vh" title="流量订单审核">
      <div class="checkPic">
        <dl v-if="searchImg">
          <dt>搜索截图</dt>
          <dd >
            <img  @click="getImg(searchImg)" :src=" imageDomain + searchImg" alt="" />
          </dd>
        </dl>
        <dl v-else class="noViewPic">暂无搜索截图</dl>
        <dl v-if="likeImg">
          <dt>商品收藏截图</dt>
          <dd >
            <img @click="getImg(likeImg)" :src=" imageDomain + likeImg" alt="" />
          </dd>
        </dl>
        <dl v-else class="noViewPic">暂无商品收藏截图</dl>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="check('1')">审核成功</el-button>
        <el-button type="error" @click="check('2')">审核拒绝</el-button>
        <el-button type="info" @click="detailInfo = false; searchImg = '';likeImg = ''">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="拒绝原因" :visible.sync="reasonBox" center top="20vh"  width="30%" >
      <span>备注：</span>
      <el-input :rows="4" type="textarea" :maxlength="100" v-model.trim="reason" placeholder="审核拒绝时不能为空，可输入字符最大长度为100"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitReason">提 交</el-button>
        <el-button type="info" @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <div v-if="showImg" @click="close" class="mask">
      <img :src=" imageDomain + bigImg" alt="" />
    </div>
  </div>
</template>

<script>
  import { getOrderList , orderDetail , checkOrder  } from "@/api/activity"
  import  searchBar  from "@/components/searchBar";

  export default {
    name: "check-flow" ,
    components : {
      searchBar
    },
    data(){
      return {
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
        ],
        order : {
          EQ_status: '4',
          // thirdAccount: '',
          platformType : '' ,
          activityCode : '',
          thirdOrderCode: '',
          EQ_activityShop : '',
          activityStartTime : '',
          activityEndTime : '',
          EQ_activityType : '4'
          // currentPage : 1,
          // pageSize : 10
        },
        tableData : [],
        currentPage : 1 ,
        pageSize : 10 ,
        totalPages : '',
        totalElements : 0 ,
        searchImg : '' ,
        likeImg : '',
        detailInfo : false ,
        showImg : false ,
        imageDomain : process.env.IMAGE_DOMAIN ,
        // imageDomain : 'http://yabei.oss-cn-beijing.aliyuncs.com/',
        orderId : '' ,
        reason : '' ,
        refuseReason : '' ,
        status : '' ,
        reasonBox : false

      }
    },
    mounted(){
      this.getList();
    },
    methods : {

      //  获取订单列表
      getList(){
        let formData = new FormData();
        formData.append('EQ_tryoutActivity.platformType',this.order.platformType);
        let reg = /^[0-9]*$/;
        if( reg.test(this.order.activityCode)){
          formData.append('EQ_tryoutActivity.activityCode', this.order.activityCode);
        }else{
          formData.append('EQ_tryoutActivity.activityCode', '');
        }
        if( reg.test(this.order.thirdOrderCode)){
          formData.append('EQ_tryoutOrderWin.thirdOrderCode', this.order.thirdOrderCode);
        }else{
          formData.append('EQ_tryoutOrderWin.thirdOrderCode', '');
        }
        formData.append('EQ_activityType',this.order.EQ_activityType);
        formData.append('currentPage', this.currentPage);
        formData.append('EQ_status','4');
        formData.append('pageSize', this.pageSize);
        getOrderList(formData).then( res=> {
          if(res.data.status === '000000000'){
            this.tableData = res.data.data ;
            this.totalPages = res.data.totalPages ;
            this.totalElements = res.data.totalElements ;
            // console.log( this.totalElements)
          }
        }).catch( err => {
          alert('服务开小差啦，请稍等~');

        })
      },
      //根据搜索条件获取订单列表
      getData(res){
        this.order ={...res }  ;
        this.currentPage = 1 ;

        // console.log(this.order);
        this.getList();
      },

      //查看订单详情
      goDetail(index,order){
        this.$router.push('/order/flowDetail/'+ order) ;

      },


      // 评价审核详情
      handleOrder(index ,order){
        this.orderId = order ;
        this.detailInfo = true ;
        this.viewImg = '';
        orderDetail(order).then( res => {
          // console.log(res);
          if( res.data.status === '000000000'){
            if(res.data.data.orderImageList.length){
              res.data.data.orderImageList.forEach( i => {
                if(i.type === '5'){
                  this.searchImg = i.imageUrl ;

                }
                if(i.type === '1'){
                  this.likeImg = i.imageUrl ;

                }
              } )
            }

          }else{
            this.$message({
              message : res.data.message ,
              center : true ,
              type : 'error'
            })
          }
        }).catch( err => {
          alert('服务器开小差啦，请稍等~')
        })
      },

      //审核操作
      check(type){

        if(type === '1'){
          this.status = '99' ;
          this.handelRefuse();
        }else{
          this.status = '11' ;
          this.reasonBox = true ;

        }
        // console.log(this.orderId ,  this.status , this.refuseReason);


      },

      handelRefuse(){
        checkOrder({ orderId : this.orderId , status : this.status ,reason : this.refuseReason ,activityType : this.order.EQ_activityType}).then( res => {
          if(res.data.status === '000000000'){
            this.$message({
              message : '审核提交成功，请稍后确认' ,
              center : true ,
              type : 'success',
            });
            setTimeout(()=> {
              window.location.reload();
            }, 3000);
          }else{
            this.$message({
              message : res.data.message ,
              center : true ,
              type : 'error'
            })
          }

        }).catch( err => {
          alert('服务器开小差啦，请稍等~')
        });
        this.detailInfo = false ;
        this.viewImg = '' ;
      },

      //提交拒绝原因
      submitReason(){

        this.refuseReason = this.reason ;
        // console.log(this.orderId ,  this.status , this.refuseReason ,2);

        if(this.refuseReason === ''){
          this.$message({
            message : '请填写拒绝原因',
            type : 'error' ,
            center : 'true'
          });
          return false ;
        }else{
          if(this.refuseReason.length > 100){
            this.$message({
              message : '拒绝原因不得超过100个字符',
              type : 'error' ,
              center : 'true'
            });
          }else {
            this.handelRefuse();
            this.reasonBox = false;
            // this.reason = '' ;
          }
        }

      },

      //查看图片详情
      getImg(url){
        this.showImg = true ;
        this.bigImg = url ;
      },
      close(){
        this.showImg = false ;
      },

      //关闭窗口
      cancel(){
        this.reasonBox = false ;
        this.reason = '' ;
      },

      handleSizeChange(val) {
        this.pageSize = val ;
        this.getList();
      },
      handleCurrentChange(val) {
        // console.log(val);
        this.currentPage = val ;
        this.getList();
      }
    }
  }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "src/styles/table.scss" ;

  .checkflow{
    .search{
      border-bottom : 1px solid #aaa ;

    }

    .el-dialog {
      dl {
        width: 40%;
        margin: 0 auto;
        text-align: center;

        dt {
          width: 100%;
          height: 0.5rem;
          line-height: 0.5rem;
          color: #456;
          text-align: center;

        }
        dd {
          max-height: 3rem;
          width: 100%;
          margin: 0 auto;
          display: flex;
          justify-content: center;
          align-items: center;
          img {
            max-width: 100%;
            max-height: 2.5rem;
          }
        }
      }
      .noViewPic {
        height: 100px;
        line-height: 100px;
      }
      p {
        display: inline-block;
        margin-bottom: 0.1rem;
      }
      .dialog-footer {
        height: 1rem;
        .el-button {
          width: 0.9rem;
          padding: 0;
          text-align: center;
          line-height: 0.35rem;
        }
      }

    }

  }
</style>
