'use strict';

// tests for approveLetter
// Generated by serverless-mocha-plugin

const mochaPlugin = require('serverless-mocha-plugin');
const sandbox = require('sinon').createSandbox();
const expect = mochaPlugin.chai.expect;
const request = require('request-promise-native');
const AWS = require('aws-sdk-mock');
const fileHelper = require('./fileHelper');

let wrapped = mochaPlugin.getWrapper('approveLetter', '/handler.js', 'approveLetter');

describe('approveLetter Integration Tests', () => {

  let sesSpy = sandbox.spy();
  beforeEach(function () {
    sesSpy = sandbox.spy();
    AWS.mock('SES','sendEmail', sesSpy);
  });

  afterEach(function () {
    // completely restore all fakes created through the sandbox
    sandbox.restore();
  });

  it('calls SES.sendEmail with the expected object', (done) => {
    let payload = fileHelper.readJsonFile('test/data/approveLetterValidInputPayload.json');
    let encodedPayload = encodeURIComponent(JSON.stringify(payload));

    let event = {
      headers: { "content-type": "application/json" },
      body: `payload=${encodedPayload}`
    }

     wrapped.run(event).then((response) => {
      expect(response).to.not.be.empty;
      expect(sesSpy.calledOnce).to.be.true;
      const objectActuallyPassedToSES = sesSpy.firstCall.args[0];
      const objectExpectedToBePassedToSES = fileHelper.readJsonFile('test/data/approveLetterValidSESParameter.json');
      expect(objectActuallyPassedToSES).to.deep.equal(objectExpectedToBePassedToSES);
      done();
    });
  });
});
