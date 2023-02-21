# Instructor's Classes Extension
## The Extension
This example extension includes a card that shows the instructor's classes. This example provides a starting point for other functionality. Additional data and behavior could include more class details, and even third-party integrations with a way-finding provider to find your way to class.

This extension utilizes a microservice that uses Ethos GraphQL API

![](../docs/images/Instructor-Classes-Diagram.png)

To upload and use this extension you will need to do the following from the instructor-classes-lambda/extension directory:

* Run 'npm install'
* Set the "publisher" in extension.js. This should be the name of your institution or organization.
* Copy sample.env to .env. Adding your upload token and uncommenting and editing the other vars as appropriate.
* Run one of the deploy scripts in package.json. Such as "watch-and-upload" or "deploy-dev".
* Use Experience Setup to enable or verify your new extension is enabled, is associated with an Environment, has a shared secret, and, has an Extension API Token.

## Instructor's Classes Microservice

This example makes CORS (Cross-Origin Resource Sharing) API calls to an AWS Gateway that triggers an AWS Lambda function. This Lambda function authorizes requests and queries Ethos GraphQL.

See the readme for details [readme](../microservice/README.md)

<br/>

Copyright 2021–2023 Ellucian Company L.P. and its affiliates.
