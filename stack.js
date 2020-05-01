
const cdk = require('@aws-cdk/core');
const app = new cdk.App();

class RngStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const s3 = require('@aws-cdk/aws-s3');
    const frontEndBucket = new s3.Bucket(this, 'MyBucket', {
      websiteIndexDocument: 'index.html',
      publicReadAccess: true
    });

    const s3deploy = require('@aws-cdk/aws-s3-deployment');
    new s3deploy.BucketDeployment(this, 'DeployWebsite', {
      sources: [s3deploy.Source.asset('./build')],
      destinationBucket: frontEndBucket
    });

  }
}

new RngStack(app, 'RngStack');
