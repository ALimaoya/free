<template>
  <div class="goodsList activityTable">
    <h1>商品清单</h1>
    <div class="search">
      <el-input size="small" :maxlength="20" v-model.trim="account.name" placeholder="商品编号"></el-input>
      <el-input size="small" :maxlength="20" v-model.trim="account.code" placeholder="商品名称"></el-input>
      <el-select  size="small" clearable v-model="account.firstType" @change="getSecondList(account.firstType)" filterable placeholder="请选择一级分类">
        <el-option
          v-for="item in firstTypeList"
          :key="item.value"
          :label="item.name"
          :value="item.value">
        </el-option>
      </el-select>
      <el-select size="small" clearable v-model="account.secondType" @change="getThirdList(account.secondType)" filterable placeholder="请选择二级分类">
        <el-option
          v-for="item in secondTypeList"
          :key="item.value"
          :label="item.name"
          :value="item.value">
        </el-option>
      </el-select>
      <el-select  size="small" clearable v-model="account.thirdType" filterable placeholder="请选择三级分类">
        <el-option
          v-for="item in thirdTypeList"
          :key="item.value"
          :label="item.name"
          :value="item.value">
        </el-option>
      </el-select>
      <el-select  size="small" clearable v-model="account.status" filterable placeholder="请选择审核状态">
        <el-option
          v-for="item in statusList"
          :key="item.value"
          :label="item.name"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button  size="small" type="primary"  @click="search()" class="searchOrder">查询</el-button>
      <el-button  size="small" type="primary"  @click="reset()" class="searchOrder">重置</el-button>
    </div>
    <div class="tableTitle">
      <h2>账户列表</h2>
      <el-button  size="mini" type="primary" style="padding : 0 5px;text-align : center ;height : 30px;line-height : 30px;" @click="newGoods()" class="searchOrder">新增商品</el-button>

    </div>
    <el-table  :data="tableData"  border fit>
      <el-table-column prop="orderId" label="商品序号"></el-table-column>
      <el-table-column prop="goodsId" label="商品编号" ></el-table-column>
      <el-table-column prop="shop" label="所属店铺" ></el-table-column>
      <el-table-column prop="goodsName" label="商品名称" ></el-table-column>
      <el-table-column prop="brand" label="商品品牌" ></el-table-column>
      <el-table-column prop="type" label="分类" ></el-table-column>
      <el-table-column label="规格" width="160" show-overflow-tooltip>
        <template slot-scope="scope">
          <!--<el-table :data="scope.row.size"  border fit :header-row-class-name="thColor" :row-style="tbColor">-->
            <!--<el-table-column prop="size" label="尺码" ></el-table-column>-->
            <!--<el-table-column prop="color" label="颜色"></el-table-column>-->
            <!--<el-table-column prop="num" label="库存" ></el-table-column>-->
          <!--</el-table>-->
          <table class="tableC">
            <tr class="thColor"><th>尺寸</th><th>颜色</th><th>库存</th></tr>
            <tr class="tbColor"><td></td><td></td><td></td></tr>
          </table>
        </template>
      </el-table-column>
      <el-table-column prop="price" label="价格" ></el-table-column>
      <el-table-column prop="createTime" label="创建时间" ></el-table-column>
      <el-table-column prop="status" label="状态" ></el-table-column>
      <el-table-column label="操作" >
        <template slot-scope="scope">
          <el-button size="mini" type="warning"  @click="handleOff(scope.$index,scope.row.goodsId)">下架</el-button>
          <el-button size="mini" type="primary"  @click="editor(scope.$index,scope.row.goodsId)">修改</el-button>
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
  </div>
</template>

<script>
    export default {
        name: "goods-list",
      data(){
          return{
            account : {
              name: '',
              code: '',
              firstType: '',
              secondType: '',
              thirdType: '',
              status: ''
            },
            firstTypeList : [],
            secondTypeList : [],
            thirdTypeList : [],
            statusList : [
              {
                name : '全部状态',
                value: ''
              },
              {
                name : '待审核',
                value : '1'
              },
              {
                name : '已通过',
                value : '2'
              },
              {
                name : '未通过',
                value : '3'
              }
            ],
            thColor : true ,
            tbColor : true,
            tableData : [],
            totalPages : '',
            totalElements : 0,
            currentPage : 1,
            pageSize : 10,
          }
      },
      mounted(){
          this.getList();
          this.getFirstList();
      },
      methods : {
        //  获取商品列表
        getList(){
          this.tableData = [
            {
              time: '2016-05-02',
              subOrderId : '111',
              orderId: '王小虎',
              address: '上海市普陀区金沙江路 1518 弄'
            }, {
              time: '2016-05-04',
              orderId: '王小虎',
              subOrderId : '4535435354',
              address: '上海市普陀区金沙江路 1517 弄'
            }, {
              time: '2016-05-01',
              orderId: '王小虎',
              address: '上海市普陀区金沙江路 1519 弄'
            }, {
              time: '2016-05-03',
              orderId: '王小虎',
              address: '上海市普陀区金沙江路 1516 弄'
            }
          ]

        },
        //  获取一级分类
        getFirstList(type){
          // this.firstTypeList =
        },
        //  获取二级分类
        getSecondList(type){
          // this.secondTypeList =
        },
        getThirdList(type){
          // this.thirdTypeList =
        },
      //  查询
        search(){

        },
        reset(){
          this.account = {

          }
        },
        //下架操作
        handleOff(index,order){

          window.location.reload();
        },
        //修改商品
        editor(index,order){
          this.$router.push({ path : '/merchantCenter/goods/newGoods',query: {'order':order}})

        },
        //新增商品
        newGoods(){
          this.$router.push('/merchantCenter/goods/newGoods')

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
  @import '../../../styles/activityTable';
  @import '../../../styles/table';

  .search{
    .el-input{
      margin-left : 0!important;
      width : 160px!important;
    }
    padding-bottom : 0!important;
    height : 120px!important;
  }
  .el-table{


    .cell{
      height : 0.5rem ;
    }
    .el-button{
      margin : 0.1rem auto;
    }


  }





</style>
