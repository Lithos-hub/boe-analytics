<template>
  <div class="text-white/80">
    <Navbar />
    <Container class="max-h-[calc(100vh-56px)] overflow-y-auto">
      <div class="mx-auto max-w-[95vw] py-5 md:w-[80vw]">
        <NuxtPage />
      </div>
    </Container>

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
