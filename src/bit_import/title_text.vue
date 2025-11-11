<template>
  <GradientText
    text="交院大明白"
    :colors="[ 'gray', '#0f0f0f']"
    :animation-speed="8"
    :show-border="false"
    class-name="your-custom-class"
  />
</template>

<script setup lang="ts">
  import GradientText from "../bits/GradientText.vue";
</script>
