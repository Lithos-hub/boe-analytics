import { getSummary } from '~/server/services/openai/summary';
import { missingPropertyHandler } from '~/validators/errorHandlers';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const text = missingPropertyHandler('text', body);

    const summary = await getSummary(text);

    return {
      summary: summary ?? '',
    };
  } catch (error) {
    console.error('DeepSeek API error:', error);
    return {
      summary: '',
    };
  }
});
