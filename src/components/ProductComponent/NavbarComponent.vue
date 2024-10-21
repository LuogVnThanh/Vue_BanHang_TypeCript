<script setup>
import { storeToRefs } from "pinia";
import { ref, onMounted, watch } from "vue";
import { useRouter, onBeforeRouteUpdate } from "vue-router";
import { useAuthStore } from "../../stores/authStore/authStore";
import { useCategoryStore } from "../../stores/categoryStore/categoryStore";

const router = useRouter();
const authStore = useAuthStore();
const categoryStore = useCategoryStore();
const { categories } = storeToRefs(categoryStore);

// ==============================================
onMounted(() => {
  categoryStore.getAllCategories();
});
</script>

<template>
  <!-- Navbar -->
  <nav class="navbar navbar-expand-lg bg-light">
    <div class="container container-fluid">
      <!-- Logo bên trái -->
      <a class="navbar-brand" href="/">
        <img
          src="https://media.routine.vn/prod/media/3a5190d5-6bc5-4dd1-b8a9-3b143556822a.webp"
          alt="Logo"
          width="40"
          height="40"
        />
      </a>

      <!-- Nút toggle cho di động -->
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Danh sách các sản phẩm nằm giữa -->
      <div
        class="collapse navbar-collapse justify-content-center"
        id="navbarNav"
      >
        <ul class="navbar-nav">
          <li
            class="nav-item dropdown"
            v-for="category in categories"
            :key="category.id"
          >
            <router-link
              :to="{ name: 'ProductByCategory', params: { id: category.id } }"
              class="nav-link dropdown-toggle"
              @click.stop
              role="button"
              aria-expanded="false"
            >
              {{ category.name }}
            </router-link>
            <!--  =======================SUBNAV====================== -->
            <ul class="dropdown-menu">
              <li
                v-for="subCategory in category.children"
                :key="subCategory.id"
              >
                <router-link
                  :to="{
                    name: 'ProductByCategory',
                    params: { id: subCategory.id },
                  }"
                  class="dropdown-item"
                >
                  {{ subCategory.name }}
                </router-link>
              </li>
            </ul>
          </li>
        </ul>
      </div>

      <!-- Icon Cart, User, Logout nằm bên phải -->
      <div class="d-flex">
        <!-- Icon tìm kiếm -->
        <div class="search-container">
          <i class="bi bi-search" @click="toggleSearch"></i>
          <input
            v-if="showSearch"
            type="text"
            class="search-input"
            placeholder="Tìm kiếm..."
          />
        </div>

        <!-- Icon giỏ hàng -->
        <a class="nav-link"  @click="authStore.HandleLoginCart()">
          <i class="bi bi-cart"></i>
        </a>

        <!-- Icon người dùng -->
        <a
          class="nav-link"
          v-if="authStore.isAuthenticated"
          @click="authStore.HandleProfile()"
        >
          <i class="bi bi-person">{{ authStore.userSelf?.name }}</i>
        </a>

        <!-- Hiển thị nút đăng nhập nếu chưa có token -->
        <a v-else class="nav-link" @click="authStore.HandleProfile()">
          <i class="bi bi-person"> Đăng nhập</i>
        </a>

        <!-- Nút đăng xuất chỉ hiển thị khi đã đăng nhập -->
        <a
          v-if="authStore.isAuthenticated"
          class="nav-link"
          @click="authStore.Logout"
        >
          <i class="bi bi-box-arrow-right"></i> Đăng xuất
        </a>
      </div>
    </div>
  </nav>
</template>

<!-- css -->

<style scoped>
/* Custom style for navbar */
.navbar {
  position: fixed; /* Đặt vị trí cố định */
  top: 0; /* Gắn trên cùng */
  left: 0; /* Gắn bên trái */
  right: 0; /* Gắn bên phải */
  z-index: 1000; /* Đảm bảo navbar nằm trên các thành phần khác */
}

.navbar-nav {
  flex-direction: row; /* Inline các mục menu */
}

.nav-item {
  margin-right: 20px; /* Khoảng cách giữa các mục */
}

.nav-link {
  color: black; /* Màu chữ mặc định */
  cursor: pointer;
}

.nav-link:hover {
  color: #007bff; /* Màu khi hover */
}

.dropdown-menu {
  display: none; /* Ẩn menu con */
}

.dropdown:hover .dropdown-menu {
  display: block; /* Hiện menu con khi hover vào menu cha */
}

.d-flex {
  margin-right: 50px;
}

.d-flex a {
  margin-left: 15px; /* Khoảng cách giữa các icon */
}

.navbar-brand img {
  height: 40px;
  width: auto; /* Kích thước logo */
}

/* Style cho input tìm kiếm */
.search-container {
  position: relative; /* Để có thể định vị input */
}

.search-input {
  display: block;
  position: absolute; /* Đặt input ra ngoài */
  right: -270px !important; /* Di chuyển input ra ngoài khung nhìn */
  padding-left: 20px !important;
  top: 50%;
  transform: translateY(-50%);
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: right 0.5s ease; /* Hiệu ứng di chuyển */
}

.search-container .bi-search {
  cursor: pointer;
}

/* Hiện input khi showSearch là true */
.search-container .search-input {
  right: 0; /* Về lại vị trí ban đầu */
}

/* Ẩn input khi showSearch là false */
.search-container .search-input {
  right: -250px; /* Ẩn input */
}

/* Div chứa kết quả tìm kiếm */
.search-results {
  position: absolute;
  background-color: white;
  border: 1px solid #ddd;
  width: 300px;
  max-height: 300px; /* Thay đổi chiều cao tối đa */
  overflow-y: auto;
  margin-top: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  border-radius: 4px; /* Bo góc */
  z-index: 100; /* Đảm bảo nó ở trên */
}

/* Sản phẩm trong danh sách tìm kiếm */
.search-item {
  display: flex;
  align-items: center;
  padding: 10px; /* Tăng khoảng cách padding */
  border-bottom: 1px solid #eee;
  transition: background-color 0.3s; /* Hiệu ứng chuyển màu nền */
  text-decoration: none; /* Bỏ gạch chân cho router-link */
  color: inherit; /* Đảm bảo màu chữ kế thừa */
}

.search-item:hover {
  background-color: #f0f8ff; /* Màu nền khi hover */
}

.search-product-image {
  width: 50px;
  height: 50px;
  margin-right: 10px;
  border-radius: 4px; /* Bo góc ảnh */
}

.search-product-name {
  flex: 1;
  font-weight: bold; /* Làm cho tên sản phẩm nổi bật hơn */
  color: #333; /* Màu chữ */
}

/* Custom style cho thẻ p trong kết quả tìm kiếm */
.search-results p {
  margin: 0; /* Xóa khoảng cách mặc định */
  padding: 10px; /* Thêm padding cho thẻ p */
  font-size: 14px; /* Thay đổi kích thước chữ */
  color: #333; /* Màu chữ */
  font-weight: bold; /* Làm chữ đậm hơn */
  text-align: center; /* Căn giữa văn bản */
  background-color: #f8f9fa; /* Màu nền cho thẻ p */
  border-radius: 4px; /* Bo góc cho thẻ p */
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); /* Thêm bóng cho thẻ p */
  margin-bottom: 5px; /* Khoảng cách dưới giữa các thẻ p */
}
</style>
