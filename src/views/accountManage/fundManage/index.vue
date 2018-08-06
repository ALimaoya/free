<template>
      <div class="money">
        <h1>资金明细：</h1>
        <ul class="gold">
          <li>
            <span></span>
            <dl>
              <dt>￥{{ wallet.deposit }}</dt>
              <dd>可用押金</dd>
            </dl>
          </li>
          <li>
            <span></span>
            <dl>
              <dt>￥{{ wallet.freeze_deposit }}</dt>
              <dd>冻结押金</dd>
            </dl>
          </li>
          <li>
            <span></span>
            <dl>
              <dt>￥{{ wallet.gold }}</dt>
              <dd>可用金币</dd>
            </dl>
          </li>
        </ul>

        <ul class="btn_wrap">
          <li class="cash">
            <el-button size="small" class="btn" @click="recharge(1)">充值</el-button>
            <el-button size="small" class="btn" @click="recharge(2)">提现</el-button>
          </li>
        </ul>
      </div>
</template>

<script>
    export default {
        name: "index",
        data() {
            return {
              wallet: {},
            }
        },
        mounted() {
          this.$store.dispatch('GetInfo').then(res => {

            if( res.data.status === '000000000'){
              this.wallet = this.$store.state.user.wallet ;

            }
          })
        },
        methods: {
          //充值/提现
          recharge(type){
            if(type === 2){
              this.$router.push('/accountManage/fund/cash')
            }else{
              this.$router.push('/accountManage/fund/recharge')
            }
          },
        }
    }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .money{
    width : 85% ;
    margin: 0.5rem auto ;
    h1{
      font-size: 0.26rem ;
      color : #333;
      height: 0.6rem ;
      line-height: 0.6rem ;
    }
    .gold{
      display: flex;
      flex-direction:row ;
      padding: 0.2rem 0 ;
      box-sizing: border-box;
      background: #eee ;
      justify-content: center;
      align-items: center;
      margin: 0.2rem auto 0.5rem;
      li{
        flex: 1 ;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        span{
          display: inline-block;
          width: 0.6rem  ;
          height: 0.6rem ;
          border-radius: 50% ;
          margin-right: 0.2rem ;
        }

        dl{
          width: 50% ;
          dt{
            font-size: 0.32rem ;
            line-height: 0.5rem ;

          }
          dd{
            font-size: 0.2rem ;
            color : #333;
            text-indent: 0.32rem;
          }
        }
      }
      li:nth-child(1){
        span{
          background : url('../../../assets/imgs/fund.png') no-repeat center;
          background-size:cover ;
        }
        dt{
          color : #ff524f ;
        }
      }
      li:nth-child(2){
        span{
          background : url('../../../assets/imgs/freeze.png') no-repeat center;
          background-size:cover ;

        }
        dt{
          color : #53c0c1 ;
        }
      }
      li:nth-child(3){
        span{
          background : url('../../../assets/imgs/coin.png') no-repeat center;
          background-size:cover ;

        }
        dt{
          color : #ff9313 ;
        }
      }
    }
    .el-button{
      width: 100px ;
      background : #ff524f;
      color : #fff ;
      border : 0;
      border-radius: 0.1rem;
    }

  }
</style>
