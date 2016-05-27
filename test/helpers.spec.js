/* eslint-env mocha*/
/* eslint func-names: "off"*/

const expect = require('chai').expect;
const express = require('express');
const app = express();
const server = require('http').Server(app);// eslint-disable-line new-cap
const io = require('socket.io')(server);
const helpers = require('../lib/helpers.js').init(io);

describe('Helpers Module', () => {
  describe('isVisitor()', () => {
    it('returns a function that gets the id of a visitor object', () => {
      const visitor = {
        id: '123ab',
        name: 'Mary Jane',
      };
      expect(helpers.isVisitor('123ab')(visitor)).to.eql(true);
      expect(helpers.isVisitor('432zx')(visitor)).to.eql(false);
    });
  });
});
