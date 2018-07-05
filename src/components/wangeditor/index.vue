<template>
  <div id="wangeditor">
    <div ref="editorElem" style="text-align:left" v-html="word"></div>
  </div>
</template>

<script>
  import { getToken } from '@/utils/auth'
  import E from 'wangeditor'
    export default {
        name: "wangeditor",
        props:['catchData'],    //接收父组件的方法
        data() {
            return {
              word: '',
              dataInterface: {
                editorUpImgUrl: process.env.BASE_API+'/file/multi/upload' // 编辑器插入的图片上传地址
              },
              editor: '',  // 存放实例化的wangEditor对象，在多个方法中使用
              token: getToken(),
            }
        },

        mounted() {

          this.createEditor();
          // console.log(this.getData)
          // this.$set(this.content,'word',this.getData)


        },
        methods: {
          createEditor(){
            var editor = new E(this.$refs.editorElem)        //创建富文本实例

            editor.customConfig.onchange = (html) => {

              this.catchData(html)  //把这个html通过catchData的方法传入父组件
            }
            editor.customConfig.uploadImgServer = this.dataInterface.editorUpImgUrl
            editor.customConfig.uploadFileName = 'sourcePic'
            editor.customConfig.showLinkImg = false;
            editor.customConfig.uploadImgMaxLength = 10;
            editor.customConfig.uploadImgHeaders = {
              'ContentType': 'application/json',
              'yb-tryout-merchant-token':this.token    //头部token
            }
            editor.customConfig.uploadImgParams = {
              token : 'abcdef12345'
            }
            editor.customConfig.menus = [          //菜单配置
              'head',
              'list',  // 列表
              'justify',  // 对齐方式
              'quote',  // 引用
              'bold',
              'fontSize',  // 字号
              'italic',
              'underline',
              'strikeThrough',  // 删除线
              'foreColor',  // 文字颜色
              'backColor',  // 背景颜色
              'link',  // 插入链接
              'image',  // 插入图片
              'table',  // 表格
              'video',  // 插入视频
              'undo',  // 撤销
              'redo'  // 重复
            ]
            editor.customConfig.uploadImgHooks = {
              before: function (xhr, editor, files) {
                // 图片上传之前触发
                // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，files 是选择的图片文件

                // 如果返回的结果是 {prevent: true, msg: 'xxxx'} 则表示用户放弃上传
                // return {
                //     prevent: true,
                //     msg: '放弃上传'
                // }
              },
              success: function (xhr, editor, result) {
                // 图片上传并返回结果，图片插入成功之后触发
                // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果

                this.imgUrl= Object.values(result.data.filePath).toString()
              },
              fail: function (xhr, editor, result) {
                // 图片上传并返回结果，但图片插入错误时触发
                // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果

              },
              error: function (xhr, editor) {
                // 图片上传出错时触发
                // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
              },
              timeout: function (xhr, editor) {
                // 图片上传超时时触发
                // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
              },

              customInsert: function (insertImg, result, editor) {
                // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
                // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果
                let url = Object.values(result.data.filePath)      //result.data就是服务器返回的图片名字和链接
                // console.log(result.data.filePath,url)
                // if(url.length !==1){
                  result.data.filePath.map( i => {
                    // let url = Object.values(i)      //result.data就是服务器返回的图片名字和链接
                  insertImg(i)

                  })
                // }

              }
            }
            editor.customConfig.linkImgCallback = function (url) {
              // console.log(url) // url 即插入图片的地址
            }

            editor.create()
            // editor.txt.html(this.getData)

          },


        }
    }
</script>

<style scoped lang="scss" rel="stylesheet/scss">

</style>
