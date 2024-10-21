<script setup lang="ts" >
import type { IRegister } from "@/interface/auth/auth";
import { useAuthStore } from "@/stores/authStore/authStore";
import { computed, reactive, ref } from "vue";
import { useRouter } from "vue-router";
 

const errorMessage = ref("");

const router = useRouter();
const authStore = useAuthStore()


const initialRegister = reactive<IRegister>({
  email: "trong@gmail.com",
  name: "Trọng",
  password: "123456",
  password_confirmation: "123456",
})

// Trạng thái để kiểm tra xem mật khẩu có được hiển thị hay không
const showPassword = ref(false);
const showConfirmPassword = ref(false);

// Computed property để kiểm tra nút có thể được kích hoạt hay không
const isFormValid = computed(() => {
  return (
    initialRegister.name.trim() !== "" &&
    initialRegister.email.trim() !== "" &&
    initialRegister.password.trim() !== "" &&
    initialRegister.password_confirmation.trim() !== ""
  );
});

// Hàm xử lý đăng ký
const HandleRegister = async () => {
  errorMessage.value = ""; // Reset thông báo lỗi

  // Kiểm tra các trường không được để trống
  if (
    initialRegister.name.trim() === "" ||
    initialRegister.email.trim() === "" ||
    initialRegister.password.trim() === "" ||
    initialRegister.password_confirmation.trim() === ""
  ) {
    errorMessage.value = "Vui lòng điền đầy đủ thông tin!";
    return;
  }

  // Kiểm tra độ dài mật khẩu
  if (initialRegister.password.length < 6) {
    errorMessage.value = "Mật khẩu phải chứa ít nhất 6 ký tự!";
    return;
  }
    // Kiểm tra mật khẩu không được chứa khoảng trắng
    if (initialRegister.password.includes(" ")) {
    errorMessage.value = "Mật khẩu không được chứa khoảng trắng!";
    return;
  }

  // Kiểm tra mật khẩu và mật khẩu Đăng ký
  if (initialRegister.password !==initialRegister.password_confirmation) {
    errorMessage.value = "Mật khẩu không khớp!";
    return;
  }
  

  // Nếu tất cả điều kiện đều hợp lệ, tiến hành đăng ký
  try {
    await authStore.Register(
      initialRegister.name, 
      initialRegister.email, 
      initialRegister.password, 
      initialRegister.password_confirmation);
    // Xử lý sau khi đăng ký thành công
    // router.push({ name: "Login" });
  } catch (error) {
    console.log("Err", error);
    // Kiểm tra nếu lỗi là do email đã tồn tại
    errorMessage.value = "Email đã tồn tại trong hệ thống!";
  }
};
</script>

<template>
  <div class="RegisterForm">
    <div class="register-container">
      <h2>Register</h2>
      <!-- @submit.prevent="login": Khi người dùng gửi form, sự kiện submit sẽ gọi hàm login mà không làm reload trang. -->
      <form id="RegisterFormForm" @submit.prevent="HandleRegister">
        <div class="form-group">
          <i class="fas fa-user icon-right"></i>
          <input v-model="initialRegister.name" type="text" placeholder="Name" required />
        </div>
        <div class="form-group">
          <i class="fas fa-envelope icon-right"></i>
          <input v-model="initialRegister.email" type="email" placeholder="Email" required />
        </div>
        <div class="form-group">
          <i class="fas fa-lock icon-right"></i>
          <input
            :type="showPassword ? 'text' : 'password'"
            v-model="initialRegister.password"
            placeholder="Password"
            required
          />
          <i
            :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"
            @click="showPassword = !showPassword"
            class="toggle-password"
          ></i>
        </div>
        <div class="form-group">
          <i class="fas fa-lock icon-right"></i>
          <input
            :type="showConfirmPassword ? 'text' : 'password'"
            v-model="initialRegister.password_confirmation"
            placeholder="Confirm Password"
            required
          />
          <i
            :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"
            @click="showConfirmPassword = !showConfirmPassword"
            class="toggle-password"
          ></i>
        </div>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

        <div class="form dky">
          <div>
            <button type="submit">Đăng ký</button>
          </div>

          <router-link to="login" class="form-login" sty
            >Đã có tài khoản?</router-link
          >
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
input {
  box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2); /* Thêm hiệu ứng đổ bóng để tạo chiều sâu */
}
.RegisterForm {
  font-family: Arial, sans-serif;
  background-color: #f4f4f4;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 90vh;
  margin: 0;
}
.register-container {
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 10px 10px rgba(0, 0, 0, 0.1);

  width: 350px;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
  font-size: 28px; /* Tăng kích thước chữ để nổi bật hơn */
  font-weight: bold; /* Làm chữ đậm */
  color: #bebfc0; /* Thay đổi màu chữ để thu hút sự chú ý */
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.9); /* Thêm hiệu ứng đổ bóng để tạo chiều sâu */
}
.form-group {
  margin-bottom: 15px;
}
label {
  display: block;
  margin-bottom: 5px;
}
input[type="string"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
button {
  width: 100%;
  padding: 10px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
button:hover {
  background-color: #218838;
}
.error-message {
  color: red;
  font-size: 14px;
  margin-top: 10px;
  text-align: center;
}

.form-login a {
  display: block;
  text-align: end;
  color: #007bff;
  cursor: pointer;
  text-decoration: none;
}
.form-login a:hover {
  text-decoration: underline;
}
.form-group {
  position: relative;
  margin-bottom: 15px;
}

.icon-right {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #888;
}

.toggle-password {
  position: absolute;
  right: 10px; /* Đặt icon ở bên phải của ô nhập liệu */
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #888;
}
.toggle-password:hover {
  color: #333;
}
input[type="text"],
input[type="email"],
input[type="password"] {
  width: 100%;
  padding: 10px 10px 10px 50px; /* Thêm khoảng cách để icon không chồng lên chữ */
  border: 1px solid #ccc;
  border-radius: 5px;
}
.form.dky {
  display: flex;
  justify-content: space-between; /* Căn giữa các phần tử */
  align-items: center; /* Căn giữa theo chiều dọc */
  margin-top: 20px; /* Thêm khoảng cách phía trên */
}

button {
  width: 120px;
  padding: 10px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.form-login {
  color: #007bff;
  text-decoration: none;
  margin-left: 10px; /* Thêm khoảng cách bên trái */
}

.form-group i {
  opacity: 0.3;
}
</style>
