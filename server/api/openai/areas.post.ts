import { getAreas } from '~/server/services/openai/areas';
import { genericErrorHandler } from '~/validators/errorHandlers';
import { missingPropertyHandler } from '~/validators/errorHandlers';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const text = missingPropertyHandler('text', body);

    const areas = await getAreas(text);

    return {
      areas: JSON.parse(areas || '[]'),
    };
  } catch (error: unknown) {
    console.error('Error in boe/areas:', error);
    genericErrorHandler(error);
  }
});
