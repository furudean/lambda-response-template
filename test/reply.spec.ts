import { expect } from 'chai';
import { ResponseTemplate } from '../src/index';

describe('Constructor', () => {
  it('should set headers properly', () => {
    const headers = { 'x-something': true };
    const Reply = new ResponseTemplate({
      headers,
    });
    const responseObject = Reply.make(404, 'Something not found');
    expect(responseObject.headers).to.be.an('object').that.deep.equals({
      'content-type': 'application/json',
      ...headers,
    });
  });
  it('should set multiValueHeaders properly', () => {
    const multiValueHeaders = { 'x-something': ['awesome', 'sauce'] };
    const Reply = new ResponseTemplate({
      multiValueHeaders,
    });
    const responseObject = Reply.make(404, 'Something not found');
    expect(responseObject.multiValueHeaders).to.be.an('object').that.deep.equals(multiValueHeaders);
  });
  it('should set initial values for headers', () => {
    const Reply = new ResponseTemplate();
    const responseObject = Reply.make(200, '');
    expect(responseObject.headers).to.be.an('object').that.deep.equals({ 'content-type': 'application/json' });
    expect(responseObject.multiValueHeaders).to.be.an('object').that.deep.equals({});
  });
  it('should set isBase64Encoded properly', () => {
    const Reply = new ResponseTemplate({ isBase64Encoded: true });
    const responseObject = Reply.make(200);
    expect(responseObject.isBase64Encoded).to.be.a('boolean').that.equals(true);
  });
  it('should set initial values for isBase64Encoded', () => {
    const Reply = new ResponseTemplate();
    const responseObject = Reply.make(200);
    expect(responseObject.isBase64Encoded).to.be.a('boolean').that.equals(false);
  });
});
describe('make', () => {
  it('should set statusCode', () => {
    const Reply = new ResponseTemplate();
    const statusCode = 200;
    const responseObject = Reply.make(statusCode, '');

    expect(responseObject.statusCode).to.be.a('number').that.equals(statusCode);
  });
  it('should set body', () => {
    const Reply = new ResponseTemplate();
    const body = 'blabla';
    const responseObject = Reply.make(200, body);

    expect(responseObject.body).to.be.a('string').that.equals(body);
  });
  it('undefined body should be set to \'\'', () => {
    const Reply = new ResponseTemplate();
    const responseObject = Reply.make(200);

    expect(responseObject.body).to.be.a('string').that.equals('');
  });
  describe('overrides', () => {
    it('should set isBase64Encoded', () => {
      const Reply = new ResponseTemplate();
      const responseObject = Reply.make(200, '', { isBase64Encoded: true });
      expect(responseObject.isBase64Encoded).to.be.a('boolean').that.equals(true);
     });
    it('should overwrite default headers', () => {
      const Reply = new ResponseTemplate({
        headers: { 'x-some-header': true },
      });
      const overwrite = { 'x-some-header': '*' };
      const responseObject = Reply.make(404, 'Something not found', { headers: overwrite });
      expect(responseObject.headers).to.be.an('object').that.deep.equals({
        'content-type': 'application/json',
        ...overwrite,
      });
    });
    it('should overwrite multiValueHeaders', () => {
      const Reply = new ResponseTemplate({
        multiValueHeaders: { 'x-some-multi-header': ['yes'] },
      });
      const overwrite = { 'x-some-multi-header': ['no'] };
      const responseObject = Reply.make(404, 'Something not found', { multiValueHeaders: overwrite });
      expect(responseObject.multiValueHeaders).to.be.an('object').that.deep.equals(overwrite);
    });
  });
  it('should allow content-type instead of options', () => {
    const Reply = new ResponseTemplate({
      headers: {
        'a': 'b',
        'content-type': 'text/plain',
      },
    });

    const responseObject = Reply.make(200, undefined, 'audio/mpeg');

    expect(responseObject.headers).to.deep.equal({
      'a': 'b',
      'content-type': 'audio/mpeg',
    });
  });
  it('should normalize header keys', () => {
    const Reply = new ResponseTemplate({
      headers: {
        'X-Epic-Sauce': 'yeah',
      },
    });

    const responseObject = Reply.make(200, undefined, {
      headers: {'soMe-HEadEr': 'Sure'},
    });

    expect(responseObject.headers).to.deep.equal({
      'content-type': 'application/json',
      'x-epic-sauce': 'yeah',
      'some-header': 'Sure',
    });
  });
});
