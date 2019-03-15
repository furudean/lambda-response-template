import { APIGatewayProxyResult } from 'aws-lambda';

export type TransformationFn = (value: any) => string;
export type Headers = NonNullable<APIGatewayProxyResult['headers']>;
export type MultiValueHeaders = NonNullable<APIGatewayProxyResult['multiValueHeaders']>;

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
