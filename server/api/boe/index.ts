import { createBoe } from '@/server/services/boe/post';
import { missingPropertiesHandler } from '@/validators/errorHandlers';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const { client, date, url } = missingPropertiesHandler(
    ['client', 'date', 'url'],
    body,
  );

  const boe = await createBoe({
    data: {
      date,
      url,
    },
    client,
  });

  return { boe };
});
