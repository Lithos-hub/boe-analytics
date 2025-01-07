<template>
  <header class="sticky top-0 left-0 w-full backdrop-blur-xl">
    <nav
      class="px-5 h-14 flex justify-between border-b items-center border-primary/10"
    >
      <div class="flex gap-5 items-center">
        <NuxtLink to="/" class="flex gap-2.5">
          <img src="/logo.svg" width="25" />
          <span class="text-primary">BOE RESUMIDO</span>
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
