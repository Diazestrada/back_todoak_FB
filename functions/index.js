'use strict'

const functions = require('firebase-functions');
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const mongoose = require('mongoose')
const config = require('./settings/db/database')

const routesConfig = require('./routes/routes')

const app = express()

// settings
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(morgan('dev'))
app.use(cors())

// connect mongoose
mongoose.connect(config.db.mongodb.atlas, {
  autoIndex: false,
  useCreateIndex: true,
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true
})
mongoose.connection.on('connected', () => {
  console.log('Mongoose is connected')
})

mongoose.connection.on('Disconnected', function () {
  console.log('Mongoose is disconnected')
});

process.on('SIGINT', function () {
  mongoose.connection.close(function () {
    console.log('Mongoose connection is disconnected due to application termination');
    process.exit(0)
  });
});
routesConfig(app)

exports.api = functions.https.onRequest(app)

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

