import { getMainPoints } from '~/server/services/openai/main-points';
import {
  genericErrorHandler,
  missingPropertiesHandler,
} from '~/validators/errorHandlers';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { text } = missingPropertiesHandler(['text'], body);
    return await getMainPoints(text);
  } catch (error: unknown) {
    console.error('Error in boe/main-points:', error);
    genericErrorHandler(error);
  }
});
