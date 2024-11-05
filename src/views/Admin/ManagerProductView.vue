<script setup lang="ts">
import { useProductStore } from "../../stores/productStore/productStore";
import { storeToRefs } from "pinia";
import { onMounted, reactive, ref } from "vue";
import type {
  IProductShowByAdmin,
  IProductCreate,
} from "../../interface/product/product";
import { formatCurrency } from "../../helpers/formatCurrency/formatCurrency";
import { getProductImage } from "../../helpers/getImages/getImage";
import { useCategoryStore } from "../../stores/categoryStore/categoryStore";
import { useImageStore } from "../../stores/ImageStore/imageStore";
import { useAttributeStore } from "../../stores/attributeStore/attributeStore";
import type {
  IAttributes1,
  IAttributesCreate,
  IAttributesEdit,
} from "../../interface/attribute/attribute";

const productStore = useProductStore();
const categoryStore = useCategoryStore();
const imageStore = useImageStore();
const attributeStore = useAttributeStore();

const { categories } = storeToRefs(categoryStore);
const { adminProducts } = storeToRefs(productStore);
const { attributes } = storeToRefs(attributeStore);
const { images } = storeToRefs(imageStore);

// Modal cho thêm thuộc tính

const showAttributeModal = ref(false);

const newAttribute = reactive<IAttributesCreate>({
  name: "",
  values: [], // Mảng để lưu giá trị của thuộc tính
});

// Hàm mở modal thêm thuộc tính
const openAttributeModal = () => {
  showAttributeModal.value = true;
};

// Hàm đóng modal thêm thuộc tính
const closeAttributeModal = () => {
  showAttributeModal.value = false;
  newAttribute.name = "";
  newAttribute.values = [];
};

// Hàm thêm thuộc tính
const addAttribute_value = async () => {
  if (newAttribute.name && newAttribute.values.length > 0) {
    await attributeStore.CreateAttribute_Value(newAttribute);
    closeAttributeModal(); // Đóng modal sau khi thêm
  } else {
    alert("Vui lòng nhập tên và giá trị cho thuộc tính.");
  }
};
// Hàm xử lý khi nhập giá trị thuộc tính
const handleValuesInput = (event: Event) => {
  // Chuyển từ dạng event.target thành dạng htmlinput để có thể lấy được thuộc tính value
  const input = (event.target as HTMLInputElement).value;
  // tách chuỗi ra và chuyển chuyển thành đối tượng có cấu trúc{value}
  newAttribute.values = input.split(",").map((val) => ({ value: val.trim() }));
};

// ===================Edit attributes=================================
const showEditNameModal = ref(false);
const editedAttributeName = reactive<IAttributesEdit>({
  id: 0,
  name: "",
});
const openEditAttributeModal = (attribute: IAttributesEdit) => {
  editedAttributeName.id = attribute.id;
  editedAttributeName.name = attribute.name;
  showEditNameModal.value = true;
};
// Đóng modal chỉnh sửa tên
const closeEditAttributeModal = () => {
  showEditNameModal.value = false;
  editedAttributeName.id = 0;
  editedAttributeName.name = "";
};
// Hàm lưu tên đã chỉnh sửa
const saveEditedName = async () => {
  if (editedAttributeName.name) {
    await attributeStore.EditAttribute(
      { ...editedAttributeName } as IAttributes1,
      editedAttributeName.id
    );
    closeEditAttributeModal();
  } else {
    alert("Vui lòng nhập tên thuộc tính.");
  }
};
// Xóa attributes
const deleteAttributeModal = async (id: number) => {
  if (window.confirm("Bạn có chắc chắn muốn xóa thuộc tính này?")) {
    await attributeStore.DeleteAttribute(id);
    alert("Xóa thuộc tính thành công!");
    closeEditAttributeModal();
  }
};

// =====================Hàm thêm Product=======================================
const showModal = ref(false);
const newProduct = reactive<IProductCreate>({
  id:0,
  name: "Quần Què",
  description: "Hơi rách tí",
  price: "20000",
  public: 1,
  category_id: 6,
  variant: [],
});

// Hàm mở modal
const openModal = () => {
  showModal.value = true;
};

// Hàm đóng modal
const closeModal = () => {
  showModal.value = false;
  newProduct.name = "";
  newProduct.description = "";
  newProduct.price = "";
  newProduct.category_id = 6;
  newProduct.public = 1;
  newProduct.variant = [];
  newVariant.value = ""; // Reset variant

  imageFile.value = null;
};
const newVariant = ref(""); // Thêm biến để lưu variant mới

// hàm thêm biến thể
const addVariant = () => {
  newProduct.variant.push({
    quantity: 0, // Khởi tạo số lượng mặc định
    sku: "", // Khởi tạo SKU mặc định
    attributes: [], // Mảng attributes trống
  });
};

const addAttribute = (variantIndex: number) => {
  const variant = newProduct.variant[variantIndex];

  if (variant) {
    // Khởi tạo attributes nếu nó không tồn tại
    if (!Array.isArray(variant.attributes)) {
      variant.attributes = [];
    }

    // Thêm thuộc tính mới vào attributes với giá trị mặc định
    variant.attributes.push({
      value: "", // Hoặc giá trị mặc định khác
    });
  } else {
    console.error("Variant does not exist", variant);
  }
};

// Xóa biến thể
const removeVariant = (index: number) => {
  newProduct.variant.splice(index, 1);
};

// Add Product
// Add Product
const addProduct = async (product: IProductCreate) => {
  await productStore.addProduct(product); // Thêm sản phẩm mới
  if (imageFile.value) {
    await uploadImage(product.id); // Upload ảnh nếu có
  }
  closeModal(); // Đóng modal
};

const deleteProduct = async (ProductId: number) => {
  const confirmDelete = confirm(
    "Bạn có chắc chắn muốn xóa sản phẩm này không?"
  );
  if (confirmDelete) {
    await productStore.deleteProduct(ProductId);
  }
};
// ==================Thêm ảnh=======================
const imageFile = ref<File | null>(null);

//  phương thức để xử lý việc người dùng chọn tệp ảnh.
const onFileSelected = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0] || null;
  imageFile.value = file;
};

// Upload ảnh
const uploadImage = async (idProd: number) => {
  if (imageFile.value) {
    // Tạo đối tượng FormData
    const formData = new FormData();
    formData.append("id", idProd.toString()); // Thêm id vào FormData
    formData.append("file", imageFile.value); // Thêm file vào FormData

    // Gọi API tạo ảnh với FormData
   await imageStore.createImage(idProd, imageFile.value); 

    // Đặt lại imageFile về null sau khi upload
    imageFile.value = null;
  }
};

onMounted(() => {
  imageStore.getAllImages();
  productStore.getAllProduct();
  categoryStore.getAllCategories();
  attributeStore.getAllAttributes();
});
</script>

<template>
  <!-- Modal thêm thuộc tính -->
  <div v-if="showAttributeModal" class="modal-overlay">
    <div class="modal-container">
      <h2>Thêm Thuộc Tính</h2>
      <form @submit.prevent="addAttribute_value">
        <div class="form-group">
          <input
            v-model="newAttribute.name"
            type="text"
            required
            placeholder="Tên thuộc tính"
          />
        </div>
        <div class="form-group">
          <input
            @input="handleValuesInput"
            type="text"
            required
            placeholder="Giá trị thuộc tính (ngăn cách bởi dấu phẩy)"
          />
          <small>Ví dụ: Giá trị1, Giá trị2, Giá trị3</small>
        </div>
        <div class="modal-actions">
          <button type="submit" class="add-btn">Thêm</button>
          <button type="button" class="cancel-btn" @click="closeAttributeModal">
            Hủy
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- Modal sửa thuộc tính -->
  <div v-if="showEditNameModal" class="modal-overlay">
    <div class="modal-container">
      <h2>Sửa Thuộc Tính</h2>
      <form @submit.prevent="saveEditedName">
        <div class="form-group">
          <input
            v-model="editedAttributeName.name"
            type="text"
            required
            placeholder="Tên thuộc tính"
          />
        </div>
        <div class="modal-actions">
          <button type="submit" class="add-btn">Lưu</button>
          <button
            type="button"
            class="cancel-btn"
            @click="closeEditAttributeModal"
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- Table hiển thị danh sách Attribute -->
  <div style="margin-bottom: 20px">
    <div style="display: flex; justify-content: space-between">
      <h1>Danh sách Attribute</h1>
      <button
        class="add-user-btn"
        style="height: 40px"
        @click="openAttributeModal"
      >
        <i class="fas fa-plus" style="margin-right: 5px"></i> Thêm Attribute
      </button>
    </div>
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên</th>
            <th>Giá trị</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="attribute in attributes" :key="attribute.id">
            <td>{{ attribute.id }}</td>
            <td>
              {{ attribute.name }}
              <i
                class="fas fa-edit action-icon"
                title="Sửa"
                @click="openEditAttributeModal(attribute)"
              ></i>
            </td>
            <td style="display: flex; flex-wrap: wrap; justify-content: center">
              <span
                v-for="(value, index) in attribute.values"
                :key="value.id"
                style="margin: 2px"
              >
                {{ value.value }}
                <span v-if="index < attribute.values.length - 1">, </span>
              </span>
              <i
                class="fas fa-edit action-icon"
                title="Sửa"
                @click="openEditValueModal(attribute)"
              ></i>
            </td>

            <td>
              <i
                class="fas fa-trash action-icon"
                title="Xóa"
                @click="deleteAttributeModal(attribute.id)"
              ></i>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Sản phẩm -->
  <div class="header-container">
    <h1>Danh sách sản phẩm</h1>
    <button class="add-user-btn" @click="openModal">
      <i class="fas fa-plus" style="margin-right: 5px"></i> Thêm sản phẩm
    </button>
  </div>

  <div class="table-container">
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Tên</th>
          <th>Mô tả</th>
          <th>Giá</th>
          <th>Loại</th>
          <th>Ảnh</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in adminProducts" :key="product.id || product.name">
          <td>{{ product.id }}</td>

          <td
            style="
              max-width: 150px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            "
          >
            {{ product.name }}
          </td>

          <td
            style="
              max-width: 200px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            "
          >
            {{ product.description }}
          </td>

          <td>{{ formatCurrency(product.price * 1) || "Trống" }}</td>

          <td>{{ product.category?.name }}</td>

          <td>
            <img
              style="
                height: auto;
                width: 100%;
                object-fit: contain;
                max-width: 50px;
              "
              :src="getProductImage(product.images[0]?.url)"
              alt="Product Image"
            />
          </td>

          <td style="text-align: center">
            <!-- Icon sửa và xóa -->
            <i class="fas fa-edit action-icon" title="Sửa"></i>
            <i
              class="fas fa-trash action-icon"
              title="Xóa"
              @click="deleteProduct(product.id)"
            ></i>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Modal thêm sản phẩm -->
  <div v-if="showModal" class="modal-overlay">
    <div class="modal-container">
      <h2>Thêm Sản phẩm</h2>
      <!-- Thêm @submit.prevent vào form -->
      <form @submit.prevent="addProduct(newProduct)">
        <div class="form-group">
          <!-- <label for="name">Tên:</label> -->
          <input
            v-model="newProduct.name"
            type="text"
            id="name"
            required
            placeholder="Tên sản phẩm"
          />
        </div>
        <div class="form-group">
          <!-- <label for="email">Email:</label> -->
          <input
            v-model="newProduct.description"
            type="text"
            id="description"
            required
            placeholder="Mô tả"
          />
        </div>
        <div class="form-group">
          <!-- <label for="email">Email:</label> -->
          <input
            v-model="newProduct.price"
            type="text"
            id="price"
            required
            placeholder="Giá"
          />
        </div>
        <!-- Thêm public -->
        <div class="form-group">
          <input
            v-model="newProduct.public"
            type="text"
            required
            placeholder="Public (1 or 0)"
          />
        </div>
        <!-- Thêm loại cate -->
        <div class="form-group" style="display: flex; align-items: center">
          <label for="role" style="width: 200px">Loại:</label>
          <select v-model="newProduct.category_id" id="role">
            <optgroup
              v-for="cate in categories"
              :key="cate.id"
              :label="cate.name"
            >
              <option
                v-for="child in cate.children"
                :key="child.id"
                :value="child.id"
              >
                {{ child.name }}
              </option>
            </optgroup>
          </select>
        </div>
        <!-- Thêm biến thể -->
        <div class="form-group" style="align-items: center">
          <button type="button" @click="addVariant">Thêm biến thể</button>
          <div
            v-for="(variant, variantIndex) in newProduct.variant"
            :key="variantIndex"
            class="bienthe"
          >
            <p>Biến thể {{ variantIndex + 1 }}:</p>

            <button type="button" @click="removeVariant(variantIndex)">
              Xóa biến thể
            </button>

            <button type="button" @click="addAttribute(variantIndex)">
              Thêm thuộc tính
            </button>

            <!-- Thêm số lượng -->
            <div class="form-group" style="display: flex; margin-top: 20px">
              <label for="name" style="width: 200px">Số lượng:</label>
              <input
                v-model="variant.quantity"
                type="number"
                id="name"
                required
                placeholder="Số lượng"
              />
            </div>

            <!-- Thêm sku -->
            <div class="form-group" style="display: flex">
              <label for="name" style="width: 200px">SKU:</label>
              <input
                v-model="variant.sku"
                type="text"
                id="name"
                required
                placeholder="SKU"
              />
            </div>

            <!-- Thêm các thuộc tính -->
            <div class="form-group">
              <p>Thuộc tính:</p>
              <div
                v-for="(attribute, index) in variant.attributes"
                :key="index"
              >
                <select v-model="attribute.value">
                  <option value="" disabled>Chọn giá trị</option>
                  <template v-for="attr in attributes" :key="attr.id">
                    <option
                      v-for="value in attr.values"
                      :key="value.id"
                      :value="value.id"
                    >
                      {{ attr.name }} - {{ value.value }}
                    </option>
                  </template>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Thêm Ảnh -->
        <div class="form-group" style="display: flex; align-items: center">
          <label style="width: 200px; align-items: center">Thêm ảnh:</label>
          <input type="file" @change="onFileSelected" />
          <!-- @change="onFileSelected": Gọi phương thức onFileSelected để xử lý việc chọn ảnh. -->
        </div>

        <!-- 2btn -->
        <div class="modal-actions">
          <button type="submit" class="add-btn"  >Thêm</button>
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
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-container {
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 600px; /* Đặt độ rộng tối đa cho modal */
  max-height: 100vh; /* Đặt chiều cao tối đa cho modal */
  overflow-y: auto; /* Cho phép cuộn dọc khi nội dung quá dài */
}

.modal-container h2 {
  margin-bottom: 15px;
  font-size: 1.25em;
  font-weight: 600;
}

.form-group {
  margin-bottom: 15px;
}

.form-group input[type="text"] {
  width: 100%;
  padding: 8px;
  font-size: 1em;
  border: 1px solid #ddd;
  border-radius: 4px;
}
/* CSS cho input giá trị thuộc tính */
.modal-container input[type="text"] {
  width: 100%;
  padding: 10px;
  font-size: 1em;
  border: 1px solid #ddd;
  border-radius: 4px;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.2s;
}

.modal-container input[type="text"]:focus {
  border-color: #333;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.add-btn,
.save-btn {
  background-color: #4caf50;
  color: white;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.cancel-btn {
  background-color: #f44336;
  color: white;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.add-btn:hover,
.save-btn:hover,
.cancel-btn:hover {
  opacity: 0.9;
}
</style>
