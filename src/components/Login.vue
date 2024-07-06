<template>
  <div class="w-full h-screen flex items-center justify-center">
    <form
      @submit.prevent="login"
      class="w-[500px] mx-auto bg-white shadow-lg p-5 rounded-lg"
    >
      <div class="mb-5">
        <label for="email" class="block mb-2 text-sm font-medium text-gray-900">
          Your email
        </label>
        <input
          v-model="email"
          type="email"
          id="email"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="name@gmail.com"
          required
        />
      </div>
      <div class="mb-5">
        <label
          for="password"
          class="block mb-2 text-sm font-medium text-gray-900"
        >
          Your password
        </label>
        <input
          v-model="password"
          type="password"
          id="password"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500"
          required
        />
      </div>

      <button
        type="submit"
        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Submit
      </button>
    </form>
  </div>
</template>

<script>
import { ref } from "vue";
import axiosInstance from "../api/index";
import { useRouter } from "vue-router";

export default {
  setup() {
    const email = ref("");
    const password = ref("");
    const router = useRouter();

    const login = async () => {
      try {
        const response = await axiosInstance.post("/login", {
          email: email.value,
          password: password.value,
        });

        // Handle successful login
        localStorage.setItem("token", response.data.token);
        console.log("Login successful:", response.data);
        router.push({ path: "/dashboard" });
      } catch (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          console.error("Login failed:", error.response.data);
        } else if (error.request) {
          // The request was made but no response was received
          console.error("Login failed: No response received");
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error("Login failed:", error.message);
        }
      }
    };

    return {
      email,
      password,
      login,
    };
  },
};
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
