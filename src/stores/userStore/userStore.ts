import axiosInstance from "@/axios/axiosInstance";
import type { IUser, IUserCreate } from "@/interface/user/user";
import { defineStore } from "pinia";

export const useUserStore = defineStore("userStore", {
  state: () => ({
    Users: [] as IUser[],
  }),
  getters: {},
  actions: {
    // GetAll User
    async GetAllUser() {
      try {
        const response = await axiosInstance.get("/admin/users");
        this.Users = response.data.users;
      } catch (error) {
        console.log("Có lỗi khi lấy toàn bộ người dùng", error);
      }
    },
    // Create User
    async CreateUser(user: IUserCreate) {
      try {
        const response = await axiosInstance.post("/admin/users/create", user);
        if (response.status === 201) {
          const newUser = response.data.user;
          console.log("New user created", response.data.user);
          if (newUser && newUser.id) {
            // Kiểm tra newUser có id không
            this.Users.push(newUser);
            alert("Tạo người dùng thành công");
          } else {
            console.warn("User mới không có id, không thêm vào danh sách");
          }
        } else if (response.status === 422) {
          alert("Email đã tồn tại trong hệ thống");
        } else {
          alert("Đã có lỗi xảy ra khi tạo người dùng");
        }
      } catch (error: any) {
        if (error.response && error.response.status === 422) {
          // Log lỗi chi tiết từ server
          console.error("Lỗi 422:", error.response.data);
          alert(
            `Có lỗi xảy ra: ${
              error.response.data.message || "Email đã tồn tại trong hệ thống"
            }`
          );
        } else {
          console.error("Có lỗi khi tạo người dùng", error);
          alert("Đã có lỗi xảy ra khi tạo người dùng");
        }
      } finally {
        await this.GetAllUser(); // Gọi lại để lấy danh sách mới, nếu cần
      }
    },
    // update User
  async UpdateUser(id:number, user:IUserCreate){
    try{
      const response = await axiosInstance.put(`/admin/users/update/${id}`,user);
      if(response.status === 201){
        const updatedUser = response.data.user;
        const index = this.Users.findIndex((user) => user.id === id);
        if(index!== -1){
          this.Users[index] = updatedUser; // Hoặc gán giá trị mới nếu API trả về thông tin đầy đủ
          alert("Cập nhật thành công");
          await this.GetAllUser();
        }else{
          console.warn("Không tìm thấy người dùng để cập nhật");
        }
      }else{
        alert("Đã có lỗi xảy ra khi cập nhật người dùng");
      }

      }catch(error){
      console.log("Có lỗi khi chỉnh sửa người dùng",error);
    }
    // finally{
    //   await this.GetAllUser(); // Gọi lại để lấy danh sách mới, nếu cần
    // }

  },
    // Delete User
    async DeleteUser(userId: number){
      try{
        const response = await axiosInstance.delete(`/admin/users/delete/${userId}`);
        if(response.status === 200){
          this.Users = this.Users.filter((user) => user.id!== userId);
          alert("Xóa người dùng thành công");
        }else{
          alert("Đã có lỗi xảy ra khi xóa người dùng");
        }

      }catch(error){
        console.log("Có lỗi khi xóa người dùng", error);
      }
    }
  },
});
