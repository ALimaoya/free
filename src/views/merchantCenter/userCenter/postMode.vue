<template>
  <div class="postMode activityTable"  v-loading="loading"  element-loading-text="拼命加载中">
    <div class="modeList" v-if="isNew === '0'">
      <h1 class="h_title">运费模板<el-button type="danger" size="mini" @click="isNew = '1';">新增运费模板</el-button></h1>
      <!--模板列表-->
      <div class="tableWrap" v-for="(item,index) in tableData" :key="index">
        <div class="tableTitle">
          <b>模板名称</b><span>最后编辑时间：</span>
          <el-button type="text" @click="saveMode(index)" v-if="readList[index] == '1'">保存</el-button>
          <el-button type="text" @click="editMode(index,item)" v-else="">修改</el-button>
          |<el-button type="text" @click="deleteMode(item)">删除</el-button>
        </div>
        <el-table  :data="item"  border fit >
          <el-table-column  label="运送方式" ></el-table-column>
          <el-table-column label="运送到" >
            <template slot-scope="scope">
              <span v-if="scope.row[0].area.length> 0" v-for="(k,i) in scope.row[0].area" :key="i">{{ k.name }}
                <span v-if="i !== scope.row[0].area.length-1">、</span>
              </span>
            </template>
          </el-table-column>
          <el-table-column  label="首件（个）" width="100">
            <template slot-scope="scope">
              <el-input  size="mini" :max="1000000000" type="number" v-model.number="scope.row[0].firstPieces"  :readonly="readList[index] === '0'"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="运费（元）" width="100">
            <template slot-scope="scope">
              <el-input  size="mini" :max="1000000000" type="number" v-model.number="scope.row[0].firstFee" :readonly="readList[index] === '0'"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="续件（个）" width="100">
            <template slot-scope="scope">
              <el-input  size="mini" :max="1000000000" type="number" v-model.number="scope.row[0].addPieces" :readonly="readList[index] === '0'"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="运费（元）" width="100">
            <template slot-scope="scope">
              <el-input  size="mini" :readonly="readList[index] === '0'" :max="1000000000" type="number" v-model.number="scope.row[0].addFee" @blur="checkedFee((scope.$index+1)*1,scope.row.addFee)"></el-input>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

      <!--新建模板-->
    <div class="newMode" v-else-if="isNew === '1'">
      <h1 class="h_title">模板基础信息</h1>
      <el-form :model="carriageForm" ref="carriageForm"  :rules="rule">
        <el-form-item prop="name" label="模板名称：" :labelWidth="labelWidth">
          <el-input class="inputInfo" size="small" :maxlength="20" v-model.trim="carriageForm.name"></el-input>
        </el-form-item>
        <el-form-item prop="carriageType" label="是否包邮：" :labelWidth="labelWidth">
          <el-radio-group size="mini" v-model="carriageForm.carriageType" fill="#f56c6c"  @change="chooseCarriage(carriageForm.carriageType)">
            <el-radio-button  label="1" border>全国包邮</el-radio-button>
            <el-radio-button label="2" border>自定义</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item  label="计费方式：" :labelWidth="labelWidth">
          <span class="tips_warn">按件数计费</span>
        </el-form-item>
        <el-form-item></el-form-item>
        <div class="self" v-if="selfSetting==='1'" >
          <el-form-item :labelWidth="labelWidth">
            <span class="note">备注：除指定地区外，其余地区的运费采用“默认运费”</span>
          </el-form-item>
          <el-form-item label="默认运费："  :labelWidth="labelWidth">
            <el-input class="defaultInput" size="small" :max="1000000000" type="number" v-model.number="carriageForm.specialList[0].firstPieces"></el-input>件内
            <el-input class="defaultInput" size="small" :max="1000000000" type="number" v-model.number="carriageForm.specialList[0].firstFee" @blur="validFee(0,carriageForm.specialList[0].firstFee)"></el-input>元，
            每增加<el-input class="defaultInput" size="small" :max="1000000000" type="number" v-model.number="carriageForm.specialList[0].addPieces"></el-input>，增加运费
            <el-input class="defaultInput" size="small" :max="1000000000" type="number" v-model.number="carriageForm.specialList[0].addFee" @blur="checkedFee(0,carriageForm.specialList[0].addFee)"></el-input>元
          </el-form-item>
          <el-form-item :labelWidth="labelWidth">
            <el-table v-if="carriageForm.specialList.length> 1" :data="carriageForm.specialList.slice(1)"  border fit >
              <el-table-column label="运送到" >
                <template slot-scope="scope">
                  <span v-if="scope.row.area.length === 0">未选择地区</span>
                  <span v-else="scope.row.area > 0" v-for="(item,index) in scope.row.area" :key="index">{{ areaList[item-1].name  }}
                    <span v-if="item !== scope.row.area[scope.row.area.length-1]">、</span>
                  </span>
                </template>
              </el-table-column>
              <el-table-column >
                <template slot-scope="scope">
                  <el-button type="text" @click="editorArea(scope.$index)">编辑</el-button>
                </template>
              </el-table-column>
              <el-table-column prop="firstPieces" label="首件数（件）" >
                  <template slot-scope="scope">
                    <el-input  size="mini" :max="1000000000" type="number" v-model.number="scope.row.firstPieces"></el-input>
                  </template>
              </el-table-column>
              <el-table-column prop="firstFee" label="首费(元)" >
                <template slot-scope="scope">
                  <el-input  size="mini" :max="1000000000" type="number" v-model.number="scope.row.firstFee" @blur="validFee((scope.$index+1)*1,scope.row.firstFee)"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="addPieces" label="续件数（件）" >
                <template slot-scope="scope">
                  <el-input  size="mini" :max="1000000000" type="number" v-model.number="scope.row.addPieces" ></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="addFee" label="续费（元）" >
                <template slot-scope="scope">
                  <el-input  size="mini" :max="1000000000" type="number" v-model.number="scope.row.addFee" @blur="checkedFee((scope.$index+1)*1,scope.row.addFee)"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="操作" >
                <template slot-scope="scope">
                  <el-button type="text" @click="deleteItem(scope.row.$index)">删除</el-button>
                </template>
              </el-table-column>

            </el-table>
            <el-button type="info" @click="addAppoint">为指定地址设置运费</el-button>
          </el-form-item>
          <!--<el-form-item >-->
            <!--<el-checkbox v-model="appoint">指定条件包邮：</el-checkbox>-->
            <!--<el-select filterable clearable v-model="carriageForm.appointType" size="small" :disabled="!appoint" placeholder="请选择">-->
              <!--<el-option-->
                <!--v-for="item in options"-->
                <!--:key="item.value"-->
                <!--:label="item.name"-->
                <!--:value="item.value">-->
              <!--</el-option>-->
            <!--</el-select>-->
            <!--满<el-input class="defaultInput" size="small" :disabled="!appoint" :maxlength="10" v-model.trim="carriageForm.free"></el-input>件包邮-->

          <!--</el-form-item>-->
        </div>
        <el-form-item :labelWidth="labelWidth">
          <el-button type="danger" @click="saveNew('carriageForm')">保存并返回</el-button>
          <el-button plain @click="cancel">取消</el-button>
        </el-form-item>

      </el-form>
    </div>

    <el-dialog class="shop_dialog" title="选择区域" top="20%" :visible.sync="areaDialog" width="70%" center :before-close="cancelArea">
      <el-checkbox-group v-model="getArea" fill="#f56c6c">
        <el-checkbox-button v-for="(item,index) in areaList" :label="item.value" :key="index" :disabled="areaList[index].checked !== undefined && areaList[index].checked === true">{{item.name }}</el-checkbox-button>
      </el-checkbox-group>
    <span slot="footer" class="dialog-footer">
      <el-button size="mini" type="danger" @click="saveArea">保存</el-button>
      <el-button size="mini" plain @click="cancelArea">取消</el-button>
    </span>
    </el-dialog>
    <!--<el-dialog class="shop_dialog" title="提示" top="20%" :visible.sync="hasShop" width="40%" center-->
    <!--:show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">-->
    <!--<p>{{ tips }}</p>-->
    <!--<span slot="footer" class="dialog-footer">-->
    <!--<el-button type="primary" @click="applyShop">前往我要开店</el-button>-->
    <!--</span>-->
    <!--</el-dialog>-->
  </div>
</template>

<script>
  // import {  int } from '@/utils/validate'
  import {  getShopInfo } from "@/api/merchant"

  // import ElFormItem from "element-ui/packages/form/src/form-item";
  import { carriageList , deleteCarriage,  addCarriage } from "@/api/userCenter"
  import ElFormItem from "element-ui/packages/form/src/form-item";
  import ElForm from "element-ui/packages/form/src/form";
  // import ElCheckbox from "element-ui/packages/checkbox/src/checkbox";
  // import ElSelect from "element-ui/packages/select/src/select";
  export default {
    // components: {
    //   ElSelect,
    //   ElCheckbox,
    //   ElFormItem},
    components: {
      ElForm,
      ElFormItem},
    name: "post-mode",
    data(){

      return{
        isNew: '0',
        tableData: [
          [
            [{ area:
                [{
                name : '北京',
                value : '1'
              },
                {
                  name : '河南',
                  value : '2'
                },],
              firstPieces: '10',firstFee: 0, addPieces: '2', addFee: 0,}
            ],
          [{ area:
              [{
                name : '北京',
                value : '1'
              },
                {
                  name : '安徽',
                  value : '2'
                },],
            firstPieces: '1',firstFee: 0, addPieces: '1', addFee: 0,}]
          ],[]
          ],
        carriageForm:{
          name: '',
          carriageType: '1',
          // appointType: '1',
          // free: '',
          specialList:[
            { area: [],firstPieces: '1',firstFee: 0, addPieces: '1', addFee: 0,}
          ],
        },
        rule: {
          name: [ { required: true , trigger: 'blur', message : '请输入模板名称'}],
          carriageType: [ { required : true ,trigger: 'change', message : '请选择是否包邮'}],

        },

        labelWidth: '128px',
        selfSetting: '0',
        appoint: true ,
        options: [
          { name : '件数' , value : '1'},
          { name : '价格', value : '2'}
        ],
        loading: false,
        chooseArea: '' ,
        areaDialog: false ,
        getArea: [],
        chooseList: [],
        areaList: [
          {
            name : '北京',
            value : '1'
          },
          {
            name : '安徽',
            value : '2'
          },
          {
            name : '福建',
            value : '3'
          },
          {
            name : '甘肃',
            value : '4'
          },
          {
            name : '广东',
            value : '5'
          },
          {
            name : '广西',
            value : '6'
          },
          {
            name : '贵州',
            value : '7'
          },
          {
            name : '海南',
            value : '8'
          },
          {
            name : '河北',
            value : '9'
          },
          {
            name : '河南',
            value : '10'
          },
          {
            name : '黑龙江',
            value : '11'
          },
          {
            name : '湖北',
            value : '12'
          },
          {
            name : '湖南',
            value : '13'
          },
          {
            name : '吉林',
            value : '14'
          },
          {
            name : '江苏',
            value : '15'
          },
          {
            name : '江西',
            value : '16'
          },
          {
            name : '辽宁',
            value : '17'
          },
          {
            name : '内蒙古',
            value : '18'
          },
          {
            name : '宁夏',
            value : '19'
          },
          {
            name : '青海',
            value : '20'
          },
          {
            name : '山东',
            value : '21'
          },
          {
            name : '山西',
            value : '22'
          },
          {
            name : '陕西',
            value : '23'
          },
          {
            name : '上海',
            value : '24'
          },
          {
            name : '四川',
            value : '25'
          },
          {
            name : '天津',
            value : '26'
          },
          {
            name : '西藏',
            value : '27'
          },
          {
            name : '新疆',
            value : '28'
          },
          {
            name : '云南',
            value : '29'
          },
          {
            name : '浙江',
            value : '30'
          },
          {
            name : '重庆',
            value : '31'
          },
          {
            name : '云南',
            value : '32'
          },
          {
            name : '浙江',
            value : '33'
          },
          {
            name : '重庆',
            value : '34'
          },
        ],
        readList: [],
      }
    },
    mounted(){
      this.getList();
    },
    methods : {

      getList(){
        // this.tableData =
        for(let i = 0 ,j= this.tableData.length ; i < j ;i ++ ){
          this.readList[i] = '0';
        }
      },
      editMode(index,item){
        // this.readList[index] = '1';
        this.$set(this.readList,index , '1');
        console.log(this.readList[index])
      },
      deleteMode(item){

      },
      saveMode(index){
        // this.readList[index] = '0';

        this.$set(this.readList,index , '0');
        // delete this.tableData[index].editorStatus;

      },
      //保存新增模板
      saveNew(formName){
        if(this.carriageForm.carriageType === '2'&&this.carriageForm.specialList.length>1 ){
          this.carriageForm.specialList.some((i,index) => {
            if(i.area.length === 0&& index !==0 ){
              this.$message({
                message : '指定地区不能为空，请确定选择指定地区',
                center : true ,
                type : 'error'
              });
              return false ;
            }
          });

        }
        this.$refs[formName].validate((valid) =>{
          if(valid){
            console.log(this.carriageForm);
            this.cancel() ;
          }
        })
      },
      //设置指定地区运费
      addAppoint(){
        if(this.carriageForm.specialList.length < 34){
          this.carriageForm.specialList.push({ area: [],firstPieces: '1',firstFee: 0, addPieces: '1', addFee: 0,})

        }else{
          this.$message({
            message : '您添加的指定地址运费规则太多啦，不能再加啦~',
            type: 'error',
            center: true
          })
        }
      },
      //删除指定地址运费
      deleteItem(index){
        this.carriageForm.specialList.splice((index+1)*1,1);
      },
      //编辑指定地区
      editorArea(index){
        this.chooseArea = index ;
        this.getArea = [];
        this.areaDialog = true ;

      },
      //校验输入运费
      validFee(index,value){
          if(value<= 0|| !/^[0-9]{1,10}$/.test(value)){
            this.carriageForm.specialList[index].firstFee = 0;
          }

          if(this.carriageForm.specialList[index].addFee*1> value*1){
            this.$message({
              message : '续件运费不得大于首件运费',
              center : true ,
              type : 'error'
            });
            this.$set(this.carriageForm.specialList[index],'addFee' , 0);
          }
      },
      checkedFee(index,value){
        if(value*1<= 0 || !/^[0-9]{1,10}$/.test(value)){
          this.carriageForm.specialList[index].addFee = 0;
        }

        if(value*1 > this.carriageForm.specialList[index].firstFee*1){
          this.$message({
            message : '续件运费不得大于首件运费',
            center : true ,
            type : 'error'
          });
          this.$set(this.carriageForm.specialList[index],'addFee' , 0);
        }
      },
      //保存指定运费地区
      saveArea(){
        if(this.getArea.length> 0){
          console.log(this.chooseArea);
          this.getArea.map( i =>{
            this.carriageForm.specialList[(this.chooseArea+1)*1].area.push(i) ;

          });
          this.areaDialog = false;
          this.areaList.map( i => {
            if(this.getArea.indexOf(i.value) !== -1){
              i['checked'] = true ;
            }
          })
        }else{
          this.$message({
            message: '请选择指定地区',
            type: 'error',
            center: true
          })
        }

      },
      //取消编辑地区
      cancelArea(){
        this.getArea = [];
        this.areaDialog = false;
        this.chooseArea = '';
      },
      //取消新建
      cancel(){
        this.isNew = '0';
        this.selfSetting =  '0';
        this.carriageForm.specialList = [] ;
        this.$refs.carriageForm.resetFields();
      },
      //改变包邮类型
      chooseCarriage(value){
        if(value === '1'){
          this.selfSetting = '0';
          this.carriageForm.specialList = [];
          this.carriageForm.specialList.push({ area: '',firstPieces: '1',firstFee: 0, addPieces: '1', addFee: 0,})
        }else if(value === '2'){
          this.selfSetting = '1';

        }
      },

    }
  }
</script>


<style scoped lang="scss" rel="stylesheet/scss">
  @import '../../../styles/step';
  @import '../../../styles/activityTable';

  /*.top{*/
  /*border-bottom*/
  h1{
    height : 0.8rem;
    .el-button{
      float : right ;

    }
  }
  .tableTitle{
    width: 95% ;
    margin: 0.3rem auto 0;
    height: 50px;
    background: #eee ;
    padding: 0.1rem 0.2rem;
    box-sizing: border-box;
    border : 1px solid #aaa ;
    border-bottom: 0;
    border-radius: 0.05rem 0.05rem 0 0;
    b{
      font-size: 0.26rem ;
      width: 60% ;
      display: inline-block;
    }
    span{
      font-size: 0.18rem ;
      color : #333 ;
      margin-right: 0.3rem ;
    }
    .el-button{
      margin-right : 10px ;
    }
  }

  .el-table{
    border-radius: 0 0 0.05rem 0.05rem!important ;

  }
  .el-form{
    width : 90% ;
    margin : 0.6rem auto ;
    .el-form-item{
      .el-form-item__label{
        font-size : 0.2rem!important ;
      }
      .el-input{
         width : 60% ;
      }


      .el-radio-button:nth-child(1){
          margin-right : 0.2rem ;
      }

    }
    .self{
      width : 100% ;
      margin-top: 0;
      .note{
        width: 100%;
        font-size : 0.14rem ;
        color : #999 ;
        display: inline-block;
        line-height : 0.3rem ;
        height : 0.3rem ;
      }

      .el-form-item{
        width : 100% !important;
        color : #606266;
        .el-select{
          width : 100px;
          margin-right : 0.1rem ;
        }
      }
      .el-form-item:nth-child(1){
        margin-bottom: 0;
      }
      .defaultInput{
        width : 100px ;
        margin : 0 0.1rem ;

      }
      .defaultInput:nth-child(1){
        margin-left : 0!important;
      }
      .el-table{
        width : 100% ;
        margin-bottom: 0.3rem ;
      }
    }

  }
  .shop_dialog{
    .el-checkbox-button{
      margin : 0.05rem ;
    }
  }
</style>
