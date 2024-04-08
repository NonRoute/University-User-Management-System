const request = require('supertest')
const app = require('./../server')

describe('List Users', () => {
  it('list all users', () => {
    request(app).get('/course').expect(200).expect('Content-Type', /json/)
  })
})
