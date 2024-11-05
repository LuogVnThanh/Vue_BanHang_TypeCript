<script setup lang="ts">
import type { IProfile } from "../../interface/auth/auth";
import { useAuthStore } from "../../stores/authStore/authStore";
import { onMounted, reactive, ref } from "vue";
import { useOrderStore } from "../../stores/orderStore/orderStore";
import { storeToRefs } from "pinia";
import { formatCurrency } from "../../helpers/formatCurrency/formatCurrency";
import type { IOrder, IOrderItem } from "../../interface/order/order";

const authStore = useAuthStore();
const orderStore = useOrderStore();
const { orderList } = storeToRefs(orderStore);

// Thêm biến activeMenu để theo dõi phần tử đang hoạt động
const activeMenu = ref("orderDetails");

const state = reactive({
 
  showOrderDetails: true,
});

// ==================Hàm update==========================
// Biến để điều khiển modal
const showModalEdit = ref(false);
const editingOrder = reactive<IOrderItem>({
  id: 0, // Hoặc một giá trị ID hợp lệ
  phone: "0123456789",
  address: "Biên Hòa",
  note: "1234 Em có đánh dơi nhịp nào hong",
});

const updateOrder = (id: number) => {
  if (id === undefined) {
    // Hiện thông báo lỗi hoặc không thực hiện gì
    console.error("ID không hợp lệ");
    return;
  }
  const orderItem = { ...editingOrder }; // Gán giá trị cho orderItem
  orderStore
    .updateOrderItem(id, orderItem)
    .then(() => {
      orderStore.getOrder();
      cancelEdit();
      // Hiện thông báo thành công ở đây
    })
    .catch((error) => {
      // Xử lý lỗi tại đây
    });
};

// Hàm để hủy chỉnh sửa
const cancelEdit = () => {
  editingOrder.phone = "";
  editingOrder.address = "";
  editingOrder.note = "";
  showModalEdit.value = false; // Ẩn modal
};

const editOrder = (order: IOrder) => {
  Object.assign(editingOrder, order); // Gán giá trị cho đơn hàng đang chỉnh sửa
  showModalEdit.value = true; // Hiện modal
};
// ==================Hàm Xóa==========================
const showModalDelete = ref(false);
const orderToDeleteId = ref<number | null>(null);

const prepareDelete = (id: number) => {
  orderToDeleteId.value = id; // Lưu ID đơn hàng cần xóa
  showModalDelete.value = true; // Hiện modal xóa
};

const deleteOrder = () => {
  if (orderToDeleteId.value === null) {
    console.error("ID không hợp lệ");
    return;
  }

  orderStore
    .deleteOrderItem(orderToDeleteId.value)
    .then(() => {
      orderStore.getOrder(); // Cập nhật lại danh sách đơn hàng
      showModalDelete.value = false; // Ẩn modal
      orderToDeleteId.value = null; // Đặt lại giá trị ID sau khi xóa
    })
    .catch((error) => {
      console.log("Có lỗi khi xóa đơn hàng", error);
    });
};
onMounted(() => {
  orderStore.getOrder();

});
</script>

<template>
  <div class="container">
 

    <!-- ===================Thông tin sản phẩm============================ -->

    <div v-if="state.showOrderDetails" class="order-details">
      <h3 style="padding: 20px;font-weight:bold" >ĐƠN HÀNG CỦA TÔI</h3>
      <div class="order-card" v-for="order in orderList" :key="order.id">
        <div class="order-item">
          <div class="item-info">
            <div class="details">
              <div
                style="
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                "
              >
                <div class="info-container">
                  <h4>Đơn hàng ID: {{ order.id }}</h4>
                  <button class="button" @click="editOrder(order)">
                    Chỉnh sửa thông tin
                  </button>
                  <button
                    class="button"
                    style="background-color: #da0f0f"
                    @click="prepareDelete(order.id)"
                  >
                    Xóa
                  </button>
                </div>
              </div>

              <!-- <h4>{{ order.name }}</h4> -->
              <div class="item-info" v-for="item in order.items" :key="item.id">
                <div class="details" style="display: flex">
                  <div class="img">
                    <img
                      src="https://bulma.io/assets/images/placeholders/1280x960.png"
                      alt="Product Image"
                    />
                  </div>
                  <div class="title">
                    <h4>Sản phẩm ID: {{ item.product_variant_id }}</h4>
                    <p>Số lượng: {{ item.quantity }}</p>
                    <p class="price">
                      Giá: {{ formatCurrency(item.price * 1) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="status">
            <span
              style="color: #000"
              v-if="order.payment_status === 'chưa thanh toán'"
              class="canceled"
              >Chưa thanh toán</span
            >
            <span
              v-else-if="order.payment_status === 'Đã thanh toán'"
              class="canceled"
              >Đã thanh toán</span
            >
            <p>
              Thành tiền:
              <span class="total-price">{{
                formatCurrency(order.total_amount * 1)
              }}</span>
            </p>

            <button
              v-if="order.payment_status === 'đã thanh toán'"
              class="buy-again"
            >
              Đánh giá
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal Chỉnh sửa thông tin đơn hàng -->
  <div v-if="showModalEdit" class="modal">
    <div class="modal-content">
      <span class="close" @click="cancelEdit">&times;</span>
      <h2>Chỉnh sửa đơn hàng ID: {{ editingOrder.id }}</h2>
      <input v-model="editingOrder.phone" placeholder="Số điện thoại" />
      <input v-model="editingOrder.address" placeholder="Địa chỉ" />
      <input v-model="editingOrder.note" placeholder="Ghi chú" />
      <div style="display: flex; justify-content: space-between">
        <button @click="updateOrder(editingOrder.id)">Cập nhật</button>
        <button @click="cancelEdit">Hủy</button>
      </div>
    </div>
  </div>
  <!-- Modal xác nhận xóa  -->
  <div v-if="showModalDelete" class="modal">
    <div class="modal-content">
      <span class="close" @click="showModalDelete = false">&times;</span>
      <h2>Bạn có chắc xóa đơn hàng</h2>
      <div style="display: flex; justify-content: space-between">
        <button @click="deleteOrder()">Xác nhận</button>
        <button @click="showModalDelete = false">Hủy</button>
      </div>
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
 



.order-details {
  width: 100%;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
  max-height: 500px; /* Giới hạn chiều cao của khối đơn hàng */
  overflow-y: auto; /* Thêm con lăn dọc khi nội dung vượt quá chiều cao */
}

.order-card {
  position: relative; /* Để position: absolute trong status hoạt động chính xác */
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 15px;
  background-color: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05); /* Đổ bóng nhẹ hơn */
  margin-bottom: 15px; /* Khoảng cách giữa các đơn hàng */
}

.order-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin: 10px ;
  padding-bottom: 10px; /* Khoảng cách dưới mỗi sản phẩm */
  border-bottom: 1px solid #e0e0e0; /* Đường viền giữa các sản phẩm */
}
.order-item:last-child {
  border-bottom: none; /* Bỏ đường viền cho sản phẩm cuối cùng */
}
.item-info {
  display: flex;
  align-items: center;
}

.item-info img {
  width: 80px;
  height: 80px;
  margin-right: 15px;
  border-radius: 5px; /* Bo góc hình ảnh sản phẩm */
  border: 1px solid #ddd; /* Viền nhạt xung quanh ảnh */
}

.details {
  flex: 1;
}

.price {
  color: #d9534f;
  font-weight: bold;
}

.status {
  position: absolute; /* Cố định vị trí của status */
  bottom: 10px; /* Đặt cách mép dưới một khoảng */
  right: 10px; /* Đặt cách mép phải một khoảng */
  text-align: right;
}

.canceled {
  color: #d9534f;
  font-weight: bold;
}

.total-price {
  font-weight: bold;
  color: #333; /* Màu chữ tối hơn cho dễ nhìn */
}

.buy-again {
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 15px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.buy-again:hover {
  background-color: #0056b3;
}
/* Modal chung */
.modal {
  position: fixed; /* Đặt modal ở vị trí cố định */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Màu nền tối */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* Đảm bảo modal luôn ở trên cùng */
}

/* Nội dung modal */
.modal-content {
  background-color: #fff;
  padding: 25px; /* Giảm padding cho gọn gàng */
  border-radius: 12px; /* Bo góc mềm mại hơn */
  box-shadow: 0px 15px 30px rgba(0, 0, 0, 0.3); /* Đổ bóng mạnh hơn */
  width: 380px; /* Giảm chiều rộng để phù hợp nội dung */
  max-width: 90%;
  position: relative;
  animation: fadeIn 0.3s ease; /* Hiệu ứng mở modal */
}
/* Hiệu ứng mở modal */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Nút đóng modal */
.close {
  position: absolute;
  top: 10px; /* Căn chỉnh với mép trên */
  right: 15px; /* Căn chỉnh với mép phải */
  font-size: 18px;
  cursor: pointer;
  color: #333; /* Màu xám đậm */
  transition: color 0.3s;
}

.close:hover {
  color: #d9534f; /* Đổi màu khi hover */
}

/* Tiêu đề của form */
.modal-content h2 {
  margin: 0 0 20px 0; /* Bỏ margin-top */
  font-size: 24px; /* Tăng kích thước chữ */
  color: #444; /* Màu tối hơn */
  font-weight: bold;
}

/* Input trong modal */
.modal-content input {
  width: 100%;
  padding: 12px;
  margin-bottom: 15px; /* Khoảng cách dưới */
  border: 1px solid #ddd;
  border-radius: 6px; /* Bo góc nhẹ */
  box-sizing: border-box;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s;
}
.modal-content input:focus {
  border-color: #007bff; /* Đổi màu viền khi focus */
}

/* Nút cập nhật và hủy */
.modal-content button {
  display: inline-block;
  width: 48%;
  padding: 12px 0;
  margin: 10px 0;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  border: none;
  transition: background-color 0.3s;
}

.modal-content button:first-of-type {
  background-color: #007bff; /* Màu xanh đậm */
  color: white;
}

.modal-content button:first-of-type:hover {
  background-color: #0056b3; /* Đổi màu khi hover */
}

.modal-content button:last-of-type {
  background-color: #ddd; /* Màu xám nhạt */
  color: #333;
}

.modal-content button:last-of-type:hover {
  background-color: #bbb; /* Đổi màu khi hover */
}
.info-container {
  display: flex;
  align-items: center;
  justify-content: space-around; /* Canh phải nội dung bên trong */
  margin-bottom: 20px; /* Khoảng cách bên dưới cho dễ nhìn */
}
.info-container h4 {
  align-items: center;
  width: 320px;
}

.button {
  margin-right: 3px;
  width: 200px;
  background-color: #007bff; /* Màu nền xanh dương */
  color: white; /* Màu chữ trắng */
  border: none; /* Bỏ viền */
  border-radius: 5px; /* Bo góc nút */
  padding: 10px 15px; /* Khoảng cách bên trong nút */
  cursor: pointer; /* Con trỏ chuột thay đổi thành dạng tay khi hover */
  transition: background-color 0.3s; /* Hiệu ứng chuyển màu */
  font-size: 14px; /* Kích thước chữ */
  font-weight: bold; /* In đậm chữ */
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.1); /* Hiệu ứng đổ bóng nhẹ */
}

.edit-button:hover {
  background-color: #0056b3; /* Màu khi hover */
}

.edit-button:active {
  background-color: #004494; /* Màu khi click vào nút */
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2); /* Đổ bóng khi click */
  transform: translateY(2px); /* Hiệu ứng nhấn nút */
}
</style>
