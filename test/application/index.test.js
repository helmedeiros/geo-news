'use strict';

var expect = require('chai').expect;
var application = require('../../lib/src/application');

describe('application index', function () {
  it('re-exports the use-case factories', function () {
    expect(application.indexNews.create).to.be.a('function');
    expect(application.indexAll.create).to.be.a('function');
    expect(application.queryByRegion.create).to.be.a('function');
  });
});
