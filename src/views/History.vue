<template>
  <div class="w-full p-5 space-y-3 relative">
    <!-- Search and Sort Controls -->
    <div
      v-if="displayedPurchases.length > 0"
      class="w-fit p-5 rounded-lg shadow-lg border overflow-auto space-x-3"
    >
      <el-input
        v-model="search"
        placeholder="Search by name"
        style="width: 240px"
        size="large"
      />
    </div>
    <div
      class="w-full max-w-[1240px] h-[700px] p-5 rounded-lg shadow-lg border overflow-auto"
    >
      <ul v-if="displayedPurchases.length > 0" class="space-y-4">
        <li
          v-for="(purchase, index) in displayedPurchases"
          :key="index"
          class="flex gap-3 p-2 bg-white rounded-lg shadow-lg items-center hover:shadow-md duration-300 relative"
        >
          <div>
            <img
              :src="getImageUrl(purchase.product_image)"
              alt="Product Image"
              style="max-width: 100px; height: auto"
            />
          </div>
          <div class="space-y-2">
            <div class="">
              Product Name: {{ purchase.product_name || "Unknown" }}
            </div>
            <div class="flex flex-col items-start gap-3">
              <el-tag size="large" effect="dark" type="success">
                Quantity: {{ purchase.quantity }}
              </el-tag>
              <el-button type="primary" round>
                Type:
                {{ purchase.category_name }}
                ${{ purchase.price }}
              </el-button>
            </div>
          </div>
        </li>
      </ul>

      <div v-else style="max-width: 600px" class="mt-3">
        <el-alert
          class="!h-16"
          title="No History , Please Go To Cart Enjoy the Shopping"
          type="error"
          :closable="false"
        />
      </div>
    </div>

    <!-- Pagination Controls -->
    <div
      v-if="displayedPurchases.length > 0"
      class="w-full flex justify-center items-center mt-5"
    >
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
  return userPurchases.value.slice(start, start + pageSize.value);
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
  fetchUser();
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

// Computed property for filtering purchases by the logged-in user
const userPurchases = computed(() => {
  if (!user.value) {
    return [];
  }
  return filteredPurchases.value.filter(
    (purchase) => purchase.user_name === user.value.name
  );
});
</script>

<style>
/* Optional styles */
</style>
