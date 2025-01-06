<template>
  <header>
    <nav
      class="px-5 h-14 flex justify-between border-b items-center border-primary/10"
    >
      <div class="flex gap-5 items-center">
        <NuxtLink to="/" class="flex gap-2.5">
          <img src="/logo.svg" width="25" />
          <strong class="text-primary">BOE Resumido</strong>
        </NuxtLink>
      </div>
      <NuxtLink to="/about" class="text-primary">Sobre el proyecto</NuxtLink>
    </nav>
  </header>
</template>
