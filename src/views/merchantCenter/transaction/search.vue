<template>
  <div class="searchOrder activityTable">
      <h1>交易管理</h1>
      <div class="search">
        <div class="inputWrap">
          <el-input size="small" :maxlength="20" v-model.trim="transition.orderId" placeholder="订单号"></el-input>
          <el-input size="small" :maxlength="20" v-model.trim="transition.subOrderId" placeholder="子订单号"></el-input>
          <el-input size="small" :maxlength="20" v-model.trim="transition.code" placeholder="商品编号"></el-input>
          <el-input size="small" :maxlength="20" v-model.trim="transition.buyAccount" placeholder="买方账号"></el-input>
        </div>
        <div class="inputWrap">
        <div class="block">
          <span class="demonstration">交易开始时间：</span>
          <el-date-picker size="small" v-model="transition.startDate" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="开始时间"></el-date-picker>
        </div>
        <div class="block">
          <span class="demonstration">交易结束时间：</span>
          <el-date-picker size="small" v-model="transition.endDate" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="结束时间"></el-date-picker>
        </div>
        <el-select  size="small" clearable v-model="transition.status" filterable placeholder="订单状态">
          <el-option
            v-for="item in statusList"
            :key="item.value"
            :label="item.name"
            :value="item.value">
          </el-option>
        </el-select>
        </div>
        <div class="inputWrap">
          <el-button  size="mini" type="primary"  @click="search()" class="searchOrder">查询</el-button>
          <el-button  size="mini" type="primary"  @click="exportOrder()" class="searchOrder">导出</el-button>
          <el-button  size="mini" type="primary" style="padding: 0;text-align: center;height : 28px;"  @click="deliverDialog= true;" class="searchOrder">导入发货</el-button>
          <el-button  size="mini" type="primary"  @click="reset()" class="searchOrder">重置</el-button>
        </div>
      </div>
      <div class="tableTitle">
        <h2>交易列表列表</h2>
      </div>
    <el-table  :data="tableData"  border  align="center" fit>
      <el-table-column label="订单/子订单"  width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.orderCode}}</span>
          <span class="subOrder">({{ scope.row.code }})</span>
        </template>
      </el-table-column>
      <el-table-column  label="商品" class="goodsInfo">
        <template slot-scope="scope">
          <table class="tableC">
            <tr class="thColor">
              <th>商品编号</th><th>商品名称</th><th>品牌</th>
              <th>分类</th><th>规格</th><th>价格</th><th>数量</th>
            </tr>
            <!-- <template slot-scope="scope" > -->
            <tr class="tbColor" v-for="(item , index) in scope.row.orderProducts" :key="index">
                  <!-- <template> -->
                  <td>{{item.productItem.code}}</td>
                  <td>{{item.productItem.productName}}</td>
                  <td>{{item.productItem.brandCnName}}</td>
                  <td>
                    <span v-if="item.productItem.cateGoryMap != ''">
                      <span v-if="item.productItem.cateGoryMap.categoryName1">{{item.productItem.cateGoryMap.categoryName1}}</span>/
                      <span v-if="item.productItem.cateGoryMap.categoryName2">{{item.productItem.cateGoryMap.categoryName2}}</span>/
                      <span v-if="item.productItem.cateGoryMap.categoryName3">{{item.productItem.cateGoryMap.categoryName3}}</span>/
                      <span v-if="item.productItem.cateGoryMap.categoryName4">{{item.productItem.cateGoryMap.categoryName4}}</span>
                    </span>

                  </td>
                  <td><span>{{item.productItem.size}}</span><span class="subOrder">{{item.productItem.color}}</span></td>
                  <td>{{item.price}}</td>
                  <td>{{item.quantity}}</td>
                <!-- </template> -->

            </tr>
            <!-- </template> -->
          </table>
        </template>
      </el-table-column>
      <el-table-column prop="totalNum" label="总数量" width="100"></el-table-column>
      <el-table-column prop="totalMoney" label="总价" width="100"></el-table-column>
      <el-table-column prop="createTime" label="交易时间" width="100"></el-table-column>
      <el-table-column label="状态" width="100">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status !== ''" size="mini" :type="statusList[scope.row.status*1].type">{{ statusList[scope.row.status*1].name }}</el-button>

          <!-- <el-button v-if="scope.row.status ==='0'" type='warning' size="mini">未支付</el-button>
          <el-button v-else-if="scope.row.status ==='1'"  type='primary' size="mini">已支付</el-button>
          <el-button v-else-if="scope.row.status ==='2'" type='primary' size="mini">已发货</el-button>
          <el-button v-else-if="scope.row.status ==='3'"  type='success' size="mini">确认收货</el-button>
          <el-button v-else-if="scope.row.status ==='4'" type='warning' size="mini">申请退货退款</el-button>
          <el-button v-else-if="scope.row.status ==='5'" type='danger' size="mini">退款中</el-button>
          <el-button v-else-if="scope.row.status ==='6'" type='primary' size="mini">已退款</el-button>
          <el-button v-else-if="scope.row.status ==='7'" type='info' size="mini">已取消</el-button> -->
        </template>
      </el-table-column>
      <el-table-column prop="action" label="操作" width="100">
        <template slot-scope="scope">
          <el-button type='primary' @click="goDetail(scope.$index,scope.row.id)" size="mini">详情</el-button>
          <el-button type="warning" @click="deliver(scope.$index,scope.row.id)" size="mini">发货</el-button>
          <el-button type='warning' @click="changeWay(scope.$index,scope.row.id)" size="mini">修改快递</el-button>
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
    <el-dialog title="填写快递信息" :visible.sync="dialogVisible" width="60%" >
      <el-form :model="expressForm" ref="expressForm" :rules="expressFormRule" label-position="right" class="expForm">
        <el-form-item  labelWidth="130px" label="快递公司：" prop="expressName">
          <el-select  size="small" clearable v-model="expressForm.expressName" filterable placeholder="快递公司">
            <el-option
              v-for="item in deliverList"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item   labelWidth="130px"  label="快递单号：" prop="expressNumber">
          <el-input class="inputInfo" size="small" v-model.trim="expressForm.expressNumber" placeholder="快递单号"></el-input>
        </el-form-item>
        <el-form-item   labelWidth="130px"  label="确认密码：" prop="confirmPwd">
          <el-input class="inputInfo" size="small" :type="pwdType" v-model.trim="expressForm.confirmPwd" placeholder="请输入登录密码"></el-input>
          <span class="show-pwd" @click="showPwd">
          <svg-icon icon-class="eyeopen" v-if="pwdType===''" />
          <svg-icon v-else="pwdType==='password'" icon-class="eyeclose"></svg-icon>
        </span>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer" >
        <el-button type="primary" size="mini" @click="confirm('expressForm')">确认</el-button>
        <el-button plain size="mini" @click="close('expressForm')">关闭</el-button>

      </div>
    </el-dialog>
    <el-dialog class="file_dialog" title="导入发货信息" top="20%" :visible.sync="deliverDialog" width="60%" center
               :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-button type="text" class="demo_btn" @click="downloadDemo">模板下载</el-button>
      <el-form  :model="deliverFile" ref="deliverFile" :rules="fileRule" label-position="right">
        <el-form-item   labelWidth="130px"  label="上传Excel：" prop="sourceFile">
          <el-button type="primary" size="mini" @click="handelFile">选择文件</el-button>
          <input id="openFile" class="hideFile" type="file" accept=".xlsx, .xls"  @change="handkeFileChange"></input>
          <input  class="hideFile" v-model.trim="deliverFile.sourceFile"/>
        </el-form-item>
        <el-form-item   labelWidth="130px"  label="确认密码：" prop="confirmPassword">
          <el-input class="inputInfo" size="small" :type="pwdType" v-model.trim="deliverFile.confirmPassword" placeholder="请输入登录密码"></el-input>
          <span class="show-pwd" @click="showPwd">
          <svg-icon icon-class="eyeopen" v-if="pwdType===''" />
          <svg-icon v-else="pwdType==='password'" icon-class="eyeclose"></svg-icon>
        </span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="importOrder('deliverFile')">确定</el-button>
        <el-button plain size="small" @click="cancelFile('deliverFile')">取消</el-button>
      </span>
    </el-dialog>
  </div>


</template>

<script>
  import XLSX from 'xlsx'
  import {  validPassWord } from '@/utils/validate'
  import { getOrderList,confirmDeliver,importDeliver,deliverDemo } from "@/api/merchant"
    export default {
      name: "search",
      data(){
        const validOrder = ( rule,value,callback) => {
          if(value === ''){
            callback(new Error('请输入快递单号'))
          }else{
            var reg = /^d{7,20}$/;
            if(!reg.test(value)){
              callback(new Error('请输入正确格式的快递单号'))

            }
            callback();
          }
        }
        const validPassword = ( rule,value,callback) => {
          if(value === ''){
            callback(new Error('请输入登录密码'))
          }else{
            if (!validPassWord(value)) {
              callback(new Error('密码为8-16位的数字、字母组合'))
            }
            callback();
          }
        }
          return{
            transition: {
              orderId: '',
              subOrderId: '',
              code: '',
              buyAccount: '',
              startDate: '',
              endDate: '',
              status: '',
            },
            statusList:[
              {
                name : '未支付',
                value : '0',
                type:'danger'
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
                name : '申请退货退款',
                value : '4',
                type: 'warning'

              },
              {
                name : '退款中',
                value : '5',
                type: 'danger'

              },
              {
                name : '已退款',
                value : '6',
                type: 'info'

              },
              {
                name : '已取消',
                value : '7',
                type: 'danger'

              }
            ],
            // thColor : true ,
            // tbColor : true,
            tableData : [],
            totalPages : '',
            totalElements : 0,
            currentPage : 1,
            pageSize : 10,
            dialogVisible : false ,
            expressForm :{
              expressName: '',
              expressNumber: '',
              confirmPwd: '',
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
              confirmPwd: [
                {
                  required : true ,trigger : 'blur',validator : validPassword

                }
              ]
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
              confirmPassword: [
                {
                  required : true ,trigger : 'blur',validator : validPassword

                }
              ]
            },
            deliverList : [],
            changeExpress : '',
            expressType : '',
            deliverDialog: false ,
            excelData: {
              header: null,
              results: null
            },
            pwdType: 'password'
          }
      },
      mounted(){
        this.getList();
      },
      methods: {
        //  获取交易列表
        getList(){
          let formData = new FormData();
          formData.append('currentPage',this.currentPage);
          formData.append('pageSize',this.pageSize);
          getOrderList(formData).then( res => {
            console.log('res',res)
            if( res.data.status === '000000000'){

              this.deliverList=  res.data.data.tExpressResDtos ;
              this.tableData = res.data.data.pageResultDto.data ;
              this.totalElements = res.data.data.pageResultDto.totalElements;
              this.totalPages = res.data.data.pageResultDto.totalPages;
            }else{
              this.$message({
                message: res.data.message ,
                center : true ,
                type: 'error'
              })
            }
          }).catch( err => {
            alert('服务器开小差啦，请稍等~')

          })

        },

        //  查询交易
        search(){
          // this.transition =
          // this.tableData =
        },
        //导出订单列表
        exportOrder(){

        },
        //选择文件
        handelFile(){
          document.getElementById('openFile').click()

        },
        handkeFileChange(e) {
          console.log(e)
          const files = e.target.files
          const itemFile = files[0] // only use files[0]
          let _this = this;
          // let inputDOM = this.$refs.inputer;
          // 通过DOM取文件数据
          // itemFile = event.currentTarget.files[0];
          var rABS = false; //是否将文件读取为二进制字符串
          var f = itemFile;
          var reader = new FileReader();
          //if (!FileReader.prototype.readAsBinaryString) {
          FileReader.prototype.readAsBinaryString = function(f) {
            var binary = "";
            var rABS = false; //是否将文件读取为二进制字符串
            var pt = this;
            var wb; //读取完成的数据
            var outdata;
            var reader = new FileReader();
            reader.onload = function(e) {
              var bytes = new Uint8Array(reader.result);
              var length = bytes.byteLength;
              for(var i = 0; i < length; i++) {
                binary += String.fromCharCode(bytes[i]);
              }
              // var XLSX = require('xlsx');
              if(rABS) {
                wb = XLSX.read(btoa(fixdata(binary)), { //手动转化
                  type: 'base64'
                });
              } else {
                wb = XLSX.read(binary, {
                  type: 'binary'
                });
              }
              outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);//outdata就是你想要的东西
              console.log(_this.deliverFile,outdata)
              _this.deliverFile.sourceFile = outdata;
            }
            reader.readAsArrayBuffer(f);
          }
          if(rABS) {
            reader.readAsArrayBuffer(f);
          } else {
            reader.readAsBinaryString(f);
          }
          // this.readerData(itemFile)
        },
        // generateDate({ header, results }) {
        //   this.excelData.header = header
        //   this.excelData.results = results
        //   this.deliverFile.sourceFile = results ;
        // },
        // readerData(itemFile) {
        //   const reader = new FileReader()
        //   reader.onload = e => {
        //     const data = e.target.result
        //     const fixedData = this.fixdata(data)
        //     const workbook = XLSX.read(btoa(fixedData), { type: 'base64' })
        //     const firstSheetName = workbook.SheetNames[0]
        //     const worksheet = workbook.Sheets[firstSheetName]
        //     const header = this.get_header_row(worksheet)
        //     const results = XLSX.utils.sheet_to_json(worksheet)
        //     this.generateDate({ header, results })
        //   }
        //   reader.readAsArrayBuffer(itemFile)
        // },
        // fixdata(data) {
        //   let o = ''
        //   let l = 0
        //   const w = 10240
        //   for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)))
        //   o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)))
        //   return o
        // },
        // get_header_row(sheet) {
        //   const headers = []
        //   const range = XLSX.utils.decode_range(sheet['!ref'])
        //   let C
        //   const R = range.s.r /* start in the first row */
        //   for (C = range.s.c; C <= range.e.c; ++C) { /* walk every column in the range */
        //     var cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })] /* find the cell in the first row */
        //     var hdr = 'UNKNOWN ' + C // <-- replace with your desired default
        //     if (cell && cell.t) hdr = XLSX.utils.format_cell(cell)
        //     headers.push(hdr)
        //   }
        //   return headers
        // },

        //导入发货列表
        importOrder(formName){
          this.$refs[formName].validate( valid => {
            if(valid){
              let formData = new FormData();

              formData.append('sourceFile',this.deliverFile.sourceFile);
              formData.append('confirmPassword',this.deliverFile.confirmPassword);

              importDeliver().then( res => {
                if( res.data.status === '000000000'){
                  this.$message({
                    message: '导入发货列表成功' ,
                    center : true ,
                    type: 'success'
                  })
                  this.deliverDialog = false ;

                }else{
                  this.$message({
                    message: res.data.message ,
                    center : true ,
                    type: 'error'
                  })
                }
              }).catch( err => {
                alert('服务器开小差啦，请稍等~')

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
        //模板下载
        downloadDemo(){
          deliverDemo().then( res => {
            if( res.data.status === '000000000'){
              location.href = res.data.data ;
            }else{
              this.$message({
                message: res.data.message ,
                center : true ,
                type: 'error'
              })
            }
          }).catch( err => {
            alert('服务器开小差啦，请稍等~')

          })
        },
        //重置搜索条件
        reset(){
          this.transition = {
            orderId: '',
            subOrderId: '',
            code: '',
            buyAccount: '',
            startDate: '',
            endDate: '',
            status: '',
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
          this.changeExpress = order ;
          this.dialogVisible = true ;
          this.expressType= '1';
        },
        //修改快递
        changeWay(index,order){
          this.changeExpress = order ;
          this.dialogVisible = true ;
          this.expressType= '2';

        },

        //  确认快递相关操作
        confirm(formName){
          this.$refs[formName].validate((valid) => {
            if(valid){
              confirmDeliver(this.expressForm).then( res => {
                if( res.data.status === '000000000'){
                  this.$message({
                    message: '操作成功，请稍后确认' ,
                    center : true ,
                    type: 'error'
                  });
                  setTimeout(() => {
                    window.location.reload();
                  },2000)

                }else{
                  this.$message({
                    message: res.data.message ,
                    center : true ,
                    type: 'error'
                  })
                }
              }).catch( err => {
                alert('服务器开小差啦，请稍等~')

              })
            }else{

            }
          })
        },
        showPwd() {
          if (this.pwdType === 'password') {
            this.pwdType = ''
          } else {
            this.pwdType = 'password'
          }
        },
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
    height : 160px!important;
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
        width : 85px!important ;
        line-height : 32px!important;
        margin : 0 0 0 0.2rem!important ;
      }
      .el-input{
        width : 160px!important;

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
    .demo_btn{
      margin-left: 130px;
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
