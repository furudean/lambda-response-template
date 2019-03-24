/* tslint:disable:no-unused-expression */

import { expect } from 'chai';
import { isString } from '../src/util';

describe('util', () => {
  describe('isString', () => {
    it('should return true for a string', () => {
      const result = isString('some string');
      expect(result).to.be.true;
    });
    it('should return false for an object', () => {
      const result = isString({});
      expect(result).to.be.false;
    });
    it('should return false for a boolean', () => {
      const result = isString(false);
      expect(result).to.be.false;
    });
    it('should return false for a number', () => {
      const result = isString(0);
      expect(result).to.be.false;
    });
    it('should return false for undefined', () => {
      const result = isString(undefined);
      expect(result).to.be.false;
    });
    it('should return false for null', () => {
      const result = isString(null);
      expect(result).to.be.false;
    });
  });
});
