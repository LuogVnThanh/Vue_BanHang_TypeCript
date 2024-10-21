<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed, onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import { useProductStore } from "../../stores/productStore/productStore";
import { useCartStore } from "../../stores/cartStore/cartStore";

import { formatCurrency } from "../../helpers/formatCurrency/formatCurrency";
import { getProductImage } from "../../helpers/getImages/getImage";
import type {
  IAttribute,
  IDetailProduct,
  IVariant,
} from "../../interface/product/product";
import router from "../../router";
import { useAuthStore } from "../../stores/authStore/authStore";

const route = useRoute();
const authStore = useAuthStore();
const productStore = useProductStore();
const cartStore = useCartStore();
const { selectedDetailProduct } = storeToRefs(productStore);

// ========Chọn Attribute========================
const selectedAttributes = reactive<IAttribute>({});
const selectedVariant = reactive<IVariant>({
  id: 0,
  quantity: 0,
  sku: "",
  attributes: {},
});
const selectedQuantity = ref(1);

// Trích xuất các thuộc tính một cách linh hoạt
const dynamicAttributes = computed(() => {
  // Lấy tất cả các variants của sản phẩm
  const variants = selectedDetailProduct.value?.variants || [];
  //  Tạo ra set để lưu dữ liệu các attribute tồn tại của các variants
  const availableAttributes = new Set<string>();

  variants.forEach((variant) => {
    Object.keys(variant.attributes).forEach((attribute) => {
      availableAttributes.add(attribute);
    });
  });
  return Array.from(availableAttributes);
});

// Hàm để chọn giá trị của thuộc tính
const selectedAttributeValue = (attributeName: string, value: string) => {
  selectedAttributes[attributeName] = value;
  updateSelectedVariant(); // Cập nhật variant mõi khi thuộc tính được chọn
  selectedQuantity.value = 1;
};

//Hàm cập nhật selectedVariant dựa trên các thuộc tính đã chọn
const updateSelectedVariant = () => {
  const variants = selectedDetailProduct.value?.variants || [];

  const foundVariant =
    variants.find((variant) => {
      return Object.keys(selectedAttributes).every((attribute) => {
        return selectedAttributes[attribute] === variant.attributes[attribute];
      });
    }) || null; //Gắn giá trị cho selectedVariant hoặc null nếu không tòm thấy

  if (foundVariant) {
    if (selectedVariant) {
      selectedVariant.id == foundVariant.id;
      // console.log('a',selectedVariant.id);
    }
    Object.assign(selectedVariant, foundVariant); // Gán tất cả thuộc tính của foundVariant vào selectedVariant
    selectedQuantity.value = 1; // Số lượng về 0
  } else {
    Object.assign(selectedVariant, {
      id: 0,
      quantity: 0,
      sku: "",
      attributes: {},
    }); // Reset nếu không tìm thấy
    selectedQuantity.value = 0; // Số lượng về 0
  }
  // console.log("objectupdatraudsd", foundVariant?.id);
};
// Hàm tăng giảm số lượng=========================
const decreaseQuantity = () => {
  if (selectedQuantity.value > 1) {
    selectedQuantity.value = selectedQuantity.value - 1;
  }
};
const increaseQuantity = () => {
  const maxQuantity = selectedVariant.quantity || 0; // Lấy số lượng cao nhất trong variant
  if (selectedQuantity.value < maxQuantity) {
    selectedQuantity.value = selectedQuantity.value + 1;
  }
};

// Hàm xử lý nút thêm vào giỏ hàng
const addToCart = () => {
 
  if (selectedVariant.id && selectedVariant.id !== 0) {
    // sử dụng selectedVariant.value
    const product_variant_id = selectedVariant.id; // lấy id
    const quantity = selectedQuantity.value || 1; // số lượng
    // console.log("Thêm vào giỏ hàng:", { product_variant_id, quantity });


    // Lấy số lượng sản phẩm đã có trong giỏ hàng với cùng variant id
    const existingCartItem = cartStore.cartProduct.find(
      (item)=> item.product_variant_id = selectedVariant.id
    )
    
    // Kiểm tra nếu quantity > 0 mới cho thêm vào giỏ hàng
    if (quantity > 0 && quantity <= selectedVariant.quantity) {
      try {
        cartStore.addToCart(product_variant_id, quantity);
        router.push({ name: "Cart" });
      } catch (error) {
        console.error("Lỗi khi thêm vào giỏ hàng:", error);
        alert("Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng.");
      }
    } else {
      // Hiển thị thông báo lỗi nếu số lượng không hợp lệ
      alert("Vui lòng chọn số lượng hợp lệ.");
    }
  }
};

// Thiết lập thuộc tính mặc định khi component được mount
onMounted(() => {
  const id = Number(route.params.id);
  if (!isNaN(id)) {
    productStore.getProductById(id).then(() => {
      const productAttributes = selectedDetailProduct.value?.attributes || {};
      dynamicAttributes.value.forEach((attribute) => {
        selectedAttributes[attribute] =
          productAttributes[attribute]?.[0] || undefined;
      });
      updateSelectedVariant();
    });
  }
});
</script>

<template>
  <div class="container DetailProduct" v-if="selectedDetailProduct">
    <div class="ImgProduct">
      <a href="">
        <img
          v-if="
            selectedDetailProduct?.images &&
            selectedDetailProduct.images.length > 0
          "
          :src="getProductImage(selectedDetailProduct.images[0]?.url)"
          alt="Product Image"
          style="height: 500px; width: 100%; object-fit: contain"
        />
      </a>
    </div>

    <div class="InfoProduct">
      <div class="product-header">
        <p>Tên: {{ selectedDetailProduct.name }}</p>
        <p style="font-size: 16px; font-weight: 500">
          SKU:
          {{ selectedVariant?.sku || "Không có SKU" }}
        </p>
      </div>

      <hr class="separator" />
      <h6>{{ formatCurrency(Number(selectedDetailProduct.price * 1  )) }}</h6>

      <hr class="separator" />

      <div class="attribute-container">
        <!-- Hiển thị các thuộc tính một cách linh hoạt -->
        <div
          v-for="attribute in dynamicAttributes"
          :key="attribute"
          class="attribute-select"
        >
          <!-- <p>{{ attribute }}:</p> -->
          <div class="attribute-items">
            <div
              v-for="value in selectedDetailProduct.attributes[attribute]"
              :key="value"
              class="attribute-item"
              :class="{ selected: selectedAttributes[attribute] === value }"
              @click="selectedAttributeValue(attribute, value)"
            >
              {{ value }}
            </div>
          </div>
        </div>
      </div>

      <hr class="separator" />
      <p>Tổng số lượng: {{ selectedVariant?.quantity || 0 }}</p>

      <div class="quantity-control">
        <button
          class="quantity-btn"
          @click="decreaseQuantity"
          :disabled="selectedQuantity === 1"
        >
          -
        </button>
        <input
          type="number"
          v-model="selectedQuantity"
          :min="1"
          :max="selectedVariant?.quantity"
          readonly
          class="quantity-input"
        />
        <button
          class="quantity-btn"
          @click="increaseQuantity"
          :disabled="selectedQuantity >= (selectedVariant?.quantity || 0)"
        >
          +
        </button>
      </div>

      <router-link :to="{ name: 'Cart' }"></router-link>
      <button
        class="confirm-btn"
        :disabled="!selectedVariant || selectedVariant.quantity === 0"
        @click="addToCart(), authStore.HandleLoginCart()"
      >
        Thêm vào giỏ hàng
      </button>

      <hr class="separator" />

      <p><b>Mô tả:</b> {{ selectedDetailProduct.description }}</p>
    </div>
  </div>
</template>
<style scoped>
.DetailProduct {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  padding: 20px;
}

.ImgProduct {
  flex: 1;
}

.InfoProduct {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 20px;
}

/* Kiểu dáng cho tiêu đề sản phẩm */
.product-header p {
  font-size: 20px;
  color: #333;
  font-weight: bold;
  margin: 5px 0;
}

/* Đường cắt ngang */

/* Kiểu dáng cho các thuộc tính */
.attribute-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.attribute-select {
  display: flex;
  justify-content: space-between;
  align-content: center;
}
.attribute-select-pant {
  flex-direction: row-reverse;
}

.attribute-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}
.attribute-size {
  flex-direction: row-reverse;
}
.attribute-title p {
  font-weight: bold;
  cursor: pointer;
}

.attribute-items {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.attribute-item {
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #fff;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;
  text-align: center;
  min-width: 80px;
}

.attribute-item:hover {
  background-color: #000; /* Màu nền khi hover */
  color: #fff; /* Màu chữ khi hover */
}

/* Kiểu cho nút tăng/giảm số lượng */
.quantity-control {
  display: flex;
  align-items: center;
  gap: 10px;
}

.quantity-btn {
  width: 30px;
  background-color: #f3f5f4;
  border: none;
  color: #000;
  padding: 6px 10px; /* Thay đổi padding để thu nhỏ nút */
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.quantity-btn:hover {
  background-color: #cfcfcf;
}

.quantity-input {
  width: 60px; /* Thu nhỏ kích thước input */
  text-align: center;
  font-size: 16px;
  padding: 5px;
  font-weight: bold;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f9f9f9;
}

/* Kiểu cho nút thêm vào giỏ hàng */
.confirm-btn {
  background-color: #949494;
  color: white;
  padding: 10px 36px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease, transform 0.2s ease; /* Thêm hiệu ứng chuyển đổi */
}

.confirm-btn:hover {
  background-color: #4b4b4b; /* Màu nền khi hover */
  transform: translateY(-2px); /* Nâng nút lên một chút khi hover */
}

.confirm-btn:active {
  transform: translateY(0); /* Trở về vị trí ban đầu khi nhấn */
}

/* Kiểu cho modal hiển thị ảnh kích thước */
.size-chart-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  z-index: 1000;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  max-width: 90%; /* Giới hạn chiều rộng tối đa */
  max-height: 100%; /* Giới hạn chiều cao tối đa */
  overflow: auto; /* Thêm thanh cuộn nếu nội dung quá lớn */
}

.size-chart-image {
  max-width: 100%; /* Đảm bảo hình ảnh không vượt quá chiều rộng của modal */
  height: auto; /* Giữ tỉ lệ cho hình ảnh */
}

.close-chart-btn {
  position: absolute; /* Đặt vị trí tuyệt đối */
  top: 10px; /* Cách từ trên xuống */
  right: 10px; /* Cách từ bên phải */
  background-color: transparent; /* Nền trong suốt */
  border: none; /* Không có đường viền */
  font-size: 24px; /* Kích thước lớn hơn cho dễ nhìn */
  color: #dc3545; /* Màu đỏ cho nút đóng */
  cursor: pointer; /* Con trỏ chuột */
}

.close-chart-btn:hover {
  background-color: #c82333; /* Hiệu ứng hover cho nút đóng */
}
.attribute-item.selected {
  background-color: #000; /* Màu nền khi được chọn */
  color: #fff; /* Màu chữ khi được chọn */
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999; /* Đảm bảo overlay nằm dưới modal */
}
</style>
