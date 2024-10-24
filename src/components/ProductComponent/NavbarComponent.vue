<script setup>
import { storeToRefs } from "pinia";
import { ref, onMounted, watch } from "vue";
import { useRouter, onBeforeRouteUpdate } from "vue-router";
import { useAuthStore } from "../../stores/authStore/authStore";
import { useCategoryStore } from "../../stores/categoryStore/categoryStore";
import { useProductStore } from "../../stores/productStore/productStore";
import { getProductImage } from "../../helpers/getImages/getImage";

const router = useRouter();
const productStore = useProductStore();
const authStore = useAuthStore();
const categoryStore = useCategoryStore();
const { categories } = storeToRefs(categoryStore);

const { ResultProductBySearch } = storeToRefs(productStore);

const goToHomePage = () => {
  productStore.currentPage = 1; // Đặt lại currentPage về 1
  localStorage.setItem("currentPage", "1"); // Cập nhật localStorage
  productStore.getProductByPage(1); // Gọi lại hàm lấy sản phẩm trang 1
};
// =====================SEARCH=========================
const searchKeyWord = ref("");
const showSearchInput = ref(false);
const showSearchResult = ref(false);

const toggleSearch = () => {
  showSearchInput.value = !showSearchInput.value;
  if (!showSearchInput.value) {
    showSearchResult.value = false;
    searchKeyWord.value = "";
  }
};
const searchProduct = async () => {
  try {
    if (searchKeyWord.value) {
      await productStore.searchProduct(searchKeyWord.value);
      showSearchResult.value = true;
    } else {
      showSearchResult.value = false;
    }
  } catch (error) {
    console.error("Lỗi khi tìm kiếm sản phẩm:", error);
  }
};

watch(searchKeyWord, () => {
  searchProduct();
});

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

      <router-link class="navbar-brand" to="/" @click="goToHomePage">
        <img
          src="https://media.routine.vn/prod/media/3a5190d5-6bc5-4dd1-b8a9-3b143556822a.webp"
          alt="Logo"
          width="80"
          height="40"
        />
      </router-link>

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

      <!-- Chỉnh sửa phần search và icons -->
      <div class="nav-actions">
        <!-- Search container -->
        <div class="search-container">
          <i class="bi bi-search search-icon" @click="toggleSearch"></i>
          <transition name="fade">
            <input
              v-if="showSearchInput"
              v-model="searchKeyWord"
              type="text"
              class="search-input"
              placeholder="Tìm kiếm..."
              @input="searchProduct"
            />
          </transition>

          <!-- Kết quả tìm kiếm -->
          <div
            v-if="showSearchResult && showSearchInput"
            class="search-results"
          >
            <div v-if="ResultProductBySearch.length === 0" class="no-results">
              Không có sản phẩm nào tìm thấy.
            </div>
            <div v-else class="results-container">
              <router-link
                v-for="item in ResultProductBySearch"
                :key="item.id"
                :to="{ name: 'DetailProduct', params: { id: item.id } }"
                class="search-item"
              >
                <img
                  :src="getProductImage(item.images[0]?.url)"
                  alt="Product"
                  class="search-product-image"
                />
                <div class="search-product-name">{{ item.name }}</div>
              </router-link>
            </div>
          </div>
        </div>

        <!-- Cart Icon -->
        <a class="nav-link" @click="authStore.HandleLoginCart()">
          <i class="bi bi-cart"></i>
        </a>

        <!-- User Icon/Login -->
        <a
          class="nav-link"
          v-if="authStore.isAuthenticated"
          @click="authStore.HandleProfile()"
        >
        <i class="bi bi-person" style="margin-right: 3px;"></i> {{ authStore.userSelf?.name }} 
      </a>
        <a v-else class="nav-link" @click="authStore.HandleProfile()">
          <i class="bi bi-person" style="margin-right: 3px;"> </i>Đăng nhập
        </a>

        <!-- Logout Icon -->
        <a
          v-if="authStore.isAuthenticated"
          class="nav-link"
          @click="authStore.Logout"
        >
          <i class="bi bi-box-arrow-right" style="margin-right: 3px;"></i> Đăng xuất
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
  margin-right: 5px; /* Khoảng cách giữa các mục */
}

.nav-link {
  color: black; /* Màu chữ mặc định */
  cursor: pointer;
  display: flex;
  align-items: center;
  text-decoration: none;
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

.nav-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.search-container {
  display: flex;
  align-items: center;
  position: relative;
  gap: 8px;
}

.search-icon {
  cursor: pointer;
  font-size: 1.2rem;
  padding: 5px;
}

/* Search input */
.search-input {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 20px;
  width: 180px;
  height: 35px;
  font-size: 14px;
  transition: all 0.3s ease;
}

/* Search results */
.search-results {
  position: absolute;
  top: 100%;
  right: 0;
  width: 300px;
  max-height: 400px;
  background: white;
  border: 1px solid #eee;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  z-index: 1000;
  margin-top: 5px;
}

.no-results {
  padding: 15px;
  text-align: center;
  color: #666;
}

.results-container {
  padding: 5px 0;
}

.search-item {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  text-decoration: none;
  color: inherit;
  transition: background-color 0.2s;
}

.search-item:hover {
  background-color: #f5f5f5;
}

.search-product-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 10px;
}

.search-product-name {
  font-size: 14px;
  color: #333;
  flex: 1;
}

.other-icons .nav-link {
  margin-left: 15px;
}

/* Animation cho input */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  width: 0;
  padding: 0;
}
</style>
