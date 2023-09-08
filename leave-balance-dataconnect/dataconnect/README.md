# Leave Balance Data Connect API

This example extension retrieves data through the use of a Data Connect Serverless API. The API is created by using the Data Connect designer in Experience. The API pipeline source is included in this directory, in a file called ethos-example-account-details.json

To create the API in your tenant, you will need to do the following:

### Create the API pipeline

1. Login to Experience in a tenant that has the Data Connect - Integration Designer configured for use.
1. Create a package as needed. For example - experience-ethos-examples
1. Create a pipeline using the "+PIPELINE" button.
1. Pick Pipeline Type - API
1. Enter a pipeline name. For example - \<tenant-alias>-leave-balance  NOTE: \<tenant-alias> or similar will be needed to name space the API. The name has to be globally unique, meaning others might pick the same name if you don't name space it. It doesn't have to be your tenant alias.
1. Select HTTP Method - GET
1. Select Authentication Type - User Token
1. Click on "SAVE"
1. Click on the Dropdown next to "GET" at the top of the screen and pick "Import Pipeline".
1. Find ethos-example-leave-balance.json file and click on "Open"
1. Click on "SAVE"
1. Click on "PUBLISH", then after it shows you the version options, click on "PUBLISH". It will take some time to publish.
1. The API is ready to set up permissions

### Configure Data Connect Platform Component
Follow the directions in documentation titled [Publish and execute a serverless API](https://resources.elluciancloud.com/bundle/ethos_data_connect_int_design_acn_use/page/t_dc_designer_publish_execute_serverless_api.html).

### Configire Experience Ethos application Tag
1. Use Ethos Integration UI and navigate to the Ethos application used by Experience.
1. Click on the *ADD TAG*
1. Enter **integration-package** for the name
1. Enter **data-connect-package-name** for the value. This can be a comma seperated list if using more than one package
1. Save the Tag.

### Configure Experience Permissions

The Data Connect API is published and ready to use once permissions are assigned.

1. Login to Experience Setup. Initially, you will probably be doing this in your Test tenant.
1. Click on "PERMISSIONS" in the top navigation bar in Experience Setup. Pick "DATA CONNECT".
1. Select "APIs" in the left navigation. Then your package. For example experience-ethos-examples
1. Select your API Pipeline. For example - \<tenant-alias>-leave-balance
1. In the right pane select the Role(s) and User(s) as desired to grant the Execute permission for these users. For this example, you would want to grant the Execute permission to a role that includes all employees. This will allow all employees to use the Experience extension to view their leave balance through the execution of this API

The API is now ready to use. Configure the card in Experience and test it.


<br/>

Copyright 2021–2023 Ellucian Company L.P. and its affiliates.
