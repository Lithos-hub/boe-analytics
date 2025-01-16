import { getKeywords } from '@/server/services/html/getKeywords';
import { missingPropertyHandler } from '~/validators/errorHandlers';
import { genericErrorHandler } from '~/validators/errorHandlers';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const text = missingPropertyHandler('text', body);

    const keywordsHtml = await getKeywords(text);

    return {
      keywordsHTML: keywordsHtml,
    };
  } catch (error: unknown) {
    console.error('Error in boe/keywords:', error);
    genericErrorHandler(error);
  }
});
