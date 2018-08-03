<template>
  <div class="choose-date">
    <div class="content">
    <div class="left">
      <Calendar v-on:choseDay="clickDay" :markDate='dayMark' :agoDayHide='limitStart' :futureDayHide="limitEnd"
                :sundayStart="true"></Calendar>
    </div>
    <div class="right" v-if="activity.date === ''">
      <img src="../../../assets/imgs/u189.jpg" alt=""/>
    </div>
    <div class="right" v-else="activity.date !== ''">
      <div v-if="type ==='1'">
        <h1>选择秒杀时段</h1>
        <el-radio-group v-model="activity.time">
          <el-radio :label="item.value" v-for="(item,index) in timeList" :key="index">{{ item.name }}</el-radio>
        </el-radio-group>
      </div>
      <div v-else="type==='2'">
        <h1>选择活动时间</h1>
        <p class="dateInfo">活动时间：{{ activity.date }} 00:00:00 —— {{ activity.date }} 23:59:59 </p>
        <p class="dateInfo">备注：分享购活动时间每次活动周期为一天</p>
      </div>

      <div class="condition">
        <p>报名时间：活动开始前第16天-活动开始前2天，报名时间一共14天</p>
        <div class="button">
          <el-button size="mini" :type="statusList[activityStatus-0].type">{{ statusList[activityStatus-0].name }}</el-button>
        </div>
      </div>
      <el-button type="primary" @click="goShop">下一步，选择报名商品</el-button>
    </div>
    </div>
  </div>
</template>

<script>
  import Calendar from 'vue-calendar-component';
  export default {
    name: "choose-date",
    components: {
      Calendar
    },
    data() {
      return {
        activity: {
          date: '',
          time: '',
        },
        timeList: [
          {
            name : '09:00',
            value : '1'
          },
          {
            name : '12:00',
            value : '2'
          },
          {
            name : '14:00',
            value : '3'
          },
          {
            name : '16:00',
            value : '4'
          },
        ],
        statusList: [
          {
            name: '即将开始',
            type: 'primary'
          },
          {
            name: '报名中',
            type: 'danger'
          },
          {
            name: '已结束',
            type: 'info'
          }
        ],
        type: '',
        today: '',
        dayMark:[],
        activityStatus: ''
      }
    },
    computed: {
      limitStart: function(){
        let start = new Date(new Date().getTime()/1000 + 2 * 24 * 3600) ;
        return start.getTime()+'';

      },
      limitEnd: function(){
        let end = new Date(new Date().getTime()/1000 + 16 * 24 * 3600) ;
        return   end.getTime()+'';
      },

    },
    mounted() {
      this.type = this.$route.query.type;

      this.getCalendar();
      this.getStatus();
      },
    methods: {
      getStatus(){
        this.activityStatus = '0';
      },
      goShop() {
          this.$emit('getContent', 'signContent')
        if(this.activity.date === ''){
          this.$message({
            message : '请选择活动日期',
            type: 'error',
            center : true
          });
          return false ;
        }
        if(this.activity.time === ''&& this.type === '1'){
          this.$message({
            message : '请选择秒杀时间段',
            type: 'error',
            center : true
          });
          return false ;

        }
        if(this.activityStatus !== '1'){
          let tips = '';
          if(this.activityStatus === '0'){
            tips = '活动尚未开始，请耐心等候~';
          }else if(this.activityStatus === '2'){
            tips = '本期活动已结束，敬请期待下次活动吧~'
          }
          this.$message({
            message :tips,
            type: 'error',
            center : true
          });
          return false ;
        }
        if(this.activity.date !== ''&& ((this.activity.time !== ''&&this.type === '1')|| this.type === '2')&& this.activityStatus === '1'){
          this.$emit('getContent', 'signContent')

        }
      },
      clickDay(date){
        this.dayMark = [];
        this.dayMark.push(date);
        this.activity.date = date.replace(/\/+/g,'-') ;
      },
      getCalendar() {



      }
    }
  }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .choose-date {
    padding: 0.2rem;
    width: 100%;
    box-sizing: border-box;
    color : #333 ;
    .content {
      margin-top: 0.4rem;
      display: flex;
      .left {
        width: 35%;
        border: 1px solid #aaa ;
        border-right : 0;
      }
      .right {
        width: 65%;
        border: 1px solid #ccc;
        padding: 0.2rem;
        box-sizing: border-box;
        img {
          width: 100%;
          height: 100%;
        }
        h1 {
          margin-bottom: 0.5rem;
          padding: 0.2rem 0;
          border-bottom: 1px solid #999;
          font-size: 0.24rem;
          line-height: 0.3rem;
          text-align: center;
        }
        .el-radio-group {
          width: 100%;
          .el-radio {
            width: 20%;
            text-align: center;
            margin-left: 0;
          }
        }
        .dateInfo{
          height : 0.7rem ;
          line-height : 0.7rem ;
          font-size : 0.22rem ;
          text-align: center;
        }
        .condition {
          width: 100%;
          height: 100px;
          display: flex;
          p {
            width: 75%;
            font-size: 0.2rem;
            line-height: 0.9rem;
            padding:0 0.3rem 0.3rem;
            box-sizing: border-box;
          }
          .button {
            width: 25%;
          }
        }
        .el-button {
          margin: 0.3rem auto;
          display: block;
        }
      }
    }
  }
</style>
