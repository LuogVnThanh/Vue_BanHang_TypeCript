import axiosInstance from "@/axios/axiosInstance";
import type { IDetailProduct, IProduct } from "@/interface/product/product";
import { defineStore } from "pinia";

export const useProductStore = defineStore("productStore", {
  state: () => ({
    products: [] as IProduct[],
    selectedDetailProduct: {} as IDetailProduct,
    selectedProductByCate: [] as IProduct[],
  }),
  getters: {},
  actions: {
    //getall============================================================
    async getAllProduct() {
      try {
        const response = await axiosInstance.get<IProduct[]>("/product/getall");
        this.products = response.data;
      } catch (error) {
        console.log("Có lỗi khi lấy tất cả sản phẩm", error);
      }
    },
    //DetailProdcut============================================================
    async getProductById(id: number) {
      try {
        const response = await axiosInstance.get<IDetailProduct>(
          `/product/getbyid/${id}`
        );
        this.selectedDetailProduct = response.data;
        // console.log("objectdeaaiusd", this.selectedDetailProduct);
      } catch (error) {
        console.log("Có lỗi khi lấy chi tiết sản phẩm", error);
      }
    },
    //ProductByCategory=========================================================
    async getProductByCategory(id: number) {
      try {
        const response = await axiosInstance.get(`/product/getbycate/${id}`);
        this.selectedProductByCate = response.data;
      } catch (error) {
        console.log("có lỗi khi lấy sản phẩm theo category", error);
      }
    },
  },
});
    