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
      <el-table  :data="tableData"  border fit   @select="handleCurrentChange" @select-all="allData">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="orderId" label="序号"></el-table-column>
        <el-table-column label="图片">
          <template slot-scope="scope">
            <img :src="scope.row.imgUrl"  @click="showImg( scope.row.imgUrl )" />
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
        <img :src=" imageDomain + bigImg"  />
      </div>
      <el-dialog :title="'批量修改商品'+ title " :visible.sync="dialogVisible" width="50%" center>
        <!--<el-table  :data="subTableData"  border fit ref="changeData">-->
          <!--<el-table-column prop="title" label="商品名称"></el-table-column>-->
          <!--<el-table-column prop="price" label="当前价格" v-if="this.changeType === '1'"></el-table-column>-->
          <!--<el-table-column prop="newPrice" label="修改后的价格"  v-if="this.changeType === '1'"></el-table-column>-->
          <!--<el-table-column prop="type" label="当前类目" v-if="this.changeType === '2'"></el-table-column>-->
          <!--<el-table-column prop="newType" label="修改后的类目" v-if="this.changeType === '2'"></el-table-column>-->
          <!--<el-table-column prop="express" label="当前运费状态" v-if="this.changeType === '3'"></el-table-column>-->
          <!--<el-table-column prop="newExpress" label="修改后的运费状态" v-if="this.changeType === '3'"></el-table-column>-->
        <!--</el-table>-->
        <table class="tableC"  border="1"  v-if="this.changeType === '1'">
          <tr><th>商品名称</th><th>当前价格</th><th>修改后的价格</th></tr>
          <tr v-for="(item,index) in subTableData" :key="index"><td>{{ item.title }}</td><td>{{ item. price}}</td><td> {{ getPrice }}</td></tr>
        </table>
        <table class="tableC"  border="1"  v-else-if="this.changeType === '2'">
          <tr><th>商品名称</th><th>当前类目</th><th>修改后的类目</th></tr>
          <tr v-for="(item,index) in subTableData" :key="index"><td>{{ item.title }}</td>{{ item. type}}<td></td><td>{{ getType }}</td></tr>
        </table>
        <table class="tableC"  border="1" v-else-if="this.changeType === '3'">
          <tr><th>商品名称</th><th>当前运费状态</th><th>修改后的运费状态</th></tr>
          <tr v-for="(item,index) in subTableData" :key="index"><td>{{ item.title }}</td><td>{{ item.express }}</td><td>{{ getExpress  }}</td></tr>
        </table>

        <div class="changeSelect" v-if="this.changeType === '1'">
          <p>价格修改</p>
          <el-input type="number" v-model.number="newPrice" size="mini"  ></el-input>
        </div>
        <div class="changeSelect" v-else-if="this.changeType === '2'">
          <p>类目修改</p>
          <!--<div>-->
            <el-input size="mini" type="text" v-model.trim="newType" @focus="selectVisible=true"></el-input>
            <el-button type="primary" size="mini" @click="selectVisible=true">选择</el-button>
          <!--</div>-->
        </div>
        <div class="changeSelect" v-else-if="this.changeType === '3'">
          <p>运费承担</p>
          <el-select  size="small" clearable v-model="expressType" filterable placeholder="运费承担">
            <el-option
              v-for="item in expressList"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div slot="footer" class="dialog-footer" >
          <el-button type="primary" size="mini" @click="saveNew">保存</el-button>
          <el-button size="mini" @click="dialogVisible = false;">取消</el-button>
        </div>
      </el-dialog>
      <el-dialog title="宝贝类目选择" :visible.sync="selectVisible" width="50%" center>
        <div class="selectWrap">
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
        <div slot="footer" class="dialog-footer" >
          <el-button type="primary" size="mini" @click="confirmType">确定</el-button>
          <el-button size="mini" @click="selectVisible = false;">取消</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>

    import ElButton from "element-ui/packages/button/src/button";

    export default {
      components: {
        ElButton
      },
      name: "List",
        data() {
            return {
              tableData: [],
              type : '',
              imageDomain : process.env.IMAGE_DOMAIN ,
              mask : false ,
              bigImg : '',
              changeType: '',
              title : '',
              dialogVisible: false ,
              subTableData: [],
              selectVisible: false ,
              newPrice: '',
              newType: '',
              goods: {
                firstType: '',
                secondType: '',
                thirdType: '',
              },
              firstTypeList : [{
                value: '1',
                name: '黄金糕'
              }, {
                value: '2',
                name: '双皮奶'
              }, {
                value: '3',
                name: '蚵仔煎'
              }, {
                value: '4',
                name: '龙须面'
              }, {
                value: '5',
                name: '北京烤鸭'
              }],
              secondTypeList : [{
                value: '1',
                name: '黄金糕'
              }, {value: '2', name: '双皮奶'}, {
                value: '3',
                name: '蚵仔煎'
              }, {value: '4', name: '龙须面'}, {
                value: '5',
                name: '北京烤鸭'
              }],
              thirdTypeList : [{
                value: '1',
                name: '黄金糕'
              }, {
                value: '2',
                name: '双皮奶'
              }, {
                value: '3',
                name: '蚵仔煎'
              }, {
                value: '4',
                name: '龙须面'
              }, {
                value: '5',
                name: '北京烤鸭'
              }],
              expressType : '1',
              expressList : [
                {
                  value : '1',
                  name : '卖家承担'
                },
                {
                  value : '2',
                  name : '买家承担'
                }
              ]
            }
        },
      computed: {
        getPrice(){
          return this.newPrice ;
        },
        getType(){
          return this.newType ;
        },
        getExpress(){
          return this.expressList[this.expressType-1].name ;
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
                price: '2',
                orderId : '111',
                title: '王小虎',
                source: '上海市普陀区金沙江路 1518 弄'
              }, {
                orderId: '2016-05-04',
                title: '王小虎',
                price : '4535435354',
                source: '上海市普陀区金沙江路 1517 弄'
              }, {
                orderId: '2016-05-01',
                title: '王小虎',
                price : '54',
                source: '上海市普陀区金沙江路 1519 弄'
              }, {
                orderId: '2016-05-03',
                title: '王小虎',
                price : '123',
                source: '上海市普陀区金沙江路 1516 弄'
              }
            ]
          },
          //查看源宝贝
          getSource(index,url){
            // console.log(url)
          },
          //删除商品
          deleteGoods(index,order){

          },
          //选择所有数据
          allData(val){
            this.subTableData = val ;

            // console.log(val,1)
          },
          //批量选择
          handleCurrentChange(row){
            // console.log(row,2);
            this.subTableData = row ;

          },
          isChange(){
            if(this.subTableData.length> 0){
              return true ;
            }else{
              this.$message({
                message : '请先选择需要修改的商品',
                center : true ,
                type : 'error'
              });
              return false ;
            }
          },
          //修改价格操作
          changePrice(){
            // console.log(this.isChange());
            if(this.isChange()){
              this.changeType = '1';
              this.title = '价格';
              this.dialogVisible = true ;

              // console.log(this.subTableData);
            }


          },

          //修改宝贝类目
          changeGoodsType(){
            if(this.isChange()) {

              this.title = '类目';
              this.changeType = '2';
              this.dialogVisible = true;
            }
          },
          //修改运费
          changeExpress(){
            if(this.isChange()) {

              this.title = '运费承担';
              this.changeType = '3';
              this.dialogVisible = true;
            }
          },
          //保存修改
          saveNew(){

            this.dialogVisible = false ;

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
          //确定类目修改
          confirmType(){
            this.newType = this.firstTypeList[this.goods.firstType-1].name + '>'+ this.secondTypeList[this.goods.secondType-1].name + '>' + this.thirdTypeList[this.goods.thirdType-1].name ;
            this.selectVisible = false ;
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
  .settings{
    margin : 0.5rem  0.8rem;
    width : 25% ;
    padding : 0.2rem ;
    box-sizing: border-box;
    border : 1px solid #aaa ;
    border-radius: 0.05rem ;
    h2{
      font-size : 0.24rem ;
      line-height : 0.6rem ;
      text-indent: 0.2rem ;
    }
    ul{
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      height : 0.4rem ;
    }
  }
  .tableC{
    width : 80% ;
    margin : auto ;
    /*border-collapse: collapse;*/
    border : 1px solid #d3d3dd!important;
    tr{
      height : 0.5rem ;

    }
    th,td{
      width : 30% ;
      text-align: center;
      border-right : 1px solid #d3d3dd!important;
      border-bottom : 1px solid #d3d3dd!important;

    }
  }
  .changeSelect{
    width : 90% ;
    margin : 0.5rem auto ;
    p{
      font-size : 0.24rem ;
      font-weight : bold ;
      line-height : 0.3rem ;
    }
    .el-input, .el-select{
      width : 40% ;
      margin-left : 0.2rem ;
    }

  }
</style>
