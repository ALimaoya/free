<template>
    <div class="sourceGoodsList tableBox">
      <h1 class="h_title">源宝贝列表</h1>
      <div class="settings">
        <h2>批量修改</h2>
        <ul>
          <li><el-button type="primary" size="mini" @click="changePrice">价格</el-button></li>
          <li><el-button type="primary" size="mini" @click="changeGoodsType">宝贝类目</el-button></li>
          <li><el-button type="primary" size="mini" @click="changeExpress">运费</el-button></li>

        </ul>
      </div>
      <el-table  :data="tableData"  border fit   @row-click="handleCurrentChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="orderId" label="序号"></el-table-column>
        <el-table-column label="图片">
          <template slot-scope="scope">
            <img :src="scope.row.imgUrl" alt="" @click="showImg( scope.row.imgUrl )" />
          </template>
        </el-table-column>
        <el-table-column prop="title" label="宝贝标题" ></el-table-column>
        <el-table-column prop="price" label="价格" ></el-table-column>
        <el-table-column prop="source" label="来源" ></el-table-column>
        <el-table-column prop="type" label="商品类目" ></el-table-column>
        <el-table-column prop="action" label="操作" >
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="getSource(scope.$index,scope.row.goodsUrl)">查看源</el-button>
            <el-button type="text" v-if="type === '1'" size="mini" @click="deleteGoods(scope.$index,scope.row.orderId)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="mask" @click="close" class="mask">
        <img :src=" imageDomain + bigImg" alt="" />
      </div>
      <el-dialog :title="{title}" :visible.sync="dialogVisible" width="50%" center>
        <el-table  :data="subTableData"  border fit v-if="this.changeType === '1'">
          <el-table-column prop="goodsName" label="序号"></el-table-column>
          <el-table-column prop="oldPrice" label="当前价格"></el-table-column>
          <el-table-column label="修改后的价格">
            <template slot-scope="scope">
              <el-input type="number" v-model.number="scope.row.newPrice" size="mini"></el-input>
            </template>
          </el-table-column>
        </el-table>
        <el-table  :data="subTableData"  border fit v-else-if="this.changeType === '2'">
          <el-table-column prop="goodsName" label="序号"></el-table-column>
          <el-table-column prop="oldType" label="当前类目"></el-table-column>
          <el-table-column label="修改后的类目">
            <template slot-scope="scope">
              {{ goods.firstType>goods.secondType>goods.thirdType}}
            </template>
          </el-table-column>
        </el-table>
        <div class="">
          <el-select  size="small" clearable v-model="goods.firstType" @change="getSecondList(goods.firstType)" filterable placeholder="请选择一级分类">
            <el-option
              v-for="item in firstTypeList"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select size="small" clearable v-model="goods.secondType" @change="getThirdList(goods.secondType)" filterable placeholder="请选择二级分类">
            <el-option
              v-for="item in secondTypeList"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select  size="small" clearable v-model="goods.thirdType" filterable placeholder="请选择三级分类">
            <el-option
              v-for="item in thirdTypeList"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
      </el-dialog>
    </div>
</template>

<script>

    import ElButton from "element-ui/packages/button/src/button";
    import ElSelect from "element-ui/packages/select/src/select";

    export default {
      components: {
        ElSelect,
        ElButton},
      name: "List",
        data() {
            return {
              tableData: [],
              type : '',
              imageDomain : process.env.IMAGE_DOMAIN ,
              mask : false ,
              bigImg : '',
              changeType: '',
              // checked : '',
              multipleSelection: [],
              title : '',
              dialogVisible: false ,
              subTableData: [],
              typeName: '',
              goods: {
                firstType: '',
                secondType: '',
                thirdType: '',
              },
              firstTypeList : [],
              secondTypeList : [],
              thirdTypeList : [],
            }
        },
        mounted() {
          this.type = this.$route.query.type ;
          this.getList();
          this.getFirstList();

          // console.log(this.$route,this.type);
        },
        methods: {
          getList(){
            this.tableData = [
              {
                price: '2016-05-02',
                orderId : '111',
                title: '王小虎',
                source: '上海市普陀区金沙江路 1518 弄'
              }, {
                orderId: '2016-05-04',
                title: '王小虎',
                subOrderId : '4535435354',
                source: '上海市普陀区金沙江路 1517 弄'
              }, {
                orderId: '2016-05-01',
                title: '王小虎',
                source: '上海市普陀区金沙江路 1519 弄'
              }, {
                orderId: '2016-05-03',
                title: '王小虎',
                source: '上海市普陀区金沙江路 1516 弄'
              }
            ]
          },
          //查看源宝贝
          getSource(index,url){
            console.log(url)
          },
          //删除商品
          deleteGoods(index,order){

          },
          //批量选择
          handleCurrentChange(row,event){
            if(event.target.nodeName!=="INPUT"){

              if(this.multipleSelection.indexOf(row.orderId)=== -1){
                this.multipleSelection.push(row.orderId);
                // let num = this.multipleSelection.indexOf(row.orderId);
                // this.multipleSelection.splice(num,1);
                return this.multipleSelection;

              }else{
                let num = this.multipleSelection.indexOf(row.orderId);
                this.multipleSelection.splice(num,1);
                return this.multipleSelection;

              }

            }else{
              return false ;
            }


          },
          //修改价格
          changePrice(){
            this.changeType = '1';
            this.dialogVisible = true ;

            console.log(this.multipleSelection);

          },
          //修改宝贝类目
          changeGoodsType(){
            this.changeType = '2';

          },
          //修改运费
          changeExpress(){
            this.changeType = '3';

          },
          //关闭弹窗
          close(){
            this.dialogVisible = false ;

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
          //查看宝贝大图
          showImg(url){
            this.mask = true ;
            this.bigImg = url ;
          },
          close(){
            this.mask = false ;
            this.bigImg = '' ;
          },
        }
    }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import '../../../styles/table';

</style>
