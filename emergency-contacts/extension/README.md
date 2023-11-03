# Emergency Contacts Data Connect Extension
## The Extension
This example extension includes a card that shows the current user's emergency contacts and allows them to add, edit or remove emergency contacts.

<br/>

![](../docs/images/Emergency-Contacts-Diagram.png)

To upload and use this extension you will need to do the following from the emergency-contacts/extension directory:

### Upload the extension

1. Run 'npm install'
1. Set the "publisher" in extension.js. This should be the name of your institution or organization.
1. Copy sample.env to .env. Adding your upload token and uncommenting and editing the other vars as appropriate.
1. This includes setting the several PIPELINE* environment variables to the names of your pipelines - see [Data Connect Guide](../dataconnect/README.md)
1. Run one of the deploy scripts in package.json. Such as "watch-and-upload" or "deploy-dev".
1. Use Experience Setup to enable or verify your new extension is enabled, and is associated with an Environment.

### Configure the card
Login to Experience as a user with permission to use Experience Configuration -> Card Management. Locate the Emergency Contacts card. This card has one item to configure.

1. Ethos API Key - set this to an Ethos API key that has access to the resources as described in [Ethos Guide](../docs/ethos-guide.md).

<br/>

## Emergency Contacts Data Connect Serverless API

This example makes use of a Data Connect Serverless API.

See the readme for details [readme](../dataconnect/README.md)

<br/>

Copyright 2021–2023 Ellucian Company L.P. and its affiliates.
