<template>
    <div class="goodsManage tableBox" v-loading="loading"  element-loading-text="拼命加载中">
      <h1>推广管理</h1>
      <div class="btn_wrap">
        <el-button type="primary" size="small" @click="getGoods">新增主推商品</el-button>
        <el-button type="primary" size="small" @click="deleteChoose">删除选中项</el-button>
      </div>
      <el-table :data="tableData"  border fit @select="chooseApart" @select-all="chooseAll">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="商品信息" >
          <template slot-scope="scope">
            <div class="goodsWrap">
              <img v-if="scope.row.productImage!==null&&scope.row.productImage!==''" :src="imageDomain + scope.row.productImage"  />
              <img  src="../../../assets/404_images/fail.png" v-else>

              <div class="detailWrap">
                <span>{{ scope.row.productName }}</span>
                <span>商品编号：{{ scope.row.code}}</span>
                <span>￥{{ scope.row.price}}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="佣金比率(%)"  width="125" class="flex_show" >
          <template slot-scope="scope">
            <span class="showRatio" :class="{ isHide:show[scope.$index*1] === scope.$index, isEdited:date[scope.$index*1] !==false&&(show[scope.$index*1] === '' || show[scope.$index*1] === undefined)}" @click="editRatio(scope.$index,scope.row.brokerageRate)">{{ scope.row.brokerageRate }}</span>
            <el-input type="number" v-model.number="scope.row.brokerageRate"  class="ratio_input" size="mini" :class="{isActive:show[scope.$index*1] === scope.$index }"></el-input>
            <el-popover trigger="hover" placement="right"  >
              <p>距该修改生效还需时间：</p>
              <p class="tips_warn"> {{ date[scope.$index] }}</p>
              <p v-if="scope.row.usingBrate!== null">原比率：{{ scope.row.usingBrate}}</p>
              <div slot="reference" class="name-wrapper">
                <svg-icon slot="reference" class="icon isHide" icon-class="alarm" :class="{isEdited:date[scope.$index*1] !==false&&(show[scope.$index*1] === '' || show[scope.$index*1] === undefined)}"></svg-icon>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="90">
          <template slot-scope="scope">
            <span>{{ statusList[scope.row.status-0].name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <div class="action1" :class="{isHide:show[scope.$index*1] === scope.$index }">
              <el-button type="text" @click="editRatio(scope.$index,scope.row.brokerageRate)">编辑</el-button>
              <el-button type="text" @click="deleteItem(scope.$index,scope.row.id,scope.row.productId)">删除</el-button>
            </div>
            <div class="action2 isHide"  :class="{isActive:show[scope.$index*1] === scope.$index }">
              <el-button type="text" @click="saveEdit(scope.$index,scope.row.brokerageRate,scope.row.id)">保存修改</el-button>
              <el-button type="text"  @click="cancelEditor(scope.$index,scope.row.brokerageRate)">取消</el-button>
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
        <span class="totalItems" >共{{totalPages }}页，{{ totalElements }}条记录</span>
      </div>

      <el-dialog title="选择推广商品" :visible.sync="dialogVisible" width="75%" center :show-close="false" >
        <div class="search">
          <el-input size="small" :maxlength="40" v-model.trim="shopName" placeholder="请输入商品名称" clearable></el-input>
          <el-input size="small" :maxlength="40" v-model.trim="goodsCode" placeholder="请输入商品编号" clearable></el-input>
          <el-button type="primary" size="mini" @click="getGoods">搜索</el-button>
        </div>
        <el-table ref="multipleTable" :data="goodsList"  border fit class="chooseTable" max-height="600" @select="handleApart" @select-all="allData" v-loading="loading2"  element-loading-text="拼命加载中">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="商品名称">
            <template slot-scope="scope">
              <div class="goodsWrap">
                <img v-if="scope.row.productImages!==null&&scope.row.productImages[0]!==''" :src="imageDomain+ scope.row.productImages[0]" />
                <img  src="../../../assets/404_images/fail.png" v-else>
                <div class="detailWrap">
                  <span>{{ scope.row.productName}}</span>
                  <span>商品编号：{{ scope.row.code}}</span>
                  <span>￥{{ scope.row.price}}</span>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="设置佣金比率(%)" prop="brokerageRate">
            <template slot-scope="scope">
              <el-input placeholder="1.5%(默认)"  v-model.trim="scope.row.brokerageRate" size="mini" @change="validPercent(scope.row.brokerageRate)"></el-input>
            </template>
          </el-table-column>
        </el-table>
        <div class="setting"><span>批量设置佣金：</span><el-input size="mini" v-model.trim="commonRatio" @change="handleApart(chooseList)"></el-input></div>
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
          <span class="totalItems" >共{{ subTotalPages }}页，{{ subTotalElements }}条记录</span>

        </div>
        <div slot="footer" class="dialog-footer" style="padding-bottom: 0px;height: 0.7rem ;">
          <el-button type="primary" size="mini" @click="confirmAdd">完成添加</el-button>
          <el-button plain size="mini" @click="close">取消</el-button>

        </div>
      </el-dialog>

      <el-dialog class="file_dialog" title="修改佣金" top="20%" :visible.sync="editDialog" width="30%" center>
       <ul>
         <li>当前修改为：{{ currentRatio }}</li>
         <li>佣金范围：{{ range }}</li>
         <li>确认修改{{ hour }}个小时后生效</li>
       </ul>
        <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="confirm">确定</el-button>
        <el-button plain size="small" @click="editDialog= false ;">取消</el-button>
      </span>
      </el-dialog>
    </div>
</template>

<script>
    import SvgIcon from "../../../components/SvgIcon/index";
    import { getSpreadList, addSpread, hasSpreadGoods, editorR, deleteGoods,batchDelete } from "@/api/merchant"
    import { parseTime,countTime } from "@/utils"
    // import { validPercent } from "@/utils/validate"
    export default {
      components: {SvgIcon},
      name: "goods-manage",
        data() {
            return {
              loading: true ,
              loading2: true ,
              tableData: [],
              dialogVisible: false,
              shopName:'',
              goodsCode: '',
              goodsList: [],
              totalPages : 0,
              totalElements : 0,
              currentPage : 1,
              pageSize : 10,
              subTotalElements: 0,
              subTotalPages: 0,
              subCurrentPage: 1,
              subPageSize: 10,
              statusList:[
                {
                  value: '0',
                  name: '待生效',
                },
                {
                  value: '1',
                  name: '生效中',
                }

              ],
              commonRatio:'',
              chooseList : [],
              deleteList: [],
              show:[],
              currentRatio: '',
              oldRatio: [],
              range: '1.5%-70%',
              hour: '12',
              editDialog: false ,
              currentIndex: '',
              edited: [],
              imageDomain : process.env.IMAGE_DOMAIN ,
              date: [],
              pageTimer: [],
              updateId: '',
            }
        },
        mounted() {
          this.getList();
        },
        // computed: {
        //   list : function(){
        //     return this.goodsList ;
        //   }
        // },
        methods: {
          //已有推广商品列表
          getList() {
            this.date = [];
            this.oldRatio = [];
            this.show = [];
            this.edited = [];
            for (var i in this.pageTimer) {
              clearInterval(this.pageTimer[i]);
            }

            let formData = new FormData();
            formData.append('currentPage', this.currentPage);
            formData.append('pageSize', this.pageSize);
            this.loading = true ;
            hasSpreadGoods(formData).then(res => {
              this.tableData = res.data.data ;
              this.totalPages = res.data.totalPages;
              this.totalElements = res.data.totalElements;
              if(this.tableData.length !== 0){
                this.tableData.map((i, index) => {
                  this.date.push(i.totalSeconds);
                });
                this.date.map((i, index) => {

                  this.pageTimer["timer" + index] = setInterval(() => {

                    this.$set(this.date,index,countTime(i));
                    i++;

                  }, 1000);

                });
              }
              this.loading = false;
            })
          },
          //获取商品列表
          getGoods(){
            this.dialogVisible= true ;
            let formData = new FormData();
            formData.append('currentPage',this.subCurrentPage);
            formData.append('pageSize',this.subPageSize);
            formData.append('EQ_code',this.goodsCode);
            formData.append('LIKE_productName',this.shopName);
            this.loading2 = true ;

            getSpreadList(formData).then( res => {
              this.loading2 = false ;
              this.goodsList = res.data.data ;
              this.subTotalPages = res.data.totalPages;
              this.subTotalElements = res.data.totalElements
              this.goodsList.map( i=> {
                i.brokerageRate = '';
              })
            })
            //   this.goodsList = [{
            //   ratio: '2%',
            //     productName: '王小虎',
            //   price: '123',
            //   code: '上海市普陀区金沙江路 1518 弄'
            // },
            //     {
            //   ratio: '4%',
            //     productName: '王小虎',
            //   price: '654',
            //   code: '上海市普陀区金沙江路 1517 弄'
            // },
            //     {
            //   ratio: '1%',
            //     productName: '王小虎',
            //   price: '1423',
            //   code: '上海市普陀区金沙江路 1519 弄'
            // },
            //     {
            //   ratio: '3%',
            //     productName: '王小虎',
            //   price: '223',
            //   code: '上海市普陀区金沙江路 1516 弄'
            // }];
          },
          //选择所有数据
          allData(val){
            this.chooseList = val ;
            this.setAllRatio();

          },
          //选择部分数据
          handleApart(row){
            this.chooseList = row ;
            this.setAllRatio();

          },

          //批量设置比率
          setAllRatio(){
            if(this.commonRatio !== ''){
              this.goodsList.map( i=> {
                i.brokerageRate = '';
              });
              if(this.chooseList.length>0){
                if(!this.validPercent(this.commonRatio)){
                  this.commonRatio = '';
                  return false ;

                }

                this.chooseList.map( (i,index) => {
                  // this.$set(this.chooseList[index],'brokerageRate' ,this.commonRatio)
                  i.brokerageRate = this.commonRatio ;
                });
                this.$refs.multipleTable.tableData.map( (i,index) =>{
                  this.$set(this.goodsList,index ,i)

                } )
                console.log(this.chooseList,this.$refs.multipleTable)

              }

            }


          },
          //确认新增
          confirmAdd(){
            // let flag = false ;
            if(this.commonRatio === ''){
              this.chooseList.map( i => {
                if(i.brokerageRate === ''){
                  i.brokerageRate = '1.5';

                }
              });

            }else{
              this.chooseList.map( i => {
                if(i.brokerageRate === ''){
                  i.brokerageRate = this.commonRatio;

                }
              });
            }

              // else{
              //   // i.brokerageRate = i.brokerageRate.split('%')[0];
              // }
            // if(!flag){
              let arr = [];
              this.chooseList.map( i =>{
                arr.push( { productId: i.id ,brokerageRate: i.brokerageRate})
              })
              addSpread(arr).then( res => {
                  if(res.data.status === '000000000'){
                    this.$message({
                      message:'添加成功',
                      type: 'success',
                      center: true,
                      duration: 1000
                    });
                    this.getList();
                    this.close() ;
                  }
              });


            // }
          },
          //取消新增
          close(){
            this.dialogVisible = false ;
            this.commonRatio = '';
            this.goodsCode = '';
            this.shopName = '';
            this.$refs.multipleTable.clearSelection();
          },
          chooseAll(val){
            this.deleteList = val ;
          },
          //
          chooseApart(row){
            this.deleteList = row ;
          },
          //批量删除
          deleteChoose(){
            let arr = [];
            this.deleteList.map( i => {
              arr.push( { id: i.id ,productId: i.productId ,brokerageRate: 0 })
            });
            this.loading = true ;
            batchDelete(arr).then( res => {
              this.loading = false ;
              if(res.data.status === '000000000'){
                this.$message({
                  message: '批量删除成功，请稍后确认',
                  center: true ,
                  type: 'success'
                });
                this.getList();

              }

            })
            // console.log(this.deleteList);

          },
          //删除选中项
          deleteItem(index,id,productId){
            this.loading = true ;
            deleteGoods(id,productId).then( res => {
              this.loading = false ;
              if(res.data.status === '000000000'){
                this.$message({
                  message: '删除成功',
                  center: true,
                  type: "success"
                });
                this.getList();

              }

            })
          },
          //编辑佣金比率
          editRatio(index,ratio){
            this.$set(this.show,index,index)  ;
            this.$set(this.oldRatio,index,ratio)  ;
            this.$set(this.edited,this.currentIndex,'')  ;
            // console.log(this.show,this.edited);
          },
          //保存编辑
          saveEdit(index,ratio,id){

          if(!this.validPercent(ratio)){

            return false ;

          }else{

            if(ratio !== this.oldRatio[index]&&ratio!== ''){
              this.currentRatio = ratio;
              this.editDialog = true ;
              this.currentIndex = index ;
              this.updateId = id;
            }else{
              this.$set(this.show,index,'')  ;

            }
          };

          },
          //取消编辑
          cancelEditor(index){
            this.$set(this.show,index,'')  ;
            this.$set(this.tableData[index], 'brokerageRate',this.oldRatio[index])  ;

          },
          //确认修改
          confirm(){
            editorR({ id: this.updateId ,brokerageRate:this.currentRatio}).then(res => {
              if(res.data.status === '000000000'){
                this.editDialog = false ;
                this.$set(this.show,this.currentIndex,'')  ;
                this.$set(this.edited,this.currentIndex,true)  ;
                this.getList();
              }
            });


          },

          validPercent(value){
              // let num = value.split('%')[0];
              if (value < 1.5 || value > 70) {
                this.$message({
                  message: '请输入' + this.range + '之间的百分数',
                  center: true,
                  type: 'error'
                });
                return false ;

              }else{
                return true ;
              }

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
      width : 20% ;
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
      width : 1rem ;
      height: 1rem ;
      margin: 0 0.2rem ;
    }
    .detailWrap{
      flex-direction: column;
      flex: 1 ;
      font-size: 0.16rem ;
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
  .isActive{
    display: block!important;
  }
  .ratio_input{
    width: 80% ;
    margin : auto ;
    display: none;
  }
  .isHide{
    display: none;
  }
  .showRatio{
    line-height : 0.4rem ;
    /*display: inline-block;*/
    color: #00CC33;
    width: 50% ;
    text-align: right;
  }
  .name-wrapper{
    width: 50% ;
    float:right;
  }
  .icon{
    width: 0.4rem ;
    height: 0.4rem ;
  }
  .isEdited{
    color : rgb(255, 153, 0);
    display: inline-block!important;

  }
  .tips_warn{
    margin : 0.07rem 0 ;
  }
  .el-pagination{
    white-space: pre!important;
  }


</style>
