<template>
  <div class="PatternBackground" />
</template>

<style lang="scss" scoped>
.PatternBackground {
  @apply fixed left-0 top-0 -z-10 h-screen w-screen bg-[#292524] opacity-20;

  background-size: 12px 12px;
  background-image: repeating-linear-gradient(
    45deg,
    #6366f1 0,
    #6366f1 1.2000000000000002px,
    #292524 0,
    #292524 50%
  );
}
</style>
