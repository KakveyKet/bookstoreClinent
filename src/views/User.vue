<template>
  <div class="w-full p-5 space-y-3 relative">
    <!-- Search Input -->
    <div class="flex justify-between items-center w-[400px]">
      <el-input
        v-model="searchQuery"
        placeholder="Search by name or email"
        clearable
        @input="handleSearch"
      ></el-input>
    </div>

    <!-- Users Table -->
    <div
      class="w-full max-w-[1000px] h-[700px] p-5 rounded-lg shadow-lg border overflow-auto mt-4"
    >
      <table class="w-full table-auto">
        <thead>
          <tr class="bg-gray-200">
            <th class="py-2 px-4 text-left">No</th>
            <th class="py-2 px-4 text-left">Name</th>
            <th class="py-2 px-4 text-left">Email</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, index) in paginatedUsers" :key="user.id">
            <td class="py-2 px-4">
              {{ index + 1 + (currentPage - 1) * pageSize }}
            </td>
            <td class="py-2 px-4">{{ user.name }}</td>
            <td class="py-2 px-4">{{ user.email }}</td>
          </tr>
          <tr v-if="paginatedUsers.length === 0">
            <td colspan="3" class="py-4 px-4 text-center text-gray-500">
              No users found
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="flex justify-start mt-4">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="filteredUsers.length"
        :page-size="pageSize"
        @current-change="handlePageChange"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import axiosInstance from "../api/index";

export default {
  setup() {
    const users = ref([]);
    const searchQuery = ref("");
    const currentPage = ref(1);
    const pageSize = ref(10);

    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get("/users");
        users.value = response.data;
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    const filteredUsers = computed(() => {
      const filteredByRole = users.value.filter(
        (user) => user.rols === "customer"
      );
      if (!searchQuery.value.trim()) {
        return filteredByRole;
      }
      return filteredByRole.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.value.toLowerCase())
      );
    });

    const paginatedUsers = computed(() => {
      const start = (currentPage.value - 1) * pageSize.value;
      const end = start + pageSize.value;
      return filteredUsers.value.slice(start, end);
    });

    const handlePageChange = (page) => {
      currentPage.value = page;
    };

    const handleSearch = () => {
      currentPage.value = 1; // Reset to first page on new search
    };

    onMounted(() => {
      fetchUsers();
    });

    return {
      users,
      searchQuery,
      currentPage,
      pageSize,
      filteredUsers,
      paginatedUsers,
      handlePageChange,
      handleSearch,
    };
  },
};
</script>

<style>
/* Add your styles here if needed */
</style>
