<template>
  <div class="login-form">
    <h2>Login</h2>
    <form @submit.prevent="login">
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <button type="submit">Login</button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script>
import { ref } from "vue";
import axiosInstance from "../api/index";
import { useRouter } from "vue-router";

export default {
  setup() {
    const router = useRouter();
    const email = ref("");
    const password = ref("");
    const error = ref(null);

    const login = async () => {
      try {
        const response = await axiosInstance.post("/login", {
          email: email.value,
          password: password.value,
        });

        const token = response.data.token;
        localStorage.setItem("token", token);

        // Redirect to /shop after successful login
        router.push("/shop");
      } catch (err) {
        error.value = err.response.data.message || "Login failed";
        console.error("Login error:", err);
      }
    };

    return {
      email,
      password,
      error,
      login,
    };
  },
};
</script>

<style scoped>
/* Your existing styles */
</style>
