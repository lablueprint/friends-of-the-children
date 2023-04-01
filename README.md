# Friends of the Children

This is the Github repository for the web app created for [Friends of the Children, Los Angeles](https://friendsofthechildren.org/) by [LA Blueprint](https://lablueprint.org/).

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Installation
Run the following commands in terminal in the directory you wish to clone this repository:

```
git clone https://github.com/lablueprint/friends-of-the-children.git
cd friends-of-the-children
npm install --save
```

## Running the Web App

In the project directory, you can run:

`npm start`

If it doesn't automatically open, go to [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Firebase

To connect to the Firebase backend, create a .env file at the project root and fill it with the appropriate environment variables. These can be found in the Firebase console for the friends-of-the-children Firebase app.

```
REACT_APP_FIREBASE_API_KEY=xxxxx
REACT_APP_FIREBASE_AUTH_DOMAIN=xxxxx
REACT_APP_FIREBASE_PROJECT_ID=xxxxx
REACT_APP_FIREBASE_STORAGE_BUCKET=xxxxx
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=xxxxx
REACT_APP_FIREBASE_APP_ID=xxxxx
REACT_APP_FIREBASE_MEASUREMENT_ID=xxxxx
```

## Google Calendar

Get your Google OAuth credentials, which grant access to the GCal API. Send the access token to API and get a refresh token.

Make sure this file does not get committed to the Github repository.