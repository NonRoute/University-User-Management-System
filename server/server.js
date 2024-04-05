const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
const swaggerJsDoc = require('swagger-jsdoc')
const swaggerUI = require('swagger-ui-express')

const user = require('./routes/user')
const course = require('./routes/course')

app.use(cors({ origin: true, credentials: true }))
app.use(express.json())
app.use(morgan('dev'))

app.use('/user', user)
app.use('/course', course)

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Universiry User Management System API',
      version: '1.0.0',
      description: 'API Document'
    }
  },
  apis: ['./routes/*.js']
}
const swaggerDocs = swaggerJsDoc(swaggerOptions)
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs))

const server = app.listen(8080, () =>
  console.log(`
🚀 Server ready at: http://localhost:8080
`)
)
