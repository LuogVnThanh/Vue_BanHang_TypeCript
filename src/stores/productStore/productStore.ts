import axiosInstance from "@/axios/axiosInstance";
import type {
  IDetailProduct,
  IProduct,
  IProductPage,
  ISearchProduct,
} from "@/interface/product/product";
import { defineStore } from "pinia";

export const useProductStore = defineStore("productStore", {
  state: () => ({
    // adminProducts lưu tất cả sản phẩm cho quản trị viên
    adminProducts: [] as IProduct[],

    // pagedProducts lưu sản phẩm được phân trang cho người dùng
    pagedProducts: [] as IProduct[] ,
     ResultProductBySearch: [] as ISearchProduct[],
    selectedDetailProduct: {} as IDetailProduct,
    selectedProductByCate: [] as IProduct[],
    currentPage: 1,
    totalPage: 0,
    last_page: 0,
  }),
  getters: {},
  actions: {
    //getall============================================================
    async getAllProduct() {
      try {
        const response = await axiosInstance.get<IProduct[]>("/product/getall");
        this.adminProducts = response.data;
      } catch (error) {
        console.log("Có lỗi khi lấy tất cả sản phẩm", error);
      }
    },
    //getallProductByPage===========================================
    
    async getProductByPage(page: number) {
      try {
        const response = await axiosInstance.get<IProductPage>(
          `/product/pagein/4?page=${page}`
        );
        this.pagedProducts = response.data.data;
     
        // Cập nhật thông tin phân trang
        this.currentPage = response.data.current_page;
        this.totalPage = response.data.total;
        this.last_page = response.data.last_page;
      } catch (error) {
        console.log("Có lỗi khi lấy sản phẩm phân trang", error);
      }
    },

    //DetailProduct============================================================
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
    //Search=====================================================================
    async searchProduct(keyword: string) {
      try {
        const response = await axiosInstance.get<ISearchProduct[]>(
          `/product/search?keyword=${keyword}`
        );
        this.ResultProductBySearch = response.data;
      } catch (error) {
        console.log("Có lỗi khi tìm kiếm sản phẩm", error);
      }
    },
  
  },
});
