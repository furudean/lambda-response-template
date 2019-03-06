import { APIGatewayProxyResult } from 'aws-lambda';
import { isString, lowercaseKeys as lk } from './util';

export interface Template {
  headers: NonNullable<APIGatewayProxyResult['headers']>;
  multiValueHeaders: NonNullable<APIGatewayProxyResult['multiValueHeaders']>;
  isBase64Encoded: NonNullable<APIGatewayProxyResult['isBase64Encoded']>;
}

export type ResponseOverrides = Partial<Template>;

export class ResponseTemplate {
  public template: Template;

  /** Creates a template. */
  constructor(template: Partial<Template> = {}) {
    this.template = {
      headers: {
        'content-type': 'application/json',
        ...(template.headers || {}),
      },
      multiValueHeaders: (template.multiValueHeaders || {}),
      isBase64Encoded: template.isBase64Encoded || false,
    };
  }

  /**
   * Creates a response object from a template.
   *
   * @param statusCode - HTTP status code.
   * @param body - The response body.
   * @param overrides - Override these parts of your template.
   * @param contentType - Set `Content-Type` header to this value.
   */
  public make(statusCode: number, body?: string, overrides?: ResponseOverrides): APIGatewayProxyResult;
  public make(statusCode: number, body?: string, contentType?: string): APIGatewayProxyResult;
  public make(statusCode: number, body: string = '', overrideLike?: ResponseOverrides | string): APIGatewayProxyResult {
    let overrides: ResponseOverrides;

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

    return {
      statusCode,
      body,
      headers: {
        ...lk(this.template.headers), // set defaults
        ...lk(overrides.headers || {}), // spread specified headers
      },
      multiValueHeaders: {
        ...lk(this.template.multiValueHeaders),
        ...lk(overrides.multiValueHeaders || {}),
      },
      isBase64Encoded: overrides.isBase64Encoded !== undefined ?
        overrides.isBase64Encoded :
        this.template.isBase64Encoded,
    };
  }
}
