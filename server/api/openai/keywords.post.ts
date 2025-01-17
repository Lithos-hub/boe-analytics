import { getKeywords } from '~/server/services/openai/keywords';
import { missingPropertiesHandler } from '~/validators/errorHandlers';
import { genericErrorHandler } from '~/validators/errorHandlers';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { text } = missingPropertiesHandler(['text'], body);

    const keywords = await getKeywords(text);

    return {
      keywords: JSON.parse(keywords || '[]'),
    };
  } catch (error: unknown) {
    console.error('Error in boe/keywords:', error);
    genericErrorHandler(error);
  }
});
