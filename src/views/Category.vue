<template>
  <div class="w-full p-5 space-y-3 relative">
    <!-- Search Input -->
    <div class="w-fit p-5 rounded-lg shadow-lg border overflow-auto space-x-3">
      <el-input
        v-model="searchQuery"
        style="width: 240px"
        size="large"
        placeholder="Search by name..."
      />
      <el-button type="primary" size="large" @click="handleAdd">
        Add New Category
      </el-button>
    </div>

    <!-- Category Table -->
    <div
      class="w-full max-w-[1000px] h-[700px] p-5 rounded-lg shadow-lg border overflow-auto"
    >
      <table class="w-full table-auto">
        <thead>
          <tr class="bg-gray-200">
            <th class="py-2 px-4 text-left">No</th>
            <th class="py-2 px-4 text-left">Name</th>
            <th class="py-2 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(category, index) in filteredCategories"
            :key="category.id"
          >
            <td class="py-2 px-4">{{ index + 1 }}</td>
            <td class="py-2 px-4">{{ category.name }}</td>
            <td class="py-2 px-4">
              <button
                @click="handleEditCategory(category)"
                class="text-indigo-600 hover:text-indigo-900"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-6 text-primary2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                  />
                </svg>
              </button>
              <button
                @click="confirmDelete(category.id)"
                class="text-red-600 hover:text-red-900 ml-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-6 text-red-500"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                  />
                </svg>
              </button>
            </td>
          </tr>
          <tr v-if="filteredCategories.length === 0">
            <td colspan="3" class="py-4 px-4 text-center text-gray-500">
              No categories found
            </td>
          </tr>
        </tbody>
      </table>
      <!-- Add/Edit Category Dialog -->
      <el-dialog
        v-model="dialogVisible"
        width="500"
        :before-close="handleClose"
      >
        <div>
          <component
            :itemtoedit="itemtoedit"
            @close="handleClose"
            :is="currentComponent"
          ></component>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { ref, onMounted, computed } from "vue";
import axiosInstance from "../api/index";
import CategoryForm from "../form/CategoryFrom.vue";
import { ElMessageBox } from "element-plus"; // Import ElMessageBox for delete confirmation

export default {
  components: {
    CategoryForm,
  },
  setup() {
    const confirmDelete = (categoryId) => {
      ElMessageBox.confirm(
        "Are you sure you want to delete this category?",
        "Delete Confirmation",
        {
          confirmButtonText: "Delete",
          cancelButtonText: "Cancel",
          type: "warning",
        }
      )
        .then(() => {
          deleteCategory(categoryId);
        })
        .catch(() => {
          // Cancel action
        });
    };
    const categories = ref([]);
    const searchQuery = ref("");
    const dialogVisible = ref(false);
    const currentComponent = ref("");
    const dialogTitle = ref("Add/Edit Category");

    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get("/categories");
        categories.value = response.data;
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const filteredCategories = computed(() => {
      if (!searchQuery.value) {
        return categories.value;
      }
      const query = searchQuery.value.toLowerCase();
      return categories.value.filter((category) =>
        category.name.toLowerCase().includes(query)
      );
    });
    const itemtoedit = ref(null);
    const handleEditCategory = (category) => {
      dialogVisible.value = true;
      currentComponent.value = "CategoryForm";
      itemtoedit.value = category;
    };

    const deleteCategory = async (categoryId) => {
      try {
        await axiosInstance.delete(`/categories/${categoryId}`);
        fetchCategories();
      } catch (error) {
        console.error("Error deleting category:", error);
      }
    };

    const handleAdd = () => {
      dialogVisible.value = true;
      currentComponent.value = "CategoryForm";
      dialogTitle.value = "Add New Category";
      // Optionally, you can handle adding a new category here
    };

    const handleClose = () => {
      dialogVisible.value = false;
      currentComponent.value = "";
      dialogTitle.value = "Add/Edit Category"; // Reset dialog title
      fetchCategories(); // Refresh categories after closing dialog
    };
    console.log(itemtoedit);
    onMounted(() => {
      fetchCategories();
    });

    return {
      categories,
      searchQuery,
      filteredCategories,
      dialogVisible,
      currentComponent,
      dialogTitle,
      handleEditCategory,
      deleteCategory,
      handleAdd,
      handleClose,
      confirmDelete,
      itemtoedit,
    };
  },
};
</script>

<style></style>
