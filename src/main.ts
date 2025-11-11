import { createApp } from 'vue'
import type { App as AppType } from 'vue'
import App from './App.vue'
import loginForm from './login_form/loginForm.vue'
import Bg from './bit_import/bg.vue'
import titlefont from './bit_import/titlefont.vue'
import title_text from './bit_import/title_text.vue'
import title_2 from './bit_import/title_2.vue'
createApp(App).mount('#app')
createApp(loginForm).mount('#loginForm')
createApp(Bg).mount('#bg')
createApp(titlefont).mount('#titlefont')
createApp(title_text).mount('#title_text')
createApp(title_2).mount('#title_2')

