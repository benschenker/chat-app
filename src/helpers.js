/* eslint func-names: "off", no-console: "off"*/
const _ = require('lodash');
exports.init = (io) => {
  // Helper functions below which do not need access to the 'socket' variable

  // Returns a function that is used as a predicate to find a visitor with id 'id'
  function isVisitor(id) {
    return (visitorObj) => visitorObj.id === id;
  }

  // Anytime the queue changes we update the operator with the new queue state
  function queueUpdateOperator(currentState) {
    io.to(currentState.operator).emit('queueUpdateOperator', currentState.queue);
  }

  /* Grabs the next user from the queue and sets them as the visitorChatting
  Updates everyone that the queue has changed
  Sends the chatStart event to the operator and visitor so that they can start chatting
  */
  function addNextChatterToChat(currentState) {
    const newState = _.cloneDeep(currentState);
    if (newState.queue.length && newState.operator) {
      newState.visitorChatting = newState.queue.shift();
      io.emit('queueUpdate'); // notify all users that the queue has changed
      io.to(newState.operator).emit('chatStart', newState.visitorChatting);
      io.to(newState.visitorChatting.id).emit('chatStart');
    } else {
      newState.visitorChatting = {};
    }
    queueUpdateOperator(newState);
    return newState;
  }

  // Logging helper function
  function logState(currentState) {
    console.log(`
      queue: ${_.map(currentState.queue, (visitorObj) => _.get(visitorObj, 'id'))},
      visitorChatting: ${_.get(currentState.visitorChatting, 'id')},
      operator: ${currentState.operator}
    `);
  }

  return {
    logState,
    addNextChatterToChat,
    queueUpdateOperator,
    isVisitor,
  };
};
