 
<script setup lang="ts">

import ManagerProductViewVue from "./ManagerProductView.vue";
import ManagerRevenueViewVue from "./ManagerRevenueView.vue";
import ManagerUserViewVue from "./ManagerUserView.vue";

import { onMounted, reactive, ref } from "vue";
 


 

const currentComponent = ref("ManagerProduct");
const showSection = (component: string) => {
  currentComponent.value = component; // Chuyển sang component quản lý sản phẩm
};

 


 
 
onMounted(() => {
 
 
});
</script>

<template>
  <div class="container">
    <div class="sidebar">     
 
      <nav class="nav-menu">
        <ul>
          <li>
            <a
              href="#"
              @click="showSection('ManagerProduct')"
              >Quản lý sản phẩm</a
            >
          </li>
          <li>
            <a
              href="#"
              @click="showSection('ManagerUser')"
              >Quản lý người dùng</a
            >
          </li>
          <li>
            <a
              href="#"
              @click="showSection('ManagerRevenue')"
              >Quản lý Doanh thu</a
            >
          </li>
          <!-- <li>
            <a
              href="#"
              @click="showSection('ManagerWare')"
              >Quản lý kho</a
            >
          </li> -->
 
        </ul>
      </nav>
    </div>
    <!--  ===================Quản lý sản phẩm=========================== -->
    <div v-if="currentComponent === 'ManagerProduct'" style="width: 100%;">
            <ManagerProductViewVue />
        </div>
    <!-- ===================Quản lý người dùng============================ -->
    <div v-if="currentComponent === 'ManagerUser'" style="width: 100%;">
      <ManagerUserViewVue />
        </div>
    <!-- ===================Quản lý Kho============================ -->
    <div v-if="currentComponent === 'ManagerRevenue'" style="width: 100%;">
      <ManagerRevenueViewVue />
        </div>
    <!-- ===================Quản lý Doanh thu============================ -->
    <!-- <div v-if="currentComponent === 'ManagerProduct'" style="width: 100%;">
            
        </div> -->
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
  width: 30%;
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
