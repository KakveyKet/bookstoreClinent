<template>
  <div class="sticky top-0 z-40">
    <div
      class="w-full h-[70px] bg-white shadow-md flex items-center justify-between"
    >
      <h2
        v-if="$route.path.startsWith('/dashboard')"
        class="text-heading2 font-bold text-primary ml-4"
      >
        Dashboard
      </h2>
      <h2
        v-if="$route.path.startsWith('/product')"
        class="text-heading2 font-bold text-primary ml-4"
      >
        Product List
      </h2>
      <h2
        v-if="$route.path.startsWith('/todayorder')"
        class="text-heading2 font-bold text-primary ml-4"
      >
        To day Order
      </h2>
      <h2
        v-if="$route.path.startsWith('/category')"
        class="text-heading2 font-bold text-primary ml-4"
      >
        Category List
      </h2>
      <h2
        v-if="$route.path.startsWith('/punchase')"
        class="text-heading2 font-bold text-primary ml-4"
      >
        Punchase
      </h2>
      <div v-if="user" class="flex items-center mr-4">
        <div
          class="w-10 h-10 bg-primary rounded-full flex items-center justify-center"
        >
          <span class="text-sm text-white font-semibold">{{
            user.name.charAt(0)
          }}</span>
        </div>
        <div class="ml-2">
          <span class="text-sm font-semibold">{{ user.name }}</span>
          <span class="block text-xs text-gray-500">{{ user.email }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axiosInstance from "../api/index";
import { ref, onMounted } from "vue";
import { ElMessageBox } from "element-plus";
export default {
  setup() {
    const user = ref(null);

    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Token not found");
        }

        const response = await axiosInstance.get("/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        user.value = response.data;
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    // Fetch user data when component is mounted
    onMounted(fetchUser);
    const logout = async () => {
      try {
        const confirmed = await ElMessageBox.confirm(
          "Are you sure you want to log out?",
          "Logout Confirmation",
          {
            confirmButtonText: "Yes",
            cancelButtonText: "No",
            type: "warning",
          }
        );

        if (confirmed) {
          await axiosInstance.post(
            "/logout",
            {},
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          localStorage.removeItem("token");
          user.value = null;
          isAuthenticated.value = false;
          router.push("/login");
        }
      } catch (error) {
        if (error !== "cancel") {
          console.error("Error logging out:", error);
        }
      }
    };
    return {
      user,
      logout,
    };
  },
};
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
