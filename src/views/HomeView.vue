<template>
  <div class="relative flex">
    <SidebarVue />
    <div class="w-full">
      <NavbarVue />
      <div class="w-full h-screen bg-default"><router-view></router-view></div>
    </div>
  </div>
</template>
<script>
import NavbarVue from "../components/Navbar.vue";
import SidebarVue from "../components/Sidebar.vue";
export default {
  components: {
    SidebarVue,
    NavbarVue,
  },
};
</script>
