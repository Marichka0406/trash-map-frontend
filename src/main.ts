import 'primeicons/primeicons.css'
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'mapbox-gl/dist/mapbox-gl.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import Vue3Toastify from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import store from '../src/store/index';

import router from './router'
import { createApp } from 'vue'
import App from './App.vue'


const app = createApp(App)

app.use(store);
app.use(router)
app.use(Vue3Toastify, {
    autoClose: 3000,
    position: "top-right"
})

app.mount('#app')
