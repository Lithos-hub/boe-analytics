import { getAnalysisPoints } from '@/server/services/html/getAnalysisPoints';
import {
  genericErrorHandler,
  missingPropertyHandler,
} from '~/validators/errorHandlers';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const text = missingPropertyHandler('text', body);

    const analysisPointsHtml = await getAnalysisPoints(text);

    return {
      analysisPointsHTML: analysisPointsHtml,
    };
  } catch (error: unknown) {
    console.error('Error in boe/analysis-points:', error);
    genericErrorHandler(error);
  }
});
