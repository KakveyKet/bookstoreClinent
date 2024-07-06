<template>
  <div class="bg-white">
    <!-- head -->
    <div class="w-full bg-white shadow-lg">
      <div class="max-w-[1400px] mx-auto">
        <el-menu
          :default-active="activeIndex"
          class="el-menu-demo flex items-center mx-auto !bg-white w-full"
          mode="horizontal"
          :ellipsis="false"
          @select="handleSelect"
        >
          <router-link to="/shop" class="flex items-center">
            <img
              class="w-20 h-20 ml-5"
              src="../assets/1.svg"
              alt="Element logo"
            />
          </router-link>
          <div class="flex-grow" />
          <div class="mr-4">
            <el-tooltip
              :content="user ? user.email : 'Guest@gmail.com'"
              placement="top"
            >
              <div
                class="w-10 h-10 bg-primary5 flex items-center justify-center rounded-full border-2 border-primary text-white"
                size="large"
              >
                {{ user ? user.name[2] : "Guest" }}
              </div>
            </el-tooltip>
          </div>
          <div class="mr-4">
            <el-button
              class="w-10 h-10"
              @click="drawer = true"
              type="primary"
              :icon="ShoppingCart"
              circle
            />
            <el-button type="success" :icon="Notification" circle />
          </div>
        </el-menu>
      </div>
    </div>
    <!-- body -->
    <div class="max-w-[1400px] mx-auto">
      <Curacel />
    </div>
    <div class="max-w-[1400px] mx-auto flex items-center justify-center">
      <div class="mt-4">
        <el-input
          v-model="searchQuery"
          style="width: 600px"
          placeholder="Search by name or price"
          class="input-with-select"
          @input="fetchProducts"
        >
          <template #prepend>
            <el-button :icon="Search" />
          </template>
          <template #append>
            <el-select
              v-model="selectedCategory"
              placeholder="Filter by category"
              style="width: 160px"
              @change="fetchProducts"
            >
              <el-option label="All Categories" value="">
                <!-- Added All Categories option -->
              </el-option>
              <el-option
                v-for="category in categories"
                :key="category.id"
                :label="category.name"
                :value="category.id"
              />
              <el-option label="Clear Filter" value="clear">
                <!-- Option to clear the filter -->
              </el-option>
            </el-select>
          </template>
        </el-input>
      </div>
    </div>
    <div class="max-w-[1400px] mx-auto p-5 grid grid-cols-4 space-x-3 gap-y-3">
      <div
        v-for="product in filteredProducts"
        :key="product"
        class="w-[300px] h-auto bg-white rounded-lg shadow-lg hover:shadow-md overflow-hidden"
      >
        <div class="w-full h-[350px] overflow-hidden">
          <img
            class="w-full h-full object-cover"
            :src="getImageUrl(product.image)"
            alt=""
          />
        </div>
        <div class="bg-white p-3 flex flex-col items-start space-y-2">
          <div class="w-full">
            <div>
              <h2 class="py-2">
                {{ product.name }}
              </h2>
            </div>
            <div class="flex items-center justify-between w-full">
              <el-tag type="success">Code : #{{ product.code }}</el-tag>
              <el-tag size="large" effect="dark" type="success"
                >Price: $ {{ product.price }}</el-tag
              >
            </div>
          </div>
          <el-divider />

          <el-tag type="primary"> {{ product.category.name }} </el-tag>
          <el-button @click="addToCart(product.id)" type="primary"
            >Add To Card</el-button
          >
        </div>
      </div>
    </div>
    <el-drawer v-model="drawer" title="I am the title" :with-header="false">
      <div>
        <h2>Your Cart</h2>
        <ul v-if="cartItems.length > 0">
          <li v-for="item in cartItems" :key="item.id">
            <div>
              Product Name: {{ item.product ? item.product.name : "Unknown" }}
            </div>
            <div>Quantity: {{ item.quantity }}</div>
            <div>
              Price: ${{ item.product ? item.product.price : "Unknown" }}
            </div>
            <div>
              Category:
              {{
                item.product && item.product.category
                  ? item.product.category.name
                  : "Unknown"
              }}
            </div>
            <div>
              <img
                :src="item.product ? item.product.image : ''"
                alt="Product Image"
                style="max-width: 100px; height: auto"
              />
            </div>
          </li>
        </ul>
        <p v-else>No items in your cart.</p>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import Curacel from "../views/Curacel.vue";
import axiosInstance from "../api/index"; // Adjust the path to your axios instance

import { ref, onMounted } from "vue";
import {
  Check,
  Delete,
  Edit,
  Message,
  Star,
  ShoppingCart,
  Notification,
  Search,
} from "@element-plus/icons-vue";

const activeIndex = ref("1");

const handleSelect = () => {
  console.log(key, keyPath);
};

const searchQuery = ref("");
const selectedCategory = ref(null);
const products = ref([]);
const categories = ref([]);
const filteredProducts = ref([]);

const fetchCategories = async () => {
  try {
    const response = await axiosInstance.get("/categories");
    categories.value = response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
};
const item = ref([]);

const FetchItems = async () => {
  try {
    const response = await axiosInstance.get("/cart");
    item.value = response.data;
  } catch (error) {
    console.error("Error fetching items:", error);
  }
};

const fetchProducts = async () => {
  try {
    const response = await axiosInstance.get("/products", {
      params: {
        search: searchQuery.value,
        category: selectedCategory.value || null, // Pass null if selectedCategory is empty
      },
    });
    products.value = response.data;
    filterProducts();
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};

const filterProducts = () => {
  let filtered = [...products.value];

  // Filter by search query
  if (searchQuery.value.trim() !== "") {
    filtered = filtered.filter(
      (product) =>
        product.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        product.price.toString().includes(searchQuery.value)
    );
  }

  // Filter by selected category, or show all if selectedCategory is empty
  if (selectedCategory.value && selectedCategory.value !== "clear") {
    filtered = filtered.filter(
      (product) => product.category_id === selectedCategory.value
    );
  }

  filteredProducts.value = filtered;
};

const getImageUrl = (imagePath) => {
  return `http://127.0.0.1:8000/storage/${imagePath}`; // Adjust the base URL as necessary
};
// Call the fetchProducts function when the component is mounted
onMounted(() => {
  fetchProducts();
  fetchUser();
  fetchCategories();
  addToCart();
  fetchCartItems();
});

const user = ref(null);

const fetchUser = async () => {
  try {
    const token = localStorage.getItem("token");
    console.log("Token:", token); // Log the token

    if (!token) {
      throw new Error("Token not found");
    }

    const response = await axiosInstance.get("/user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("User response:", response.data); // Log the response
    user.value = response.data;
  } catch (error) {
    console.error("Error fetching user:", error);
  }
};

const addToCart = async (productId, quantity) => {
  try {
    const response = await axiosInstance.post("/cart/add", {
      product_id: productId,
      quantity: 1,
    });

    console.log("Product added to cart:", response.data);
  } catch (error) {
    console.error("Error adding product to cart:", error);
  }
};

const drawer = ref(false);

const cartItems = ref([]);

// Fetch cart items from API
const fetchCartItems = async () => {
  try {
    const response = await axiosInstance.get("/cart");
    cartItems.value = response.data.cartItems;
  } catch (error) {
    console.error("Error fetching cart items:", error);
  }
};
</script>

<style>
.flex-grow {
  flex-grow: 1;
}
</style>
