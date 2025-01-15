<template>
  <div>
    <Card>
      <div class="flex items-center justify-between">
        <UButton
          icon="i-heroicons-arrow-left"
          variant="soft"
          color="primary"
          :to="`/`">
          Volver
        </UButton>
        <h5 class="text-primary">Análisis del BOE del {{ boeDate }}</h5>
      </div>
      <hr class="border-primary/10 my-5 border" />

      <div class="relative min-h-[500px]">
        <Suspense>
          <BoeAnalytics :date />

          <template #fallback>
            <div
              class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <Loader
                :status-messages="[
                  'Obteniendo texto del boletín...',
                  'Analizando el texto...',
                  'Generando análisis detallado...',
                  'Extrayendo palabras clave...',
                  'Identificando áreas afectadas...',
                  'Evaluando puntos positivos, negativos y neutros...',
                  'Generando resumen final, esto puede tardar unos minutos...',
                ]" />
            </div>
          </template>
        </Suspense>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
const { date } = useRoute().params as { date: string };

const [year, month, day] = (date as string).split('-');

const boeDate = new Date(
  Number(year),
  Number(month) - 1,
  Number(day),
).toLocaleDateString('es-ES', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});
</script>

<style scoped lang="scss">
@use '@/assets/scss/text.scss' as *;
</style>
