# Account Details Extension
## The Extension
This example extension includes a card and page that show the current user their account details and balance. This example provides a starting point for other functionality. Additional data and behavior could include using a Pay Now feature that integrates with your payment provider.

The architecture of this extension is diagramed.

<br/>

![](../docs/images/Account-Details-Diagram.png)

To upload and use this extension you will need to do the following from the account-details-dataconnect/extension directory:

### Upload the extension

1. Run 'npm install'
1. Set the "publisher" in extension.js. This should be the name of your institution or organization.
1. Copy sample.env to .env. Adding your upload token and uncommenting and editing the other vars as appropriate.
1. Run one of the deploy scripts in package.json. Such as "watch-and-upload" or "deploy-dev".
1. Use Experience Setup to enable or verify your new extension is enabled, is associated with an Environment, has a shared secret, and, has an Extension API Token.

### Configure the card
Login to Experience as a user with permission to use Experience Configuration -> Card Management. Locate the Account Details card. This card has two items to configure.

1. The Pay Now URL is optional. This can be used to link to a payment provider to pay the amount due.
1. Ethos API Key.


<br/>
The page view displays all the transactions with more details.

![](../docs/images/Account-Details-Page.png)

## Account Details Data Connect API

This example makes use of a Data Connect API.

See the readme for details [readme](../dataconnect/README.md)

<br/>

Copyright 2021–2023 Ellucian Company L.P. and its affiliates.
