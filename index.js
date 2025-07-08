//  IMPORTS AND CONFIGURATION
const express = require('express')
const morgan = require('morgan')


const app = express()
app.use(express.json())

//  Custom token for POST requests
morgan.token(
    'body',
    function(req) {
      return JSON.stringify(req.body)
    })


//  Morgan custom settings for POST request
app.use(morgan(':method :url :status - :response-time ms - Request: :body', {
  skip: function(req) {
    return req.method !== 'POST'
  }
}))

//  Morgan setting to log exept for POST requests
app.use(morgan('tiny', {
  skip: function(req) {
    return req.method === 'POST'
  }
}))


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


//  =====  CREATE  =====

//  aux function to generate ids while working on memory data
const generateId = () => {
  return Math.floor(Math.random() * 100000)
}


//  create a new person
app.post('/api/persons', (req, res) => {
  const newPerson = req.body
  const personExist = persons.find(person => person.name === newPerson.name)

  if (!newPerson.name) {
    return res.status(400).json({error: 'Name is required'})
  }

  if (!newPerson.number) {
    return res.status(400).json({error: 'Number is required'})
  }

  if (personExist) {
    return res.status(400).json({error: 'Person with that name already exists'})
  }

  const savedPerson = {
    "id": generateId(),
    "name": newPerson.name,
    "number": newPerson.number,
  }

  //  store in memory array
  persons.push(savedPerson)
  return res.status(201).json(savedPerson)
})

//  =====  GET  =====

//  get all persons data
app.get('/api/persons', (req, res) => {
  res.json(persons)
})

//  get one person data
app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)
  person
      ? res.json(person)
      : res.status(404).json({error: "No such person"})
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


//  =====  DELETE  =====

//  delete one person
app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
  } else {
    res.status(404).json({error: "Person not found"})
  }
})

//  middleware to catch wrong endpoint requests
const unknownEndpoint = (request, response) => {
  response.status(404).json({error: 'unknown endpoint'})
}
app.use(unknownEndpoint)


//  ================================================

//  SERVER
const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`)
})