<template>
  <div class="BlurGlass" />
  <div class="BlurShape__1" />
  <div class="BlurShape__2" />
  <div class="BlurShape__3" />
  <div class="BlurShape__4" />
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.BlurGlass {
  @apply fixed w-screen h-screen top-0 left-0 -z-10 bg-stone-900/10 opacity-50;
}

.BlurShape__1 {
  @apply fixed top-1/2 left-1/2 w-96 h-96 bg-indigo-500/10 rounded-full -z-20 blur-2xl;

  animation: motion1 30s ease-out infinite alternate-reverse;
}

.BlurShape__2 {
  @apply fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/10 rounded-full -z-30 blur-2xl;

  animation: motion2 30s ease-in infinite alternate-reverse;
}

.BlurShape__3 {
  @apply fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full -z-40 blur-2xl;

  animation: motion3 30s ease infinite alternate-reverse;
}

.BlurShape__4 {
  @apply fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/10 rounded-full -z-50 blur-2xl;

  animation: motion1 30s ease-out infinite alternate-reverse;
}

@keyframes motion1 {
  0% {
    opacity: 0.25;
    transform: translate(-50%, -60%);
    width: 100px;
    height: 300px;
  }
  25% {
    opacity: 0.25;
    transform: translate(-25%, -60%);
    width: 300px;
    height: 300px;
  }
  50% {
    opacity: 0.4;
    transform: translate(-50%, -50%);
    width: 450px;
    height: 550px;
  }
  75% {
    opacity: 0.5;
    transform: translate(-15%, -15%);
    width: 500px;
    height: 500px;
  }
  100% {
    opacity: 0.25;
    transform: translate(-10%, -10%);
    width: 100px;
    height: 100px;
  }
}

@keyframes motion2 {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%);
    width: 300px;
    height: 300px;
  }
  25% {
    opacity: 0.25;
    transform: translate(-70%, 0%);
    width: 500px;
    height: 500px;
  }
  50% {
    opacity: 0.4;
    transform: translate(-80%, -10%);
    width: 200px;
    height: 200px;
  }
  75% {
    opacity: 0.5;
    transform: translate(-70%, 0%);
    width: 500px;
    height: 500px;
  }
  100% {
    opacity: 0;
    transform: translate(-50%, 0%);
    width: 300px;
    height: 500px;
  }
}

@keyframes motion3 {
  0% {
    opacity: 0.25;
    transform: translate(-50%, -50%);
    width: 100px;
    height: 100px;
  }

  25% {
    opacity: 0.25;
    transform: translate(-25%, -25%);
    width: 40px;
    height: 400px;
  }

  50% {
    opacity: 0.4;
    transform: translate(-60%, -60%);
    width: 750px;
    height: 750px;
  }

  75% {
    opacity: 0.5;
    transform: translate(-50%, -50%);
    width: 500px;
    height: 500px;
  }

  100% {
    opacity: 0.25;
    transform: translate(-80%, -80%);
    width: 100px;
    height: 100px;
  }
}

@keyframes motion4 {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%);
    width: 100px;
    height: 100px;
  }

  25% {
    opacity: 0.25;
    transform: translate(-25%, -25%);
    width: 800px;
    height: 800px;
  }

  50% {
    opacity: 0.4;
    transform: translate(-60%, -60%);
    width: 750px;
    height: 750px;
  }

  75% {
    opacity: 0.5;
    transform: translate(-50%, -50%);
    width: 500px;
    height: 500px;
  }

  100% {
    opacity: 0.25;
    transform: translate(-50%, -50%);
    width: 100px;
    height: 100px;
  }
}
</style>
