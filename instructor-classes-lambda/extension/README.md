# Instructor's Classes Extension
This example extension includes a card that show instructor's classes. This example provides a starting point for other functionality. Additional data and behavior could include more class details, and even third-party integrations with a way-finding provider to find your way to class.

This extension utilizes a microservice that uses Ethos GraphQL API

![](../docs/images/Instructor-Classes-Diagram.png)

## Instructor's Classes Microservice

This example makes CORS (Cross-Origin Resource Sharing) API calls to an AWS Gateway that triggers an AWS Lambda function. This Lambda function authorizes requests and queries Ethos GraphQL.

See the readme for details [readme](../microservice/README.md)

<br/>

Copyright 2021–2023 Ellucian Company L.P. and its affiliates.
