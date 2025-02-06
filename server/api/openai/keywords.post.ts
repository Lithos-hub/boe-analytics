import { getKeywords } from '~/server/services/openai/keywords';
import { missingPropertiesHandler } from '~/validators/errorHandlers';
import { genericErrorHandler } from '~/validators/errorHandlers';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { text } = missingPropertiesHandler(['text'], body);
    return await getKeywords(text);
  } catch (error: unknown) {
    console.error('Error in boe/keywords:', error);
    genericErrorHandler(error);
  }
});
