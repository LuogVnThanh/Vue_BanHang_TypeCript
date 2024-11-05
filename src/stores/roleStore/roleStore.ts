import axiosInstance from "@/axios/axiosInstance";
import type { IRole } from "@/interface/user/user";
import { defineStore } from "pinia";

export const useRoleStore = defineStore("roleStore",{
    state:()=>({
        Roles:[] as IRole[]
    }),
    getters:{},
    actions:{
        // Get All Role
        async getAllRoles(){
            try{
                const response = await axiosInstance.get<IRole[]>("role/getall");
                this.Roles = response.data;

            }catch(error){
                console.log("Có lỗi khi lấy toàn bộ Role", error);
            }
        }
    }
 
})