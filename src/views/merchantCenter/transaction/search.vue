<template>
  <div class="searchOrder activityTable"  v-loading="loading"  element-loading-text="拼命加载中">
      <h1>交易管理</h1>
      <div class="search">
        <div class="inputWrap">
          <el-select  size="small" clearable v-model="transition.EQ_activityType" filterable placeholder="订单类型">
            <el-option
              v-for="item in typeList"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
          <el-input size="small" :maxlength="40" v-model.trim="transition.EQ_payOrder" placeholder="订单号"></el-input>
          <el-input size="small" :maxlength="40" v-model.trim="transition.EQ_code" placeholder="子订单号"></el-input>
          <el-input size="small" :maxlength="40" v-model.trim="transition.productCode" placeholder="商品编号"></el-input>
          <el-input size="small" :maxlength="40" v-model.trim="transition.LIKE_payOrder" placeholder="买方账号"></el-input>
          <el-select  size="small" clearable v-model="transition.EQ_status" filterable placeholder="订单状态">
            <el-option
              v-for="item in statusList"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>

        </div>
        <div class="inputWrap">
        <div class="block">
          <span class="demonstration">交易开始时间：</span>
          <el-date-picker size="small" v-model="transition.GT_createTime"  type="datetime" placeholder="开始时间" ></el-date-picker>
        </div>
        <div class="block">
          <span class="demonstration">交易结束时间：</span>
          <el-date-picker size="small" v-model="transition.LT_createTime"  type="datetime" placeholder="结束时间" ></el-date-picker>
        </div>
        </div>
        <div class="inputWrap">
          <el-button  size="mini" type="primary"  @click="getList()" class="searchOrder">查询</el-button>
          <el-button  size="mini" type="primary"  @click="exportOrder()" class="searchOrder">导出</el-button>
          <a style="display: none" id="orderFile"  :href="baseUrl+'/center/order/export?merchantId='+ merchantId+ '&EQ_activityType='+ transition.EQ_activityType+'&EQ_payOrder.code='+ transition.EQ_payOrder +'&EQ_code='+ transition.EQ_code+'&productCode='+ transition.productCode+'&LIKE_payOrder.user.accountName='+transition.LIKE_payOrder+ '&GT_createTime='+ this.gt_time + '&LT_createTime='+ this.lt_time + '&EQ_status='+transition.EQ_status"></a>
          <el-button  size="mini" type="primary" style="padding: 0;text-align: center;height : 28px;"  @click="deliverDialog= true;excelTitle = '';" class="searchOrder">导入发货</el-button>
          <el-button  size="mini" type="primary"  @click="reset()" class="searchOrder">重置</el-button>
        </div>
      </div>
      <div class="tableTitle">
        <h2>交易列表</h2>
      </div>
    <el-table  :data="tableData"  border  align="center">
      <el-table-column label="订单/子订单"  width="135">
        <template slot-scope="scope">
          <span>{{ scope.row.orderCode}}</span>
          <span class="subOrder">({{ scope.row.code }})</span>
        </template>
      </el-table-column>
      <el-table-column  label="商品" class="goodsInfo" min-width="500">
        <template slot-scope="scope">
          <table class="tableC">
            <tr class="thColor">
              <th>商品编号</th><th>商品名称</th><th>品牌</th>
              <th>分类</th><th>规格</th><th>价格（元）</th><th>数量</th>
            </tr>
            <tr class="tbColor" v-for="(item , index) in scope.row.orderProducts" :key="index">
                  <td>{{item.productItem.code}}</td>
                  <td>{{item.productItem.productName}}</td>
                  <td>{{item.productItem.brandCnName}}</td>
                  <td>
                    <span v-if="item.productItem.cateGoryMap != ''">
                      <span v-if="item.productItem.cateGoryMap.categoryName1">{{item.productItem.cateGoryMap.categoryName1}}</span>/
                      <span v-if="item.productItem.cateGoryMap.categoryName2">{{item.productItem.cateGoryMap.categoryName2}}</span>/
                      <span v-if="item.productItem.cateGoryMap.categoryName3">{{item.productItem.cateGoryMap.categoryName3}}</span>
                    </span>
                  </td>
                  <td><span>{{item.productItem.size}}</span><span class="subOrder">{{item.productItem.color}}</span></td>
                  <td>{{item.price}}</td>
                  <td>{{item.quantity}}</td>
            </tr>
          </table>
        </template>
      </el-table-column>
      <el-table-column  label="订单分类" width="95">
        <template slot-scope="scope">
          <span v-if="scope.row.activityType!==''">{{ typeList[(scope.row.activityType*1+1)].name}}</span>
          <span v-else>{{ typeList[1].name}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="totalNum" label="总数量" width="70"></el-table-column>
      <el-table-column prop="payAmount" label="总价（元）" width="70"></el-table-column>
      <el-table-column prop="createTime" label="交易时间" width="100"></el-table-column>
      <el-table-column label="状态" width="100">
        <template slot-scope="scope">
          <el-button plain v-if="scope.row.status === '9'" size="mini" :type="statusList[scope.row.status-1].type">{{ statusList[scope.row.status*1-1].name }}</el-button>
          <el-button plain v-else-if="scope.row.status !== ''" size="mini" :type="statusList[scope.row.status*1].type">{{ statusList[scope.row.status*1].name }}</el-button>
          <el-button plain v-else size="mini" :type="statusList[0].type">{{ statusList[0].name }}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="action" label="操作" width="100">
        <template slot-scope="scope">
          <el-button type='primary'  @click="goDetail(scope.$index,scope.row.id)" size="mini">详情</el-button>
          <el-button type="warning" v-if="scope.row.status === '1'" @click="deliver(scope.$index,scope.row.id)" size="mini">发货</el-button>
          <el-button type='warning' v-if="scope.row.status === '2'" @click="changeWay(scope.$index,scope.row.id)" size="mini">修改快递</el-button>
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
    <el-dialog title="填写快递信息" :visible.sync="dialogVisible" width="50%"  :show-close="false" center>
      <el-form :model="expressForm" ref="expressForm" :rules="expressFormRule" label-position="right" class="expForm">
        <el-form-item  labelWidth="130px" label="快递公司：" prop="expressName">
          <el-select  size="small" clearable v-model="expressForm.expressName" filterable placeholder="快递公司">
            <el-option
              v-for="item in deliverList"
              :key="item.code"
              :label="item.name"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item   labelWidth="130px"  label="快递单号：" prop="expressNumber">
          <el-input class="inputInfo" size="small" v-model.trim="expressForm.expressNumber" placeholder="快递单号"></el-input>
        </el-form-item>
        <!--<el-form-item   labelWidth="130px"  label="确认密码：" prop="confirmPwd">-->
          <!--<el-input class="inputInfo" size="small" :type="pwdType" v-model.trim="expressForm.confirmPwd" placeholder="请输入登录密码"></el-input>-->
          <!--<span class="show-pwd" @click="showPwd">-->
          <!--<svg-icon icon-class="eyeopen" v-if="pwdType===''" />-->
          <!--<svg-icon v-else="pwdType==='password'" icon-class="eyeclose"></svg-icon>-->
        <!--</span>-->
        <!--</el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer" >
        <el-button type="primary" size="mini" @click="confirm('expressForm')">确认</el-button>
        <el-button plain size="mini" @click="close('expressForm')">关闭</el-button>

      </div>
    </el-dialog>
    <el-dialog class="file_dialog" title="导入发货信息" top="20%" :visible.sync="deliverDialog"  width="60%" center
               :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
      <a class="downTag" :href="baseUrl+ '/center/order/download/deliverTemplate'">模板下载</a>
      <el-form  :model="deliverFile" ref="deliverFile" :rules="fileRule" label-position="right">
        <el-form-item   labelWidth="130px"  label="上传Excel：" prop="sourceFile">
          <el-button type="primary" size="mini" @click="handelFile">选择文件</el-button>
          <span class="fileName">{{ excelTitle }}</span>
          <input id="openFile" class="hideFile" type="file" accept=".xlsx, .xls"  @change="handkeFileChange"></input>
          <!--<input  class="hideFile" v-model.trim="deliverFile.sourceFile"/>-->
        </el-form-item>
        <!--<el-form-item   labelWidth="130px"  label="确认密码：" prop="confirmPassword">-->
          <!--<el-input class="inputInfo" size="small" :type="pwdType" v-model.trim="deliverFile.confirmPassword" placeholder="请输入登录密码"></el-input>-->
          <!--<span class="show-pwd" @click="showPwd">-->
          <!--<svg-icon icon-class="eyeopen" v-if="pwdType===''" />-->
          <!--<svg-icon v-else="pwdType==='password'" icon-class="eyeclose"></svg-icon>-->
        <!--</span>-->
        <!--</el-form-item>-->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="importOrder('deliverFile')">确定</el-button>
        <el-button plain size="small" @click="cancelFile('deliverFile')">取消</el-button>
      </span>
    </el-dialog>
    <el-dialog class="file_dialog" title="提示" top="20%" :visible.sync="wrongDialog" width="60%" center
               :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
        <p>您导入的文件数据有问题，请下载查看错误信息并修改以后再上传！</p>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="importWrong">下载</el-button>
          <a style="display: none" id="wrongFile"  :href="baseUrl+'/center/order/download/errorFile?fileAddress='+wrongPath"></a>
        <el-button plain size="small" @click="wrongDialog= false ;">取消</el-button>
      </span>
    </el-dialog>

  </div>


</template>

<script>
  import {  validPassWord } from '@/utils/validate'
  import { getOrderList,confirmDeliver,importDeliver,deliverDemo,wrongDemo,exportList,isExport } from "@/api/merchant"
    export default {
      name: "search",
      data(){
        const validOrder = ( rule,value,callback) => {
          if(value === ''){
            callback(new Error('请输入快递单号'))
          }else{
            var reg = /^[0-9]{7,20}$/;
            if(!reg.test(value)){
              callback(new Error('请输入正确格式的快递单号'))

            }
            callback();
          }
        };
        // const validPassword = ( rule,value,callback) => {
        //   if(value === ''){
        //     callback(new Error('请输入登录密码'))
        //   }else{
        //     if (!validPassWord(value)) {
        //       callback(new Error('密码为8-16位的数字、字母组合'))
        //     }
        //     callback();
        //   }
        // }
          return{
            transition: {
              EQ_payOrder: '',
              EQ_code: '',
              productCode: '',
              LIKE_payOrder: '',
              GT_createTime: '',
              LT_createTime: '',
              EQ_status: '',
              EQ_activityType:'',
            },
            typeList:[
              {
                value: '',
                name: '全部类型'
              },
              {
                value: '0',
                name: '商城订单'
              },
              {
                value: '1',
                name: '秒杀订单'
              },
              {
                value: '2',
                name: '助力享免单'
              },
            ],
            statusList:[
              {
                name : '未支付',
                value : '0',
                type:'warning'
              },
              {
                name : '已支付',
                value : '1',
                type: 'success'

              },
              {
                name : '已发货',
                value : '2',
                type: 'primary'

              },
              {
                name : '确认收货',
                value : '3',
                type: 'success'

              },

              {
                name : '退款中',
                value : '4',
                type: 'warning'

              },
              {
                name : '已退款',
                value : '5',
                type: 'danger'

              },
              {
                name : '已取消',
                value : '6',
                type: 'info'

              },
              {
                name : '退款拒绝',
                value : '7',
                type: 'warning'

              },
              {
                name : '已删除',
                value : '9',
                type: 'info'

              },
            ],
            // thColor : true ,
            // tbColor : true,
            tableData : [],
            totalPages : 0,
            totalElements : 0,
            currentPage : 1,
            pageSize : 10,
            dialogVisible : false ,
            expressForm :{
              expressName: '',
              expressNumber: '',
            },
            expressFormRule : {
              expressName : [
                {
                  required : true ,trigger : 'change',message : '请选择快递公司'
                }
              ],
              expressNumber : [
                {
                  required : true ,trigger : 'blur',validator : validOrder
                }
              ],
              // confirmPwd: [
              //   {
              //     required : true ,trigger : 'blur',validator : validPassword
              //
              //   }
              // ]
            },
            deliverFile:{
              sourceFile: '',
              confirmPassword:''
            },
            fileRule:{
              sourceFile: [
                {
                  required : true ,trigger : 'change',message: '请上传文件'
                }
              ],

            },
            deliverList : [],
            expressType : '',
            deliverDialog: false ,
            excelData: {
              header: null,
              results: null
            },
            baseUrl: process.env.BASE_API ,
            wrongDialog: false ,
            wrongPath : '',
            excelTitle: '',
            merchantId: '',
            deliverOrder: '',
            loading : false ,

            // pwdType: 'password'
          }
      },
      mounted(){
        this.getList();
      },
      computed: {
        lt_time : function() {

          if(this.transition !== undefined  ){
            if( this.transition.LT_createTime === null){
              this.transition.LT_createTime = '';
            }
            return this.transition.LT_createTime ;

          }
          // else{
          //   // return '';
          // }
        },
        gt_time : function(){

          if(this.transition !== undefined ){
            if( this.transition.GT_createTime === null){
              this.transition.GT_createTime = '';
            }

            return this.transition.GT_createTime ;

          }
          // else{
          //   // return '';
          // }
        }
      },
      methods: {
        //  获取交易列表
        getList(){
          let formData = new FormData();
          formData.append('currentPage',this.currentPage);
          formData.append('pageSize',this.pageSize);
          formData.append('EQ_payOrder.code',this.transition.EQ_payOrder);
          formData.append('EQ_code',this.transition.EQ_code);
          formData.append('productCode',this.transition.productCode);
          formData.append('LIKE_payOrder.user.accountName',this.transition.LIKE_payOrder);
          formData.append('GT_createTime',this.transition.GT_createTime===null?'':this.transition.GT_createTime);
          formData.append('LT_createTime',this.transition.LT_createTime===null?'':this.transition.LT_createTime);
          formData.append('EQ_status',this.transition.EQ_status);
          formData.append('EQ_activityType',this.transition.EQ_activityType);
          this.loading = true ;

          getOrderList(formData).then( res => {
            this.loading = false ;

             this.deliverList=  res.data.data.tExpressResDtos ;
              this.tableData = res.data.data.pageResultDto.data ;
              this.totalElements = res.data.data.pageResultDto.totalElements;
              this.totalPages = res.data.data.pageResultDto.totalPages;
              this.merchantId = res.data.data.merchantId;
          })

        },

        getTime(value,type){
          if(value === null){
            if(type === 1){
              // this.$set(this.transition,'GT_createTime',' ');
              this.transition.GT_createTime = '';

            }
            if(type === 2){
              this.transition.LT_createTime = '';

            }
          }
        },
        //导出订单列表
        exportOrder(){
          let formData = new FormData();
          formData.append('EQ_payOrder.code',this.transition.EQ_payOrder);
          formData.append('EQ_code',this.transition.EQ_code);
          formData.append('productCode',this.transition.productCode);
          formData.append('LIKE_payOrder.user.accountName',this.transition.LIKE_payOrder);
          formData.append('GT_createTime',this.transition.GT_createTime===null?'':this.transition.GT_createTime);
          formData.append('LT_createTime',this.transition.LT_createTime===null?'':this.transition.LT_createTime);
          formData.append('EQ_status',this.transition.EQ_status);
          formData.append('EQ_activityType',this.transition.EQ_activityType);
          this.loading = true ;
          isExport(formData).then( res => {
            this.loading = false ;

            if(res.data.status === '000000000'){
              document.getElementById('orderFile').click()

            }else{
              this.$message({
                message : res.data.message,
                center : true ,
                type : 'error'
              })
            }
          });
        },
        //选择文件
        handelFile(){
          document.getElementById('openFile').click()

        },
        handkeFileChange(e) {
          this.deliverFile.sourceFile = e.target.files[0];
          this.excelTitle = e.target.files[0].name ;
        },


        //导入发货列表
        importOrder(formName){
          this.$refs[formName].validate( valid => {
            if(valid){
              let formData = new FormData();

              formData.append('sourceFile',this.deliverFile.sourceFile);
              // formData.append('confirmPassword','123456');
              // console.log(this.deliverFile)
              this.loading = true ;

              importDeliver(formData).then( res => {
                this.loading = false ;

                if( res.data.status === '015005002' ){
                  this.$message({
                    message: '导入发货列表成功' ,
                    center : true ,
                    type: 'success'
                  })
                  this.deliverDialog = false ;
                  this.getList();
                }else{
                  if(res.data.status == '015005003'){
                    this.$message({
                      message: res.data.message ,
                      center : true ,
                      type: 'error'
                    })
                  }else if( res.data.status === 'error'){
                    this.wrongDialog = true ;
                    this.wrongPath  = res.data.message ;
                  }

                }
              })

            }else{
            }
          })
        },
        //取消导入
        cancelFile(formName){
          this.$refs[formName].resetFields();
          this.deliverDialog = false ;
        },
        //下载错误列表
        importWrong(){
          document.getElementById('wrongFile').click()
          // let formData = new FormData();
          // formData.append('fileAddress',this.wrongPath)
          // console.log(this.wrongPath)
          // wrongDemo(this.wrongPath).then( res => {
          //         if( res.data.status === '000000000'){
          //           // window.location.href = res.data.data
          //         }else{
          //           this.$message({
          //             message: res.data.message ,
          //             center : true ,
          //             type: 'error'
          //           })
          //         }
          //       }).catch( err => {
          //         alert('服务器开小差啦，请稍等~')
          //
          //       })
        },

        //重置搜索条件
        reset(){
          this.transition = {
            EQ_payOrder: '',
            EQ_code: '',
            productCode: '',
            LIKE_payOrder: '',
            GT_createTime: '',
            LT_createTime: '',
            EQ_status: '',
          };
          this.currentPage = 1 ;
          this.pageSize = 10 ;
        },
        //查看订单详情
        goDetail(index,id){
          this.$router.push('/merchantCenter/transaction/transitionOrder/'+ id)
        },
        //发货
        deliver(index,order){
          this.deliverOrder = order ;
          this.dialogVisible = true ;
          this.expressType= '1';
        },
        //修改快递
        changeWay(index,order){
          this.deliverOrder = order ;
          this.dialogVisible = true ;
          this.expressType= '2';

        },

        //  确认快递相关操作
        confirm(formName){
          this.$refs[formName].validate((valid) => {
            if(valid){
              let data = { ...this.expressForm };
              data.orderId = this.deliverOrder;
              // this.loading = true ;

              confirmDeliver(data).then( res => {
                // this.loading = false ;

              this.$message({
                    message: '操作成功，请稍后确认' ,
                    center : true ,
                    type: 'success'
                  });
                  this.dialogVisible = false ;

                  setTimeout(() => {
                    this.getList();
                  },2000)
              })
            }else{

            }
          })
        },
        // showPwd() {
        //   if (this.pwdType === 'password') {
        //     this.pwdType = ''
        //   } else {
        //     this.pwdType = 'password'
        //   }
        // },
      //关闭弹窗
        close(formName){
          this.dialogVisible = false ;
          this.$refs[formName].resetFields();
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
    padding-bottom : 0!important;
    height : 170px!important;
    .inputWrap{
      width : 100% ;
      height: 32px;
      margin : 0 0.25rem 0.2rem ;
      .el-input{
        margin-left : 0!important;
        margin-bottom : 0!important;
        width : 160px!important;
      }
    }
    .inputWrap:nth-child(3){
      margin-left : 0!important;
    }
    .block{
      width : auto!important;
      .demonstration{
        width : 165px!important ;
        line-height : 32px!important;
        margin : 0 0 0 0.2rem!important ;

      }
      .el-date-editor{
        margin-right : 0.25rem!important ;

      }
      .el-input{
        width : 190px!important;

      }
    }
  }
  .el-table{


    .cell{
      height : 0.5rem ;
    }

    .el-button{
      margin : 0.05rem auto ;
    }

  }
  .expForm{
    .el-form-item{
      width : 50% ;
      margin : 0.2rem auto ;
    }
  }
  .file_dialog{
    .downTag{
      color : rgb(64, 158, 255);
      font-size: 0.14rem ;
      margin-left : 130px;
    }
    .fileName{
      width: 100% ;
      display: inline-block;
      font-size : 0.14rem ;
      color: #666 ;
    }
    .el-input{
      width: 50% ;
    }
    .hideFile{
      display:none ;
    }
  }
  .el-form-item{
    position: relative;

  }
  .show-pwd{
    position: absolute ;
    right : 51% ;
    top: 0;
  }


</style>
