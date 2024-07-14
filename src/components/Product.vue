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
      class="w-full max-w-[1240px] h-[650px] overflow-auto p-5 rounded-lg shadow-lg border"
    >
      <table class="w-full">
        <thead>
          <tr class="font-bold">
            <th class="text-center">No</th>
            <th>Name</th>
            <th>Category</th>
            <th>Image</th>
            <th>Price</th>
            <th class="text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(product, index) in paginatedProducts" :key="product.id">
            <td class="text-center">
              {{ (currentPage - 1) * pageSize + index + 1 }}
            </td>
            <td>{{ product.name }}</td>
            <td>{{ product.category.name }}</td>
            <td>
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
            <td>{{ product.price }} $</td>
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
        </tbody>
      </table>

      <el-dialog
        v-model="dialogVisible"
        width="500"
        :before-close="handleClose"
      >
        <component
          v-if="currentComponent === 'ProductFormVue'"
          :itemtoedit="itemtoedit"
          @close="handleClose"
          :is="currentComponent"
        ></component>
      </el-dialog>
    </div>
    <el-pagination
      class="mt-5"
      @current-change="handlePageChange"
      :current-page.sync="currentPage"
      :page-size="pageSize"
      layout="prev, pager, next"
      :total="filteredProducts.length"
    />
  </div>
</template>

<script>
import axiosInstance from "../api/index";
import { ref, computed, onMounted } from "vue";
import ProductFormVue from "../form/ProductForm.vue";
import { ElMessageBox, ElNotification } from "element-plus";

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
    const currentPage = ref(1);
    const pageSize = ref(5); // Number of items per page

    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get("/products");
        products.value = response.data;
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    const getImageUrl = (imagePath) => {
      return `http://127.0.0.1:8000/storage/${imagePath}`;
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

    const paginatedProducts = computed(() => {
      const startIndex = (currentPage.value - 1) * pageSize.value;
      return filteredProducts.value.slice(
        startIndex,
        startIndex + pageSize.value
      );
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
        ElNotification({
          title: "Success",
          message: "Product deleted successfully",
          type: "success",
        });
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    };

    const handlePageChange = (newPage) => {
      currentPage.value = newPage;
    };

    const handleAdd = () => {
      dialogVisible.value = true;
      currentComponent.value = "ProductFormVue";
    };

    onMounted(() => {
      fetchProducts();
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
      paginatedProducts,
      confirmDelete,
      currentPage,
      pageSize,
      handlePageChange,
    };
  },
};
</script>

<style></style>
