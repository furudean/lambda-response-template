/* tslint:disable:no-unused-expression */

import { assert, expect } from 'chai';
import { make } from '../src/make';
import { ResponseTemplate } from '../src/template';

const defaultResponseTemplate = new ResponseTemplate();

describe('make', () => {
  it('should set statusCode', () => {
    const statusCode = 200;
    const responseObject = make(defaultResponseTemplate, statusCode, '');

    expect(responseObject.statusCode).to.be.a('number').that.equals(statusCode);
  });
  it('should set body', () => {
    const body = 'blabla';
    const responseObject = make(defaultResponseTemplate, 200, body);

    expect(responseObject.body).to.be.a('string').that.equals(body);
  });
  it('undefined body should be set to \'\'', () => {
    const responseObject = make(defaultResponseTemplate, 200);

    expect(responseObject.body).to.be.a('string').that.equals('');
  });
  describe('overrides', () => {
    it('should set isBase64Encoded', () => {
      const responseObject = make(defaultResponseTemplate, 200, '', { isBase64Encoded: true });
      expect(responseObject.isBase64Encoded).to.be.a('boolean').that.equals(true);
     });
    it('should overwrite default headers', () => {
      const Reply = new ResponseTemplate({
        headers: { 'x-some-header': true },
      });
      const overwrite = { 'x-some-header': '*' };
      const responseObject = make(Reply, 404, 'Something not found', { headers: overwrite });
      expect(responseObject.headers).to.be.an('object').that.deep.equals(overwrite);
    });
    it('should overwrite multiValueHeaders', () => {
      const Reply = new ResponseTemplate({
        multiValueHeaders: { 'x-some-multi-header': ['yes'] },
      });
      const overwrite = { 'x-some-multi-header': ['no'] };
      const responseObject = make(Reply, 404, 'Something not found', { multiValueHeaders: overwrite });
      expect(responseObject.multiValueHeaders).to.be.an('object').that.deep.equals(overwrite);
    });
    it('should overwrite transformer', () => {
      const reply = new ResponseTemplate({
        transform: (value) => value.toString(),
      });
      const responseObject = make(reply, 200, 123456, { transform: () => 'weird but true'});
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

    const responseObject = make(Reply, 200, undefined, 'audio/mpeg');

    expect(responseObject.headers).to.deep.equal({
      'a': 'b',
      'content-type': 'audio/mpeg',
    });
  });
  it('should throw if non-string body is provided without a transformer', () => {
    assert.throws(() => make(defaultResponseTemplate, 200, {}));
  });
  it('should throw if transformer does not return a string', () => {
    const reply = new ResponseTemplate({
      transform: () => 12345 as any,
    });
    assert.throws(() => make(reply, 200));
  });
});
