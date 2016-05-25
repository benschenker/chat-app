/* global angular*/
/* eslint func-names: "off", no-param-reassign: "off"*/
angular.module('chat')
.directive('qcChatbox', [
  () => ({
    restrict: 'E',
    templateUrl: '/views/qc-chatbox', // Server will serve html version of pug file
    link: (scope, element, attrs) => { // eslint-disable-line no-unused-vars
    },
  }),
]);
