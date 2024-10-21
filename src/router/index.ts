import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import Login from "../components/AuthComponent/LoginComponent.vue";
import Register from "../components/AuthComponent/RegisterComponent.vue";
import Profile from "../views/User/ProfileView.vue";
import { useAuthStore } from "@/stores/authStore/authStore";
import ProductByCategory from "../views/Product/ProductByCateView.vue"
import DetailProduct from "../views/Product/DetailProductView.vue"
import DashBoard from "../views/Admin/DashboardView.vue"
import Cart from "../views/Cart/CartView.vue"
import Cookies from "js-cookie";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      component: HomeView,
    },
    {
      path: "/login",
      name: "Login",
      component: Login,
    },
    {
      path: "/register",
      name: "Register",
      component: Register,
    },
    {
      path: "/profile",
      name: "Profile",
      component: Profile,
      meta: { requiresAth: true },
    },
    {
      path: "/category/:id",
      name: "ProductByCategory",
      component: ProductByCategory,
    },
    {
      path: "/product/detail/:id",
      name: "DetailProduct",
      component: DetailProduct,
    },
    {
      path : '/dashboard',
      name: 'Dashboard',
      component: DashBoard
    },
    {
      path : '/cart',
      name: 'Cart',
      component: Cart
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // Khởi tạo trạng thái từ local storage hoặc cookies
  if (!authStore.Token) {
    const cookieToken = Cookies.get("token");
    const cookieUser = Cookies.get("user");
    authStore.Token = cookieToken || null;

    if (cookieUser) {
      try {
        // Parse thông tin người dùng từ cookies và gán vào state
        authStore.userSelf = JSON.parse(cookieUser);
      } catch (error) {
        console.error("Error parsing user data from cookies:", error);
      }
    }

    if (authStore.Token && !authStore.userSelf) {
      try {
        // Lấy thông tin người dùng từ API nếu cần thiết
        const userInfo = await authStore.GetProfile();
        if (userInfo) {
          authStore.userSelf = userInfo;
          Cookies.set("user", JSON.stringify(userInfo));
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        authStore.Logout();
      }
    }
  }

  // Kiểm tra đường dẫn đăng nhập
  if (to.name === "Login") {
    if (authStore.isAuthenticated) {
      // Nếu đã đăng nhập, chuyển hướng đến trang phù hợp
      return next(authStore.isAdmin ? "/admin" : "/Home");
    }
    return next();
  }

  // Kiểm tra quyền truy cập cho các trang khác
  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    return next("/Home");
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next("/Login");
  }

  next();
});


export default router;
