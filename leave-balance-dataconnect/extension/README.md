# Leave Balance Data Connect Extension
## The Extension
This example extension includes a card and page that show the current user, an employee their leave balance. The data for the card and page are acquired through the BP API (Banner Business Process API) through Ethos Integration.

The interaction between the Experience card and page with Ethos is as diagrammed.

<br/>

![](../docs/images/Leave-Balance-Diagram.png)

To upload and use this extension you will need to do the following from the leave-balance/extension directory:

* Run `nvm use` (this uses `.nvmrc` and Node 22).
* Run `npm install`
* Set the "publisher" in extension.js. Should be the name of your institution or organization.
* Copy sample.env to .env. Adding your upload token and uncommenting and editing the other vars as appropriate.
* Edit .env to include PIPELINE_LEAVE_BALANCE set to the name of your Data Connect pipeline. This is used in src/cards/LeaveBalance.jsx for the resource name used
* Run one of the deploy scripts in package.json. Such as "watch-and-upload" or "deploy-dev".
* Use Experience Setup to enable or verify your new extension is enabled, and is associated with an Environment.

### Configure the card
Login to Experience as a user with permission to use Experience Configuration -> Card Management. Locate the Leave Balance Data Connect card. This card has one item to configure.

1. Ethos API Key - set this to an Ethos API key that has access to the resources as described in [Ethos Guide](../docs/ethos-guide.md).

<br/>
The page view displays all the leave balances with more details.

![](../docs/images/Leave-Balance-Page.png)

## Leave Balance Data Connect API

This example makes use of a Data Connect API.

See the readme for details [readme](../dataconnect/README.md)

<br/>

Copyright 2021–2023 Ellucian Company L.P. and its affiliates.
