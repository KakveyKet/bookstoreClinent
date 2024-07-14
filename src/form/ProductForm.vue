<template>
  <form @submit.prevent="saveProduct" class="space-y-4">
    <!-- Product Name -->
    <div>
      <label>Product Name</label>
      <br />
      <el-input
        v-model="name"
        style="width: 240px"
        size="large"
        placeholder="Name"
        required
      />
    </div>

    <div>
      <label>Product Price</label>
      <br />
      <el-input
        v-model="price"
        style="width: 240px"
        size="large"
        placeholder="Price"
        required
      />
    </div>

    <!-- Product Code -->
    <div>
      <label>Product Code</label>
      <br />
      <el-input
        v-model="code"
        style="width: 240px"
        size="large"
        placeholder="Code"
        required
      />
    </div>

    <!-- Product Image -->
    <div class="mb-4">
      <label for="image" class="block text-sm font-medium text-gray-700"
        >Product Image</label
      >
      <div class="mt-1">
        <input
          type="file"
          id="image"
          name="image"
          @change="handleFileUpload"
          accept="image/jpeg, image/png"
          class="py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm"
        />
      </div>
      <p class="mt-2 text-sm text-gray-500">
        JPG/PNG files with a size less than 500kb
      </p>
    </div>

    <!-- Category -->
    <div>
      <label>Category</label>
      <br />
      <el-select
        v-model="category_id"
        placeholder="Select category"
        style="width: 240px"
      >
        <el-option
          v-for="cat in categories"
          :key="cat.id"
          :label="cat.name"
          :value="cat.id"
        ></el-option>
      </el-select>
    </div>

    <!-- Submit Button -->
    <div>
      <el-button type="primary" native-type="submit">Save Product</el-button>
      <el-button type="danger" @click="handleClose">Cancel</el-button>
    </div>
  </form>
</template>

<script>
import axios from "axios";
import { ref, onMounted } from "vue";

export default {
  props: ["itemtoedit"],
  name: "ProductForm",
  setup(props, { emit }) {
    const name = ref("");
    const category_id = ref("");
    const price = ref("");
    const code = ref("");
    const image = ref(null);
    const categories = ref([]);
    const products = ref([]); // Define products as a reactive reference

    const handleFileUpload = (event) => {
      image.value = event.target.files[0];
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/categories"
        );
        categories.value = response.data;
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const saveProduct = async () => {
      const formData = new FormData();
      formData.append("name", name.value);
      formData.append("category_id", category_id.value);
      formData.append("price", price.value);
      formData.append("code", code.value);
      if (image.value) {
        formData.append("image", image.value);
      }

      try {
        let response;
        if (props.itemtoedit) {
          response = await axios.put(
            `http://127.0.0.1:8000/api/products/${props.itemtoedit.id}`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
        } else {
          response = await axios.post(
            "http://127.0.0.1:8000/api/products",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
        }

        console.log("Product saved:", response.data);

        // Update local state or data after successful update
        const updatedProduct = response.data;
        const index = products.value.findIndex(
          (p) => p.id === updatedProduct.id
        );
        if (index !== -1) {
          products.value.splice(index, 1, updatedProduct);
        } else {
          products.value.push(updatedProduct);
        }

        handleClose(); // Close the form after successful save
      } catch (error) {
        if (error.response && error.response.data) {
          console.error("Error saving product:", error.response.data);
        } else {
          console.error("Error saving product:", error.message);
        }
      }
    };

    const handleClose = () => {
      emit("close"); // Emit event to close the dialog or form
    };

    onMounted(async () => {
      fetchCategories();

      // Populate form fields if editing existing product
      if (props.itemtoedit) {
        name.value = props.itemtoedit.name;
        category_id.value = props.itemtoedit.category_id;
        price.value = props.itemtoedit.price;
        code.value = props.itemtoedit.code;
      }
    });

    return {
      name,
      category_id,
      price,
      code,
      image,
      categories,
      handleFileUpload,
      saveProduct,
      handleClose,
      products, // Include products in the returned setup object
    };
  },
};
</script>
