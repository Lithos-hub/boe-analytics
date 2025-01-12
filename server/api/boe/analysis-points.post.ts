import { getAnalysisPoints } from '../../services/boe/getAnalysisPoints';

export default defineEventHandler(async (event) => {
  try {
    const { text } = await readBody(event);

    if (!text) {
      throw createError({
        statusCode: 400,
        message: 'El texto es requerido',
      });
    }

    const analysisPointsHtml = await getAnalysisPoints(text);

    return {
      analysisPointsHTML: analysisPointsHtml,
    };
  } catch (error: unknown) {
    console.error('Error in boe/analysis-points:', error);
    throw createError({
      statusCode:
        error instanceof Error && 'statusCode' in error
          ? (error as any).statusCode
          : 500,
      message:
        error instanceof Error ? error.message : 'Error interno del servidor',
      cause: error,
    });
  }
});
