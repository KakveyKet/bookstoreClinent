<template>
  <div>
    <div>
      <h2>Your Cart {{ cartItems.length }}</h2>
      <ul v-if="cartItems.length > 0" class="space-y-4">
        <li
          v-for="item in cartItems"
          :key="item.id"
          class="flex gap-3 p-2 bg-white rounded-lg shadow-lg items-center hover:shadow-md duration-300 relative"
        >
          <div>
            <img
              :src="getImageUrl(item.product ? item.product.image : '')"
              alt="Product Image"
              style="max-width: 100px; height: auto"
            />
          </div>
          <div class="space-y-2">
            <div class="">
              Product Name: {{ item.product ? item.product.name : "Unknown" }}
            </div>
            <div class="flex flex-col items-start gap-3">
              <el-tag size="large" effect="dark" type="success">
                Quantity: {{ item.quantity }}
              </el-tag>
              <el-button type="primary" round>
                Type:
                {{
                  item.product && item.product.category
                    ? item.product.category.name
                    : "Unknown"
                }}
                Price: ${{ item.product ? item.product.price : "Unknown" }}
              </el-button>
            </div>
          </div>
          <div class="absolute right-2 top-2">
            <el-button
              type="danger"
              @click="removeFromCart(item.product_id)"
              :icon="Delete"
              circle
            />
          </div>
        </li>
      </ul>
      <div v-else style="max-width: 600px" class="mt-3">
        <el-alert
          class="!h-16"
          title="No Item In Cart , Please Go To Cart Enjoy the Shopping"
          type="error"
          :closable="false"
        />
      </div>
    </div>
    <div
      v-if="cartItems.length > 0"
      class="w-full flex items-center justify-center"
    >
      <el-button
        class="!w-[250px] mt-4"
        @click="ClearCart"
        type="danger"
        :icon="Delete"
        >Clear Cart</el-button
      >
      <el-button
        @click="handleCheckout"
        class="!w-[250px] mt-4"
        type="primary"
        :icon="Check"
        >Order</el-button
      >
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axiosInstance from "../api/index"; // Adjust the path to your axios instance
import {
  Check,
  Delete,
  Edit,
  Message,
  Star,
  ShoppingCart,
  Notification,
  Search,
  Bi,
} from "@element-plus/icons-vue";

// Fetch cart items from API
const cartItems = ref([]);
const fetchCartItems = async () => {
  try {
    const response = await axiosInstance.get("/cart");
    cartItems.value = response.data.cartItems;
  } catch (error) {
    console.error("Error fetching cart items:", error);
  }
};

const removeFromCart = async (productId) => {
  try {
    await axiosInstance.delete(`/cart/remove/${productId}`);
    fetchCartItems(); // Refresh cart items after removal
  } catch (error) {
    console.error("Error removing item from cart:", error);
  }
};

const ClearCart = async () => {
  try {
    await axiosInstance.delete(`/cart/clear`);
    fetchCartItems(); // Refresh cart items after removal
  } catch (error) {
    console.error("Error removing item from cart:", error);
  }
};
const getImageUrl = (imagePath) => {
  return `http://127.0.0.1:8000/storage/${imagePath}`;
};
const handleCheckout = async () => {
  try {
    await axiosInstance.post("/cart/checkout");
  } catch (error) {
    console.error(
      "Error checking out:",
      error.response ? error.response.data : error.message
    );
  }
};
onMounted(() => {
  fetchCartItems();
});
</script>

<style>
/* Add your styles here */
</style>
