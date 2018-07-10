<template>
    <div class="goodsManage tableBox" v-loading="loading"  element-loading-text="拼命加载中">
      <h1>推广管理</h1>
      <div class="btn_wrap">
        <el-button type="primary" size="small" @click="dialogVisible= true ;">新增主推商品</el-button>
        <el-button type="primary" size="small" @click="deleteChoose">删除选中项</el-button>
      </div>
      <el-table :data="tableData"  border fit @select="chooseApart" @select-all="chooseAll">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="商品信息" >
          <template slot-scope="scope">
            <div class="goodsWrap">
              <img src="" alt="" />
              <div class="detailWrap">
                <span>{{ scope.row.goodsName}}</span>
                <span>商品编号：{{ scope.row.goodsCode}}</span>
                <span>￥{{ scope.row.price}}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="佣金比率"  width="90">
          <template slot-scope="scope">
            <span>{{ scope.row.ratio }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="90">
          <template slot-scope="scope">
            <span>{{ statusList[scope.row.status-1].name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <div class="action1">
              <el-button type="text" >编辑</el-button>
              <el-button type="text" @click="deleteItem(scope.$index,scope.row.id)">删除</el-button>
            </div>
            <div class="action2">
              <el-button type="text" >保存修改</el-button>
              <el-button type="text" >取消</el-button>
            </div>

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

      <el-dialog title="选择推广商品" :visible.sync="dialogVisible" width="70%" center :show-close="false">
        <div class="search">
          <el-input size="small" :maxlength="40" v-model.trim="shopName" placeholder="请输入商品名称"></el-input>
          <el-input size="small" :maxlength="40" v-model.trim="goodsCode" placeholder="请输入商品编号"></el-input>
          <el-button type="primary" size="mini" @click="getGoods()">搜索</el-button>
        </div>
        <el-table ref="multipleTable" :data="goodsList"  border fit class="chooseTable" max-height="300" @select="handleApart" @select-all="allData" >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="商品名称">
            <template slot-scope="scope">
              <div class="goodsWrap">
                <img src="" alt="" />
                <div class="detailWrap">
                  <span>{{ scope.row.goodsName}}</span>
                  <span>商品编号：{{ scope.row.goodsCode}}</span>
                  <span>￥{{ scope.row.price}}</span>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="设置佣金比率" prop="ratio">
            <template slot-scope="scope">
              <el-input placeholder="" v-model.trim="scope.row.ratio" size="mini" @change="getItemRatio"></el-input>
            </template>
          </el-table-column>
        </el-table>
        <div class="setting"><span>批量设置佣金：</span><el-input size="mini" v-model.trim="commonRatio" @change="setAllRatio"></el-input></div>
        <div class="block2">
          <el-pagination
            @size-change="handleSubSizeChange"
            @current-change="handleSubCurrentChange"
            :current-page.sync="subCurrentPage"
            :page-sizes="[10, 15, 20]"
            :page-size="subPageSize"
            layout=" sizes, prev, pager, next, jumper"
            :total="subTotalElements">
          </el-pagination>
          <span class="totalItems">共{{ subTotalPages }}页，{{ subTotalElements }}条记录</span>
        </div>
        <div slot="footer" class="dialog-footer" >
          <el-button type="primary" size="mini" @click="confirmAdd">完成添加</el-button>
          <el-button plain size="mini" @click="close">取消</el-button>

        </div>
      </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "goods-manage",
        data() {
            return {
              loading: false ,
              tableData: [],
              dialogVisible: false,
              shopName:'',
              goodsCode: '',
              goodsList: [],
              totalPages : '',
              totalElements : 0,
              currentPage : 1,
              pageSize : 10,
              subTotalElements: 0,
              subTotalPages: '',
              subCurrentPage: 1,
              subPageSize: 10,
              statusList:[
                {
                  value: '',
                  name: '',
                },
                {
                  value: '',
                  name: '',
                },
                {
                  value: '',
                  name: '',
                },
                {
                  value: '',
                  name: '',
                },
              ],
              commonRatio:'',
              chooseList : [],
              deleteList: [],
            }
        },
        mounted() {
          this.getList();
          this.getGoods();
        },
        methods: {
          //已有推广商品列表
          getList(){
            let formData = new FormData();
            formData.append('currenPage',this.currentPage);
            formData.append('pageSize',this.pageSize);
            this.loading = false;
            this.tableData =[{
              ratio: '2',
              status: '1',
              price: '123',
              goodsName: '王小虎',
              goodsDetail: '上海市普陀区金沙江路 1518 弄',
              goodsCode: '上海市普陀区金沙江路 1518 弄'

            }, {
              ratio: '4',
              status: '2',
              price: '234',
              goodsName: '王小虎',
              goodsDetail: '上海市普陀区金沙江路 1517 弄',
              goodsCode: '上海市普陀区金沙江路 1518 弄'

            }, {
              ratio: '1',
              status: '3',
              price: '1323',
              goodsName: '王小虎',
              goodsDetail: '上海市普陀区金沙江路 1519 弄',
              goodsCode: '上海市普陀区金沙江路 1518 弄'

            }, {
              ratio: '2',
              status: '4',
              price: '253',
              goodsName: '王小虎',
              goodsDetail: '上海市普陀区金沙江路 1516 弄',
              goodsCode: '上海市普陀区金沙江路 1518 弄'

            }]
          },
          //获取商品列表
          getGoods(){
            let formData = new FormData();
            formData.append('currenPage',this.subCurrentPage);
            formData.append('pageSize',this.subPageSize);

            this.loading = false ;
            this.goodsList = [{
              ratio: '2%',
              goodsName: '王小虎',
              price: '123',
              goodsCode: '上海市普陀区金沙江路 1518 弄'
            }, {
              ratio: '4%',
              goodsName: '王小虎',
              price: '654',
              goodsCode: '上海市普陀区金沙江路 1517 弄'
            }, {
              ratio: '1%',
              goodsName: '王小虎',
              price: '1423',
              goodsCode: '上海市普陀区金沙江路 1519 弄'
            }, {
              ratio: '3%',
              goodsName: '王小虎',
              price: '223',
              goodsCode: '上海市普陀区金沙江路 1516 弄'
            }];
          },
          //选择所有数据
          allData(val){
            this.chooseList = val ;
            console.log(val,1)
          },
          //选择部分数据
          handleApart(row){
            console.log(row,2);
            this.chooseList = row ;

          },
          getItemRatio(){
            console.log(this.goodsList);
          },
          //批量设置比率
          setAllRatio(){
            this.goodsList.map( i => {
              i.ratio = this.commonRatio ;
            })
          },
          //确认新增
          confirmAdd(){
            console.log(this.chooseList);
            this.dialogVisible = false ;

            // this.chooseList
          },
          //取消新增
          close(){
            this.dialogVisible = false ;
            this.$refs.multipleTable.clearSelection();
          },
          chooseAll(val){
            this.deleteList = val ;
            console.log(val);

          },
          //
          chooseApart(row){
            this.deleteList = row ;

            console.log(row);

          },
          //批量删除
          deleteChoose(){
            console.log(this.deleteList);

          },
          //删除选中项
          deleteItem(index,id){
            console.log(id);
          },
          handleSizeChange(val) {

            this.pageSize = val ;
            this.getList();
          },
          handleCurrentChange(val) {

            this.currentPage = val ;
            this.getList();
          },
          handleSubSizeChange(val) {

            this.subPageSize = val ;
            this.getGoods();
          },
          handleSubCurrentChange(val) {

            this.subCurrentPage = val ;
            this.getGoods();
          },
        }
    }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import '../../../styles/table';
  .btn_wrap{
    width: 90% ;
    margin : 0.2rem auto;
  }
  .search{
    width : 100% ;
    padding : 0 0.5rem 0.2rem;
    height : 50px ;
    border-bottom : 1px solid #aaa ;
    margin-bottom : 0.3rem ;
    .el-input{
      width : 18% ;
      margin :0 0.25rem 0.2rem ;
      float : left;
    }
    .el-button {
      width : 65px ;
      margin-bottom : 0.2rem ;
      margin-left : 20px ;
      float : left;

    }
  }
  .goodsWrap{
    padding: 0.1rem ;
    box-sizing: border-box;
    display: flex;
    flex-wrap: nowrap;
    flex-direction: row;
    img{
      width : 30% ;
      margin: auto ;
    }
    .detailWrap{
      flex-direction: column;
      flex: 1 ;
      font-size: 0.14rem ;
      color : #666;
      span{
        display: inline-block;
        text-align: left;
        width: 100%;
      }
    }
  }

  .chooseTable{
    .el-input{
      width : 40%;
    }
  }
  .setting{
    width : 50% ;
    margin-bottom: 0.3rem ;
    padding-left : 0.7rem;
    .el-input{
      width : 30% ;

    }
  }
</style>
