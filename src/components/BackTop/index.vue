<template>
  <div class="backTop">
    <el-button  @click="back" v-show="visible" >回到顶部</el-button>
  </div>
</template>

<script>
    export default {
      name: "backTop" ,
      data() {
        return {
          visible: false,
          interval: null
        }
      },
      props: {
        visibilityHeight: {
          type: Number,
          default: 400
        },
        backPosition: {
          type: Number,
          default: 0
        },
      },
      mounted() {
        window.addEventListener('scroll', this.handleScroll)
      },
      beforeDestroy() {
        window.removeEventListener('scroll', this.handleScroll);
        if (this.interval) {
          clearInterval(this.interval)
        }
      },
      methods: {
        handleScroll() {
          this.visible = window.pageYOffset > this.visibilityHeight
        },
        back(){
          const start = window.pageYOffset
          let i = 0
          this.interval = setInterval(() => {
            const next = Math.floor(this.easeInOutQuad(10 * i, start, -start, 500))
            if (next <= this.backPosition) {
              window.scrollTo(0, this.backPosition)
              clearInterval(this.interval)
            } else {
              window.scrollTo(0, next)
            }
            i++
          }, 16.7)
        },

        easeInOutQuad(t, b, c, d) {
          if ((t /= d / 2) < 1) return c / 2 * t * t + b
          return -c / 2 * (--t * (t - 2) - 1) + b
        }
      }
    }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .backTop{
    position : fixed ;
    right : 0.3rem ;
    bottom : 0.3rem ;
    .el-button{
      width : 1rem ;
      height : 0.5rem ;
      color : #666 ;

    }
  }
</style>
