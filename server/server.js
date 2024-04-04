const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')

const user = require('./routes/user')

app.use(cors({ origin: true, credentials: true }))
app.use(express.json())
app.use(morgan('dev'))

app.use('/user', user)

const server = app.listen(8080, () =>
  console.log(`
🚀 Server ready at: http://localhost:8080
`)
)
