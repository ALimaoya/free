<template>
  <div class="goodsList activityTable">
    <h1>商品清单</h1>
    <div class="search">
      <el-input size="small" :maxlength="20" v-model.trim="account.EQ_code" placeholder="商品编号"></el-input>
      <el-input size="small" :maxlength="20" v-model.trim="account.LIKE_productName" placeholder="商品名称"></el-input>
      <el-select  size="small" clearable v-model="firstType" @change="getSecondList(firstType)" filterable placeholder="请选择一级分类">
        <el-option
          v-for="item in firstTypeList"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <el-select size="small" clearable v-model="secondType" @change="getThirdList(secondType)" filterable placeholder="请选择二级分类">
        <el-option
          v-for="item in secondTypeList"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <el-select  size="small" clearable v-model="thirdType" filterable placeholder="请选择三级分类">
        <el-option
          v-for="item in thirdTypeList"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <el-select  size="small" clearable v-model="account.EQ_status" filterable placeholder="请选择审核状态">
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
      <el-table-column prop="id" label="商品序号" width="75"></el-table-column>
      <el-table-column prop="code" label="商品编号" ></el-table-column>
      <el-table-column prop="shopName" label="所属店铺" ></el-table-column>
      <el-table-column prop="productName" label="商品名称" ></el-table-column>
      <el-table-column prop="brandCnName" label="商品品牌" ></el-table-column>
      <el-table-column label="分类" width="190">
        <template slot-scope="scope">
          <span style="font-size: 0.12rem ;" v-if="scope.row.cateGoryMap!== {}">{{ scope.row.cateGoryMap.categoryName1}}>{{ scope.row.cateGoryMap.categoryName2}}>{{ scope.row.cateGoryMap.categoryName3}} </span>
        </template>
      </el-table-column>
      <el-table-column label="规格" width="225" show-overflow-tooltip>
        <template slot-scope="scope">
          <!--<el-table :data="scope.row.size"  border fit :header-row-class-name="thColor" :row-style="tbColor">-->
            <!--<el-table-column prop="size" label="尺码" ></el-table-column>-->
            <!--<el-table-column prop="color" label="颜色"></el-table-column>-->
            <!--<el-table-column prop="num" label="库存" ></el-table-column>-->
          <!--</el-table>-->
          <table class="tableC" v-if="scope.row.productItems.length!== 0">
            <tr class="thColor"><th>尺寸</th><th>颜色</th><th>库存</th></tr>
            <tr class="tbColor"><td>{{ scope.row.productItems[0].size }}</td>
              <td>{{ scope.row.productItems[0].color }}</td>
              <td>{{ scope.row.productItems[0].stock }}</td>
            </tr>
          </table>
        </template>
      </el-table-column>
      <el-table-column prop="price" label="价格（元）" ></el-table-column>
      <el-table-column prop="createTime" label="创建时间" ></el-table-column>
      <el-table-column  label="状态" width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.status !== ''">{{ statusList[(scope.row.status*1+1)*1].name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" >
        <template slot-scope="scope">
        <el-button size="mini" type="warning" v-if="scope.row.status === '1'&& scope.row.shelveStatus === '1'"  @click="handleShelves(scope.$index,scope.row.id,0)">下架</el-button>
        <el-button size="mini" type="warning" v-if="scope.row.status === '1'&& scope.row.shelveStatus === '0'" @click="handleShelves(scope.$index,scope.row.id,1)">上架</el-button>
        <el-button size="mini" type="primary" v-if="scope.row.status === '0'|| scope.row.status === '2'" @click="editor(scope.$index,scope.row.id)">修改</el-button>
        <el-button size="mini" type="warning" v-if="scope.row.status === '2'" @click="handleReason(scope.$index,scope.row.reason)">查看原因</el-button>

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
    <el-dialog class="shop_dialog" title="审核拒绝原因" top="20%" :visible.sync="refuseDialog" width="30%" center
               :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">

      <p>{{ refuseReason }}</p>
      <span slot="footer" class="dialog-footer">

        <el-button plain @click="refuseDialog = false;refuseReason = ''; " size="mini">关闭</el-button>

      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { parseTime } from "@/utils"
  import { getMobile } from "@/utils/auth"
  import { getGoodsList,firstList,secondList,thirdList,changeStatus ,changeGoods} from "@/api/merchant"
    export default {
        name: "goods-list",
      data(){
          return{
            account : {
              EQ_code: '',
              LIKE_productName: '',
              EQ_status: ''
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
                value : '0'
              },
              {
                name : '已通过',
                value : '1'
              },
              {
                name : '未通过',
                value : '2'
              }
            ],
            thColor : true ,
            tbColor : true,
            tableData : [],
            totalPages : '',
            totalElements : 0,
            currentPage : 1,
            pageSize : 10,
            firstType: '',
            secondType: '',
            thirdType: '',
            time: '',
            refuseReason: '',
            refuseDialog: false ,
            user: getMobile(),
          }
      },
      mounted(){
        this.time = parseTime(new Date());
        this.getList();
        this.getFirstList();
      },
      methods : {
        //  获取商品列表
        getList(){
          let formData = new FormData();
          if(this.firstType !== ''&&  this.secondType === ''){
            this.$message({
              message : '请选择二级分类或三级分类',
              center: true ,
              type : 'error',
              duration: 1000
            });
            return false ;
          }
          formData.append('EQ_category.id',this.thirdType);
          formData.append('EQ_category.parent.id',this.secondType);
          formData.append('EQ_code',this.account.EQ_code);
          formData.append('LIKE_productName',this.account.LIKE_productName);
          formData.append('EQ_status',this.account.EQ_status);
          formData.append('currentPage',this.currentPage);
          formData.append('pageSize',this.pageSize);
          getGoodsList(formData).then( res => {
            if(res.data.status === '000000000') {
              this.tableData = res.data.data;
              this.totalPages = res.data.totalPages ;
              this.totalElements = res.data.totalElements ;
              console.log(this.tableData);

            }else{
              this.$message({
                message : res.data.message,
                center: true ,
                type : 'error'
              })
            }
          }).catch( err => {

          });

        },
        //  获取一级分类
        getFirstList(){
          firstList().then(res=> {
            if(res.data.status === '000000000'){
              this.firstTypeList = res.data.data

            }else{
              this.$message({
                message : res.data.message,
                center: true ,
                type : 'error'
              })
            }
          }).catch( err => {

          })
        },
        //  获取二级分类
        getSecondList(type){
          console.log(type);
          secondList(type).then(res=> {
            if(res.data.status === '000000000'){
              this.secondTypeList = res.data.data

            }else{
              this.$message({
                message : res.data.message,
                center: true ,
                type : 'error'
              })
            }
          }).catch( err => {

          })

        },
        //获取三级分类
        getThirdList(type){
          thirdList(type).then(res=> {
            if(res.data.status === '000000000'){
              this.thirdTypeList = res.data.data

            }else{
              this.$message({
                message : res.data.message,
                center: true ,
                type : 'error'
              })
            }
          }).catch( err => {
            console.log(err);

          })

        },
      //  查询
        search(){
          this.getList();

        },
        //重置搜索条件
        reset(){
          this.account = {
            EQ_code: '',
            LIKE_productName: '',
            EQ_status: ''
          },
            this.firstType = '',
            this.secondType = '',
            this.thirdType = '',
            this.currentPage = 1,
            this.pageSize = 10,
          this.getList();
        },
        //上/下架操作
        handleShelves(index,order,type){

          changeStatus(order,type,this.user).then(res=> {
            if(res.data.status === '000000000'){
              this.$message({
                message : '操作成功',
                type : 'success',
                center : true ,
                duration : 1000
              });
              setTimeout(() => {
                window.location.reload();

              },1500)
            }else{
              this.$message({
                message : res.data.message,
                center: true ,
                type : 'error'
              })
            }
          }).catch( err => {

          })

        },
        //查看审核拒绝原因
        handleReason(index,reason){
          this.refuseReason = reason ;
          this.refuseDialog = true ;
        },
        //修改商品
        editor(index,order){
          this.$router.push({ path : '/merchantCenter/goods/goodsDetail',query: {'order':order}})

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
