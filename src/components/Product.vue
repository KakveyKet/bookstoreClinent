<template>
  <div class="w-full p-5 space-y-3 relative">
    <div class="w-fit p-5 rounded-lg shadow-lg border overflow-auto space-x-3">
      <el-input
        v-model="searchQuery"
        style="width: 240px"
        size="large"
        placeholder="Search by name or price..."
      />
      <el-button type="primary" size="large" @click="handleAdd">
        Add New Product
      </el-button>
    </div>

    <div
      class="w-full max-w-[1240px] h-[700px] p-5 rounded-lg shadow-lg border overflow-auto"
    >
      <table>
        <tr class="font-bold">
          <td class="min-w-[10px] text-center">No</td>
          <td class="min-w-[200px]">Name</td>
          <td class="min-w-[200px]">Category</td>
          <td class="min-w-[200px]">Image</td>
          <td class="min-w-[200px]">Price</td>
          <td class="min-w-[10px] text-center">Action</td>
        </tr>
        <tr v-for="(product, index) in filteredProducts" :key="product.id">
          <td class="min-w-[10px] text-center">{{ index + 1 }}</td>
          <td class="min-w-[200px]">{{ product.name }}</td>
          <td class="min-w-[200px]">{{ product.category.name }}</td>
          <td class="min-w-[200px]">
            <img
              v-if="getImageUrl(product.image)"
              class="w-32 h-40 object-cover"
              :src="getImageUrl(product.image)"
              alt=""
            />
            <img
              v-else
              class="w-32 h-32"
              src="https://placehold.co/400"
              alt="Placeholder image"
            />
          </td>
          <td class="min-w-[200px]">{{ product.price }} $</td>
          <td>
            <div class="flex items-center gap-3 justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6 text-primary2 cursor-pointer"
                @click="handleEditProduct(product)"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6 text-red-500 cursor-pointer"
                @click="confirmDelete(product.id)"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>
            </div>
          </td>
        </tr>
      </table>
      <el-dialog
        v-model="dialogVisible"
        width="500"
        :before-close="handleClose"
      >
        <div>
          <component
            v-if="currentComponent === 'ProductFormVue'"
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
import axiosInstance from "../api/index"; // Adjust the path to your axios instance
import { ref, computed, onMounted } from "vue";
import ProductFormVue from "../form/ProductForm.vue";
import { ElMessageBox } from "element-plus"; // Import ElMessageBox for delete confirmation

export default {
  components: {
    ProductFormVue,
  },
  setup() {
    const products = ref([]);
    const categories = ref([]);
    const searchQuery = ref("");
    const dialogVisible = ref(false);
    const currentComponent = ref("");
    const itemtoedit = ref(null);

    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get("/products");
        products.value = response.data;
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get("/categories");
        categories.value = response.data;
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const getImageUrl = (imagePath) => {
      return `http://127.0.0.1:8000/storage/${imagePath}`; // Adjust the base URL as necessary
    };

    const filteredProducts = computed(() => {
      return products.value.filter((product) => {
        const searchLower = searchQuery.value.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(searchLower);
        const matchesPrice = product.price
          .toString()
          .includes(searchQuery.value);
        return matchesName || matchesPrice;
      });
    });

    const handleClose = () => {
      dialogVisible.value = false;
      currentComponent.value = "";
      itemtoedit.value = null;
    };

    const handleEditProduct = (product) => {
      itemtoedit.value = product;
      dialogVisible.value = true;
      currentComponent.value = "ProductFormVue";
    };

    const confirmDelete = (productId) => {
      ElMessageBox.confirm(
        "Are you sure you want to delete this product?",
        "Delete Confirmation",
        {
          confirmButtonText: "Delete",
          cancelButtonText: "Cancel",
          type: "warning",
        }
      )
        .then(() => {
          deleteProduct(productId);
        })
        .catch(() => {
          // Cancel action
        });
    };

    const deleteProduct = async (productId) => {
      try {
        await axiosInstance.delete(`/products/${productId}`);
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    };

    const handleAdd = () => {
      dialogVisible.value = true;
      currentComponent.value = "ProductFormVue";
    };

    onMounted(() => {
      fetchProducts();
      fetchCategories();
    });

    return {
      products,
      categories,
      searchQuery,
      getImageUrl,
      dialogVisible,
      handleAdd,
      currentComponent,
      handleClose,
      handleEditProduct,
      itemtoedit,
      filteredProducts,
      confirmDelete, // Ensure confirmDelete is included in the return object
    };
  },
};
</script>

<style></style>
