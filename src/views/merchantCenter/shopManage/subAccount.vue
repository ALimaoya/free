<template>
  <div class="subAccount tableBox">
    <h1 class="h_title">子账号管理<el-button type="danger" size="mini" @click="newSubDialog = true ;">+新增子账号</el-button></h1>
    <el-table  :data="tableData"  border fit  >
      <el-table-column prop="account" label="账号名"></el-table-column>
      <el-table-column prop="note" label="账号备注"></el-table-column>
      <el-table-column prop="role" label="角色"></el-table-column>
      <el-table-column prop="wechat" label="绑定微信"></el-table-column>
      <el-table-column  label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="changeNote(scope.$index,scope.row.id)">修改备注</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="修改备注" :visible.sync="dialogVisible" width="50%" center >
      <div class="dialog_content">
        <span>修改备注：</span><el-input type="text" size="small" v-model.trim="nickName" placeholder="请输入新昵称"></el-input>
      </div>
      <div slot="footer" class="dialog-footer" >
        <el-button type="danger" size="mini" @click="confirm(nickName)">确认修改</el-button>
        <el-button plain size="mini" @click="dialogVisible= false;nickName = ''">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="新建子账号" :visible.sync="newSubDialog" width="50%" center >
      <div class="dialog_content">
        <span>修改备注：</span><el-input type="text" size="small" v-model.trim="nickName" placeholder="请输入新昵称"></el-input>
      </div>
      <div slot="footer" class="dialog-footer" >
        <el-button type="danger" size="mini" @click="confirmNew()">确认创建</el-button>
        <el-button plain size="mini" @click="cancel()">取消</el-button>
      </div>
    </el-dialog>
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
        name: "sub-account",
      data(){
          return{
            tableData: [],
            dialogVisible: false ,
            nickName: '',
            dataIndex : '',
            noteId : '',
            totalPages : '',
            totalElements : 0,
            currentPage : 1,
            pageSize : 10,
            newSubDialog: false
          }
      },
      mounted(){
        this.tableData = [
          {
            account : '123',
            role: '啊啊啊',
            note : '大多'
          }
        ]
      },
      methods: {
        changeNote(index,id){
          this.dataIndex = index ;
          this.noteId = id ;
          this.dialogVisible = true ;
        },
        //确认修改备注
        confirm(){
          if(this.nickName !==''){
            this.tableData[this.dataIndex].note = this.nickName ;
            // this.noteId  ;
            this.dialogVisible = false  ;
          }else{
            this.$message({
              message : '请输入修改后的备注',
              type : 'error',
              center : true
            })
          }


        },
        //提交新建子账号
        confirmNew(){
          this.newSubDialog = false ;

        },
        cancel(){
          this.newSubDialog = false ;
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
  @import '../../../styles/table';
  .h_title{
    .el-button{
      float : right ;
    }
  }
  .dialog_content{

    .el-input{
      width : 40%;
      margin-left : 0.2rem;
    }
  }
</style>
