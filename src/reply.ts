interface HttpHeaders {
  [key: string]: string | boolean | number;
}

interface LambdaReplyDefaults {
  headers: HttpHeaders;
  multiValueHeaders: { [key: string]: string[]; };
}

interface LambdaReplyOptions {
  headers?: HttpHeaders;
  multiValueHeaders?: { [key: string]: string[]; };
  isBase64Encoded?: boolean;
}

interface LambdaResponseObject {
  statusCode: number;
  body: string;
  headers?: HttpHeaders;
  multiValueHeaders?: { [key: string]: string[]; };
  isBase64Encoded?: boolean;
}

export class LambdaReply {
  public defaults: LambdaReplyDefaults;

  /**
   * Create a new reply instance with the selected default headers.
   *
   * @param defaults
   * The defaults to apply for each response made using this reply object.
   *
   * Default values are:
   * ```javascript
   * {
   *   headers: { 'Content-Type': 'application/json' },
   *   multiValueHeaders: {}
   * }
   * ```
   */
  constructor(defaults: Partial<LambdaReplyDefaults> = {}) {
    // set initial values
    const headers = defaults.headers || {
      'Content-Type': 'application/json',
    };

    const multiValueHeaders = defaults.multiValueHeaders || {};

    this.defaults = {
      headers,
      multiValueHeaders,
    };
  }

  /**
   * Create a AWS Lambda response object.
   *
   * @param statusCode - HTTP status code
   * @param body - The response body to return.
   * @param options - Customize the response. Overwrite headers or set the response as base64 encoded.
   */
  public make(statusCode: number, body: string, options: LambdaReplyOptions = {}): LambdaResponseObject {
    return {
      statusCode,
      body,
      headers: {
        ...this.defaults.headers, // set defaults
        ...(options.headers || {}), // spread specified headers
      },
      isBase64Encoded: options.isBase64Encoded,
      multiValueHeaders: {
        ...this.defaults.multiValueHeaders,
        ...(options.multiValueHeaders || {}),
      },
    };
  }
}
