import { getAreas } from '@/server/services/html/getAreas';
import { genericErrorHandler } from '~/validators/errorHandlers';
import { missingPropertyHandler } from '~/validators/errorHandlers';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const text = missingPropertyHandler('text', body);

    const areasHtml = await getAreas(text);

    return {
      areasHTML: areasHtml,
    };
  } catch (error: unknown) {
    console.error('Error in boe/areas:', error);
    genericErrorHandler(error);
  }
});
