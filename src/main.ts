import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import VueCookies from 'vue-cookies';
import VueSweetalert2 from 'vue-sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
import {PromiseDialog} from "vue3-promise-dialog";

const app = createApp(App)

app.use(createPinia())
app.use(VueCookies)
app.use(router)
app.use(VueSweetalert2)
app.use(PromiseDialog)
app.mount('#app')
