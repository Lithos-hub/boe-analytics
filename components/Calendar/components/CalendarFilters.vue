<template>
  <div class="grid grid-cols-12 gap-2.5">
    <!-- <div class="col-span-12">
      <label class="text-primary font-bold">Buscar</label>
      <UInput
        v-model="search"
        color="primary"
        label="Buscar"
        disabled
        placeholder="Introducte un término de búsqueda"
        icon="i-heroicons-magnifying-glass" />
    </div> -->
    <div class="col-span-12 md:col-span-6">
      <label class="text-primary font-bold">Mes</label>
      <USelectMenu
        v-model="selectedMonthModel"
        color="primary"
        :options="months"
        option-attribute="name"
        value-attribute="id" />
    </div>
    <div class="col-span-12 md:col-span-6">
      <label class="text-primary font-bold">Año</label>
      <USelectMenu
        v-model="selectedYearModel"
        color="primary"
        :options="years"
        option-attribute="name"
        value-attribute="value" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { months, years } from '@/components/Calendar/Calendar.const';

const search = ref('');

const selectedMonthModel = defineModel<number>('selectedMonthModel');
const selectedYearModel = defineModel<number>('selectedYearModel');
</script>
