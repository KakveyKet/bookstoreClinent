<template>
  <el-carousel indicator-position="outside">
    <el-carousel-item v-for="(image, index) in images" :key="index">
      <img :src="image" alt="carousel image" class="carousel-image" />
    </el-carousel-item>
  </el-carousel>
</template>

<script>
export default {
  setup() {
    const images = [
      "https://images.unsplash.com/photo-1629998867511-c0ae031398b3?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1524311583145-d5593bd3502a?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1710846929336-df391424377d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1459369510627-9efbee1e6051?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ];

    return {
      images,
    };
  },
};
</script>
<style scoped>
.carousel-image {
  width: 100%;
  height: 300px;
  object-fit: cover;
}
</style>
