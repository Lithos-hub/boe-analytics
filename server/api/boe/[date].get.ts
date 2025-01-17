import { getBoeByDate } from '~/server/services/boe/get';

export default defineEventHandler(async (event) => {
  const date = getRouterParam(event, 'date') as string;
  const { client } = await readBody(event);

  const boe = await getBoeByDate({
    date,
    client,
  });

  return boe;
});
