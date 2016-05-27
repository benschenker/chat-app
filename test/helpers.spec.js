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
  describe('addNextChatterToChat()', () => {
    const visitor0 = {
      id: '0',
      name: 'visitor0',
    };
    const visitor1 = {
      id: '1',
      name: 'visitor1',
    };
    let state;

    it('takes a visitor from the queue and makes them the visitorChatting', () => {
      state = {
        queue: [
          visitor1,
        ], // array of visitor objects
        visitorChatting: visitor0, // a visitor object consisting of a name and an id
        operator: '123asdf', // the socket id of the logged in operator
      };
      const newState = helpers.addNextChatterToChat(state);
      expect(newState.queue.length).to.eql(0);
      expect(newState.visitorChatting).to.eql(visitor1);
    });

    it('empties the visitorChatting when the queue is empty', () => {
      state = {
        queue: [], // array of visitor objects
        visitorChatting: visitor0, // a visitor object consisting of a name and an id
        operator: '123asdf', // the socket id of the logged in operator
      };
      const newState = helpers.addNextChatterToChat(state);
      expect(newState.queue.length).to.eql(0);
      expect(newState.visitorChatting).to.eql({});
    });

    it('empties the visitorChatting when there is no operator', () => {
      state = {
        queue: [
          visitor1,
        ], // array of visitor objects
        visitorChatting: visitor0, // a visitor object consisting of a name and an id
        operator: undefined, // the socket id of the logged in operator
      };
      const newState = helpers.addNextChatterToChat(state);
      expect(newState.queue.length).to.eql(1);
      expect(newState.visitorChatting).to.eql({});
    });
  });
});
