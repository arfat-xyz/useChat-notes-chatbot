export const errorResponse = (
  consoleData: unknown = "Not available",
  jsonMessage: string = "Internal server error",
  statusCode: number = 500
) => {
  console.error(consoleData);
  return Response.json({ error: jsonMessage }, { status: statusCode });
};
