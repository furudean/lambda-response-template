import { APIGatewayProxyResult } from 'aws-lambda';
import { oneLine } from 'common-tags';
import { ResponseTemplate } from './template';
import { Headers, MultiValueHeaders, ResponseOverrides } from './types';
import { exists, isString } from './util';

const callbackNoop = (value: any): any => value;

export function make(self: ResponseTemplate, statusCode: number, body: any = '',
                     overrideLike?: ResponseOverrides | string): APIGatewayProxyResult {
  let overrides: ResponseOverrides;
  let headers: Headers | undefined;
  let multiValueHeaders: MultiValueHeaders | undefined;

  // Determine if third argument is content type, undefined, or options.
  if (isString(overrideLike)) {
    // Is a Content-Type header
    overrides = {
      headers: {
        'content-type': overrideLike as string,
      },
    };
  } else if (overrideLike instanceof Object) {
    // Is an options object.
    overrides = overrideLike as ResponseOverrides;
  } else {
    // Is unknown, set as empty.
    overrides = {};
  }

  const hasTransformer = exists(self.transform) || exists(overrides.transform);
  if (!hasTransformer && !isString(body)) {
    const message = oneLine`
      Attempted to pass type '${typeof body}' as a body. The body must be a
      string.`;
    throw new Error(message);
  }

  if (Object.keys(self.headers).length || exists(overrides.headers)) {
    headers = {
      ...self.headers, // set defaults
      ...overrides.headers || {}, // spread specified headers
    };
  }

  if (Object.keys(self.multiValueHeaders).length || exists(overrides.multiValueHeaders)) {
    multiValueHeaders = {
      ...self.multiValueHeaders,
      ...overrides.multiValueHeaders || {},
    };
  }

  const responseBody = (overrides.transform || self.transform || callbackNoop)(body);
  if (!isString(responseBody)) {
    const message = oneLine`
      Transformation function returned type '${typeof responseBody}'. Resulting
      body must be a string.
    `;
    throw new Error(message);
  }

  return {
    statusCode,
    body: responseBody,
    headers,
    multiValueHeaders,
    isBase64Encoded: overrides.isBase64Encoded || self.isBase64Encoded,
  };
}
