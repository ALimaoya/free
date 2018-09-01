<template>
  <div class="choose-date">
    <div class="content">
    <div class="left">
      <Calendar v-on:choseDay="clickDay" :markDate='dayMark' :agoDayHide='limitStart' :futureDayHide="limitEnd"
                :sundayStart="true"></Calendar>
    </div>
    <div class="right" v-if=" activity.date === '' && activity.sevenDay.start === ''">
      <img  src="../../../assets/imgs/u189.jpg" alt=""/>
    </div>
    <div class="right" v-else="activity.date !== ''">
      <div v-if="type ==='1'">
        <h1>选择秒杀时段</h1>
        <el-radio-group v-model="activity.time">
          <el-radio :label="item.id" v-for="(item,index) in timeList" :key="index">{{ item.name }}</el-radio>
        </el-radio-group>
      </div>
      <div v-else-if="type==='2'">
        <h1>选择活动时间</h1>
        <p class="dateInfo">活动时间：{{ activity.date }} 00:00:00 —— {{ activity.date }} 23:59:59 </p>
        <p class="dateInfo">备注：分享购活动时间每次活动周期为一天</p>
      </div>
      <div v-else="type==='3'">
        <h1>选择活动时间</h1>
        <p class="dateInfo">活动时间：{{ activity.sevenDay.start }} 00:00:00 —— {{ activity.sevenDay.end }} 23:59:59 </p>
        <p class="dateInfo">备注：分享购活动时间每次活动周期为期一周</p>
      </div>

      <div class="condition">
        <p>报名时间：活动开始前第2天——活动开始前16天，报名时间一共14天</p>
        <div class="button">
          <el-button size="mini" type="danger">报名中</el-button>
        </div>
      </div>
      <el-button type="primary" @click="goShop">下一步，选择报名商品</el-button>
    </div>
    </div>
  </div>
</template>

<script>
  import Calendar from '@/components/Calender';
  import { getTimeList } from "@/api/enter"
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
          sevenDay:
            {start : '',
            end:''}
          
        },
        timeList: [],
        // statusList: [
        //   {
        //     name: '即将开始',
        //     type: 'primary'
        //   },
        //   {
        //     name: '报名中',
        //     type: 'danger'
        //   },
        //   {
        //     name: '已结束',
        //     type: 'info'
        //   }
        // ],
        type: '',
        today: '',
        dayMark:[],
      }
    },
    computed: {
      limitStart: function(){
        let start = new Date(new Date().getTime()/1000 + 24 * 3600) ;
        return start.getTime()+'';

      },
      limitEnd: function(){
        let end = new Date(new Date().getTime()/1000 + 15 * 24 * 3600) ;
        return   end.getTime()+'';
      },

    },
    mounted() {
      this.type = this.$route.query.type;
      if(this.type === '1'){
        this.getTime() ;
      }

      },
    methods: {

      getTime(){
        getTimeList().then(res => {
          if(res.data.status === '000000000'){
            // console.log('res',res)
            this.timeList = res.data.data ;
          }
        })
      },
      goShop() {
        if(this.type === '2' && this.activity.date === ''){
          this.$message({
            message : '请选择活动日期',
            type: 'error',
            center : true
          });
          return false ;
        }
        if(this.type === '3' && this.activity.sevenDay.start === ''){
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
        if(this.activity.date !== ''&& (this.activity.time !== ''&&this.type === '1')|| this.type === '2'){
          let data = {
            startDate : this.activity.date ,
            endDate : this.activity.date ,
            startTime: '',
            endTime: '',
            startSevenDay:'',
            endSevenDay:''
          };
          this.timeList.map( i => {
          // console.log('i',i)
            if(i.id === this.activity.time){
              data.startTime = i.startTime ;
              data.endTime = i.endTime ;
            }
          });
          this.$store.commit('addSecondKill',data);
          this.$emit('getContent', 'signContent')
        }
        if(this.type === '3' && this.activity.sevenDay.start !== ''){
          let data  = {
            startDate:'',
            endDate:'',
            startTime:'',
            endTime:'',
            startSevenDay:this.activity.sevenDay.start,
            endSevenDay:this.activity.sevenDay.end
          };
          this.timeList.map( i => {
            if(i.id === this.activity.time){
              data.startTime = i.startTime ;
              data.endTime = i.endTime ;
            }
          });
          this.$store.commit('addSecondKill',data);
          this.$emit('getContent', 'signContent')
        }
        
      },
      clickDay(date){
        let timedata = date;
        this.dayMark = [];
        this.dayMark.push(date);
        if(this.type !== '3'){
          this.activity.date = timedata.replace(/\/+/g,'-') ;
        }else{
          this.activity.sevenDay.start = timedata.replace(/\/+/g,'-') ;
          let str  = new Date(timedata);
          str = str.getTime();
          let end = new Date(str+6*1000*60*60*24);
          let year = end.getFullYear();
          let Month =end.getMonth()+1 < 10 ? '0'+(end.getMonth()+1) : end.getMonth()+1;
          let date =end.getDate() ;
          this.activity.sevenDay.end = year+'-'+Month+'-'+date;
        }

      },

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
