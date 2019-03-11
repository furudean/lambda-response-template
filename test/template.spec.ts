/* tslint:disable:no-unused-expression */

import { assert, expect } from 'chai';
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
    const reply = new ResponseTemplate(undefined, (value) => JSON.stringify(value));
    const responseObject = reply.make(200, { message: 'hello' });
    expect(responseObject.body).to.equal('{"message":"hello"}');
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
      expect(responseObject.headers).to.be.an('object').that.deep.equals(overwrite);
    });
    it('should overwrite multiValueHeaders', () => {
      const Reply = new ResponseTemplate({
        multiValueHeaders: { 'x-some-multi-header': ['yes'] },
      });
      const overwrite = { 'x-some-multi-header': ['no'] };
      const responseObject = Reply.make(404, 'Something not found', { multiValueHeaders: overwrite });
      expect(responseObject.multiValueHeaders).to.be.an('object').that.deep.equals(overwrite);
    });
    it('should overwrite transformer', () => {
      const reply = new ResponseTemplate(undefined, (value) => value.toString());
      const responseObject = reply.make(200, 123456, { transform: () => 'weird but true'});
      expect(responseObject.body).to.equal('weird but true');
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
  it('should throw if non-string body is provided without a transformer', () => {
    const reply = new ResponseTemplate();
    assert.throws(() => reply.make(200, {}));
  });
});
