const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const phonename = process.argv[3]

const phonenumber = process.argv[4]

const url =
  `mongodb+srv://fullstack:<password>@phonebook.rpxsc.mongodb.net/persons?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('person', personSchema)

const person = new Person({
  name: phonename,
  number: phonenumber
})

Person.find({}).then(result => {
  result.forEach(person => {
    console.log(person)
  })
  mongoose.connection.close()
})

person.save().then(response => {
  process.argv.forEach(persons => {
	console.log(`Added ${person.name} ${person.number} to phonebook`);
  })
  mongoose.connection.close()
})
