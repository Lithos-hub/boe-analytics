<template>
  <div class="Card">
    <slot />
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.Card {
  @apply p-5 rounded-lg bg-[#101010] border border-primary/50 bg-gradient-to-tl from-dark-1 to-primary-500/10;
}
</style>
