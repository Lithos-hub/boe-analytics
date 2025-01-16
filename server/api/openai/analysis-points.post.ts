import { getAnalysisPoints } from '~/server/services/openai/aspects';
import {
  genericErrorHandler,
  missingPropertyHandler,
} from '~/validators/errorHandlers';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const text = missingPropertyHandler('text', body);

    const analysisPoints = await getAnalysisPoints(text);

    return {
      analysisPoints: JSON.parse(analysisPoints || '[]'),
    };
  } catch (error: unknown) {
    console.error('Error in boe/analysis-points:', error);
    genericErrorHandler(error);
  }
});
