interface HttpHeaders {
  [key: string]: string | boolean | number;
}

interface ReplyDefaults {
  headers: HttpHeaders;
}

interface ReplyOptions {
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
  public defaults: ReplyDefaults;

  /**
   * Creates a new reply object.
   *
   * @param defaults - The defaults to apply for each reply made using this reply object.
   */
  constructor(defaults: Partial<ReplyDefaults> = {}) {
    let { headers } = defaults;

    // set initial values
    headers = headers || {
      'Content-Type': 'application/json',
    };

    this.defaults = {
      headers,
    };
  }

  /**
   * Creates a AWS Lambda response object.
   *
   * @param statusCode - HTTP status code
   * @param body - The response body to return.
   * @param options - Customize the response. Overwrite headers or set the response as base64 encoded.
   */
  public make(statusCode: number, body: string, options: ReplyOptions = {}): LambdaResponseObject {
    const { headers, isBase64Encoded, multiValueHeaders } = options;

    return {
      statusCode,
      body,
      headers: {
        ...this.defaults.headers, // set defaults
        ...headers, // spread specified headers
      },
      isBase64Encoded,
      multiValueHeaders,
    };
  }
}
