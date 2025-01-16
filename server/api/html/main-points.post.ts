import { getMainPoints } from '@/server/services/html/getMainPoints';
import {
  genericErrorHandler,
  missingPropertyHandler,
} from '~/validators/errorHandlers';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const text = missingPropertyHandler('text', body);

    const mainPointsHtml = await getMainPoints(text);

    return {
      mainPointsHTML: mainPointsHtml,
    };
  } catch (error: unknown) {
    console.error('Error in boe/main-points:', error);
    genericErrorHandler(error);
  }
});
