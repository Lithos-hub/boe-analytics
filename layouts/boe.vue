<template>
  <div class="flex">
    <nav class="flex w-[300px] min-w-[300px] flex-col gap-2.5 py-2.5 pl-2.5">
      <div class="rounded-2xl bg-dark-950/50 p-5 backdrop-blur-sm">
        <Calendar />
      </div>
      <div class="rounded-2xl bg-dark-950/50 p-5 backdrop-blur-sm">
        <div class="flex items-center justify-center gap-2.5">
          <UTooltip text="Ver BOE original">
            <UButton
              color="secondary"
              variant="soft"
              class="border border-secondary-500/50"
              icon="i-heroicons-arrow-top-right-on-square"
              target="_blank"
              :to="boeUrl" />
          </UTooltip>
          <UTooltip text="Descargar análisis en PDF">
            <UButton
              color="green"
              variant="soft"
              class="border border-green-500/50"
              icon="i-heroicons-arrow-down-tray"
              disabled
              @click="() => {}" />
          </UTooltip>
          <UTooltip text="Ver documento en formato JSON">
            <UButton
              color="dark"
              variant="soft"
              class="border border-dark-500/50"
              :icon="
                isShowingJSON
                  ? 'i-heroicons-document-chart-bar'
                  : 'i-heroicons-code-bracket'
              "
              @click="toggleJSON" />
          </UTooltip>
        </div>
      </div>
    </nav>
    <div class="flex-1 p-2.5">
      <div
        class="max-h-[calc(100vh-95px)] overflow-y-scroll rounded-2xl bg-dark-950/50 p-5 backdrop-blur-sm">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { isShowingJSON, boeUrl } = storeToRefs(useBoeStore());

const toggleJSON = () => {
  isShowingJSON.value = !isShowingJSON.value;
};
</script>
