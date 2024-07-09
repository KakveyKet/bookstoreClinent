<template>
  <div class="w-full p-5 space-y-3 relative">
    <!-- Search and Sort Controls -->
    <div class="w-fit p-5 rounded-lg shadow-lg border overflow-auto space-x-3">
      <el-input
        v-model="search"
        placeholder="Search..."
        style="width: 240px"
        size="large"
      />
      <el-dropdown>
        <el-button type="primary"
          >Sort<el-icon class="el-icon--right"><arrow-down /></el-icon
        ></el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="sortByDate('asc')"
              >Sort by Date Asc</el-dropdown-item
            >
            <el-dropdown-item @click="sortByDate('desc')"
              >Sort by Date Desc</el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <!-- Purchase List -->
    <div
      class="w-full max-w-[1240px] h-[700px] p-5 rounded-lg shadow-lg border overflow-auto"
    >
      <table class="w-full table-auto">
        <thead>
          <tr class="bg-gray-200">
            <th class="py-2 px-4 text-left">No</th>
            <th class="py-2 px-4 text-left">Date</th>
            <th class="py-2 px-4 text-left">User Name</th>
            <th class="py-2 px-4 text-left">Product Name</th>
            <th class="py-2 px-4 text-left">Product Price</th>
            <th class="py-2 px-4 text-left">Quantity</th>
            <th class="py-2 px-4 text-left">Image</th>
            <th class="py-2 px-4 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(purchase, index) in displayedPurchases"
            :key="purchase.id"
          >
            <td class="py-2 px-4">{{ index + 1 }}</td>
            <td class="py-2 px-4">{{ formatDate(purchase.created_at) }}</td>
            <td class="py-2 px-4">{{ purchase.user_name || "Unknown" }}</td>
            <td class="py-2 px-4">{{ purchase.product_name || "Unknown" }}</td>
            <td class="py-2 px-4">$ {{ purchase.price || "Unknown" }}</td>
            <td class="py-2 px-4">{{ purchase.quantity }}</td>
            <td class="py-2 px-4">
              <img
                class="w-32 h-40"
                :src="getImageUrl(purchase.product_image)"
                alt=""
              />
            </td>
            <td class="py-2 px-4">
              <button
                @click="confirmDelete(purchase.id)"
                class="text-red-600 hover:text-red-900 ml-2"
              >
                Delete
              </button>
            </td>
          </tr>
          <tr v-if="displayedPurchases.length === 0">
            <td colspan="8" class="py-4 px-4 text-center text-gray-500">
              No purchases found
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination Controls -->
    <div class="w-full flex justify-center items-center mt-5">
      <el-pagination
        v-model="currentPage"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="pageSize"
        layout="sizes, prev, pager, next, jumper"
        :total="filteredPurchases.length"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axiosInstance from "../api/index"; // Adjust import path
import { ElMessageBox, ElPagination } from "element-plus"; // Import ElMessageBox and ElPagination

const purchases = ref([]);
const search = ref("");
const currentPage = ref(1);
const pageSize = ref(5); // Initial page size
const sortOrder = ref("asc"); // Initial sort order

// Fetch all purchases from API
const getAllPurchases = async () => {
  try {
    const response = await axiosInstance.get("/purchases");
    purchases.value = response.data.purchases;
  } catch (error) {
    console.error("Error fetching purchases:", error);
  }
};

// Delete purchase by ID
const deletePurchaseById = async (purchaseId) => {
  try {
    await axiosInstance.delete(`/purchases/${purchaseId}`);
    purchases.value = purchases.value.filter(
      (purchase) => purchase.id !== purchaseId
    );
  } catch (error) {
    console.error(`Error deleting purchase ${purchaseId}:`, error);
  }
};

// Get image URL helper function
const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return ""; // Handle case where imagePath is null or undefined
  }
  return `http://127.0.0.1:8000${imagePath}`;
};

// Confirm delete action with confirmation dialog
const confirmDelete = async (purchaseId) => {
  ElMessageBox.confirm(
    "Are you sure you want to delete this purchase?",
    "Delete Confirmation",
    {
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      type: "warning",
    }
  )
    .then(async () => {
      // Perform delete request
      try {
        await axiosInstance.delete(`/purchases/${purchaseId}`);
        purchases.value = purchases.value.filter(
          (purchase) => purchase.id !== purchaseId
        );
        // Optionally show a success message or update UI
      } catch (error) {
        console.error(`Error deleting purchase ${purchaseId}:`, error);
        // Handle delete error as needed
      }
    })
    .catch(() => {
      // Cancel action
    });
};

// Function to format the date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString(); // Format to human-readable string
};

// Function to sort purchases by date
const sortByDate = (order) => {
  sortOrder.value = order;
};

// Computed property for filtered and sorted purchases based on search term and sort order
const filteredPurchases = computed(() => {
  const searchTerm = search.value.toLowerCase();
  return purchases.value
    .filter(
      (purchase) =>
        purchase.product_name.toLowerCase().includes(searchTerm) ||
        purchase.category_name.toLowerCase().includes(searchTerm) ||
        purchase.user_name.toLowerCase().includes(searchTerm)
    )
    .sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      if (sortOrder.value === "asc") {
        return dateA - dateB;
      } else {
        return dateB - dateA;
      }
    });
});

// Computed property for displaying purchases based on pagination
const displayedPurchases = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return filteredPurchases.value.slice(start, start + pageSize.value);
});

// Methods for handling pagination events
const handleSizeChange = (newSize) => {
  pageSize.value = newSize;
  currentPage.value = 1; // Reset to first page when page size changes
};

const handlePageChange = (newPage) => {
  currentPage.value = newPage;
};

// Fetch data on component mount
onMounted(() => {
  getAllPurchases();
});

console.log(purchases);
</script>

<style>
/* Optional styles */
</style>
