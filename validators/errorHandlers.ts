export const missingPropertiesHandler = (
  properties: string[],
  body: Record<string, any>,
) => {
  for (const property of properties) {
    if (!body[property]) {
      throw createError({
        statusCode: 400,
        message: `${property} property is required`,
      });
    }
  }

  return body;
};

export const genericErrorHandler = (error: any) => {
  throw createError({
    statusCode:
      error instanceof Error && 'statusCode' in error
        ? (error as any).statusCode
        : 500,
    message: error instanceof Error ? error.message : 'Internal server error',
    cause: error,
  });
};
