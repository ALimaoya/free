<template>
  <div class="shopContent" v-loading="loading"  element-loading-text="拼命加载中">
    <div class="new">
      <p>店铺管理<button @click="toNew">绑定新店铺</button></p>
    </div>
    <div class="search">
      <el-select size="small" clearable v-model="selectShop.EQ_platformType" filterable placeholder="请选择平台类型">
        <el-option
          v-for="item in platformOptions"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <el-select size="small" v-model="selectShop.EQ_status"  filterable placeholder="请选择店铺状态" clearable>
        <el-option
          v-for="item in activityOptions"
          :key="item.value"
          :label="item.name"
          :value="item.value">
        </el-option>
      </el-select>
      <el-select size="small" v-model="selectShop.EQ_payStatus"  filterable placeholder="请选择支付状态" clearable>
        <el-option
          v-for="item in payStatus"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <el-button size="small" round type="primary" @click="getShopList()">搜索店铺</el-button>
    </div>

    <el-table class="list" :data="tableData"  border style="width: 100%" >
        <el-table-column prop="shopName" label="店铺" width="180"></el-table-column>
        <el-table-column prop="platform" label="平台类型" width="180">
          <template slot-scope="scope">
            {{ platformOptions[scope.row.platform -1].name}}
          </template>
        </el-table-column>
        <el-table-column prop="messageId" label="旺旺ID/咚咚ID"></el-table-column>
        <el-table-column prop="status" label="店铺状态">
          <template slot-scope="scope">
            <span>{{ activityOptions[scope.row.status -1].name}}</span>
          </template>
        </el-table-column>
      <el-table-column prop="payStatus" label="支付状态">
        <template slot-scope="scope">
          <span v-if="scope.row.payStatus === '1'">已支付</span>
          <span v-else-if="scope.row.payStatus === '0'">未支付</span>
        </template>
      </el-table-column>
        <el-table-column prop="updateTime" label="绑定时间"></el-table-column>
      <el-table-column prop="action" label="操作">
        <template slot-scope="scope" >
            <el-button size="mini" v-if="scope.row.status === '3' || scope.row.status === '4'"  @click="reason(scope.$index,scope.row.reason)"  style="padding : 0 0.1rem;line-height:0.28rem;">查看原因</el-button>
            <el-button size="mini" v-if="scope.row.status !== '2'" @click="change(scope.$index ,scope.row.shopId)"  style="width: 0.8rem ;padding : 0.03rem 0;line-height:0.28rem;text-align: center">修改</el-button>
            <el-button v-if="scope.row.payStatus === '0'"  class="patBtn" size="mini" @click="goPay(scope.$index ,scope.row.shopId)"  style="width: 0.6rem ;padding : 0;">去支付</el-button>
            <span  v-if="scope.row.status === '2'&& scope.row.payStatus === '1'">--</span>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="详情" :visible.sync="reasonBox" class="detail" top="22%">
      <span>招商审核备注</span>
      <el-input type="textarea" :rows="3" v-model="reasonWord"></el-input>
      <el-button class="close" type="info" size="small" @click="reasonBox=false " >关闭</el-button>
    </el-dialog>
    <div class="block2">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 15, 20]"
        :page-size="pageSize"
        layout=" sizes, prev, pager, next, jumper"
        :total="totalElements">
      </el-pagination>
      <span class="totalItems">共{{totalPages }}页，{{ totalElements }}条记录</span>
    </div>
  </div>
</template>

<script>
  import { shopList  } from "@/api/shop"
  export default {
        name: "Shop",

        data(){
          return{
            platformOptions : [
              {
                id: '1',
                name : '淘宝'
              },
              {
                id : '2',
                name : '天猫'
              },
              {
                id : '3',
                name : '京东'
              }
              // {
              //   id : '4',
              //   name : '拼多多'
              // }
            ],
            activityOptions : [
              {
                name : '审核中',
                value : '1'
              },
              {
                name : '审核通过',
                value : '2'
              },
              {
                name : '审核拒绝',
                value : '3'
              },
              {
                name : '需更新资料',
                value : '4'
              },
              // {
              //   name : '待支付',
              //   value : '5'
              // }
            ],
            payStatus : [
              {
                name : '未支付',
                id : '0'
              },
              {
                name : '已支付',
                id : '1'
              }
            ],
            selectShop : {
              EQ_platformType :'',
              EQ_status : '',
              EQ_payStatus : ''
            },
            tableData : [],
            reasonBox : false ,
            reasonWord : '',
            currentPage : 1,
            pageSize : 10 ,
            totalPages : 0,
            totalElements: 0 ,
            loading: true,
          }
        },
        mounted(){
          this.selectShop = this.$store.state.searchBar.shop.selectShop;
          this.currentPage = this.$store.state.searchBar.shop.currentPage;
          this.pageSize = this.$store.state.searchBar.shop.pageSize;
          this.getShopList();
        },
        methods : {
          toNew(){
            this.$router.push('/freeManage/newshop')
          },
          //获取店铺列表
          getShopList(){
              let formData = new FormData();
              formData.append('EQ_platformType' , this.selectShop.EQ_platformType);
              formData.append('EQ_status',this.selectShop.EQ_status);
              formData.append('currentPage' ,this.currentPage);
              formData.append('pageSize' , this.pageSize);
              formData.append('EQ_payStatus',this.selectShop.EQ_payStatus);
              let dataStorage = {
                selectShop : {
                  ...this.selectShop,
                },
                currentPage :this.currentPage,
                pageSize : this.pageSize,
              };
            this.$store.commit('saveselectShop',dataStorage);
            this.loading = true ;

            shopList(formData).then( res => {
              this.loading = false ;

             this.tableData = res.data.data ;
                this.totalPages = res.data.totalPages ;
                this.totalElements=res.data.totalElements;
            })
          },

          //拒绝原因
          reason(index){
            this.reasonBox = true ;
            this.reasonWord = this.tableData[index].reason;
          },

          //修改店铺信息
          change(index,id){

            this.$router.push({ path : '/freeManage/newshop' , query : { editor : '1' ,id : id }}) ;
          },

          //支付店铺
          goPay(index,id){
            this.$router.push({ name: 'buyShop', params :{ id : id  }  });
          },

          handleSizeChange(val) {
            this.pageSize = val ;
            this.getShopList();
          },

          handleCurrentChange(val) {
            this.currentPage = val ;
            this.getShopList();
          }
        }
    }
</script>

<style rel="stylesheet/scss" scoped lang="scss">
  .shopContent{

    .new{
      width : 100% ;
      height : 0.8rem ;
      border : 1px solid #aaa ;
      border-radius : 0.05rem ;
      p{
        font-size : 0.22rem ;
        font-weight : bold ;
        line-height : 0.8rem ;
        text-indent : 1.2rem ;
        button{
          /*width : 1rem ;*/
          height : 0.4rem ;
          border-radius: 0.05rem ;
          background : #409EFF ;
          color : #fff ;
          font-size : 0.14rem ;
          text-align: center;
          line-height : 0.4rem ;
          border : 0;
          float : right ;
          margin : 0.23rem 0.8rem ;

        }
      }
    }
    .search{
      width : 100% ;
      padding : 0.3rem 0.5rem 0.2rem;
      border-bottom : 1px solid #aaa ;
      margin-bottom : 0.3rem ;
      .el-select{
        margin-right : 0.2rem ;
        width : 2.6rem ;
      }
    }
    .list{
      width: 95%!important ;
      border : 1px solid #aaa ;
      margin : 0.4rem auto;
      border-radius : 0.05rem ;
      .el-button{
        margin : 0 0.05rem ;
      }
      .patBtn{
        padding : 0 ;
        text-align : center ;
        line-height : 0.28rem ;
      }
    }
    .detail{
      /*.el-dialog__header{*/
        /*background : #d3d3d3 ;*/
      /*}*/
        span{
          color : #ff0000 ;
          margin-bottom : 0.15rem ;
          display : inline-block;
        }

      .close{
        margin-top : 0.2rem ;
      }
    }
    .block2{
      padding : 0.3rem ;
      width : 100% ;
      box-sizing: border-box;
      .totalItems{
        display : block ;
        height : 0.3rem ;
        color : #666 ;
        text-align : right ;
        margin-top : 0.3rem ;
      }
    }
  }
</style>
