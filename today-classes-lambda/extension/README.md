# Today's Classes Lambda Extension
This example extension includes a card that shows the student their classes that meet today. The data for the card is accessed through a Lambda function which queries Ethos GraphQL. The efficiency of GraphQL also reduces the round trips to Ethos by returning graphs of objects. There is some extra setup effort involved in loading the needed resources into Ellucian Data Access and authorizing the Ethos Application to use those resources.

<br/>

![](../docs/images/Todays-Classes-Lambda.png)

<br/>
To upload and use this extension you will need to do the following from the today-classes-lambda/extensions directory:

* Run 'npm install'
* Set the "publisher" in extension.js. This can be the name of your institution or organization.
* Copy sample.env to .env. Adding your upload token and uncommenting and editing the other vars as appropriate.
* Run one of the deploy scripts in package.json. Such as "watch-and-upload" or "deploy-dev".
* Use Experience Setup to ensure your extension is enabled and is associated with an Environment. Also, ensure it has a shared secret. Then generate or copy an Extension API Token.
* Use Experience -> Configuration -> Card Management to set up the card to be available in Experience. This includes configuring the microservice URL and the Ethos API Key. The microservice URL is configurable to allow you to run the Lambda function locally.

The microservice is detailed in the [microservice README](../microservice/README.md).

<br/>

Copyright 2021–2023 Ellucian Company L.P. and its affiliates.
