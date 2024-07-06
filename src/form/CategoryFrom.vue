<template>
  <el-form :model="category" ref="categoryForm">
    <h2 class="text-heading2 py-4">
      {{ editref ? "Update Category" : "Create New Category" }}
    </h2>
    <el-form-item>
      <label for=""> Category Name </label>
      <el-input
        v-model="category.name"
        placeholder="Enter category name"
      ></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm">Save</el-button>
      <el-button @click="handleClose">Close</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { ref } from "vue";
import axiosInstance from "../api/index";

export default {
  props: ["itemtoedit"],
  setup(props, { emit }) {
    const category = ref({ name: "" });

    const submitForm = async () => {
      try {
        let response;
        if (props.itemtoedit) {
          response = await axiosInstance.put(
            `/categories/${props.itemtoedit.id}`,
            category.value
          );
        } else {
          response = await axiosInstance.post("/categories", category.value);
        }
        handleClose(); // Close the dialog after successful save
        // Optionally, emit an event or notify parent component about success
      } catch (error) {
        console.error("Error saving category:", error);
        // Optionally, display an error message to the user
      }
    };

    const handleClose = () => {
      emit("close"); // Emit a close event to the parent component
    };

    // If editing, populate the form with existing category data
    if (props.itemtoedit) {
      category.value = { ...props.itemtoedit }; // Clone the object to avoid direct mutation
    }
    const editref = props.itemtoedit;
    return {
      category,
      submitForm,
      handleClose,
      editref,
    };
  },
};
</script>

<style></style>
