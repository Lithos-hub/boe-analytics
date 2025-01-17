import {
  CreateAreaParams,
  CreateBoeParams,
  CreateMainPointParams,
  CreateStatisticParams,
  CreateSummaryParams,
} from './boe.interfaces';

export const createBoe = async ({
  data,
  client,
}: {
  data: CreateBoeParams;
  client: any;
}) => {
  const { date, url } = data;

  const { error } = await client.from('boes').insert({
    date,
    url,
  });

  if (error) {
    throw new Error('Failed to create BOE');
  }
};

export const createSummary = async ({
  data,
  client,
}: {
  data: CreateSummaryParams;
  client: any;
}) => {
  const { boe_id, summary } = data;

  const { error } = await client.from('summaries').insert({
    boe_id,
    summary,
  });

  if (error) {
    throw new Error('Failed to create summary');
  }
};

export const createArea = async ({
  data,
  client,
}: {
  data: CreateAreaParams;
  client: any;
}) => {
  const { boe_id, name, description } = data;

  const { error } = await client.from('areas').insert({
    boe_id,
    name,
    description,
  });

  if (error) {
    throw new Error('Failed to create areas');
  }
};

export const createStatistic = async ({
  data,
  client,
}: {
  data: CreateStatisticParams;
  client: any;
}) => {
  const { boe_id, type, count } = data;

  const { error } = await client.from('statistics').insert({
    boe_id,
    type,
    count,
  });

  if (error) {
    throw new Error('Failed to create statistics');
  }
};

export const createMainPoint = async ({
  data,
  client,
}: {
  data: CreateMainPointParams;
  client: any;
}) => {
  const { boe_id, main_points } = data;

  const { error } = await client.from('main_points').insert({
    boe_id,
    main_points,
  });

  if (error) {
    throw new Error('Failed to create main points');
  }
};
