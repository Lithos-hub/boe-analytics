import type { ScrapResponse } from '~/server/api/documentsByDay/scrap.interfaces';

export const useScraper = () => {
  const scrapData = ref<ScrapResponse | null>(null);
  const isLoadingScrap = ref(true);

  const scrapUrl = async (endpoint: string) => {
    try {
      scrapData.value = await $fetch(`api/documentsByDay/${endpoint}`);
    } catch (error) {
      console.error(
        `Error scraping url: api/documentsByDay/${endpoint}`,
        error,
      );
      throw error;
    } finally {
      isLoadingScrap.value = false;
    }
  };

  return {
    scrapData,
    isLoadingScrap,
    scrapUrl,
  };
};
