
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


//  CREATE

//  aux function to generate ids while working on memory data
const generateId = () => {
  const maxId = persons.length > 0
      ? Math.max(...persons.map(n => n.id))
      : 0
  return maxId + 1
}


//  create a new person
app.post('/api/persons', (req, res) => {
  const newPerson = req.body

  if (!newPerson.name) {
    return res.status(400).json({error: 'Name is required'})
  }

  if (!newPerson.number) {
    return res.status(400).error({error: 'Number is required'})
  }

  const savedPerson = {
    "id": generateId(),
    "name": newPerson.name,
    "number": newPerson.number,
  }

  //  Store in memory array
  persons.push(savedPerson)
  return res.status(201).json(savedPerson)
})

//  GET

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
      : res.status(404).json({error : "No such person"})
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

//  DELETE

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


//  SERVER
const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`)
})