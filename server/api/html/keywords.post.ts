import { getKeywords } from '@/server/services/boe/getKeywords';

export default defineEventHandler(async (event) => {
  try {
    const { text } = await readBody(event);

    if (!text) {
      throw createError({
        statusCode: 400,
        message: 'El texto es requerido',
      });
    }

    const keywordsHtml = await getKeywords(text);

    return {
      keywordsHTML: keywordsHtml,
    };
  } catch (error: unknown) {
    console.error('Error in boe/keywords:', error);
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
