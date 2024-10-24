<script setup lang="ts">
import { ref } from "vue";

import ManagerProductViewVue from "./ManagerProductView.vue";
import ManagerRevenueViewVue from "./ManagerRevenueView.vue";
import ManagerUserViewVue from "./ManagerUserView.vue";

const currentComponent = ref("ManagerProduct");
const showSection = (component: string) => {
  currentComponent.value = component; // Chuyển sang component quản lý sản phẩm
};
</script>

<template>
<div class="container">
  <div class="dashboard">
    <!-- Div chứa các thẻ quản lý -->
    <div class="management-tokens">
      <h5 @click="showSection('ManagerProduct')">Quản lý sản phẩm</h5>
      <h5 @click="showSection('ManagerUser')">Quản lý người dùng</h5>
      <h5>Quản lý kho</h5>
      <h5 @click="showSection('ManagerRevenue')">Quản lý Doanh thu</h5>
    </div>

    <!-- Div bên phải để hiển thị component -->
    <div class="content"></div>
    <!-- Hiện quản lý sản phẩm -->
    <div v-if="currentComponent === 'ManagerProduct'">
      <ManagerProductViewVue />
    </div>

    <!-- Quản lý user -->
    <div v-if="currentComponent === 'ManagerUser'">
      <ManagerUserViewVue />
    </div>

    <!-- Quản lý kho -->
    <div v-if="currentComponent === 'ManagerRevenue'">
      <ManagerRevenueViewVue />
    </div>
  </div>
</div>
</template>

<style scoped>
.dashboard {
  display: flex; /* Sử dụng flexbox để chia layout */
}

.management-tokens {
  width: 40%; /* Chiếm 40% chiều rộng */
  padding: 20px;
  border-right: 1px solid #ddd; /* Thêm đường viền bên phải */
}

.management-tokens h5 {
  cursor: pointer; /* Hiển thị con trỏ tay khi hover */
  padding: 10px 0;
}

.management-tokens h5:hover {
  color: #007bff; /* Màu khi hover */
}

.content {
  width: 60%; /* Chiếm 60% chiều rộng */
  padding: 20px;
}
</style>
