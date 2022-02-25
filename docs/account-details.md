# Experience Ethos Examples

## Account Details Examples

This set of example projects center around the [today-classes-extension](today-classes-extension/README.md). The extension includes cards that show today's classes for the current user. This example provides a starting point for other functionality. Additional data and behavior could include class details, grades, and even third-party integrations with a way-finding provider to find your way to class.

The UI content is primarily provided by the component in src/components/TodayClasses.jsx. This component is wrapped with a React Context that is parameterized by the several cards. Each card employs a different way to retrieve the data through Ethos Integration from the ERP.

<br/>

![](images/Account-Details-Lambda.png)

### Lambda microservice which uses Ethos GraphQL API

This example makes CORS (Cross-Origin Resource Sharing) API calls to an AWS Gateway that triggers an AWS Lambda function. This Lambda function authorizes requests, calls Ethos Integration GraphQL API, and filters data for the current user.

The "Today's Classes - Lambda" card requires two items to be configured in Experience Card Management

1. Lambda Today Classes URL - This will be the URL you get from deploying the [today-classes-lambda](today-classes-lambda/README.md) or running it locally in offline mode.
1. Ethos API Key - This is the Ethos API Key you wish to use. This could be the same API Key used for Experience or another one that is limited to the accessing the resources as described in the Ethos Guide (see below)

This example will use the same GraphQL queries and data loading requirements as were used with the Experience GraphQL Proxy above. The logic to filter to a list of just today's classes is contained in the Lambda function. This reduces the business logic in the browser to just sorting as needed for display.

The card in this case makes use of the getExtensionJwt property from Experience. This is an asynchronous function that generates a short-lived Experience Extension JWT token that is signed with a secret. This same secret is used by the lambda microservice to validate the JWT and extract the current user's ID.

The Lambda function is defined as a serverless.com framework node project. This is found in the same repository. See the Lambda [readme](today-classes-lambda/README.md)

Ethos GraphQL leverages the data stored in Ellucian Data Access. The following resources will need to be loaded into Data Access and permission given to the Experience Ethos Integration Application:

* buildings
* courses
* instructional-events
* persons
* rooms
* section-registrations
* sections
* subjects

See [Ethos Guide](today-classes-ethos-guide.md)

![](images/Account-Details-Page.png)

<br/>

Copyright 2021–2022 Ellucian Company L.P. and its affiliates.
