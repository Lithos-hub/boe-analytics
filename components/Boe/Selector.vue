<template>
  <header class="z-50 rounded-2xl bg-dark-950/50 p-5 backdrop-blur-sm">
    <div
      v-if="!isLoadingScrap && !scrapError"
      class="flex flex-col items-center gap-2.5">
      <small class="text-primary-500">
        Hay un total de
        <strong class="text-white">
          {{ availableScrapedBoeDocuments.length }}
        </strong>
        documentos disponibles para el
        {{ formatDateToLocaleString(route.params.date as string) }}
      </small>
      <USelectMenu
        v-model="selectedDocumentToAnalyze"
        :options="availableScrapedBoeDocuments"
        placeholder="Selecciona un documento para analizar"
        class="w-full"
        option-attribute="title"
        @change="onDocumentSelect">
        <template #label>
          <span v-if="selectedDocumentToAnalyze">
            ({{ selectedDocumentToAnalyze.id }}) -
            {{ selectedDocumentToAnalyze.title }} -
            {{ selectedDocumentToAnalyze.subtitle }}
          </span>
        </template>
        <template #option="{ option }">
          <div class="flex flex-col gap-2.5">
            <div class="flex flex-wrap items-center gap-2.5">
              <UBadge
                size="lg"
                :label="`(${option.id}) - ${option.title}`"
                variant="soft"
                :color="getColorForBoeOption(option)" />
              <small class="text-xs text-primary-200">
                ({{ option.text.split(' ').length }} palabras aprox.)
              </small>
            </div>
            <small class="text-primary-200">
              Categoría: {{ option.subtitle }}
            </small>
          </div>
        </template>
      </USelectMenu>
    </div>
    <Loader
      v-else-if="isLoadingScrap"
      :status-messages="[
        `Accediendo a los documentos disponibles del ${formattedDate}`,
      ]" />
    <FeedbackMessage
      v-else-if="scrapError"
      :message="scrapError"
      type="error" />
  </header>
</template>

<script setup lang="ts">
const boeStore = useBoeStore();
const {
  selectedDocumentToAnalyze,
  isLoadingScrap,
  scrapError,
  availableScrapedBoeDocuments,
} = storeToRefs(boeStore);
const { getBoeData } = boeStore;

const route = useRoute();
const formattedDate = formatDateToLocaleString(route.params.date as string);

const onDocumentSelect = () => {
  if (selectedDocumentToAnalyze.value) {
    getBoeData(selectedDocumentToAnalyze.value);
  }
};

const getColorForBoeOption = ({ date, has_all_data }: AvailableScrapedBoe) => {
  const isComplete = date && has_all_data;
  const isIncomplete = date && !has_all_data;
  const isNoDocId = !date;

  if (isComplete) return 'green';
  if (isIncomplete) return 'yellow';
  if (isNoDocId) return 'red';
};
</script>
