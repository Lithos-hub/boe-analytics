<template>
  <header class="Navbar">
    <nav
      class="border-primary/10 flex h-14 items-center justify-between border-b px-5">
      <div class="flex items-center gap-5">
        <NuxtLink to="/" class="flex gap-2.5">
          <img src="/logo.svg" width="25" class="Navbar__logo-icon" />
          <span class="Navbar__logo-text">BOE Analytics</span>
        </NuxtLink>
      </div>
      <div class="flex gap-5">
        <ULink
          to="/"
          active-class="text-primary font-bold underline underline-offset-4"
          inactive-class="text-gray-500">
          Inicio
        </ULink>
        <ULink
          to="/about"
          active-class="text-primary font-bold underline underline-offset-4"
          inactive-class="text-gray-500">
          Sobre el proyecto
        </ULink>
      </div>
    </nav>
  </header>
</template>

<style lang="scss" scoped>
.Navbar {
  @apply sticky left-0 top-0 w-full backdrop-blur-xl;

  $self: &;

  &__logo-text {
    @apply text-primary z-0 -translate-x-[100%] font-bold opacity-0 transition-all duration-300 ease-in-out;
  }

  &__logo-icon {
    @apply z-10 scale-100 transform transition-transform duration-300 ease-in-out;

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
