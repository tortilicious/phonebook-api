
//  IMPORTS AND CONFIGURATION
const express = require('express')
const app = express()
app.use(express.json())

//  DATA
let persons = [
  {
    "id": 1,
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": 2,
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": 3,
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": 4,
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
]

//  ================================================

//  CRUD ENDPOINTS

//  GET

//  get all persons
app.get('/api/persons', (req, res) => {
  res.json(persons)
})

//  get phonebook info
app.get('/api/info', (req, res) => {
  const phoneNumbers = persons.length
  const requestDate = new Date()

  res.send(`
    <div>
      <p>Phonebook has info for ${phoneNumbers} people</p>
      <p>${requestDate}</p>
    </div>
  `)
})


//  SERVER
const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`)
})