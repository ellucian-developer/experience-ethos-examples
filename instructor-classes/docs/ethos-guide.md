# Instructor's Classes Ethos Guide

The Instructor's Classes examples use Ethos Integration to retrieve ERP data. It also makes use of GraphQL.

## Ethos Integration EEDM Setup

The Instructor's Classes examples needs an Ethos Integration Application's API Key to make the API calls to Ethos Integration. You can use the Experience Integration Application (Using the GraphQL Proxy will use Experience's Application) or create another one as needed. To create a new one, you can follow the steps as outlined in the Experience documentation [Create an application in Ethos Integration for Ellucian Experience](https://resources.elluciancloud.com/bundle/ellucian_experience_acn_configure/page/t_create_app_ethos_experience.html) for the purpose of these cards.

Since this example uses GraphQL ther are some additional steps to setup. This includes loading the needed resources into Ellucian Data Access and granting permission to use the Integration GraphQL for these resources.

You can follow the Experience documentation [Set up GraphQL requests to Data Access](https://resources.elluciancloud.com/bundle/ellucian_experience_acn_configure/page/c_set_up_graphql.html).

The following resources will need to be loaded into Data Access and permission given to the Ethos Integration Application that you use for these examples:

* buildings
* courses
* instructional-events
* persons
* rooms
* section-registrations
* sections
* subjects

Copyright 2021–2023 Ellucian Company L.P. and its affiliates.
