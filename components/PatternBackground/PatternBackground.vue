<template>
  <div class="PatternBackground"></div>
</template>

<style lang="scss" scoped>
.PatternBackground {
  @apply fixed top-0 left-0 h-screen w-screen -z-10 bg-[#292524] opacity-20;

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
