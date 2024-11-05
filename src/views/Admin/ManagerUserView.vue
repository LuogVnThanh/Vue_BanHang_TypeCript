<script setup lang="ts">
import { storeToRefs } from "pinia";
import { onMounted, reactive, ref } from "vue";
import { useUserStore } from "../../stores/userStore/userStore";
import { useRoleStore } from "../../stores/roleStore/roleStore";
import type { IUserCreate } from "../../interface/user/user";

const userStore = useUserStore();
const roleStore = useRoleStore();
const { Users } = storeToRefs(userStore);
const { Roles } = storeToRefs(roleStore);
// Hàm thêm người dùng
const showModal = ref(false);
const isEditMode = ref(false);
const editingUserId = ref<number | null>(null); // Lưu trữ ID người dùng đang chỉnh sửa
const newUser = reactive<IUserCreate>({
  name: "Thanh",
  email: "thanh@gmail.com",
  password: "123456",
  phone: "0373545572",
  role: "customer",
  status: "active", // Hoặc tên chính xác nếu đã được định nghĩa
});

// Hàm mở modal thêm người dùng
const openAddUserModal = () => {
  isEditMode.value = false;
  showModal.value = true;
  resetForm();
};

// Hàm mở modal chỉnh sửa người dùng
const openEditUserModal = (user: any) => {
  isEditMode.value = true;
  showModal.value = true;
  editingUserId.value = user.id;
  // Điền dữ liệu của người dùng vào form
  newUser.name = user.name;
  newUser.email = user.email;
  newUser.password = user.password;
  newUser.phone = user.phone || "";
  newUser.role = user.roles[0]?.name;
  newUser.status = user.status;
};

// Hàm đóng modal
const closeModal = () => {
  showModal.value = false;
  resetForm();
 
};
// Hàm reset form
const resetForm = () => {
  newUser.name = "";
  newUser.email = "";
  newUser.phone = "";
  newUser.password = "";
  newUser.status = "active";
  newUser.role = "customer";
  editingUserId.value = null;
};

// Hàm thêm người dùng mới (giả sử sẽ thêm gọi API)
const addUser = async () => {
  console.log(newUser); // Kiểm tra giá trị của newUser trước khi gọi API
  // Kiểm tra tính hợp lệ của các trường
  if (!newUser.name || !newUser.email || !newUser.phone || !newUser.password) {
    alert("Vui lòng điền đầy đủ thông tin!");
    return;
  }

  // Kiểm tra định dạng số điện thoại hợp lệ
  const phonePattern = /^[0-9]{10,15}$/; // Ví dụ định dạng từ 10 đến 15 số
  if (!phonePattern.test(newUser.phone)) {
    alert("Số điện thoại không hợp lệ!");
    return;
  }

  // Kiểm tra định dạng email hợp lệ
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(newUser.email)) {
    alert("Email không hợp lệ!");
    return;
  }
  if (isEditMode.value && editingUserId.value !== null) {
    await userStore.UpdateUser(editingUserId.value, newUser);
  } else {
    await userStore.CreateUser(newUser);
  }

  closeModal();
};

// Hàm xóa người dùng
const deleteUser = async (userId: number) => {
  const confirmDelete = confirm(
    "Bạn có chắc chắn muốn xóa người dùng này không?"
  );
  if (confirmDelete) {
    await userStore.DeleteUser(userId);
  }
};
onMounted(() => {
  userStore.GetAllUser();
  roleStore.getAllRoles();
});
</script>

<template>
  <div class="header-container">
    <h1>Danh sách người dùng</h1>
    <button class="add-user-btn" @click="openAddUserModal">
      <i class="fas fa-plus" style="margin-right: 5px"></i> Thêm người dùng
    </button>
  </div>

  <div class="table-container">
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Tên</th>
          <th>Email</th>
          <th>SĐT</th>
          <th>Loại</th>
          <th>Trạng thái</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user,index) in Users" :key="index">
          <td>{{ index }}</td>
          <td>{{ user.name || "k co name"}}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.phone || "Trống" }}</td>
          <td>{{ user.roles?.[0]?.name || "Không có vai trò" }}</td>
          <td>
            <!-- Icon trạng thái -->
            <i
              :class="
                user.status === 'active' ? 'fas fa-unlock' : 'fas fa-lock'
              "
              :title="user.status === 'active' ? 'active' : 'inactive'"
            ></i>
          </td>
          <td style="text-align: center">
            <!-- Icon sửa và xóa -->
            <i
              class="fas fa-edit action-icon"
              title="Sửa"
              @click="openEditUserModal(user)"
            ></i>
            <i
              class="fas fa-trash action-icon"
              title="Xóa"
              @click="deleteUser(user.id)"
            ></i>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Modal thêm/chỉnh sửa người dùng -->
  <div v-if="showModal" class="modal-overlay">
    <div class="modal-container">
      <h2>{{ isEditMode ? "Chỉnh Sửa Người Dùng" : "Thêm Người Dùng" }}</h2>
      <form @submit.prevent="addUser">
        <div class="form-group">
          <input
            v-model="newUser.name"
            type="text"
            id="name"
            required
            placeholder="Tên người dùng"
          />
        </div>
        <div class="form-group">
          <input
            v-model="newUser.email"
            type="email"
            id="email"
            required
            placeholder="Email"
          />
        </div>
        <div class="form-group">
          <input
            v-model="newUser.password"
            type="password"
            id="password"
            required
            placeholder="Password"
          
          />
        </div>
        <div class="form-group">
          <input
            v-model="newUser.phone"
            type="text"
            id="phone"
            placeholder="Số điện thoại"
          />
        </div>
        <div class="form-group" style="display: flex">
          <label for="role" style="width: 200px">Vai trò:</label>
          <select v-model="newUser.role" id="role">
            <option v-for="role in Roles" :key="role.id" :value="role.name">
              {{ role.name }}
            </option>
          </select>
        </div>
        <div class="form-group" style="display: flex">
          <label style="width: 200px" for="status">Trạng thái:</label>
          <select v-model="newUser.status" id="status">
            <option value="active">active</option>
            <option value="inactive">inactive</option>
          </select>
        </div>
        <div class="modal-actions">
          <button type="submit" class="add-btn">
            {{ isEditMode ? "Cập Nhật" : "Thêm" }}
          </button>
          <button type="button" class="cancel-btn" @click="closeModal">
            Hủy
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.add-user-btn {
  display: flex;
  align-items: center;
  background-color: #28a745;
  color: #fff;
  border: none;
  padding: 8px 12px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  border-radius: 5px;
}

.add-user-btn i {
  margin-left: 8px;
}

.add-user-btn:hover {
  background-color: #218838;
}

.table-container {
  max-width: 1000px;
  margin: 0 auto;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 12px;
  text-align: center;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #333;
  color: #fff;
  font-weight: bold;
}

td {
  font-size: 14px;
}

.action-icon {
  margin: 0 8px;
  cursor: pointer;
  color: #007bff;
}

.action-icon:hover {
  color: #0056b3;
}

.fa-lock {
  color: red;
}

.fa-unlock {
  color: green;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8); /* Tăng độ tối cho nền */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1100; /* Đảm bảo modal nằm trên các thành phần khác */
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1100;
}

.modal-container {
  background: #fff;
  padding: 30px;
  border-radius: 10px;
  max-width: 500px;

  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.modal h2 {
  margin-top: 0;
  font-size: 1.8em;
  color: #333;
  text-align: center;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #555;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #28a745;
  outline: none;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
}

.add-btn,
.cancel-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.add-btn {
  background-color: #28a745;
  color: #fff;
}

.add-btn:hover {
  background-color: #218838;
}

.cancel-btn {
  background-color: #dc3545;
  color: #fff;
}

.cancel-btn:hover {
  background-color: #c82333;
}
</style>
