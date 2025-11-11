<template>
  <!-- <form class="login100-form validate-form" method="post" action="/"> -->
  <div class="wrap-input100 validate-input" data-validate="Valid email is: a@b.c">
    <input class="input100" type="text" name="username" v-model="user" />
    <span class="focus-input100" data-placeholder="用户名/UserName"></span>
  </div>

  <div class="wrap-input100 validate-input" data-validate="Enter password">
    <span class="btn-show-pass">
      <i class="zmdi zmdi-eye"></i>
    </span>
    <input class="input100" type="password" name="pass" v-model="pwd" />
    <span class="focus-input100" data-placeholder="密码/Password"></span>
  </div>

  <div class="container-login100-form-btn">
    <div class="wrap-login100-form-btn">
      <div class="login100-form-bgbtn"></div>
      <button class="login100-form-btn" @click="Login">登录</button>
    </div>
  </div>
  <!-- </form> -->
  <div class="text-center p-t-115">
    <span class="txt1">{{ alert_div }}</span>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { onMounted } from 'vue'
import axios from 'axios'

// Our official coze sdk for JavaScript [coze-js](https://github.com/coze-dev/coze-js)

const user = ref('')
const pwd = ref('')
const alert_div = ref('没有账号? ')
onMounted(() => {
  const script = document.createElement('script')
  script.src = '../../js/main.js'
  script.onload = () => {
    // console.log('main.js 加载完成，表单验证逻辑生效')
  }
  script.onerror = (err) => {
    console.error('main.js 加载失败：', err)
  }
  document.body.appendChild(script)
})
const Login = async () => {
  if (!user.value || !pwd.value) {
    const alert_tips = document.querySelector('.txt1')
    alert_tips.style.color = 'red'
    alert_div.value = '请输入用户名或密码'
    return false
  }
  const response = await axios.post('http://localhost:3000/login', {
    mobile: user.value,
    pwd: pwd.value,
  })
  console.log(response.data)
  console.log(response.data.resp_code)
  console.log('执行登录操作')
}
</script>

<style></style>
