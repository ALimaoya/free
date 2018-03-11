<template>
  <div class="shopContent">
    <div class="new">
      <p>店铺管理<button @click="toNew">绑定新店铺</button></p>
    </div>
    <div class="search">
      <el-select size="small" clearable v-model="shop.EQ_platformType" filterable placeholder="请选择平台类型">
        <el-option
          v-for="item in platformOptions"
          :key="item.value"
          :label="item.name"
          :value="item.value">
        </el-option>
      </el-select>
      <el-select size="small" v-model="shop.EQ_status" filterable placeholder="请选择店铺状态" clearable>
        <el-option
          v-for="item in activityOptions"
          :key="item.value"
          :label="item.name"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button size="small" round type="primary" @click="getShopList()">搜索店铺</el-button>
    </div>

    <el-table class="list" :data="tableData.slice((currentPage-1)*pageSize,currentPage.pageSize)" stripe border style="width: 100%">
        <el-table-column prop="shopName" label="店铺" width="180"></el-table-column>
        <el-table-column prop="platform" label="平台类型" width="180">
          <template slot-scope="scope">
            {{ platformOptions[scope.row.platform-1].name}}
          </template>
        </el-table-column>
        <el-table-column prop="messageId" label="旺旺ID/咚咚ID"></el-table-column>
        <!--<el-table-column prop="status" label="状态">-->
          <!--<template slot-scope="scope">-->
            <!--{{ activityOptions[scope.row.status-1].name }}-->
          <!--</template>-->
        <!--</el-table-column>-->
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <span>{{ activityOptions[scope.row.status -1].name}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="action" label="操作">
          <template slot-scope="scope" >
            <div v-if="scope.row.action==='1'">
              <el-button size="mini" @click="reason(scope.$index,scope.row.reason)"  style="width : 0.6rem ;padding : 0.07rem 0.06rem;">查看原因</el-button>
              <el-button size="mini" @click="change(scope.$index)"  style="width: 0.6rem ;">修改</el-button>
            </div>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="绑定时间"></el-table-column>
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
        :total="tableData.length">
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
              {
                value : '4',
                name : '拼多多'
              }
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
                name : '需要更新资料',
                value : '4'
              }
            ],
            shop : {
              EQ_platformType :'',
              EQ_status : ''
            },
            tableData : [],
            reasonBox : false ,
            reasonWord : '',
            currentPage : 1,
            pageSize : 10 ,
            totalPages : '',
            totalElements:'',
          }
        },
        mounted(){
          this.getShopList();
        },
        methods : {
          toNew(){
            this.$router.push('/newshop')
          },
          //获取店铺列表
          getShopList(){
              let formData = new FormData();
              formData.append('EQ_platformType' , this.shop.EQ_platformType);
              formData.append('EQ_status',this.shop.EQ_status);
              formData.append('currentPage' ,this.currentPage);
              formData.append('pageSize' , this.pageSize);
            shopList(formData).then( res => {
              if(res.data.status === '000000000'){
                console.log(res.data);
                this.tableData = res.data.data ;
                this.totalPages = res.data.totalPages ;
                this.totalElements=res.data.totalElements;
              }
            }).catch(err => {
              alert('服务器开小差啦，请稍等~')
            })
          },
          reason(index){
            console.log(index);
            this.reasonBox = true ;
            this.reasonWord = this.tableData[index].reasonInfo;
          },

          change(index){
            console.log(index);
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
          width : 1rem ;
          height : 0.34rem ;
          border-radius: 0.05rem ;
          background : #409EFF ;
          color : #fff ;
          font-size : 0.14rem ;
          text-align: center;
          line-height : 0.34rem ;
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
        width : 1.6rem ;
      }
    }
    .list{
      border : 1px solid #aaa ;
      margin-top : 0.4rem ;
      border-radius : 0.05rem ;

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
