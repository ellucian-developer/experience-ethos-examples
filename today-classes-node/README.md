  # Experience Ethos Example - Today's Classes Node

This example is part of a suite of examples that illustrate multiple methods to access institution data through Ethos from Experience cards and pages. This use case is a card that displays the student's classes that meet today. This example fetches the Ethos data through a Node microservice. The microservice accesses the data through Ethos EEDM (Ellucian Ethos Data Model) Resource.

Diagram of the interaction between the Experience card and Ethos.

![](docs/images/Todays-Classes-Node.png)

## Today's Classes Extension

This extension includes a card that displays a student's classes that meet today.

For details regarding the extension see: [extension README](extension/README.md)

## Today's Classes microservice

This microservice is implemented as a Node express application. The Node application provides a today-classes endpoint that authorizes requests and makes requests to Ethos Integration EEDM resources.

For details regarding the microservice see: [microservice README](microservice/README.md)

Copyright 2021–2023 Ellucian Company L.P. and its affiliates.

  
