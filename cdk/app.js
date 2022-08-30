
import { App } from 'aws-cdk-lib';
import { RngStack } from './stack.js';

const app = new App();

new RngStack(app, 'RngStack', {
  corsAllowAll: true
});

// Prod stack with strict CORS and explicit deployment environment
// new RngStack(app, 'RngStack-Prod', {
//   corsAllowAll: false,
//   env: {
//     account: '123456789012',
//     region: 'us-east-1'
//   },
// });
