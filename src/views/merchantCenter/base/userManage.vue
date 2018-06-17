<template>
  <div class="userManage activityTable">
    <h1>账户查询</h1>
    <div class="search">
      <el-input size="small" :maxlength="20" v-model.trim="account.name" placeholder="账户名称"></el-input>
      <el-input size="small" :maxlength="20" v-model.trim="account.code" placeholder="账户编号"></el-input>
      <el-button  size="small" type="primary" round @click="getList()" class="searchOrder">查询</el-button>
    </div>
    <div class="tableTitle">
      <h2>账户列表</h2>
      <el-button size="mini" type="primary" @click="newAccount()">新增</el-button>
    </div>
    <el-table :data="tableData"  border fit>
      <el-table-column prop="activityId" label="账户编号"></el-table-column>
      <el-table-column prop="shopName" label="账户名称" ></el-table-column>
      <el-table-column prop="code" label="所属平台" ></el-table-column>
      <el-table-column prop="platform" label="是否有效" ></el-table-column>
      <el-table-column prop="platform" label="激活状态" ></el-table-column>
      <el-table-column prop="platform" label="真实姓名" ></el-table-column>
      <el-table-column prop="platform" label="创建时间" ></el-table-column>
      <el-table-column prop="platform" label="操作" >
        <template slot-scope="scope">
          <el-button class="check" style="padding : 0 ;" type="text"  @click="handleBan(scope.$index,scope.row.activityId)">禁用</el-button>
          <el-button class="check" style="padding : 0 ;" type="text" v-if="scope.row.payStatus==='0'" @click="editor(scope.$index,scope.row.activityId, scope.row.payStatus)">修改</el-button>
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
        name: "UserManage",
      data(){
          return{
            account : {
              name : '',
              code : ''
            },
            tableData : [],
            totalPages : '',
            totalElements : 0,
            currentPage : 1,
            pageSize : 10,
          }
      },
      mounted(){
        this.getList();
      },
      methods : {
        //  查询列表
        getList(){

        },
        //新增账户
        newAccount(){
          this.$router.push('/merchantCenter/base/newAccount')
        },
        //禁用操作
        handleBan(){

        },
      //  修改操作
        editor(index ,order ,payStatus){
          // console.log(order) ;

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
  @import '../../../styles/variables';

  .userManage{

    .search {
      padding: 0.3rem 0.5rem 0.2rem;
      height: 100px;
      border-bottom: 0;
      margin-bottom: 0.3rem;

    }
    .tableTitle{
      height : 40px ;
      margin :  0.4rem auto ;
      width : 95% ;
      background:$title ;
      box-sizing: border-box;
      /*border-top : 1px solid #aaa ;*/
      border-bottom : 1px solid #aaa ;
      h2{
        width : 50% ;
        height : 100% ;
        line-height : 40px ;
        font-weight : 100 ;
        float : left ;
        text-indent : 0.3rem ;
        color : #fff ;

      }
      .el-button{
        float : right ;
        margin : 5px 0.2rem;
        height : 30px ;
      }
    }

  }
</style>
