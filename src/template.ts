import { APIGatewayProxyResult } from 'aws-lambda';
import { oneLine } from 'common-tags';
import { exists, isString } from './util';

type Headers = NonNullable<APIGatewayProxyResult['headers']>;
type MultiValueHeaders = NonNullable<APIGatewayProxyResult['multiValueHeaders']>;
type TransformationFn = (value: any) => string;

export interface Template {
  headers?: Headers;
  multiValueHeaders?: MultiValueHeaders;
  isBase64Encoded?: boolean;
  transform?: TransformationFn;
}

export interface ResponseOverrides {
  headers?: Headers;
  multiValueHeaders?: MultiValueHeaders;
  isBase64Encoded?: boolean;
  transform?: TransformationFn;
}

const callbackNoop = (value: any): any => value;

export class ResponseTemplate {
  public headers?: Headers;
  public multiValueHeaders?: MultiValueHeaders;
  public isBase64Encoded?: boolean;
  public transform?: TransformationFn;

  /**
   * Creates a template.
   *
   * @param transform
   * Call this function on the response body.
   */
  constructor(template: Template = {}) {
    this.headers = template.headers;
    this.multiValueHeaders = template.multiValueHeaders;
    this.isBase64Encoded = template.isBase64Encoded;
    this.transform = template.transform;
  }

  /**
   * Creates a response object from a template.
   *
   * @param statusCode - HTTP status code.
   * @param body - The response body. Must have a
   * @param overrides - Override these parts of your template.
   * @param contentType - Set `Content-Type` header to this value.
   */
  public make(statusCode: number, body?: any, overrides?: ResponseOverrides): APIGatewayProxyResult;
  public make(statusCode: number, body?: any, contentType?: string): APIGatewayProxyResult;
  public make(statusCode: number, body: any = '', overrideLike?: ResponseOverrides | string): APIGatewayProxyResult {
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

    const hasTransformer = exists(this.transform) || exists(overrides.transform);
    if (!hasTransformer && !isString(body)) {
      throw new Error(`Attempted to pass type '${typeof body}' as a body. The body must be a string.`);
    }

    if (exists(this.headers) || exists(overrides.headers)) {
      headers = {
        ...this.headers || {}, // set defaults
        ...overrides.headers || {}, // spread specified headers
      };
    }

    if (exists(this.multiValueHeaders) || exists(overrides.multiValueHeaders)) {
      multiValueHeaders = {
        ...this.multiValueHeaders || {},
        ...overrides.multiValueHeaders || {},
      };
    }

    const responseBody = (overrides.transform || this.transform || callbackNoop)(body);
    if (!isString(responseBody)) {
      const message = oneLine`
        Transformation function returned type '${typeof responseBody}'. Resulting body must be a string.
      `;
      throw new Error(message);
    }

    return {
      statusCode,
      body: responseBody,
      headers,
      multiValueHeaders,
      isBase64Encoded: overrides.isBase64Encoded || this.isBase64Encoded,
    };
  }
}
