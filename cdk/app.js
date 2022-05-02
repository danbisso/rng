
const { App } = require('aws-cdk-lib');
const { RngStack } = require('./stack');

const app = new App();
new RngStack(app, 'RngStack');
