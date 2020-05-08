
const cdk = require('@aws-cdk/core');
const app = new cdk.App();

class RngStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    // Add an S3 bucket to hold the front end
    const s3 = require('@aws-cdk/aws-s3');
    const frontEndBucket = new s3.Bucket(this, 'FrontEndBucket', {
      websiteIndexDocument: 'index.html',
      publicReadAccess: true
    });

    // Add a CloudFront CDN to serve the front end
    const cf = require('@aws-cdk/aws-cloudfront');
    const distribution = new cf.CloudFrontWebDistribution(this, 'FrontEndDistribution', {
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: frontEndBucket
          },
          behaviors: [{ isDefaultBehavior: true }]
        }
      ]
    });

    // Output the CloudFront domain name
    new cdk.CfnOutput(this, 'FrontEndDistributionDomainName', {
      value: distribution.domainName,
    });

    // Deploy the current build to the front end S3 Bucket and refresh the CloudFront distribution
    const s3deploy = require('@aws-cdk/aws-s3-deployment');
    new s3deploy.BucketDeployment(this, 'DeployWebsite', {
      sources: [s3deploy.Source.asset('./build')],
      destinationBucket: frontEndBucket,
      distribution: distribution
    });

  }
}

new RngStack(app, 'RngStack');
