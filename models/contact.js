require('dotenv').config()
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to fullStackOpen MongoDB')

mongoose.connect(url)
    .then(res => {
      console.log('connected to MongoDB')
    })
    .catch(err => {
      console.log('Error connecting to MongoDB', err)
    })


//  Crea el modelo de datos para esta entidad
const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    minlength: [3, 'Name must be at least 3 characters'],
    trim: true
  },
  number: {
    type: String,
    required: [true, 'Number is required'],
    minlength: [9, 'Number must be at least 9 characters'],
    trim: true
  }
})


//  Modifica el formato del json que devuelve la petición
contactSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Contact', contactSchema)