import axiosInstance from "@/axios/axiosInstance";
import type { ICategoryProduct } from "@/interface/category/categoryProduct";
import { defineStore } from "pinia";

export const useCategoryStore= defineStore ("categoryStore", {
    state :()=>({
        categories: [] as ICategoryProduct[],
        

    }),
    getters:{},
    actions :{

        async getAllCategories(){
            try{
                const response = await axiosInstance.get<ICategoryProduct[]>('/cate/getcatenull');
                this.categories = response.data;

            }catch(error){
                console.log("Có lỗi khi lấy loại sản phẩm",error);
            }
        },

        
    }
})