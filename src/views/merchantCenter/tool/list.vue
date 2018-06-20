<template>
    <div class="sourceGoodsList">
      <el-table  :data="tableData"  border fit>
        <el-table-column prop="orderId" label="序号"></el-table-column>
        <el-table-column label="图片">
          <template slot-scope="scope">
            <img :src="scope.row.img" alt="" />
          </template>
        </el-table-column>
        <el-table-column prop="title" label="宝贝标题" ></el-table-column>
        <el-table-column prop="price" label="价格" ></el-table-column>
        <el-table-column prop="source" label="来源" ></el-table-column>
        <el-table-column prop="type" label="商品类目" ></el-table-column>
        <el-table-column prop="action" label="操作" >
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="getSource(scope.$index,scope.row.goodsUrl)">查看源</el-button>
            <el-button type="text" v-if="this.type === '1'" size="mini" @click="deleteGoods(scope.$index,scope.row.orderId)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
</template>

<script>
    // import ElTable from "element-ui/packages/table/src/table";

    export default {
      name: "List",
        data() {
            return {
              tableData: [],
              type : ''
            }
        },
        mounted() {
        console.log(1)
        this.type = this.$route.params.type ;
        console.log(this.$route,this.type);
        },
        methods: {
          getList(){
            // this.tableData =
          },
          getSource(index,url){

          },
          deleteGoods(index,order){

          }
        }
    }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import '../../../styles/table';

</style>
