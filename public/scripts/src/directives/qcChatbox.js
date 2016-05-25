/* global angular*/
/* eslint func-names: "off", no-param-reassign: "off"*/
angular.module('chat')
.directive('qcChatbox', [
  '$timeout',
  ($timeout) => ({
    restrict: 'E',
    templateUrl: '/views/qc-chatbox', // Server will serve html version of pug file
    link: ($scope, element, attrs) => { // eslint-disable-line no-unused-vars
      $scope.addMessage = (payload) => {
        $scope.history.push(payload);
        /* We want the below block to run after the $digest completes so as to include
        the message we just pushed onto the history array, otherwise we scroll down
        to the 2nd most recent message.
        The Angular docs recommend to wrap in a 0 ms $timeout to force the correct behavior
        See: https://docs.angularjs.org/error/$rootScope/inprog#inconsistent-api-sync-async-
        */
        $timeout(() => {
          /* To keep scrolled at newest messages
          See: http://stackoverflow.com/a/18614545
          */
          const historyEl = document.getElementById('history');
          historyEl.scrollTop = historyEl.scrollHeight;
        }, 0);
      };
    },
  }),
]);
