const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./modules/person')

app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())
app.use(express.static('build'))

let persons = [
{
      name: "Bobby Bobral",
      number: "555-555-555",
      id: 1
    },
    {
      name: "Janne Jontinen",
      number: "04309404939023",
      id: 2
    },
    {
      name: "Jonne Jukarinen",
      number: "080392909",
      id: 3
    },
    {
      name: "Jouni Jukkala",
      number: "42094290235",
      id: 4
    },
    {
      name: "Matti Pekkonen",
      number: "430490390324",
      id: 5
    },
    {
      name: "Jukka Palonen",
      number: "2538998235",
      id: 6
    },
    {
      name: "Hessu Halonen",
      number: "05290549054",
      id: 7
    },
    {
      name: "Tauno Torkko",
      number: "438900943",
      id: 8
    },
    {
      name: "Heikki Säilä",
      number: "930490439043092",
      id: 9
    },
    {
      name: "Lari Lontikka",
      number: "9035539032",
      id: 10
    },
    {
      name: "Pekka Pöntikkälä",
      number: "535346346433",
      id: 11
	}
]

const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(n => n.id))
    : 0
  return maxId + 1
}

app.get('/', (req, res) => {
  res.send('<h1>Go to api/persons</h1>')
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {        
		response.json(person)      
	  } else {        
		response.status(404).end()      
	  }    
	  })
    .catch(error => next(error))
})

app.get('/info', (request, response) => {
	const max = persons.length
	let login = new Date()
	
	response.send('Phonebook has info for ' + max + ' people.<br>' + login)
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body
  if (body.name === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }
  
  const person = new Person({
	name: body.name,
	number: body.number
  })
  
  person
  .save()
  .then(savedPerson => {
      return savedPerson.toJSON()
    })
    .then(savedAndFormattedPerson => {
      response.json(savedAndFormattedPerson)
    }) 
  .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
	} else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
	} else if (error.name === 'DuplicateError') {
	return response.status(403).json({ error: 'duplicate entry' })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})