import { expect } from 'chai';
import { LambdaReply } from '../src/reply';

describe('Constructor', () => {
  it('should set headers properly', () => {
    const headers = { 'x-something': true };
    const Reply = new LambdaReply({
      headers,
    });
    const responseObject = Reply.make(404, 'Something not found');
    expect(responseObject.headers).to.be.an('object').that.deep.equals({
      'Content-Type': 'application/json',
      ...headers,
    });
  });
  it('should set multiValueHeaders properly', () => {
    const multiValueHeaders = { 'x-something': ['awesome', 'sauce'] };
    const Reply = new LambdaReply({
      multiValueHeaders,
    });
    const responseObject = Reply.make(404, 'Something not found');
    expect(responseObject.multiValueHeaders).to.be.an('object').that.deep.equals(multiValueHeaders);
  });
  it('should set initial values for headers', () => {
    const Reply = new LambdaReply();
    const responseObject = Reply.make(200, '');
    expect(responseObject.headers).to.be.an('object').that.deep.equals({ 'Content-Type': 'application/json' });
    expect(responseObject.multiValueHeaders).to.be.an('object').that.deep.equals({});
  });
});
describe('make', () => {
  it('should set statusCode', () => {
    const Reply = new LambdaReply();
    const statusCode = 200;
    const responseObject = Reply.make(statusCode, '');

    expect(responseObject.statusCode).to.be.a('number').that.equals(statusCode);
  });
  it('should set body', () => {
    const Reply = new LambdaReply();
    const body = 'blabla';
    const responseObject = Reply.make(200, body);

    expect(responseObject.body).to.be.a('string').that.equals(body);
  });
  it('undefined body should be set to \'\'', () => {
    const Reply = new LambdaReply();
    const responseObject = Reply.make(200);

    expect(responseObject.body).to.be.a('string').that.equals('');
  });
  describe('options', () => {
    it('should set isBase64Encoded', () => {
      const Reply = new LambdaReply();
      const responseObject = Reply.make(200, '', { isBase64Encoded: true });
      expect(responseObject.isBase64Encoded).to.be.a('boolean').that.equals(true);
     });
    it('should overwrite default headers', () => {
      const Reply = new LambdaReply({
        headers: { 'x-some-header': true },
      });
      const overwrite = { 'x-some-header': '*' };
      const responseObject = Reply.make(404, 'Something not found', { headers: overwrite });
      expect(responseObject.headers).to.be.an('object').that.deep.equals({
        'Content-Type': 'application/json',
        ...overwrite,
      });
    });
    it('should overwrite multiValueHeaders', () => {
      const Reply = new LambdaReply({
        multiValueHeaders: { 'x-some-multi-header': ['yes'] },
      });
      const overwrite = { 'x-some-multi-header': ['no'] };
      const responseObject = Reply.make(404, 'Something not found', { multiValueHeaders: overwrite });
      expect(responseObject.multiValueHeaders).to.be.an('object').that.deep.equals(overwrite);
    });
  });
});
