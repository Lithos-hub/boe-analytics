<script setup lang="ts">
import BoeManager from '~/components/Boe/Manager.vue';
</script>

<template>
  <div class="Home__wrapper">
    <Suspense>
      <BoeManager />

      <template #fallback>
        <Card class="h-[200px] w-full p-5">
          <div
            class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Loader
              :status-messages="[
                'Obteniendo texto del boletín...',
                'Analizando el texto...',
                'Generando resumen...',
                'Generando estadísticas...',
              ]" />
          </div>
        </Card>
      </template>
    </Suspense>
    <section class="flex w-full flex-wrap justify-center gap-5">
      <article class="grow">
        <Card>
          <Calendar />
        </Card>
      </article>
    </section>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/scss/text.scss' as *;

.Home {
  &__wrapper {
    @apply flex flex-col items-center justify-center gap-5;
  }
}
</style>
