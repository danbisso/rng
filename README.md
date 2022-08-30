
# Full Stack Javascript AWS CDK sample app

This sample app provides a (very useful) single button that will tell you: "Yes" or "No". 

All-Javascript stack:

- React front end hosted on S3 and served via Cloudfront
- Node.js serverless back end provided by Lambda
- Javascript IaC provided by AWS CDK
- Fast local development workflow with live front end reload, fast Lambda code updates and streaming logs

## Getting Started:
  1. Install project: `npm install`
  2. Install CDK: `npm install -g aws-cdk`
  3. Run `cdk deploy --watch`. This will watch the `lambda` folder for changes and update the code in Lambda. It will also stream Lambda logs in real time.
  4. After deployment is done, copy the `FunctionURL` output into `front-end/config.json` to associate your local React app to the Lambda back end URL.
  5. On a separate terminal, `cd front-end` then `npm start` to start up a front end server with live reload.
