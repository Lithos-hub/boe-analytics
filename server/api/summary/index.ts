import { createSummary } from '~/server/services/boe/post';

export default defineEventHandler(async (event) => {
  const { boe_id, summary, client } = await readBody(event);

  try {
    await createSummary({ data: { boe_id, summary }, client });
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to save summary',
    });
  }

  return { success: true };
});
