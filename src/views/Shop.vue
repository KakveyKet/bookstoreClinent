<template>
  <div class="bg-white relative">
    <!-- head -->
    <div class="w-full bg-white shadow-lg sticky top-0 z-50">
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
          <div class="mr-4 space-x-3">
            <el-badge :value="cartItems.length" class="item">
              <el-button
                class="w-10 h-10"
                @click="handleDrawer"
                type="primary"
                :icon="ShoppingCart"
                circle
              />
            </el-badge>
            <el-badge class="item">
              <el-button
                @click="Istorydrawer"
                type="success"
                :icon="Notification"
                circle
              />
            </el-badge>
            <el-badge v-if="user" class="item">
              <el-button @click="logout" type="success" :icon="Back" circle />
            </el-badge>
            <router-link to="/userregister">
              <el-badge v-if="!user" class="item">
                <el-button type="success" :icon="UserFilled" circle />
              </el-badge>
            </router-link>
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
      <component :is="currentComponent" />
    </el-drawer>
    <el-drawer
      v-model="historydrawer"
      title="I am the title"
      :with-header="false"
    >
      <component :is="currentComponent" />
    </el-drawer>
  </div>
</template>

<script setup>
import Curacel from "../views/Curacel.vue";
import axiosInstance from "../api/index"; // Adjust the path to your axios instance
import CartItem from "../views/CartItem.vue";
import { ref, onMounted } from "vue";
import History from "../views/History.vue";
import { ElMessageBox } from "element-plus"; // Import ElMessageBox for delete confirmation

import { useRouter } from "vue-router";
import {
  Check,
  Delete,
  Edit,
  Message,
  Star,
  ShoppingCart,
  Notification,
  Search,
  Back,
  UserFilled,
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
  return `http://127.0.0.1:8000/storage/${imagePath}`;
};
onMounted(() => {
  fetchProducts();
  fetchUser();
  fetchCategories();
  fetchCartItems();
});

const user = ref(null);
const isAuthenticated = ref(false);

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
    isAuthenticated.value = true; // Set authenticated to true
  } catch (error) {
    console.error("Error fetching user:", error);
    isAuthenticated.value = false; // Set authenticated to false on error
  }
};

const cartItems = ref([]);
const addToCart = async (productId) => {
  try {
    await axiosInstance.post("/cart/add", {
      product_id: productId,
      quantity: 1,
    });
    fetchCartItems(); // Refresh cart items after addition
  } catch (error) {
    console.error(
      "Error adding item to cart:",
      error.response ? error.response.data : error.message
    );
  }
};
const fetchCartItems = async () => {
  try {
    const response = await axiosInstance.get("/cart");
    cartItems.value = response.data.cartItems;
  } catch (error) {
    console.error("Error fetching cart items:", error);
  }
};

const drawer = ref(false);
const historydrawer = ref(false);
const Istorydrawer = () => {
  currentComponent.value = History;
  historydrawer.value = true;
};
const currentComponent = ref(null);
const handleDrawer = () => {
  fetchCartItems();
  currentComponent.value = CartItem;
  drawer.value = true;
};

const router = useRouter();

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
      router.push("/userregister");
    }
  } catch (error) {
    if (error !== "cancel") {
      console.error("Error logging out:", error);
    }
  }
};
</script>

<style>
.flex-grow {
  flex-grow: 1;
}
</style>
