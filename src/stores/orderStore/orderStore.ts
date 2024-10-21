import axiosInstance from "@/axios/axiosInstance";
import type { IOrder, IOrderItem } from "@/interface/order/order";
import { defineStore } from "pinia";
import { useCartStore } from "@/stores/cartStore/cartStore";

export const useOrderStore = defineStore("orderStore", {
  state: () => ({
    orderList: [] as IOrder[],
    orderItems: {} as IOrderItem,
  }),
  getters: {},
  actions: {
    // Create Order
    async createOrder(order: IOrderItem) {
      const cartStore = useCartStore(); // Khởi tạo cartStore

      // Kiểm tra xem giỏ hàng có rỗng không
      if (cartStore.cartProduct.length === 0) {
        alert("Giỏ hàng rỗng");
        return; // Thoát khỏi hàm nếu giỏ hàng rỗng
      }
      try {
        const response = await axiosInstance.post<IOrderItem>(
          "/order/create",
          order
        );
        this.orderItems = response.data;
        alert("Đặt hàng thành công!");
      } catch (error) {
        console.log("Có lỗi khi tạo đơn hàng", error);
      }
    },

    //Get Order Item
    async getOrder() {
      try {
        const response = await axiosInstance.get<IOrder[]>("/order/get");
        this.orderList = response.data;
      } catch (error) {
        console.log("Có lỗi khi lấy đơn hàng", error);
      }
    },
  },
});
