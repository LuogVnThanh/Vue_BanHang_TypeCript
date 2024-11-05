import axiosInstance from "@/axios/axiosInstance";
import type { ICartItem, ICartVariant } from "@/interface/cart/cart";
import axios from "axios";
import { defineStore } from "pinia";

export const useCartStore = defineStore("cartStore", {
  state: () => ({
    cartProduct: [] as ICartItem[],
  }),
  getters: {
    // Tổng sản phẩm trong cart
    totalItems(state) {
      return state.cartProduct.reduce(
        (sum: number, item: any) => sum + item.quantity,
        0
      );
    },
    // Tổng tiền của cart
    totalPrice(state) {
      return state.cartProduct.reduce(
        (sum: number, item: any) => sum + item.price * item.quantity,
        0
      );
    },
  },
  actions: {
    //  Xem tất cả sản phẩm trong cart
    async GetAllProductByCart() {
      try {
        const response = await axiosInstance.get<ICartItem[]>(
          "/cart-item/getall"
        );
        this.cartProduct = response.data;
      } catch (error) {
        console.log("Có lỗi khi lấy sản phẩm từ CartStore", error);
      }
    },
    // Add to Cart
    async addToCart(product_variant_id: number, quantity: number) {
      // console.log("CartStore - Thêm vào giỏ hàng:", {
      //   product_variant_id,
      //   quantity,
      // });
      try {
        const response = await axiosInstance.post<ICartVariant>(
          "cart-item/create",
          {
            product_variant_id, // id của sản phẩm
            quantity: quantity, // số lượng
          }
        );

        if (response.data && response.data.variants) {
          const newItem = {
            id: response.data.variants.id,
            product_variant_id,
            quantity,
            price: 0, // Gán giá trị mặc định cho price nếu cần
            
            // Thêm các thông tin khác nếu cần
          };

          const existingItemIndex = this.cartProduct.findIndex(
            (item) => item.product_variant_id === product_variant_id
          );

          if (existingItemIndex !== -1) {
            this.cartProduct[existingItemIndex].quantity += quantity;
          } else {
            this.cartProduct.push(newItem);
          }
          // Có thể thêm thông báo thành công ở đây
          alert("Sản phẩm đã được thêm vào giỏ hàng. ");
        }
      } catch (error) {
        console.log("Có lỗi khi thêm sản phẩm vào giỏ hàng", error);
      }
    },
    // Remove Cart
    async removeToCart(id: number) {
      try {
        await axiosInstance.delete(`/cart-item/delete/${id}`);
        this.cartProduct = this.cartProduct.filter((item) => item.id !== id);
        alert("Sản phẩm đã được xóa khỏi giỏ hàng.");
      } catch (error) {
        console.log("Có lỗi khi xóa sản phẩm khỏi giỏ hàng", error);
      }
    },
  },
});
