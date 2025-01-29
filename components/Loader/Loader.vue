<template>
  <div class="flex flex-col items-center justify-center gap-5">
    <div class="loader" />
    <small class="text-center text-xs text-primary-200" v-if="statusMessages">
      {{ statusMessages[currentMessageIndex] }}
    </small>
  </div>
</template>

<script setup lang="ts">
import type { LoaderProps } from './Loader.interfaces';

const { statusMessages } = defineProps<LoaderProps>();

const currentMessageIndex = ref(0);

onMounted(() => {
  setInterval(() => {
    currentMessageIndex.value =
      currentMessageIndex.value < (statusMessages?.length ?? 0) - 1
        ? (currentMessageIndex.value + 1) % (statusMessages?.length ?? 0)
        : (statusMessages?.length ?? 0) - 1;
  }, 4000);
});
</script>

<style lang="scss" scoped>
$size: 30px;
$border: 2px;

.loader {
  width: $size;
  height: $size;
  border-radius: 50%;
  display: inline-block;
  position: relative;
  border: $border solid;
  border-color: #6366f1 #6366f1 transparent transparent;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}
.loader::after,
.loader::before {
  content: '';
  box-sizing: border-box;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  border: $border solid;
  border-color: transparent transparent #22c55e #22c55e;
  width: calc($size - 8px);
  height: calc($size - 8px);
  border-radius: 50%;
  box-sizing: border-box;
  animation: rotationBack 0.5s linear infinite;
  transform-origin: center center;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
@keyframes rotationBack {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(-360deg);
  }
}
</style>
