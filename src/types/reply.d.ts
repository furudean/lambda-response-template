declare type HttpHeaders = {
  [key: string]: string | boolean | number;
};

declare type ReplyDefaults = {
  headers: HttpHeaders;
}

declare type ReplyOptions = {
  headers?: HttpHeaders;
  multiValueHeaders?: { [key: string]: string[]; };
  isBase64Encoded?: boolean;
};

declare type LambdaResponseObject = {
  statusCode: number;
  body: string;
  headers?: HttpHeaders;
  multiValueHeaders?: { [key: string]: string[]; };
  isBase64Encoded?: boolean;
};
