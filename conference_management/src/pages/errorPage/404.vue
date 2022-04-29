<template>
  <div style="backgrounnd:#f0f2f5;margin-top:-20px;height:100%">
      <div class="wscn-http404">
          <div class="pic-403"></div>
          <div class="bullshit">
              <div class="bullshit_headline">{{message}}</div>
              <div class="bullshit_info">请检查输入网址是否正确</div>
              <a @click="backToHome" class="bullshit_return-home">返回首页</a>
          </div>
      </div>
  </div>
</template>

<script>
export default {
    name:'page404',
    data(){
        return {

        }
    },
    methods:{
        backToHome(){
            this.$router.push('/')
        }
    },
    computed:{
        message() {
            return '404 你的页面飞走了'
        }
    }
}
</script>

<style>

</style>