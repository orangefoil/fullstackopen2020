const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const loginRouter = require('./controllers/login')
const usersRouter = require('./controllers/users')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')
const morgan = require('morgan')

morgan.token('body', function (req) {
  if (req.method === 'POST' || req.method === 'PUT') {
    return JSON.stringify(req.body)
  }
  return ''
})


mongoose.connect(config.MONGODB_URI, { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => logger.info('connected to MongoDB'))
  .catch((error) => logger.error('error connection to MongoDB:', error.message))

app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(middleware.tokenExtractor)

app.use('/api/blogs', blogsRouter)
app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
  console.log('enabled /api/testing endpoints')
}

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
