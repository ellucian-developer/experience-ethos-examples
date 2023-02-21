# Today's Classes Node Ethos Guide
The Today's Classes example calls Ethos Integration from a Node microservice to make requests for EEDM resources.

## Ethos Integration EEDM Setup
The Today's Classes example needs an Ethos Integration Application's API Key to make the API calls to Ethos Integration. You can use the Experience Integration Application or create another one as needed. To create a new one, you can follow the steps as outlined in the Experience documentation [Create an application in Ethos Integration for Ellucian Experience](https://resources.elluciancloud.com/bundle/ellucian_experience_acn_configure/page/t_create_app_ethos_experience.html).

You will need to ensure the following resources are available on your underlying ERP APIs with the credentials used.

### Colleague API
The following resources need to be owned by the Integration Application using the Colleague API

* buildings
* courses
* instructional-events
* persons
* rooms
* section-registrations
* sections
* subjects

### Banner Integration API
The following resources need to be owned by the Integration Application using the Banner Integration API

* buildings
* courses
* persons

### Banner Student API
The following resources need to be owned by the Integration Application using the Banner Student API

* courses
* instructional-events
* section-registrations
* sections
* subjects

Copyright 2021–2023 Ellucian Company L.P. and its affiliates.
