# Chat App

## Overview 

Chat App is a "Queued Chat" web application that allows visitors to queue up for chatting with an operator.
This application is composed of a small webserver component with two endpoints.

#### Root endpoint /

The `/` endpoint is where visitors enter the queue. This page has the following:
* A place to enter the nickname of the visitor
* An indicator that shows if the operator is currently available to chat
 * What is the visitor's place in the queue to chat with the operator
* If currently chatting with the operator, it displays an interface suitable for chatting. Including:
 * A text input for entering data
 * A history of the current chatting session, with messages from both operator and current visitor
 * A visitor has no visibility to the global queue of visitors or chat with other visitors.

#### Operator Endpoint /operator

The `/operator` endpoint is where the operator enters the site and makes himself/herself available to chat. The features of this page are:
* It has a list with the queue of current visitors waiting to chat
* A chat session history with the current chatting visitor.
* **Assumption**: Only a single operator can be logged in at all times.

#### Other considerations

* The operator can only chat with one visitor at a time.
* The operator can end the current chatting session by sending !next as a message. The next visitor in the queue will be served.

## Technical Overview

#### Languages/Libraries Used

* Javascript (ES6/ES2015)
 * Transpiling all front and back end code using babel
* Pug (Jade)
 * Rendering all html using pug
* Angular
* Socketjs
 * Supplies websockets for communication between front and back end
* Karma/Jasime
 * Front End Unit Testing
* Mocha/Chai
 * Back End Unit Testing
* Eslint
 * Linting using Airbnb style guide for all JS


#### Developer Setup

* `npm install`

#### Running the App

* `npm start`

#### Tests

* To run all tests: `npm test`
* Just back-end tests: `npm run unit-test-back`
* Just front-end tests: `npm run unit-test-front`