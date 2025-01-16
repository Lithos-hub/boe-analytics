import { getMainPoints } from '@/server/services/html/getMainPoints';
import { getKeywords } from '@/server/services/html/getKeywords';
import { getAreas } from '@/server/services/html/getAreas';
import { getAnalysisPoints } from '@/server/services/html/getAnalysisPoints';
import {
  genericErrorHandler,
  missingPropertyHandler,
} from '~/validators/errorHandlers';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const text = missingPropertyHandler('text', body);

    // Get each section in parallel to optimize response time
    const [mainPointsHtml, keywordsHtml, areasHtml, analysisPointsHtml] =
      await Promise.all([
        getMainPoints(text),
        getKeywords(text),
        getAreas(text),
        getAnalysisPoints(text),
      ]);

    // Combine all HTML results
    const completeHtml = `
      ${mainPointsHtml}
      ${keywordsHtml}
      ${areasHtml}
      ${analysisPointsHtml}
    `;

    return {
      analysisHTML: completeHtml,
    };
  } catch (error: unknown) {
    genericErrorHandler(error);
  }
});
