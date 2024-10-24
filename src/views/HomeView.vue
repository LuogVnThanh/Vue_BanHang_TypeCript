<script setup lang="ts">
import { storeToRefs } from "pinia";
import { onMounted } from "vue";
import { useAuthStore } from "../stores/authStore/authStore";
import { useProductStore } from "../stores/productStore/productStore";
import { getProductImage } from "../helpers/getImages/getImage"; // Import hàm getProductImage
import { formatCurrency } from "../helpers/formatCurrency/formatCurrency";

const authStore = useAuthStore();
const productStore = useProductStore();
const { userSelf } = storeToRefs(authStore);
const { pagedProducts } = storeToRefs(productStore);

// Hàm để lấy trang từ localStorage
const getStoredPage = () => {
  const storePage = localStorage.getItem("currentPage");
  return storePage ? parseInt(storePage) : 1; // Nếu không có, mặc định là 1
};

const prevPage = () => {
  if (productStore.currentPage > 1) {
    productStore.getProductByPage(productStore.currentPage - 1); // Sử dụng productStore.currentPage
    localStorage.setItem(
      "currentPage",
      (productStore.currentPage - 1).toString()
    ); // Cập nhật trang vào localStorage
  }
};

const nextPage = () => {
  if (productStore.currentPage < productStore.last_page) {
    // Đảm bảo không vượt quá trang cuối

    productStore.getProductByPage(productStore.currentPage + 1); // Sử dụng productStore.currentPage
    localStorage.setItem(
      "currentPage",
      (productStore.currentPage + 1).toString()
    ); // Cập nhật trang vào localStorage
  }
};
const goToPage = (page: number) => {
  if (page >= 1 && page <= productStore.last_page) {
    productStore.getProductByPage(page);
    localStorage.setItem("currentPage", page.toString());
  }
};

onMounted(() => {
  const storePage = localStorage.getItem("currentPage");
  const initialPage = storePage ? Number(storePage) : 1; // Nếu không có, mặc định là 1

  productStore.getProductByPage(initialPage);
});
</script>

<template>
  <div class="container">
    <!-- Div chính chứa tất cả sản phẩm -->
    <div class="product-list">
      <!-- Div tổng chứa sản phẩm -->
      <div
        class="product-container"
        v-for="prod in pagedProducts"
        :key="prod.id"
      >
        <!-- Div chứa hình ảnh sản phẩm -->
        <div class="product-image">
          <!-- Cụ thể, bạn đang cố gắng truy cập thuộc tính prod.images?.[0].image), nhưng prod.images là một mảng các đối tượng hình ảnh, nên bạn cần truy cập vào đối tượng đầu tiên trong mảng. -->

          <RouterLink :to="{ name: 'DetailProduct', params: { id: prod.id } }">
            <img
              style="height: auto; width: 100%; object-fit: contain"
              :src="getProductImage(prod.images[0]?.url)"
              alt="Product Image"
            />
          </RouterLink>

          <!-- Nút Mua ngay và Chi tiết khi hover vào ảnh -->
          <div class="product-buttons">
            <!-- <button @click="buyNow(prod)">Mua Ngay</button> -->
            <button>Mua ngay</button>
            <RouterLink :to="{ name: 'DetailProduct', params: { id: prod.id } }"
              ><button>Chi Tiết</button></RouterLink
            >
          </div>
        </div>

        <!-- Thông tin sản phẩm: tên và giá -->
        <div class="product-info">
          <div class="product-name">{{ prod.name }}</div>
          <div class="product-price">
            <!-- Giá gốc (gạch ngang) -->
            <span class="original-price"
              >{{ formatCurrency(prod.price * 1) }}
            </span>
            <!-- Giá đã giảm (giảm 30%) -->
            <span class="discounted-price" style="color: rgb(67, 67, 67)"
              >{{ formatCurrency(prod.price * 1) }}
            </span>
          </div>
        </div>
      </div>
    </div>
   
    <!-- Phân trang -->
    <div class="pagination">
      <!-- Nút số trang -->
      <div class="page-buttons">
        <button class="page-btn"
          v-for="page in productStore.last_page"
          :key="page"
          @click="goToPage(page)"
          :class="{ active: page === productStore.currentPage }"
        >
          {{ page }}
        </button>
      </div>

      <!-- Nút điều hướng "Trước" và "Sau" -->
      <div class="navigation-buttons">
        <button class="nextandpev" @click="prevPage" :disabled="productStore.currentPage <= 1">
          Trước
        </button>
        <button  class="nextandpev"
          @click="nextPage"
          :disabled="productStore.currentPage >= productStore.last_page"
        >
          Sau
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Div chính chứa tất cả sản phẩm */
.product-list {
  display: flex;
  flex-wrap: wrap; /* Cho phép các sản phẩm xuống hàng khi không đủ chỗ */

  gap: 25px; /* Khoảng cách giữa các sản phẩm */
}

/* Tổng container chứa sản phẩm */
.product-container {
  flex: 0 1 calc(25% - 20px); /* Chiếm 25% chiều rộng mỗi sản phẩm trừ khoảng cách 20px */
  margin: 10px 0; /* Khoảng cách trên và dưới */
  text-align: center;
  border-radius: 5px;
  border: 1px solid #ddd;
  padding: 15px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  position: relative;
  overflow: hidden;
}

/* Khi hover sản phẩm sẽ có hiệu ứng */
.product-container:hover {
  transform: scale(1.05);
}

/* Div chứa hình ảnh sản phẩm */
.product-image {
  position: relative;
  width: 100%;
  height: 250px;
  overflow: hidden;
}

/* Style cho hình ảnh sản phẩm */
.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Nút Mua Ngay và Chi Tiết chỉ hiển thị khi hover */
.product-buttons {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 10px 0;
  transform: translateY(100%);
  transition: transform 0.3s ease;
}

.product-container:hover .product-buttons {
  transform: translateY(0);
}

/* Style cho tên sản phẩm và giá */
.product-info {
  margin-top: 15px;
}

.product-name {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
  white-space: nowrap; /* Không cho văn bản xuống dòng */
  overflow: hidden; /* Ẩn phần văn bản vượt quá kích thước */
  text-overflow: ellipsis; /* Hiển thị dấu "..." khi văn bản quá dài */
}

/* Style cho giá sản phẩm */
.product-price {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.original-price {
  font-size: 16px;
  color: #888;
  text-decoration: line-through;
}

.discounted-price {
  font-size: 16px;
  color: #007bff;
  font-weight: bold;
}

/* Style cho nút Mua Ngay và Chi Tiết */
.product-buttons button {
  background: #007bff;
  border: none;
  padding: 8px 15px;
  color: white;
  font-size: 14px;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.product-buttons button:hover {
  background-color: #0056b3;
}
.pagination {
  display: flex;
  justify-content: space-between; /* Căn hai phần sang hai bên */
  align-items: center;
  margin-top: 20px;
}

.page-buttons {
  display: flex;
  gap: 5px; /* Khoảng cách giữa các nút số trang */
}

.navigation-buttons {
  display: flex;
  gap: 10px; /* Khoảng cách giữa nút "Trước" và "Sau" */
}

.page-buttons button,
.navigation-buttons button {
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 50px;
}
.nextandpev{
width: 100px !important ;
}

.page-buttons button:disabled,
.navigation-buttons button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* Nút số trang hiện tại */
.page-buttons button.active {
  background-color: #0056b3;
  font-weight: bold;
}


</style>
