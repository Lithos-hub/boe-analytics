import { getSummary } from '~/server/services/openai/summary';
import { missingPropertiesHandler } from '~/validators/errorHandlers';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { text } = missingPropertiesHandler(['text'], body);

    const summary = await getSummary(text);

    return summary;
  } catch (error) {
    console.error('DeepSeek API error:', error);
    return '';
  }
});
