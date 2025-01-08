<template>
  <div class="Card">
    <slot />
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.Card {
  @apply border-primary/50 rounded-lg border bg-gradient-to-tl from-transparent to-primary-500/10 p-5 shadow-xl backdrop-blur;
}
</style>
