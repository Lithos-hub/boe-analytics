<template>
  <div class="Card">
    <slot />
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.Card {
  @apply p-5 rounded-lg bg-[#101010] border border-t-[#202020] border-r-[#070707] border-b-[#050505] border-l-[#101010] bg-gradient-to-br from-[#152020] to-[#000505];

  box-shadow: 31px 31px 62px #010209, -31px -31px 62px #030a25;
}
</style>
