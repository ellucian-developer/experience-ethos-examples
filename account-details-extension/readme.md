# Account Details Extension
## The Extension
This set of example projects center around the Account Details Extension. The extension includes a card and page that show the current user their account details and balance. This example provides a starting point for other functionality. Additional data and behavior could include using a Pay Now feature that integrations with your payment provider.

The interaction between the Experience card and page with Ethos is as diagramed.

<br/>

![](../docs/images/Account-Details-Lambda.png)

To upload and use this extension you will need to do the following from the account-details-extensions directory:

* Run 'npm install'
* Set the "publisher" in extension.js. Should be the name of your institution or organization.
* Copy sample.env to .env. Adding your upload token and uncommenting and editing the other vars as appropriate.
* Run one of the deploy scripts in package.json. Such as "watch-and-upload" or "deploy-dev".
* Use Experience Setup to enable or verify your new extension is enabled, is associated with an Environment, has a shared secret, and generate and copy an Extension API Token.

## Account Details microservice

This example makes CORS (Cross-Origin Resource Sharing) API calls to an AWS Gateway that triggers an AWS Lambda function. This Lambda function authorizes requests and calls Ethos Integration.

See the readme for details [readme](../account-details-lambda/README.md)

<br/>

Copyright 2021–2022 Ellucian Company L.P. and its affiliates.
