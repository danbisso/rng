
const { Stack, CfnOutput } = require('aws-cdk-lib');
const { Bucket } = require('aws-cdk-lib/aws-s3');
const { CloudFrontWebDistribution } = require('aws-cdk-lib/aws-cloudfront');
const { BucketDeployment, Source } = require('aws-cdk-lib/aws-s3-deployment');

class RngStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    // Add an S3 bucket to hold the front end
    const frontEndBucket = new Bucket(this, 'FrontEndBucket', {
      websiteIndexDocument: 'index.html',
      publicReadAccess: true
    });

    // Add a CloudFront CDN to serve the front end
    const distribution = new CloudFrontWebDistribution(this, 'FrontEndDistribution', {
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
    new CfnOutput(this, 'FrontEndDistributionDomainName', {
      value: distribution.domainName,
    });

    // Deploy the current build to the front end S3 Bucket and refresh the CloudFront distribution
    new BucketDeployment(this, 'DeployWebsite', {
      sources: [Source.asset('./build')],
      destinationBucket: frontEndBucket,
      distribution,
      distributionPaths: ['/*']
    });
  }
}

module.exports = { RngStack };
