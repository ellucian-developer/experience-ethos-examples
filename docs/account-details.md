# Experience Ethos Examples - Account Details

## Account Details Extension
This set of example projects center around the Account Details extension. The extension includes a card and page that show the current user their account details and balance. The data for the card and page are acquired through the BP API (Banner Business Process API) through Ethos Integration. This example provides a starting point for other functionality. Additional data and behavior could include using a Pay Now feature that integrates with your payment provider.

See the extension readme for details [readme](../account-details-extension/README.md)

The interaction between the Experience card and page with Ethos is as diagramed.

<br/>

![](images/Account-Details-Lambda.png)

## Account Details microservice

This example makes CORS (Cross-Origin Resource Sharing) API calls to an AWS Gateway that triggers an AWS Lambda function. This Lambda function authorizes requests and calls BP API through Ethos Integration.

See the readme for details [readme](../account-details-lambda/README.md)

See [Ethos Guide](account-details-ethos-guide.md)

<br/>

![](images/Account-Details-Page.png)

Copyright 2021–2022 Ellucian Company L.P. and its affiliates.
