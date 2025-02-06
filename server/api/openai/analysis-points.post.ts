import { getAspects } from '~/server/services/openai/aspects';
import {
  genericErrorHandler,
  missingPropertiesHandler,
} from '~/validators/errorHandlers';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { text } = missingPropertiesHandler(['text'], body);

    return await getAspects(text);
  } catch (error: unknown) {
    console.error('Error in boe/analysis-points:', error);
    genericErrorHandler(error);
  }
});
