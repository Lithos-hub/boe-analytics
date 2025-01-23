import type { ScrapResponse } from "~/server/api/scrap/scrap.interfaces";

export const useScraper = () => {
    const scrapData = ref<ScrapResponse | null>(null)
    const isLoadingScrap = ref(true)

    const scrapUrl = async (endpoint: string) => {
        try {
          scrapData.value = await $fetch(
            `api/scrap/${endpoint}`,
          );
        } catch (error) {
          console.error(`Error scraping url: api/scrap/${endpoint}`, error);
          throw error;
        } finally {
          isLoadingScrap.value = false;
        }
      };

    return {
        scrapData,
        isLoadingScrap,
        scrapUrl
    }
}