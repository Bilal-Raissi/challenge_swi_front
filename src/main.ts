// Import Bootstrap CSS and JS
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap';

import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia';

const app = createApp(App)
const pinia = createPinia();

app.use(router) // Utiliser le route
app.use(pinia) // Utiliser pinia
app.mount('#app')
