require("dotenv").config();

const mongoose = require('mongoose')
const debug = require('debug')('express-mongoose-es6-rest-api:index')
const worker = require("./worker")
// make bluebird default Promise
Promise = require('bluebird') // eslint-disable-line no-global-assign

// plugin bluebird promise in mongoose
mongoose.Promise = Promise

// connect to mongo db
const mongoUri = process.env.MONGO_URI || process.env.MONGO_HOST
const mongoOptions = {
  socketTimeoutMS: 0,
  keepAlive: true,
}
mongoose.connect(mongoUri, mongoOptions)
mongoose.connection.on('error', (ctx) => {
  console.log(ctx)
  throw new Error(`unable to connect to database: ${mongoUri}`)
})

// worker.syncNfts()
worker.updateNFTlinks()