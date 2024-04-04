const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')

app.use(cors({ origin: true, credentials: true }))
app.use(express.json())
app.use(morgan('dev'))

const server = app.listen(8080, () =>
  console.log(`
🚀 Server ready at: http://localhost:8080
`)
)
