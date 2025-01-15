import { getMainPoints } from '@/server/services/boe/getMainPoints';
import { getKeywords } from '@/server/services/boe/getKeywords';
import { getAreas } from '@/server/services/boe/getAreas';
import { getAnalysisPoints } from '@/server/services/boe/getAnalysisPoints';

export default defineEventHandler(async (event) => {
  try {
    const { text } = await readBody(event);

    if (!text) {
      throw createError({
        statusCode: 400,
        message: 'El texto es requerido',
      });
    }

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
    console.error('Error in boe-analytics:', error);
    throw createError({
      statusCode:
        error instanceof Error && 'statusCode' in error
          ? (error as any).statusCode
          : 500,
      message: error instanceof Error ? error.message : 'Internal server error',
      cause: error,
    });
  }
});
