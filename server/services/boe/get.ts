export const getBoeByDate = async ({
  date,
  client,
}: {
  date: string;
  client: any;
}) => {
  const { data, error } = await client
    .from('boes')
    .select('*')
    .eq('date', date);

  if (error) {
    throw new Error('Failed to get BOE data');
  }

  return data;
};
