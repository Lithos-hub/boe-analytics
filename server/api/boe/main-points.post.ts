import { getMainPoints } from '../../services/boe/getMainPoints';

export default defineEventHandler(async (event) => {
  try {
    const { text } = await readBody(event);

    if (!text) {
      throw createError({
        statusCode: 400,
        message: 'El texto es requerido',
      });
    }

    const mainPointsHtml = await getMainPoints(text);

    return {
      mainPointsHTML: mainPointsHtml,
    };
  } catch (error: unknown) {
    console.error('Error in boe/main-points:', error);
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
