<template>
    <div class="enterprise admission">
      <ul class="admissionStep">
        <li :class="{isActive:show === '1' }"><span>1</span><span>身份信息</span></li>
        <span>＞＞＞＞＞＞＞＞＞</span>
        <li :class="{isActive:show === '2' }"><span>2</span><span>店铺信息</span></li>
        <span>＞＞＞＞＞＞＞＞＞</span>
        <li :class="{isActive:show === '3'  }"><span>3</span><span>入驻成功</span></li>
      </ul>
    </div>
</template>

<script>
  import Enterprise1 from "@/views/merchantCenter/userCenter/admissionShop/enterprise1"
  import Enterprise2 from "@/views/merchantCenter/userCenter/admissionShop/enterprise2"
    export default {
      name: "enterprise",
      components: {

        Enterprise1,
        Enterprise2

      },
        data() {
            return {
              isActive : false,
              tabView : '',
              show: '1',

            }
        },
        mounted() {
        },
        methods: {}
    }
</script>

<style scoped lang="scss" rel="stylesheet/scss">

</style>
