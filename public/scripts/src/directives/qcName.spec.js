/* eslint-env jasmine */
/* eslint func-names: "off", no-param-reassign: "off"*/
/* global inject */
describe('Unit testing Name Directive', () => {
  let $compile;
  let $rootScope;
  let $httpBackend;

  // Load the myApp module, which contains the directive
  beforeEach(module('chat'));

  // Store references to $rootScope and $compile
  // so they are available to all tests in this describe block
  beforeEach(inject((_$compile_, _$rootScope_, _$httpBackend_) => {
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    // Directive loads a template with http so we mock it out using the whenGET function below
    $httpBackend = _$httpBackend_;
  }));

  it('Replaces the element with the appropriate partial view', () => {
    $httpBackend.whenGET('/views/qc-name')
      .respond('What is your name?');
    // Compile a piece of HTML containing the directive
    const element = $compile('<qc-name></qc-name>')($rootScope);
    // fire all the watches and return all the http requests
    $rootScope.$digest();
    $httpBackend.flush();
    // Check that the compiled element contains the templated content
    expect(element.html()).toContain('What is your name?');
  });
});
