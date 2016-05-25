/* global angular*/
/* eslint func-names: "off", no-param-reassign: "off"*/
angular.module('chat')
.directive('qcName', [
  () => ({
    restrict: 'E',
    templateUrl: '/views/qc-name', // Server will serve html version of pug file
    link: (scope, element, attrs) => { // eslint-disable-line no-unused-vars
    },
  }),
]);
