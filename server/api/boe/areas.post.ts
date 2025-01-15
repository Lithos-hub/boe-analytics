import { getAreas } from '@/server/services/boe/getAreas';

export default defineEventHandler(async (event) => {
  try {
    const { text } = await readBody(event);

    if (!text) {
      throw createError({
        statusCode: 400,
        message: 'El texto es requerido',
      });
    }

    const areasHtml = await getAreas(text);

    return {
      areasHTML: areasHtml,
    };
  } catch (error: unknown) {
    console.error('Error in boe/areas:', error);
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
