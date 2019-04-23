import { APIGatewayProxyResult } from 'aws-lambda';
import { make } from './make';
import { Headers, MultiValueHeaders, ResponseOverrides, Template } from './types';

export class ResponseTemplate {
  public headers: Headers;
  public multiValueHeaders: MultiValueHeaders;
  public isBase64Encoded?: boolean;
  public transform?: (...args: any) => string;

  /** Creates a template. */
  constructor(template: Template = {}) {
    this.headers = template.headers || {};
    this.multiValueHeaders = template.multiValueHeaders || {};
    this.isBase64Encoded = template.isBase64Encoded;
    this.transform = template.transform;
  }

  /**
   * Creates a response object from a template.
   *
   * @param statusCode - HTTP status code.
   * @param body - The response body.
   * @param overrides - Override these parts of your template.
   * @param contentType - Set `Content-Type` header to this value.
   */
  public make(statusCode: number, body?: any, overrides?: ResponseOverrides): APIGatewayProxyResult;
  public make(statusCode: number, body?: any, contentType?: string): APIGatewayProxyResult;
  public make(statusCode: number, body: any = '', overrideLike?: ResponseOverrides | string): APIGatewayProxyResult {
    return make(this, statusCode, body, overrideLike);
  }
}
