<template>
  <div class="step">
    <el-form :model="form" rel="form" :rules="formRule">
      <p class="title">第一步：填写活动信息</p>
       <el-form-item label="活动类型：" labelWidth="1.2rem">
         <el-radio v-model="form.type" label="1">超级试用</el-radio>
         <el-radio v-model="form.type" label="2">折扣试用（待开放）</el-radio>
       </el-form-item>
      <el-form-item label="商品来源：" labelWidth="1.2rem">
        <el-radio v-model="form.source" label="1">淘宝</el-radio>
        <el-radio v-model="form.source" label="2">天猫</el-radio>
        <el-radio v-model="form.source" label="3">京东</el-radio>
        <el-radio v-model="form.source" label="4">拼多多</el-radio>
      </el-form-item>
      <el-form-item label="领取时间：" labelWidth="1.2rem">
        <el-radio v-model="form.time" label="1">24小时之内</el-radio>
        <span class="tips">（试客获得资格后会在24小时内下单领取，逾期将终止试用。）</span>
      </el-form-item>
      <p class="title">第二步：填写试用品展示信息</p>
      <el-form-item label="活动标题：" class="activity" labelWidth="1.2rem">
        <el-input placeholder="请输入内容" size="small" v-model.trim="form.title" ></el-input>
        <span class="tips"><img src="../../assets/imgs/tips3.png" alt=""/>写明赠品的数量、规格、属性等，不要复制淘宝商品标题</span>
      </el-form-item>
      <el-form-item label="试用品类型：" labelWidth="1.2rem">
        <el-select v-model="form.goodsType" placeholder="请选择商品类型" size="small">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="试用品展示图：" labelWidth="1.2rem">
        <el-upload class="upload"
          action="https://jsonplaceholder.typicode.com/posts/"  :data="imgData1"
          :show-file-list="true"
          :on-success="handleShowSuccess"
          :before-upload="beforeShowUpload">
          <img v-if="form.imageUrl" :src="form.imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <ul class="require">
          <span>展示图要求：</span>
          <li>商品清晰图片即可，无需商品主图</li>
          <li>不能出现图片留白、拼接、水印、logo、及其他文字</li>
          <li>800*800以内的正方形</li>
        </ul>
      </el-form-item>
      <p class="title">第三步：选择目标推广宝贝</p>
      <el-form-item label="选择店铺：" labelWidth="1.2rem">
        <el-select v-model="form.shopName" placeholder="请选择店铺" size="small">
          <el-option
            v-for="item in shopOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>

      </el-form-item>
      <el-form-item label="商品链接" labelWidth="1.2rem">
        <el-input size="small" v-model.trim="form.link" placeholder="请输入内容"></el-input>
        <span class="tips"><img src="../../assets/imgs/tips3.png" alt=""/>平台会根据您填写的商品链接抓取宝贝信息，试客无法看到此链接</span>

      </el-form-item>
      <el-form-item label="宝贝主图：" labelWidth="1.2rem">
        <el-upload class="upload" action="https://jsonplaceholder.typicode.com/posts/" :data="imgData2" :show-file-list="true" :on-success="handleGoodsSuccess" :before-upload="beforeGoodsUpload">
          <img v-if="form.goodsImageUrl" :src="form.goodsImageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <ul class="require">
          <span>展示图要求：</span>
          <li>目标商品搜索结果页展示的主图</li>
          <li>(淘宝展示主图)</li>
          <li>尺寸要求<span>（800*800）</span></li>
        </ul>
      </el-form-item>
      <el-form-item label="下单规格：" labelWidth="1.2rem">
        <el-input placeholder="任意拍" size="small" class="any"></el-input>
        <span>拍：</span><el-input v-model.number="form.num" size="small" class="any anyNum"></el-input><span>件</span>
        <span class="tips"><img src="../../assets/imgs/tips3.png" alt=""/>如需拍下指定规格，请务必填写此信息，如不填写默认任意拍一件；</span>
      </el-form-item>
      <el-form-item label="下单价格：" labelWidth="1.2rem">
        <el-input class="any" size="small" v-model.number="form.money" placeholder="请输入内容"></el-input>元
      </el-form-item>
      <el-form-item label="下单价格：" labelWidth="1.2rem">
        <div class="post">
          <el-radio label="1" v-model="form.post">包邮</el-radio>
          <el-radio label="2" v-model="form.post">不包邮</el-radio>
        </div>
        <span class="tips"><img src="../../assets/imgs/tips3.png" alt=""/>试客付邮试用必须同时满足：1、商品价值超过100元；2、拍A发A；
          3、淘宝销售邮费合理。若试客申诉因邮费不符导致商品无法下单，本平台有权将单品试用担保金返还给已获资格的试客</span>
      </el-form-item>
      <p class="title">第四步：设置试客找到商品入口</p>
      <el-form-item label="APP关键词：" labelWidth="1.2rem">
        <span>通过淘宝/天猫/京东/拼多多自然搜索找到商品（勾选后试客可以在手机端申请该试用宝贝）</span>
      </el-form-item>
      <el-form-item label="商品淘口令：" labelWidth="1.2rem">
        <el-input type="textarea" :rows="4" class="textarea" placeholder="请输入内容" v-model="form.taoKey"></el-input>
      </el-form-item>
      <el-form-item label="APP端关键词：" labelWidth="1.2rem">
        <el-select class="search" v-model="form.search" placeholder="淘宝搜索" size="small">
          <el-option
            v-for="item in searchOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-select class="search" v-model="form.top" placeholder="综合排序" size="small">
          <el-option
            v-for="item in topOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-input class="key" placeholder="填写搜索关键词" v-model.trim="form.key" size="small"></el-input>
        <span>筛选条件：</span><el-input class="key" placeholder="如价格区间、销量区间等" size="small"></el-input>
        <el-button size="small">删除</el-button>
        <div class="keyBtn"><el-button type="primary">添加一个APP关键词</el-button></div>
      </el-form-item>
      <p class="title">第五步：设置投放信息</p>
      <el-form-item label="每日最多申请人数：">
        <el-select class="people" v-model="form.people" placeholder="不限" size="small">
          <el-option
            v-for="item in peopleOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <span class="tips"><img src="../../assets/imgs/tips3.png" alt=""/>申请人数达到上限后，则当日不允许试客申请，避免单日进店流量异常突出</span>
        <ul class="rules">
          <span>投放规则：</span>
          <li>1、≥200元的商品，第1天、第2天、第3天的投放量可以为0；100元≤200元的商品，第1天、第2天的投放量可以为0；≤100元的商品，第1天的投放量为0，第2天的投放量至少为1；</li>
          <li>2、≥200元的商品，每期活动不低于3份，≤200元的商品，每期活动不低于5份；</li>
          <li>3、活动投放时间至少3天起发且必须连续的，不可以间断。</li>
          <span>开奖规则：</span>
          <li>当日18点前提交担保金的活动，当日审核上架次日10点开奖；18点后提交的活动次日10点上架，隔天10点系统自动开奖</li>
        </ul>
      </el-form-item>
      <el-form-item label="选择活动时间：" labelWidth="1.2rem">
        <div class="block">
          <el-date-picker
            v-model="form.date"
            type="daterange" unlink-panels
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </div>
      </el-form-item>
      <div class="rate">设置转化率：</div>
      <ul class="rules">
        <span>投放周期建议：</span>
        <li>1、 新品基础优化建议不低于3期活动，每期设置活动3~5天的单量，单量需要做螺旋，新品第一期PC长词+淘口令，第二期PC核心词+淘口令+手淘长词，第三期PC核心词+手淘核心词。</li>
        <li>2、 老品权重提升建议不低于3期活动，每期活动3~5天的单量，配合人气任务模式做收藏加购人气，单量和人气都需要螺旋，加购率做到30%，收藏率20%以上，PC核心词+手淘核心词+猜你喜欢+直通车。</li>
      </ul>
      <div class="situation">投放情况：</div>
      <el-form-item>
        <table border="1" bordercolor="#dcdfe6" >
          <tr>
            <td>投放天数</td>
            <td>投放总量（试用品份数）</td>
          </tr>
          <tr>
            <td></td>
            <td></td>
          </tr>
        </table>
      </el-form-item>
      <el-form-item class="submit">
        <el-button type="primary" @click="onSubmit('form')">提交活动报名</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
    import ElFormItem from "element-ui/packages/form/src/form-item";

    export default {
      components: {
        ElFormItem
      },
      name: "step",
      data(){
        return{
          form : {
            type : '1',
            source : '',
            time : '1',
            goodsType : '',
            title : '',
            imageUrl: '',
            shopName : '' ,
            link : '',
            goodsImageUrl : '',
            num : '',
            money : '',
            post : '1',
            taoKey : '',
            search: '',
            top : '',
            people :'',
            date : '',
            day :'',
            amount : ''
          },
          options : [
            {
              label :'潮流女装',
              value : '1'
            },
            {
              label :'精品男装',
              value : '2'
            },
            {
              label :'鞋子箱包',
              value : '3'
            },
            {
              label :'时尚配饰',
              value : '4'
            },
            {
              label :'美食特产',
              value : '5'
            },
            {
              label :'数码家电',
              value : '6'
            },
            {
              label :'家具日用',
              value : '7'
            },
            {
              label :'美容护肤',
              value : '8'
            },
            {
              label :'综合试用',
              value : '9'
            }
          ] ,
          shopOptions : [
            {
              label : '选项一',
              value : '1'
            },
            {
              label : '选项二',
              value : '2'
            },
            {
              label : '选项三',
              value : '3'
            }
          ],
          searchOptions : [
            {
              label : '淘宝搜索',
              value : '1'
            },
            {
              label : '天猫搜索',
              value : '2'
            },
            {
              label : '淘宝直通车',
              value : '3'
            },
            {
              label : '京东搜索',
              value : '4'
            },
            {
              label : '京东快车',
              value : '5'
            },
            {
              label : '京东微信',
              value : '6'
            },
            {
              label : '拼多多',
              value : '7'
            }
          ],
          topOptions : [
            {
              label : '人气排序',
              value : '1',
            },
            {
              label : '销量排序',
              value : '2'
            },
            {
              label : '信用排序',
              value : '3'
            },
            {
              label : '综合排序',
              value : '4'
            }
          ],
          peopleOptions : [
            {
              label : '',
              value : ''
            }
          ],
          dialogVisible: false ,
          isUploadShow: false,  // 是否显示upload组件
          supportWebp: false,   // 是否支持webp
          bucketHost: '',   // 上传图片的外链域名
          imgData1 : {},
          imgData2 : {},
          formRule : {

          }
        }
      },
      methods: {
        handleShowSuccess(res, file) {
          this.form.imageUrl = URL.createObjectURL(file.raw);
          console.log(this.form.imageUrl);
        },
        beforeShowUpload(file) {
          const isWidth = file.width;
          const isHeight = file.height ;
          if(isWidth>800&&isHeight>800){
            new Error('图片尺寸过大，请重新选择后上传');
          }
        },
        handleGoodsSuccess(res, file) {
          this.form.goodsImageUrl = URL.createObjectURL(file.raw);
        },
        beforeGoodsUpload(file) {
          const isLt2M = file.size / 1024 / 1024 < 2;
        },
        onSubmit(formName){
          this.$refs[formName].validate((valid) => {
            if(valid){
              this.$message({
                type : 'success',
                message : '提交成功',
                center : true
              });
              this.$router.push('/publish/step2');
            }else{
              this.$message({
                type : 'error',
                message : '提交失败，请重新确认信息',
                center : true
              });
              return false ;
            }
          })
        }

      }
    }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .step{
    width : 90% ;
    margin : 0 auto ;
    .title{
      width : 100% ;
      height : 0.5rem ;
      line-height : 0.5rem ;
      font-size : 0.22rem ;
      font-weight : bold ;
      color : #333;
      text-indent : 0.1rem ;
      border-bottom : 1px solid #aaa ;
      margin-bottom : 0.2rem ;
    }
    .el-form-item{
      /*margin : 0;*/
      width : 100% ;
      padding-left : 0.3rem ;
      .upload{
        width : 1.6rem ;
        float : left ;
        margin-top : 0.2rem ;

      }
      .require{
        margin-top : 0.2rem ;
        margin-left : 0.3rem ;
        float : left ;
        width : 60% ;
        li{
          height : 0.3rem ;
          line-height : 0.3rem ;
          span{
            color : #ff0000 ;
          }
        }
      }
      .tips{
        width : 50% ;
        height : 0.3rem ;
        line-height : 0.3rem ;
        font-size : 0.12rem ;
        color : #456 ;
        margin-left : 0.2rem ;
        display: inline-block;
        img{
          width : 0.2rem ;
          height : 0.2rem ;
          float : left ;
          margin-top : 0.03rem ;
          margin-right : 0.05rem ;
        }
      }
      .el-input{
        width : 4rem ;
      }
      .activity{
        .el-input{
          width : 3rem ;
        }
      }
      .any{
        width : 1.2rem ;
        margin-right : 0.1rem ;
      }
      .anyNum{
        width : 0.7rem ;
      }
      .post{
        height : 1rem ;
        float : left ;
        margin-right : 1.1rem ;
      }
      .textarea{
        width : 40% ;
      }
      .search{
        width : 1.2rem ;
        margin-right : 0.2rem ;
      }
      .key{
        width : 20% ;
        margin-right : 0.2rem ;
      }
      .keyBtn{
        width : 100% ;
        margin-top : 0.2rem ;
      }
      table{
        border-collapse: collapse;
        width : 60% ;
        margin : auto 1.2rem;
        td{
          width : 2rem ;
          height : 0.3rem ;
          text-align : center;
          color : #456 ;
        }
      }

    }
    .rules{
      width : 90% ;
      padding-left : 0.28rem ;
      font-size : 0.13rem ;
      color : #456 ;
      span{
        font-size : 0.14rem ;
      }
      li{
        padding-left : 0.25rem ;
        line-height : 0.25rem ;
      }
    }
    .rate,.situation{
      font-size : 0.18rem ;
      font-weight : bold ;
      height : 0.6rem ;
      line-height : 0.6rem ;
      color : #333;
      text-indent : 0.1rem ;
    }
    .situation{
      width : 2rem ;
    }
    .submit{
      display : flex ;
      justify-content: center;
      margin-top : 0.5rem ;
    }
  }
</style>
