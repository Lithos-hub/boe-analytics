import { getSummary } from '~/server/services/openai/summary';
import {
  genericErrorHandler,
  missingPropertiesHandler,
} from '~/validators/errorHandlers';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { text } = missingPropertiesHandler(['text'], body);

    const summary = await getSummary(text);

    return summary;
  } catch (error: unknown) {
    console.error('Error in openai/summary:', error);
    genericErrorHandler(error);
  }
});
