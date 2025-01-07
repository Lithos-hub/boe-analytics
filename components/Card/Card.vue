<template>
  <div class="Card">
    <slot />
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.Card {
  @apply p-5 rounded-lg backdrop-blur border border-primary/50 bg-gradient-to-tl from-transparent to-primary-500/10 shadow-xl;
}
</style>
