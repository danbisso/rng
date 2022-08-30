import { randomInt } from 'crypto';

// Event handler.
export const handler = async (event, context) => {

  // Returning a string makes Lambda infer the response format and include the CORS config
  // See: https://docs.aws.amazon.com/lambda/latest/dg/urls-invocation.html
  return randomInt(0,2) ? 'Yes' : 'No';
};
