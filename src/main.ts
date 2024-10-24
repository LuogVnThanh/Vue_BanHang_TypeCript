
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.js';
import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/authStore/authStore';
 

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Khởi tạo auth store ngay khi app start
const authStore = useAuthStore()
await authStore.initializeAuth()

 

app.mount('#app')


