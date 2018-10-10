'use strict';

// Import the mongoose module
const mongoose = require('mongoose');

// In order to use Express-mquery
const actions = require('mongoose-rest-actions');

mongoose.plugin(actions);

// Set up default mongoose connection
const mongoDB = 'mongodb://jeremy:pass@127.0.0.1:27017/ife';
mongoose.connect(
  mongoDB,
  { useCreateIndex: true, useNewUrlParser: true },
);
// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;
// Get the default connection
const db = mongoose.connection;

// Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
