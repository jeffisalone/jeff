<template>
 <TextType
  :text="['你好！我是交院大明白，交通学院智能助手。有什么我可以帮助你的吗？',
  '崇实 尚善 弘毅 求精',
  '团结 勤奋 务实 创新',
  '厚德 博学 严谨 敬业'
  ]"
  :typingSpeed="75"
  :pauseDuration="3500"
  :showCursor="true"
  cursorCharacter="▌"
/>
</template>

<script setup lang="ts">
  import TextType from "../bits/TextType.vue";
</script>
