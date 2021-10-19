# Today's Classes - Node
This example builds on a basic express node application. The today-classes API returns a student's classes for the given date, presumably today.

The today-classes endpoint does the following:
1. Allows CORS calls from Experience origins.
1. Verifies and decodes the Experience Extension JWT passed from the browser side extension.
1. Calls the card server configuration endpoint on Experience to retrieve the Ethos API Key.
1. Makes several Ethos Integration resource API calls as needed to get the student's classes for today. Note, the date is passed in so that today is determined by the browser's timezone rather than the server's timezone.

Here is an interaction diagram.

![](../docs/images/Todays-Classes-Node.png)

# Quick Start

To run the node application locally, do the following

1. Open a terminal and cd to the today-classes-node directory.
1. Execute `npm install` to install all the node modules needed.
1. Create .env. Copy the sample.env file to .env and add the JWT_SECRET and EXTENSION_API_TOKEN from Experience Setup Extension Management. See below.
1. Execute `npm start` will run the npm script 'node src/app'.

It will start a node application listening on port 3001. It will show you the base url for the application which will be http://localhost:3001. The URL you will need to use in the card configuration will be http://localhost:3001/api/today-classes.

The `npm start` will start the node application.
The `npm run watch` will start the node application and restart it with any code changes.

## JWT secret and extension API Token
You will need to create a JWT secret to share with the Extension Management and use in the .env file. This secret needs to be between 32 to 50 characters.

Once the extension is uploaded, an Extension API Token needs to be generated. Use Experience Setup Extension Management and edit the extension. Enter the JWT secret and then click on the "GENERATE API TOKEN" button. This will generate a Token that the server side can use to call back to Experience and get card configuration. Copy the generated token and add it to the .env file as the value for EXTENSION_API_TOKEN

## Configure Card

Please follow the readme for the [today-classes-extension](../today-classes-extension/README.md) to build and deploy the cards.

Login to Experience as a user with permission to use Card Mangement. Locate the Today's Classes - Node card. This card has two items to configure on step 3.

1. Node Today Classes URL - set this to http://localhost:3001/api/today-classes
1. Ethos API Key - set this to an Ethos API key that has access to the GraphQL resources as described in [Ethos Guide](../docs/today-classes-ethos-guide.md).