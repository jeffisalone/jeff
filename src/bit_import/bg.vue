<template>
  <div class="aurora-container">
    <Aurora
      :color-stops="['#7cff67', '#171D22', '#7cff67']"
      :amplitude="1.0"
      :blend="0.5"
      :speed="1.0"
      :intensity="1.0"
      class="w-full h-full"
    />
  </div>
</template>

<script setup lang="ts">
  import Aurora from "../bits/Prism.vue";
</script>

<style scoped>
  .aurora-container {
    width: 100%;
    height: 500px;
    position: relative;
    overflow: hidden;
  }
</style>
