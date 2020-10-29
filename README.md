
# Treehouse Project 9 FSJS REST API
Project 9 of Treehouse FSJS Techdegree Program

# Motivation
Motivation behind this project is to continue my learning within the fullstack JavaScript program. This focused on building an API for storing courses created by users.  This will be used for Project 10 of the FSJS program.

## Overview of the Provided Project Files

We've supplied the following files for you to use: 

* The `seed` folder contains a starting set of data for your database in the form of a JSON file (`data.json`) and a collection of files (`context.js`, `database.js`, and `index.js`) that can be used to create your app's database and populate it with data (we'll explain how to do that below).
* We've included a `.gitignore` file to ensure that the `node_modules` folder doesn't get pushed to your GitHub repo.
* The `app.js` file configures Express to serve a simple REST API. We've also configured the `morgan` npm package to log HTTP requests/responses to the console. You'll update this file with the routes for the API. You'll update this file with the routes for the API.
* The `nodemon.js` file configures the nodemon Node.js module, which we are using to run your REST API.
* The `package.json` file (and the associated `package-lock.json` file) contain the project's npm configuration, which includes the project's dependencies.
* The `RESTAPI.postman_collection.json` file is a collection of Postman requests that you can use to test and explore your REST API.

## Getting Started

To get up and running with this project, run the following commands from the root of the folder that contains this README file.

NOTE: I followed the pinned comment for 'robertpm' on the project to get started

First, install the project's dependencies using `npm`.

```
npm install
```

Second, update any vulnerabilities

```
npm audit fix
```

Third, seed the SQLite database.

```
npm run seed
```

Lastly, start the application.

```
npm start
```

To test the Express server, browse to the URL [http://localhost:5000/](http://localhost:5000/).
