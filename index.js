//  IMPORTS AND CONFIGURATION
require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')

const app = express()
const Contact = require('./models/contact')
app.use(express.json())
app.use(cors())
app.use(express.static('dist'))




//  ======  Morgan middleware CONFIG  ======

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


//  ================================================

//  CRUD ENDPOINTS


//  ======  CREATE  ======

//  create a new contact
app.post('/api/contacts', (req, res) => {
  const body = req.body

  if (!body.name) {
    return res.status(400).json({error: 'name missing'})
  }

  if (!body.number) {
    return res.status(400).json({error: 'number missing'})
  }

  const contact = new Contact(
      {
        name: body.name,
        number: body.number,
      })

  contact.save().then(savedContact => {
    res.json(savedContact)
  })
})

//  =====  GET  =====

//  get all persons data
app.get('/api/contacts', (req, res) => {
  Contact.find({}).then((contacts) => {
    res.json(contacts)
  })
})

//  get one person data
app.get('/api/contacts/:id', (req, res) => {
  Contact.findById(req.params.id)
      .then((contact) => {
        if (contact) {
          res.json(contact)  // ← Contacto encontrado
        } else {
          res.status(404).json({ error: 'Contact not found' })  // ← No encontrado
        }
      })
      .catch((err) => {
        console.log('Error. Could not find contact', err)
        res.status(400).json({ error: 'malformatted id' })  // ← ID inválido
      })
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
app.delete('/api/contacts/:id', (req, res) => {
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
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`)
})