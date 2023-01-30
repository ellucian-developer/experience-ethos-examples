  # Experience Ethos Example - Today's Classes Lambda

This example is part of a suite of examples that illustrate multiple methods to access institution data through Ethos from Experience cards and pages. This use case is a card that displays the student's classes that meet today. This example fetches the Ethos data through a Lambda microservice. The microservice accesses the data through Ethos GraphQL. The efficiency of GraphQL also reduces the round trips to Ethos by returning graphs of objects. There is some extra setup effort involved in loading the needed resources into Ellucian Data Access and authorizing the Ethos Application to use those resources.

Diagram of the interaction between the Experience card and Ethos.

![](docs/images/Todays-Classes-Lambda.png)

## Today's Classes Extension

This extension includes a card that displays a student's classes that meet today.

For details regarding the extension see: [extension README](extension/README.md)

## Today's Classes microservice

This microservice is implemented as a Serverless.com project which uses a JavaScript Lambda function in AWS. This extension makes CORS (Cross-Origin Resource Sharing) API calls to an AWS Gateway that triggers an AWS Lambda function. This Lambda function authorizes requests and queries Ethos GraphQL.

For details regarding the microservice see: [microservice README](microservice/README.md)

Copyright 2021–2023 Ellucian Company L.P. and its affiliates.

  
