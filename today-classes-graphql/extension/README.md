# Today's Classes GraphQL Proxy Extension
This example extension includes a card that shows the student their classes that meet today. The data for the card is accessed through Ethos utilizing the Experience GraphQL proxy. Using Experience's GraphQL proxy avoids the need to deploy a microservice. The efficiency of GraphQL also reduces the round trips to Ethos by returning graphs of objects. There is some extra setup effort involved in loading the needed resources into Ellucian Data Access and authorizing the Ethos Application to use those resources.

<br/>

![](../docs/images/Todays-Classes-Experience-GraphQL-Proxy.png)

<br/>
To upload and use this extension you will need to do the following from the today-classes-graphql/extension directory:

* Run 'npm install'
* Set the "publisher" in extension.js. This can be the name of your institution or organization.
* Copy sample.env to .env. Adding your upload token and uncommenting and editing the other vars as appropriate.
* Run one of the deploy scripts in package.json. Such as "watch-and-upload" or "deploy-dev".
* Use Experience Setup to ensure your extension is enabled and is associated with an Environment.
* Use Experience -> Configuration -> Card Management to set up the card to be available in Experience.

## GraphQL Setup

Please see the [Ethos Guide](../docs/ethos-guide.md) for reference.

Copyright 2021–2023 Ellucian Company L.P. and its affiliates.
