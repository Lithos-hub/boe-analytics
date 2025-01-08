<template>
  <header class="Navbar">
    <nav
      class="px-5 h-14 flex justify-between border-b items-center border-primary/10"
    >
      <div class="flex gap-5 items-center">
        <NuxtLink to="/" class="flex gap-2.5">
          <img src="/logo.svg" width="25" class="Navbar__logo-icon" />
          <span class="Navbar__logo-text">BOE Resumido</span>
        </NuxtLink>
      </div>
      <div class="flex gap-5">
        <ULink
          to="/"
          active-class="text-primary font-bold underline underline-offset-4"
          inactive-class="text-gray-500"
        >
          Inicio
        </ULink>
        <ULink
          to="/about"
          active-class="text-primary font-bold underline underline-offset-4"
          inactive-class="text-gray-500"
        >
          Sobre el proyecto
        </ULink>
      </div>
    </nav>
  </header>
</template>

<style lang="scss" scoped>
.Navbar {
  @apply sticky top-0 left-0 w-full backdrop-blur-xl;

  $self: &;

  &__logo-text {
    @apply opacity-0 transition-all duration-300 ease-in-out -translate-x-[100%] z-0 text-primary font-bold;
  }

  &__logo-icon {
    @apply transform scale-100 transition-transform duration-300 ease-in-out z-10;

    &:hover {
      @apply transform scale-110 rotate-180;

      ~ #{$self}__logo-text {
        @apply opacity-100 translate-x-0;

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
