export class LambdaReply {
  public defaults: ReplyDefaults;

  /**
   * A tiny utility for creating AWS Lambda response objects.
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
