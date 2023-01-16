# Experience Ethos Example - Leave Balance

This example, includes a card and page that show the current user, employee, their leave balance. There are two npm projects in this example, an extension and a microservice. The data for the card and page are acquired through the BP API (Banner Business Process API) through Ethos Integration.

The interaction between the Experience card and page with Ethos is as diagramed.

![](docs/images/Leave-Balance-Diagram.png)

## Account Details Extension

This extension includes a card which displays a summary of the leave balances. Clicking on the DETAILS button will open a page which displays all a detailed list of the leave balances.

For details regarding the extension see: [readme](extension/README.md)

## Account Details microservice

This microservice is implemented as a Serverless.com project which uses a JavaScript Lambda function in AWS. This extension makes CORS (Cross-Origin Resource Sharing) API calls to an AWS Gateway that triggers an AWS Lambda function. This Lambda function authorizes requests and calls BP API through Ethos Integration.

For details regarding the microservice see: [readme](microservice/README.md)

Copyright 2021–2023 Ellucian Company L.P. and its affiliates.
