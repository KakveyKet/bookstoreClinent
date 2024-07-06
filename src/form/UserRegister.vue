<template>
  <div class="w-full h-screen flex items-center justify-center">
    <el-form
      ref="ruleFormRef"
      style="width: 600px"
      status-icon
      label-width="auto"
      class="demo-ruleForm bg-white p-5 rounded-lg shadow-lg"
    >
      <el-form-item label="Name" prop="name" :error="nameError">
        <el-input v-model="name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="Email" prop="email" :error="emailError">
        <el-input v-model="email" autocomplete="off" />
      </el-form-item>
      <el-form-item class="!hidden" label="Role" prop="rols">
        <el-input class="hidden" v-model="rols" autocomplete="off" />
      </el-form-item>
      <el-form-item label="Password" prop="pass" :error="passwordError">
        <el-input v-model="password" type="password" autocomplete="off" />
      </el-form-item>
      <el-form-item
        label="Confirm Password"
        prop="checkPass"
        :error="confirmPasswordError"
      >
        <el-input
          v-model="confirmPassword"
          type="password"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm"> Register </el-button>
        <el-button @click="resetForm">Reset</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { ref } from "vue";
import axiosInstance from "../api/index";

export default {
  setup() {
    const name = ref("");
    const email = ref("");
    const rols = ref("customer");
    const password = ref("");
    const confirmPassword = ref("");

    const nameError = ref("");
    const emailError = ref("");
    const passwordError = ref("");
    const confirmPasswordError = ref("");

    const validateForm = () => {
      let isValid = true;

      if (!name.value) {
        nameError.value = "Please input your name";
        isValid = false;
      } else {
        nameError.value = "";
      }

      if (!email.value) {
        emailError.value = "Please input your email";
        isValid = false;
      } else if (!/\S+@\S+\.\S+/.test(email.value)) {
        emailError.value = "Please input a valid email";
        isValid = false;
      } else {
        emailError.value = "";
      }

      if (!password.value) {
        passwordError.value = "Please input your password";
        isValid = false;
      } else if (password.value.length < 6) {
        passwordError.value = "Password must be at least 6 characters";
        isValid = false;
      } else {
        passwordError.value = "";
      }

      if (!confirmPassword.value) {
        confirmPasswordError.value = "Please confirm your password";
        isValid = false;
      } else if (confirmPassword.value !== password.value) {
        confirmPasswordError.value = "Passwords do not match";
        isValid = false;
      } else {
        confirmPasswordError.value = "";
      }

      return isValid;
    };

    const submitForm = async () => {
      if (validateForm()) {
        try {
          const response = await axiosInstance.post("/register", {
            name: name.value,
            rols: rols.value,
            email: email.value,
            password: password.value,
          });
          console.log("Registration successful:", response.data);
          // Optionally, handle success (e.g., navigate to login page or show a success message)
        } catch (error) {
          console.error("Error during registration:", error);
        }
      }
    };

    const resetForm = () => {
      name.value = "";
      email.value = "";
      rols.value = "customer";
      password.value = "";
      confirmPassword.value = "";
      nameError.value = "";
      emailError.value = "";
      passwordError.value = "";
      confirmPasswordError.value = "";
    };

    return {
      name,
      email,
      rols,
      password,
      confirmPassword,
      nameError,
      emailError,
      passwordError,
      confirmPasswordError,
      submitForm,
      resetForm,
    };
  },
};
</script>
