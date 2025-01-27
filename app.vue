<template>
  <div class="text-white/80">
    <Modal />
    <div class="px-2.5 pt-2.5">
      <Navbar />
    </div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <PatternBackground />
  </div>
</template>

<style>
html,
body {
  @apply overflow-hidden;
}

/* Custom scrollbar styles */
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

::-webkit-scrollbar-track {
  @apply bg-stone-800;
}

::-webkit-scrollbar-thumb {
  @apply bg-primary/50 rounded-lg;
}

::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-500/50;
}
</style>
