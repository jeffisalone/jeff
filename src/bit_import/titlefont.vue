<template>
  <TrueFocus
    sentence="交院 大明白"
    :manualMode="false"
    :blurAmount="5"
    borderColor="green"
    :animationDuration="2"
    :pauseBetweenAnimations="1"
  />
</template>

<script setup lang="ts">
  import TrueFocus from "../bits/RotatingText.vue";
</script>
