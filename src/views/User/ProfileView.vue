<script setup lang="ts">
import type { IProfile } from "../../interface/auth/auth";
import { useAuthStore } from "../../stores/authStore/authStore";
import { onMounted, reactive, ref } from "vue";

const authStore = useAuthStore();
const user = reactive<IProfile>({
  id: 0,
  name: '',
  email: '',
  phone: '',
  status: '',
  role: [ ],
}); 

// Thêm một đối tượng reactive để kiểm soát việc hiển thị của hai div
const state = reactive({
  showUserInfo: true,
  showOrderDetails: false,
  HandleProd: false,
});

// Hàm để xử lý sự kiện click và hiển thị div tương ứng
// Hàm để xử lý sự kiện click và hiển thị div tương ứng
const toggleUserInfo = () => {
  state.showUserInfo = true;
  state.showOrderDetails = false;
 
};

const toggleOrderDetails = () => {
  state.showOrderDetails = true;
  state.showUserInfo = false;
};

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
          <a href="#" @click="toggleUserInfo">Sửa Hồ Sơ</a>
        </div>
      </div>
      <nav class="nav-menu">
        <ul>
          <li><a href="#" @click="toggleUserInfo">Tài Khoản Của Tôi</a></li>
          <li><a href="#" @click="toggleOrderDetails">Đơn Hàng Của Tôi</a></li>
          <li>
            <router-link to="/dashboard" v-if="authStore.isAdmin" href="#"
              >DashBoard</router-link
            >
          </li>
        </ul>
      </nav>
    </div>

    <div v-if="state.showUserInfo" class="info-user">
      <h2>Thông tin cá nhân</h2>
      <p>Họ tên: {{ user?.name || "..." }}</p>
      <p>Email: {{ user?.email || "..." }}</p>
      <p>Số điện thoại: {{ user?.phone || "..." }}</p>
      <a href="#">Chỉnh sửa thông tin</a>
    </div>


    <div v-if="state.showOrderDetails" class="order-details">
      <div class="order-card">
        <h3>Đơn hàng của tôi</h3>
        <div class="order-item">
          <div class="item-info">
            <img
              src="https://bulma.io/assets/images/placeholders/1280x960.png"
              alt="Product Image"
            />
            <div class="details">
              <h4>Áo thun</h4>
              <p>Phân loại hàng: Đồ mới</p>
              <p>Số lượng: x1</p>
              <p class="price">Giá: 136.200 VNĐ</p>
            </div>
          </div>
          <div class="status">
            <span v-if="state.HandleProd" class="canceled">Đang giao hàng</span>
            <span v-else class="canceled">Đã hàng</span>
            <p>Thành tiền: <span class="total-price">108.199 VNĐ</span></p>
            <button v-if="!state.HandleProd" class="buy-again">Đánh giá</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex; /* Sử dụng flexbox cho bố cục */

  font-family: Arial, sans-serif; /* Font chữ */
}

.sidebar {
  width: 25%; /* Chiếm 25% chiều ngang */
  background-color: #f8f8f8; /* Màu nền */
  padding: 20px; /* Padding bên trong */
  border-right: 1px solid #ccc; /* Viền bên phải */
  height: 100%;

}

.user-info {
  display: flex; /* Sử dụng flexbox để căn chỉnh */
  align-items: center; /* Căn giữa theo chiều dọc */
}

.user-avatar {
  margin-right: 10px; /* Khoảng cách giữa hình ảnh và tên */
}

.user-avatar img {
  width: 60px; /* Kích thước hình ảnh */
  height: 60px; /* Kích thước hình ảnh */
  border-radius: 50%; /* Bo tròn hình ảnh */
}
.user-info p {
  margin: 0; /* Xóa margin */

  width: 100%;
}

.user-info a {
  text-decoration: none; /* Không gạch chân */
  color: #007bff; /* Màu chữ */
  font-size: 14px; /* Kích thước chữ */
}

.nav-menu ul {
  list-style-type: none; /* Xóa dấu đầu dòng */
  padding: 0; /* Xóa padding */
}

.nav-menu li {
  margin: 10px 0; /* Khoảng cách giữa các mục */
}

.nav-menu a {
  text-decoration: none; /* Không gạch chân */
  color: #333; /* Màu chữ */
  padding: 10px; /* Padding cho liên kết */
  display: block; /* Hiển thị dưới dạng block */
  transition: background-color 0.3s; /* Hiệu ứng chuyển màu nền */
}

.nav-menu a:hover,
.nav-menu a.active {
  background-color: #007bff; /* Màu nền khi hover hoặc active */
  color: white; /* Màu chữ trắng khi hover */
}

.order-details {
  width: 75%; /* Chiếm 75% chiều ngang */
  padding: 20px; /* Padding bên trong */
}

.order-card {
  border: 1px solid #ccc; /* Viền quanh đơn hàng */
  border-radius: 5px; /* Bo góc */
  padding: 15px; /* Padding bên trong */
  background-color: #fff; /* Màu nền */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Đổ bóng */
}

.order-item {
  display: flex; /* Sử dụng flexbox để căn chỉnh */
  justify-content: space-between; /* Căn giữa giữa các phần */
  align-items: center; /* Căn giữa theo chiều dọc */
  margin: 10px 0; /* Khoảng cách giữa các sản phẩm */
}

.item-info {
  display: flex; /* Sử dụng flexbox cho thông tin sản phẩm */
  align-items: center; /* Căn giữa theo chiều dọc */
}

.item-info img {
  width: 80px; /* Kích thước hình ảnh sản phẩm */
  height: 80px; /* Kích thước hình ảnh sản phẩm */
  margin-right: 10px; /* Khoảng cách bên phải */
}

.details {
  flex: 1; /* Chiếm không gian còn lại */
}

.price {
  color: #d9534f; /* Màu chữ cho giá */
  font-weight: bold; /* Đậm chữ */
}

.status {
  text-align: right; /* Căn phải */
}

.canceled {
  color: #d9534f; /* Màu đỏ cho trạng thái đã hủy */
  font-weight: bold; /* Đậm chữ */
}

.total-price {
  font-weight: bold; /* Đậm chữ cho tổng tiền */
}

.buy-again {
  background-color: #007bff; /* Màu nền nút */
  color: white; /* Màu chữ */
  border: none; /* Không viền */
  border-radius: 5px; /* Bo góc */
  padding: 10px 15px; /* Padding cho nút */
  cursor: pointer; /* Con trỏ khi hover */
  transition: background-color 0.3s; /* Hiệu ứng chuyển màu */
}

.buy-again:hover {
  background-color: #0056b3; /* Màu nền khi hover */
}
</style>
