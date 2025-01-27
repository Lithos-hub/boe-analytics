<template>
  <header class="Navbar">
    <nav class="flex items-center justify-between p-5">
      <div class="flex items-center gap-5">
        <NuxtLink :to="`/${dateRaw}`" class="flex gap-2.5">
          <img
            src="/logo.svg"
            width="24"
            height="24"
            class="Navbar__logo-icon" />
          <span class="Navbar__logo-text">BOE Analytics</span>
        </NuxtLink>
      </div>
      <div class="hidden gap-5 md:flex">
        <ULink
          :to="`/${dateRaw}`"
          active-class="text-primary font-bold underline underline-offset-4"
          inactive-class="text-gray-500">
          BOE de hoy
        </ULink>
        <ULink
          to="/about"
          active-class="text-primary font-bold underline underline-offset-4"
          inactive-class="text-gray-500">
          Sobre el proyecto
        </ULink>
      </div>
      <div class="flex md:hidden">
        <UButton icon="i-heroicons-bars-3" variant="soft" @click="showMenu" />
      </div>
    </nav>
  </header>
  <USlideover v-model="isShowingMenu">
    <div class="flex-1 p-4">
      <UButton
        color="gray"
        variant="ghost"
        icon="i-heroicons-x-mark-20-solid"
        class="absolute end-5 top-5 z-10 flex sm:hidden"
        square
        padded
        @click="closeMenu" />
    </div>
    <div class="flex h-full flex-col items-center justify-center gap-5">
      <ULink
        :to="`/${dateRaw}`"
        active-class="text-primary font-bold underline underline-offset-4"
        inactive-class="text-gray-500">
        BOE de hoy
      </ULink>
      <ULink
        to="/about"
        active-class="text-primary font-bold underline underline-offset-4"
        inactive-class="text-gray-500">
        Sobre el proyecto
      </ULink>
    </div>
  </USlideover>
</template>

<script setup lang="ts">
import { getCurrentDate } from '@/utils/dates';

const route = useRoute();

const { dateRaw } = getCurrentDate();

const isShowingMenu = ref(false);

const showMenu = () => {
  isShowingMenu.value = !isShowingMenu.value;
};

const closeMenu = () => {
  isShowingMenu.value = false;
};

watch(route, () => {
  closeMenu();
});
</script>

<style lang="scss" scoped>
.Navbar {
  @apply sticky left-0 top-0 w-full rounded-2xl bg-dark-950/50 backdrop-blur-xl;

  $self: &;

  &__logo-text {
    @apply text-primary z-0 -translate-x-[100%] font-bold opacity-0 transition-all duration-300 ease-in-out;
  }

  &__logo-icon {
    @apply transform transition-transform duration-300 ease-in-out;

    &:hover {
      @apply rotate-180 scale-110 transform;

      ~ #{$self}__logo-text {
        @apply translate-x-0 opacity-100;

        animation: slideFromLeft 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      }
    }
  }
}

@keyframes slideFromLeft {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}
</style>
