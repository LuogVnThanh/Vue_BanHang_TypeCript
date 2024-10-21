import { useAuthStore } from '@/stores/authStore/authStore'
import axios from 'axios'


const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Authorization':'bearer <token>',
    },
     
})

// rq interceptor

axiosInstance.interceptors.request.use(
    (config) => {
      const authStore = useAuthStore()
      const token = authStore.Token
      if (token) {
        config.headers['Authorization'] = `bearer ${token}`
      }
      return config
    },

    (err) => {
      return Promise.reject(err)
    }
  )
  
  //response interceptor
  
  axiosInstance.interceptors.response.use(
    (response) => {
      return response
    },
    (error) => {
      const authStore = useAuthStore()
  
      // kt token or het han token
      if (error.response && error.response.status === 401) {
        authStore.Logout()
  
        // chuyen den trang login
        window.location.href = '/Login'
      }
      return Promise.reject(error)
    }
  )
  
  export default axiosInstance