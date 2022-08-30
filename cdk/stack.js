
import { Stack, CfnOutput, DockerImage } from 'aws-cdk-lib';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { CloudFrontWebDistribution } from 'aws-cdk-lib/aws-cloudfront';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { Function, Code, Runtime, FunctionUrlAuthType, HttpMethod, Architecture } from 'aws-cdk-lib/aws-lambda';
import { execSync } from 'child_process';
import fse from 'fs-extra';

export class RngStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    // Add an S3 bucket to host the front end
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

    // Add a Lambda function for the back end
    const backEndFunction = new Function(this, 'BackEndFunction', {
      runtime: Runtime.NODEJS_16_X,
      architecture: Architecture.ARM_64,
      code: Code.fromAsset('back-end'),
      handler: 'index.handler',
      reservedConcurrentExecutions: 1
    });

    // Add a URL to our back end function
    const functionUrl = backEndFunction.addFunctionUrl({
      authType: FunctionUrlAuthType.NONE,
      cors: {
        allowedOrigins: [props.corsAllowAll ? '*' : `https://${distribution.domainName}`],
        allowedMethods: [HttpMethod.GET]
      }
    });

    // Build the front end asset
    const build = Source.asset('./front-end', {
      bundling: {
        // The Docker image prop is required, but we won't use it, we'll use local bundling instead.
        // See: https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.BundlingOptions.html#local
        image: DockerImage.fromRegistry('alpine'),
        local: {
          tryBundle(outputDir) {
            // We can embed env var values into the CRA build at synth time
            // See: https://create-react-app.dev/docs/adding-custom-environment-variables
            // process.env.REACT_APP_STACK_ID = id;

            // Build commands
            execSync(`cd front-end && npm install && npm run build`, { stdio: 'inherit' });
            // Copy the build to the local bundling output dir
            fse.copySync('./front-end/build', outputDir, { recursive: true });
            return true;
          },
        },
      },
    });

    // Create an additional Source for the front end config file
    const frontEndConfig = Source.jsonData('config.json', { functionUrl: functionUrl.url });

    // Deploy the front end build and config to the S3 Bucket and refresh the CloudFront distribution
    new BucketDeployment(this, 'DeployWebsite', {
      sources: [build, frontEndConfig],
      destinationBucket: frontEndBucket,
      distribution,
      distributionPaths: ['/*']
    });

    // Output the CloudFront domain name
    new CfnOutput(this, 'DistributionDomainName', {
      value: distribution.domainName,
    });

    // Output the back end function URL
    new CfnOutput(this, 'FunctionURL', {
      value: functionUrl.url,
    });
  }
}
