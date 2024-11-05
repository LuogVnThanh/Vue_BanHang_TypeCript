<script setup lang="ts">
import type { IProfile } from "../../interface/auth/auth";
import { useAuthStore } from "../../stores/authStore/authStore";
import { onMounted, reactive, ref } from "vue";
import  OrderViewVue from "../Order/OrderView.vue"; // Kiểm tra đường dẫn



const authStore = useAuthStore();
const user = reactive<IProfile>({
  id: 0,
  name: "",
  email: "",
  phone: "",
  status: "",
  role: [],
});

const currentComponent = ref("Profile");
const showSection = (component: string) => {
  currentComponent.value = component; // Chuyển sang component quản lý sản phẩm
};

// Thêm một đối tượng reactive để kiểm soát việc hiển thị của hai div
const state = reactive({
  showUserInfo: false,
  showOrderDetails: true,
});

 
 
 
onMounted(() => {
 
  Object.assign(user, authStore.userSelf); // Gán giá trị cho user bằng Object.assign
});
</script>

<template>
  <div class="container">
    <div class="sidebar">
      <div class="user-info">
        <div class="user-avatar">
          <img
            src="https://bulma.io/assets/images/placeholders/128x128.png"
            alt="User Avatar"
          />
        </div>
        <div>
          <p><strong>Thanh18252</strong></p>
          <a href="">Sửa Hồ Sơ</a>
        </div>
      </div>
      <nav class="nav-menu">
        <ul>
          <li>
            <a
              href="#"
              @click="showSection('Profile')"
              >Tài Khoản Của Tôi</a
            >
          </li>
          <li>
            <a
              href="#"
              @click="showSection('Order')"
              >Đơn Hàng Của Tôi</a
            >
          </li>
          <li>
            <router-link to="/dashboard" v-if="authStore.isAdmin" href="#"
              >DashBoard</router-link
            >
          </li>
        </ul>
      </nav>
    </div>
    <!--  ===================Thông tin người dùng=========================== -->

    <div v-if="currentComponent === 'Profile'" class="info-user">
      <h2>Thông tin cá nhân</h2>
      <p>Họ tên: {{ user?.name || "..." }}</p>
      <p>Email: {{ user?.email || "..." }}</p>
      <p>Số điện thoại: {{ user?.phone || "..." }}</p>
      <a href="#">Chỉnh sửa thông tin</a>
    </div>

    <!-- ===================Thông tin sản phẩm============================ -->
          <!-- Hiện quản lý sản phẩm -->
          <div v-if="currentComponent === 'Order'" style="width: 100%;">
          <OrderViewVue />
        </div>

 
  </div>

 
</template>

<style scoped>
.container {
  display: flex;
  gap: 20px; /* Khoảng cách giữa sidebar và nội dung chính */
  font-family: Arial, sans-serif;
  padding: 20px;
  background-color: #f0f2f5; /* Màu nền tổng thể */
  min-height: 100vh; /* Chiều cao tối thiểu của màn hình */
}

.sidebar {
  width: 25%;
  background-color: #fff;
  padding: 20px;
  border-radius: 10px; /* Bo góc sidebar */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* Đổ bóng nhẹ */
  border: 1px solid #e0e0e0; /* Viền mờ */
}

.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 20px; /* Khoảng cách dưới giữa user info và menu */
}

.user-avatar {
  margin-right: 15px;
}

.user-avatar img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 2px solid #007bff; /* Viền màu xanh đậm */
}

.user-info p {
  margin: 0;
  font-weight: bold; /* Đậm chữ tên người dùng */
  color: #333;
}

.user-info a {
  text-decoration: none;
  color: #007bff;
  font-size: 14px;
  margin-top: 5px; /* Khoảng cách phía trên liên kết */
  display: inline-block;
}

.nav-menu ul {
  list-style-type: none;
  padding: 0;
}

.nav-menu li {
  margin: 10px 0;
}

.nav-menu a {
  text-decoration: none;
  color: #333;
  padding: 10px;
  display: block;
  border-radius: 5px; /* Bo góc */
  transition: background-color 0.3s;
}

.nav-menu a:hover,
.nav-menu a.active {
  background-color: #007bff;
  color: white;
}
</style>
