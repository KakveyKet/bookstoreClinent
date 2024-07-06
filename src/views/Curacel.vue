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
      "https://img.freepik.com/free-photo/close-up-brunette-woman-with-yellow-blouse_23-2148294091.jpg?t=st=1720273863~exp=1720277463~hmac=72284406bc9ca4617b9ab4082c1d8e60a47255b32a61b77a4cb680ca29a228f2&w=1380",
      "https://img.freepik.com/premium-photo/book-is-open-book-with-pages-open_1081342-9388.jpg?ga=GA1.1.1214285083.1710758670&semt=sph",
      "https://t4.ftcdn.net/jpg/03/36/06/77/240_F_336067790_fSLRKkgCrjcKQp7fSISEpPmtp5MTdLO8.jpg",
      "https://img.freepik.com/free-photo/close-up-hands-holding-open-book_23-2148882726.jpg?t=st=1720273898~exp=1720277498~hmac=d2640cab28212cf551f2f66e48f8136e378f359b2327616aacb342410a36da01&w=1480",
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
