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
        const response = await axiosInstance.get<IOrder[]>("/order/getbyuser");
        this.orderList = response.data;
      } catch (error) {
        console.log("Có lỗi khi lấy đơn hàng", error);
      }
    },
    // Update Item
    async updateOrderItem(id:number,orderItem: IOrderItem) {
      try {
       const response=  await axiosInstance.put(`/order/update/${id}`, orderItem);
       // Cập nhật lại orderList sau khi thành công
       const index = this.orderList.findIndex(order => order.id === id);
       if (index !== -1) {
         this.orderList[index] = response.data; // Hoặc gán giá trị mới nếu API trả về thông tin đầy đủ
       }
       alert("Cập nhập thành công")
      } catch (error) {
        console.log("Có lỗi khi cập nhật đơn hàng", error);
      }
    },
    // Delete Item
    async deleteOrderItem(id: number) {
      try {
        await axiosInstance.delete(`/order/delete/${id}`);
        alert("Xóa đơn hàng thành công!");
      } catch (error) {
        console.log("Có lỗi khi xóa đơn hàng", error);
      }
    },
  },
});
