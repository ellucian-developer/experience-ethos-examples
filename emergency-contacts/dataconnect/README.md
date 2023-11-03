# Emergency Contacts Data Connect Severless API

This example extension creates, reads, updates and deletes data through the use of a Data Connect Serverless API. The API is created by using the Data Connect designer in Experience. The API pipeline sources are included in this directory, in several JSON files.

For Banner, you will use the following JSON files:

1. ethos-example-get-emergency-contacts.json
1. ethos-example-post-emergency-contacts.json
1. ethos-example-banner-put-emergency-contacts.json
1. ethos-example-banner-delete-emergency-contacts.json

For Colleague, you will use the following JSON files:

1. ethos-example-get-emergency-contacts.json
1. ethos-example-post-emergency-contacts.json
1. ethos-example-colleague-put-emergency-contacts.json
1. ethos-example-colleague-delete-emergency-contacts.json

### Ensure Ethos access to the necessary resources

Follow the [Ethos Guide](../docs/ethos-guide.md) to ensure the needed resources are available and you have an API Key that can be used to access them.

### Create the four API pipelines

You will need to create each API in your tenant by doing the following for each one:
Note: the prefix is needed to make a globally unique package and pipeline names. It is recommended that you use your institution's domain name part or your tenant alias for the prefix. For instance, for ellucian.edu, I could use ellucian as my prefix.

1. Login to Experience in a tenant that has the Data Connect - Integration Designer configured for use.
1. Create a package as needed. For example - \<prefix>-experience-ethos-examples
1. Create a pipeline using the "+PIPELINE" button.
1. Pick Pipeline Type - API
1. Enter a pipeline name. For example - \<prefix>-ethos-example-get-emergency-contacts.
1. Pick the appropriate HTTP Method for the pipeline you are creating. GET, POST, PUT or DELETE as denoted in each JSON file name.
1. Select Authentication Type - User Token
1. Click on "SAVE"
1. Click on the Dropdown next to the method, for example, "GET" at the top of the screen and pick "Import Pipeline".
1. Find the appropriate JSON file for the method you are creating from the list of files above and click on "Import"
1. Click on "SAVE"
1. Click on "PUBLISH", then after it shows you the version options, click on "PUBLISH". It will take some time to publish.
1. The API is ready to set up permissions

### Configure Data Connect Platform Component
Follow the directions in documentation titled [Publish and execute a serverless API](https://resources.elluciancloud.com/bundle/ethos_data_connect_int_design_acn_use/page/t_dc_designer_publish_execute_serverless_api.html).

### Configure Experience Permissions

The Data Connect Serverless API is published and ready to use once permissions are assigned.

1. Login to Experience Setup. Initially, you will probably be doing this in your Test tenant.
1. Click on "PERMISSIONS" in the top navigation bar in Experience Setup. Pick "DATA CONNECT".
1. Select "APIs" in the left navigation. Then your package. For example \<prefix>-experience-ethos-examples
1. Select each of your API Pipelines. For example - \<prefix>-ethos-example-get-emergency-contacts
1. In the right pane select the Role(s) and User(s) as desired to grant the Execute permission for these users. For this example, you would want to grant the Execute permission to a role that includes all students. This will allow all students to use the Experience extension to view their emergency contacts through the execution of these APIs.

The APIs are now ready to use. Configure the card in Experience and test it.


<br/>

Copyright 2021–2023 Ellucian Company L.P. and its affiliates.
