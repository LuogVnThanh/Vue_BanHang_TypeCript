import axiosInstance from "@/axios/axiosInstance";
import type {
  IAuthResponse,
  ILogin,
  IProfile,
  IRegister,
} from "@/interface/auth/auth";
import { defineStore } from "pinia";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import router from "@/router";

export const useAuthStore = defineStore("authStore", {
  state: () => ({
    Token: null as string | null,
    userSelf: null as IProfile | null,
    role_id: null as number | null,

    refresh_token: null as string | null,
    token_expired: null as number | null, //Kiểm tra thời hạn token
    checkInterval: null as number | null, // Thêm biến để lưu interval
    // user_expired: null as number | null
  }),
  getters: {
    isAuthenticated: (state) => !!state.Token,
    isAdmin: (state) => state.userSelf?.role.includes("admin"),
    isManager: (state) => state.userSelf?.role.includes("manager"),
    isStaff: (state) => state.userSelf?.role.includes("staff"),
    isCustomer: (state) => state.userSelf?.role.includes("customer"),
  },
  actions: {
    // =========Khởi tạo trạng thái từu côkie
    async initializeAuth() {
      const cookieToken = Cookies.get("token");
      const cookieUser = Cookies.get("user");

      if (cookieToken) {
        this.Token = cookieToken;
        try {
          const decodedToken = jwtDecode(cookieToken);
          this.token_expired = decodedToken.exp! * 1000;

          // Kiểm tra token đã hết hạn  chưa
          const now = Date.now();
          if (this.token_expired <= now) {
            // Nếu đã hết hạn, thử refresh token
            const success  = await this.RefreshToken();

            if (!success ) {
              // Nếu refresh thất bại, logout
              this.Logout();
              return false;
            }
          }

          if (cookieUser) {
            this.userSelf = JSON.parse(cookieUser);
          } else {
            // Nếu không có user info trong cookie, lấy từ API
            await this.GetProfile();
          }

          this.startCheckTokenExpiry();
          return true;
        } catch (error) {
          console.log("Lỗi khi khởi tạo auth", error);
          this.Logout();
          return false
        }
      }
      return false;
    },
    // ===========Profie==================
    async GetProfile():Promise<IProfile|undefined> {
      try {
        const response = await axiosInstance.get<IProfile>("/me");
        this.userSelf = response.data;
        Cookies.set("user", JSON.stringify(response.data));
        return response.data;
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng", error);
        return undefined;
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
          // console.log("token: " + this.Token);

          let decodedToken;
          try {
            decodedToken = jwtDecode(response.data.token);
            const userId = decodedToken.sub;
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

          // Gán thời gian hết hạn của token từ exp
          this.token_expired = decodedToken.exp! * 1000; // Chuyển sang milliseconds
          // console.log("Token expired:", this.token_expired);

          this.startCheckTokenExpiry();

          router.push({ name: "Home" });
        }
      } catch (error) {
        console.error("Có lỗi khi đăng nhập", error);
        alert("Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin.");
      }
    },
    // ===========RefreshToken==================
    async RefreshToken() {
      try {
        const response = await axiosInstance.post<IAuthResponse>("/refresh");

        if (response.status === 200 && response.data.token) {
          this.Token = response.data.token;
          Cookies.set("token", this.Token!);
          // console.log("tokenaftertref: " + this.Token);

          const decodedToken = jwtDecode(response.data.token);
          this.token_expired = decodedToken.exp! * 1000; // Chuyển sang milliseconds
          // console.log("Token expired:", this.token_expired);

          // Cập nhật lại profile sau khi refresh token
          await this.GetProfile();

          // Gọi lại hàm startCheckTokenExpiry để đảm bảo interval tiếp tục
          this.startCheckTokenExpiry();
          return true;
        }
        return false
      } catch (error) {
        console.log("Có lỗi khi refresh token", error);
        this.Logout(); // Đăng xuất nếu không thể refresh
        return false;
      }
    },

    // ===========START CHECK TOKEN EXPIRY==================
    startCheckTokenExpiry() {
      if (this.checkInterval) {
        clearInterval(this.checkInterval);
      }

      const checkToken = async () => {
        const now = Date.now();
        if (this.token_expired && this.Token) {
          // Kiểm tra nếu token sắp hết hạn (còn 10 giây)
          if (this.token_expired - now <= 10000) {
            console.log("Token sắp hết hạn, đang refresh...");
            await this.RefreshToken();
          }
        }
      };

      checkToken();

      // Thiết lập interval kiểm tra định kỳ (mỗi 5 giây)
      this.checkInterval = setInterval(checkToken, 5000);
      // console.log("Đã thiết lập interval kiểm tra token:", this.checkInterval);
    },
    // ===========LOGOUT==================
    async Logout() {
      this.Token = null;
      Cookies.remove("token");
      Cookies.remove("user");
      window.location.href = "/login";
    },
    // ===========REGISTER==================
    async Register(
      name: string,
      email: string,
      password: string,
      password_confirmation: string
    ) {
      try {
        const response = await axiosInstance.post<IRegister>("/register", {
          name,
          email,
          password,
          password_confirmation,
        });
        if (response.status === 201) {
          router.push({ name: "Login" });
          alert("Đăng kí tài khoản thành công");
        } else {
          console.log("Status: " + response.status);
        }
      } catch (error: any) {
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
