<template>
  <div class="w-full p-5">
    <div class="mt-12 grid gap-y-10 gap-x-6 grid-cols-2 max-w-[1000px] ml-4">
      <div
        class="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md"
      >
        <div
          class="bg-clip-border mx-4 rounded-xl overflow-hidden bg-gradient-to-tr from-blue-600 to-blue-400 text-white shadow-blue-500/40 shadow-lg absolute -mt-4 grid h-16 w-16 place-items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="size-6"
          >
            <path
              d="M3.375 3C2.339 3 1.5 3.84 1.5 4.875v.75c0 1.036.84 1.875 1.875 1.875h17.25c1.035 0 1.875-.84 1.875-1.875v-.75C22.5 3.839 21.66 3 20.625 3H3.375Z"
            />
            <path
              fill-rule="evenodd"
              d="m3.087 9 .54 9.176A3 3 0 0 0 6.62 21h10.757a3 3 0 0 0 2.995-2.824L20.913 9H3.087Zm6.163 3.75A.75.75 0 0 1 10 12h4a.75.75 0 0 1 0 1.5h-4a.75.75 0 0 1-.75-.75Z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <div class="p-4 text-right">
          <p
            class="block antialiased font-sans text-sm leading-normal font-normal text-blue-gray-600"
          >
            Products
          </p>
          <h4
            class="block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900"
          >
            {{ products.length }}
          </h4>
        </div>
      </div>
      <div
        class="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md"
      >
        <div
          class="bg-clip-border mx-4 rounded-xl overflow-hidden bg-gradient-to-tr from-pink-600 to-pink-400 text-white shadow-pink-500/40 shadow-lg absolute -mt-4 grid h-16 w-16 place-items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="size-6"
          >
            <path
              fill-rule="evenodd"
              d="M5.25 2.25a3 3 0 0 0-3 3v4.318a3 3 0 0 0 .879 2.121l9.58 9.581c.92.92 2.39 1.186 3.548.428a18.849 18.849 0 0 0 5.441-5.44c.758-1.16.492-2.629-.428-3.548l-9.58-9.581a3 3 0 0 0-2.122-.879H5.25ZM6.375 7.5a1.125 1.125 0 1 0 0-2.25 1.125 1.125 0 0 0 0 2.25Z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <div class="p-4 text-right">
          <p
            class="block antialiased font-sans text-sm leading-normal font-normal text-blue-gray-600"
          >
            Category
          </p>
          <h4
            class="block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900"
          >
            {{ categories.length }}
          </h4>
        </div>
      </div>
      <div
        class="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md"
      >
        <div
          class="bg-clip-border mx-4 rounded-xl overflow-hidden bg-gradient-to-tr from-green-600 to-green-400 text-white shadow-green-500/40 shadow-lg absolute -mt-4 grid h-16 w-16 place-items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="size-6"
          >
            <path
              d="M2.25 2.25a.75.75 0 0 0 0 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 0 0-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 0 0 0-1.5H5.378A2.25 2.25 0 0 1 7.5 15h11.218a.75.75 0 0 0 .674-.421 60.358 60.358 0 0 0 2.96-7.228.75.75 0 0 0-.525-.965A60.864 60.864 0 0 0 5.68 4.509l-.232-.867A1.875 1.875 0 0 0 3.636 2.25H2.25ZM3.75 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM16.5 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z"
            />
          </svg>
        </div>
        <div class="p-4 text-right">
          <p
            class="block antialiased font-sans text-sm leading-normal font-normal text-blue-gray-600"
          >
            Today Order
          </p>
          <h4
            class="block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900"
          >
            {{ purchasesToday.length }}
          </h4>
        </div>
      </div>
      <div
        class="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md"
      >
        <div
          class="bg-clip-border mx-4 rounded-xl overflow-hidden bg-gradient-to-tr from-orange-600 to-orange-400 text-white shadow-orange-500/40 shadow-lg absolute -mt-4 grid h-16 w-16 place-items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="size-6"
          >
            <path
              d="M10.464 8.746c.227-.18.497-.311.786-.394v2.795a2.252 2.252 0 0 1-.786-.393c-.394-.313-.546-.681-.546-1.004 0-.323.152-.691.546-1.004ZM12.75 15.662v-2.824c.347.085.664.228.921.421.427.32.579.686.579.991 0 .305-.152.671-.579.991a2.534 2.534 0 0 1-.921.42Z"
            />
            <path
              fill-rule="evenodd"
              d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v.816a3.836 3.836 0 0 0-1.72.756c-.712.566-1.112 1.35-1.112 2.178 0 .829.4 1.612 1.113 2.178.502.4 1.102.647 1.719.756v2.978a2.536 2.536 0 0 1-.921-.421l-.879-.66a.75.75 0 0 0-.9 1.2l.879.66c.533.4 1.169.645 1.821.75V18a.75.75 0 0 0 1.5 0v-.81a4.124 4.124 0 0 0 1.821-.749c.745-.559 1.179-1.344 1.179-2.191 0-.847-.434-1.632-1.179-2.191a4.122 4.122 0 0 0-1.821-.75V8.354c.29.082.559.213.786.393l.415.33a.75.75 0 0 0 .933-1.175l-.415-.33a3.836 3.836 0 0 0-1.719-.755V6Z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <div class="p-4 text-right">
          <p
            class="block antialiased font-sans text-sm leading-normal font-normal text-blue-gray-600"
          >
            Punchase
          </p>
          <h4
            class="block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900"
          >
            {{ purchases.length }}
          </h4>
        </div>
      </div>
      <div
        class="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md"
      >
        <div
          class="bg-clip-border mx-4 rounded-xl overflow-hidden bg-gradient-to-tr from-indigo-600 to-indigo-400 text-white shadow-indigo-500/40 shadow-lg absolute -mt-4 grid h-16 w-16 place-items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="size-6"
          >
            <path
              fill-rule="evenodd"
              d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <div class="p-4 text-right">
          <p
            class="block antialiased font-sans text-sm leading-normal font-normal text-blue-gray-600"
          >
            Users
          </p>
          <h4
            class="block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900"
          >
            {{ users.length }}
          </h4>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import axiosInstance from "../api/index";
const purchases = ref([]);

const getAllPurchases = async () => {
  try {
    const response = await axiosInstance.get("/purchases");
    purchases.value = response.data.purchases;
  } catch (error) {
    console.error("Error fetching purchases:", error);
  }
};
const categories = ref([]);
const fetchCategories = async () => {
  try {
    const response = await axiosInstance.get("/categories");
    categories.value = response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
};
const products = ref([]);
const fetchProducts = async () => {
  try {
    const response = await axiosInstance.get("/products");
    products.value = response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};
const purchasesToday = ref([]);

const getAllPurchasesToday = async () => {
  try {
    const response = await axiosInstance.get("/purchases");
    const allPurchases = response.data.purchases;

    // Get today's date in UTC format
    const today = new Date().toISOString().slice(0, 10);

    // Filter purchases for today's date
    const purchasesTodayFiltered = allPurchases.filter((purchase) => {
      // Assuming created_at is in ISO 8601 format (e.g., "2024-07-11T08:30:00Z")
      const createdAtDate = new Date(purchase.created_at)
        .toISOString()
        .slice(0, 10); // Convert created_at to ISO format and extract date part

      return createdAtDate === today;
    });

    // Set purchasesToday.value to filtered purchases
    purchasesToday.value = purchasesTodayFiltered;
  } catch (error) {
    console.error("Error fetching purchases:", error);
  }
};
const users = ref([]);

const fetchUsers = async () => {
  try {
    const response = await axiosInstance.get("/users");
    users.value = response.data.filter((user) => user.rols === "customer");
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};

onMounted(() => {
  fetchProducts();
  getAllPurchases();
  fetchCategories();
  getAllPurchasesToday();
  fetchUsers();
});
</script>

<style></style>
