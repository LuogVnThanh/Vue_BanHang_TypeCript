import axiosInstance from "@/axios/axiosInstance";
import type { IAuthResponse, ILogin, IProfile, IRegister } from "@/interface/auth/auth";
import { defineStore } from "pinia";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import router from "@/router";

export const useAuthStore = defineStore("authStore", {
  state: () => ({
    Token: null as string | null,
    userSelf: null as IProfile | null,
    role_id: null as number | null,

    // refresh_token: null as string | null,
    // token_expired: null as number | null,
    // user_expired: null as number | null
  }),
  getters: {
    isAuthenticated: (state) => !!state.Token,
    isAdmin: (state) => state.userSelf?.role.includes('admin'),
    isManager: (state) =>state.userSelf?.role.includes('manager'),
    isStaff: (state) => state.userSelf?.role.includes('staff'),
    isCustomer: (state) => state.userSelf?.role.includes('customer'),
  },
  actions: {
    // ===========Profie==================
    async GetProfile() {
      try {
        const response = await axiosInstance.get<IProfile>("/me");
        console.log(response.data, "ng");
        return response.data;
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng", error);
      }
    },

    // ===========LOGIN==================
    async Login(email: string, password: string) {
      try {
        const response = await axiosInstance.post<IAuthResponse>("/login", {
          email,
          password,
        });
        this.Token = response.data.token;

        if (response.status === 200 && response.data.token) {
          // Lưu token vào cookies
          Cookies.set("token", this.Token!);
          let decodetoken;
          try {
            decodetoken = jwtDecode(response.data.token);
            const userId = decodetoken.sub;
            const userInfo = await this.GetProfile();
            if (userInfo) {
              this.userSelf = userInfo;
              Cookies.set("user", JSON.stringify(userInfo));
              
            }
            // console.log("User ID:", userId);
          } catch (err) {
            console.error("Lỗi khi giải mã token:", err);
            alert("token không hợp lệ. Vui lòng đăng nhập lại.");
            return;
          }

          // Gọi API lấy thông tin chi tiết của người dùng nếu cần thiết
          // const userInfo = await this.GetProfile();
          // if (userInfo) {
          //   this.userSelf = userInfo;
          //   Cookies.set("user", JSON.stringify(userInfo));
          // }

          router.push({ name: "Home" });
        }
      } catch (error) {
        console.error("Có lỗi khi đăng nhập", error);
        alert("Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin.");
      }
    },
    // ===========LOGOUT==================
    async Logout() {
      this.Token = null;
      Cookies.remove("token");
      Cookies.remove("user");
      window.location.href = "/Login";
    },
    // ===========REGISTER==================
    async Register(name: string,email: string,password: string, password_confirmation: string) {
      try{
        const response = await axiosInstance.post<IRegister>("/register", {
          name,
          email,
          password,
          password_confirmation,
        });
        if(response.status === 201){

          router.push({name: "Login"});
          alert("Đăng kí tài khoản thành công")
        }
        else{
          console.log("Status: "+ response.status);
        }

      }catch (error: any) {
        if (error.response && error.response.status === 400) {
          alert("Email đã tồn tại trong hệ thống!");

        } else {
          console.log("Có lỗi khi tạo tài khoản", error);
        }
      }

    },


    // ============Xử lý kiểm tra đăng  nhập vào profile ===================
    async HandleProfile() {
      if (this.Token == null) {
        router.push("/Login");
      } else return router.push("/Profile");
      // const routeName = this.Token && this.userSelf ? "Profile" : "Login";
      // router.push({ name: routeName });
    },
    // Hàm kiểm tra đăng nhập vào cart
    async HandleLoginCart() {
      if (this.Token == null) {
        router.push("/Login");
      } else return router.push("/Cart");
      // const routeName = this.Token && this.userSelf ? "Profile" : "Login";
      // router.push({ name: routeName });
    },
  },
});
