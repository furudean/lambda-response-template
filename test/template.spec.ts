/* tslint:disable:no-unused-expression */

import { expect } from 'chai';
import { ResponseTemplate } from '../src/index';

describe('Constructor', () => {
  it('should set headers properly', () => {
    const headers = { 'x-something': true };
    const Reply = new ResponseTemplate({
      headers,
    });
    const responseObject = Reply.make(404, 'Something not found');
    expect(responseObject.headers).to.be.an('object').that.deep.equals(headers);
  });
  it('should set multiValueHeaders properly', () => {
    const multiValueHeaders = { 'x-something': ['awesome', 'sauce'] };
    const Reply = new ResponseTemplate({
      multiValueHeaders,
    });
    const responseObject = Reply.make(404, 'Something not found');
    expect(responseObject.multiValueHeaders).to.be.an('object').that.deep.equals(multiValueHeaders);
  });
  it('should set isBase64Encoded properly', () => {
    const Reply = new ResponseTemplate({ isBase64Encoded: true });
    const responseObject = Reply.make(200);
    expect(responseObject.isBase64Encoded).to.be.a('boolean').that.equals(true);
  });
  it('should transform the body', () => {
    const reply = new ResponseTemplate({
      transform: (value) => JSON.stringify(value),
    });
    const responseObject = reply.make(200, { message: 'hello' });
    expect(responseObject.body).to.equal('{"message":"hello"}');
  });
});
