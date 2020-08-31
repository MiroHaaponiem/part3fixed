import React, { useState, useEffect } from 'react'
import axios from 'axios'
import noteService from './services/notes'
import './index.css'

const Note = ({ note, deletenote }) => {
  
  return (
    <li>{note.name} {note.number} <button onClick={deletenote}>delete</button></li>
  )
}

const Filter = (props) => {
	return (
	<form>
		<div>
		filter shown with: <input
			type="text"
			placeholder="Search"
			value={props.values}
			onChange={props.change}
		/>
		</div>
	</form>
	)
}

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="error">
      {message}
    </div>
  )
}

const PersonForm = (props) => {
	return (
	    <form onSubmit={props.submit}>
        <div>
          name: <input 
				value={props.name}
				onChange={props.changer}
				/>
		  number: <input 
				  value={props.number}
				  onChange={props.changer2}
				 />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
	)
}

const App = () => {

  const [ persons, setPersons ] = useState([]) 
  const [ newNumber, setNumber ] = useState('')
  const [ newName, setNewName ] = useState('')
  const [ filterText, setFilterText ] = useState('')
  const [ errorMessage, setErrorMessage ] = useState(null)
  
  useEffect(() => {
    noteService
      .getAll()
      .then(initialNumbers => {
        setPersons(initialNumbers)
      })
  }, [])
  
  const addName = (event) => {
    event.preventDefault()
    const noteObject = {
    name: newName,
	number: newNumber,
	id: persons.length + 1
  }
  
  console.log(noteObject)
  
  noteService
	.create(noteObject)
	.then(returnedName => {
    setPersons(persons.concat(returnedName))
		setNewName('')
		setNumber('')
	setErrorMessage(
          `Added '${noteObject.name}'`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
    })
  }
  
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  
  const handleNumberChange = (event) => {
	setNumber(event.target.value)
  }
  
  const handleSearchChange = value => {
	  setFilterText(value);
	  SearchFilter(value);
  }
  
  const deleteitem = (id) => {
	  const url = `${id}`
	  const findperson = persons.find(persons => persons.id == id)
	  
	  noteService.remove(url)
		.then(window.confirm(`Delete ${findperson.name}`))
  }
  
  const exclude = ["id"];
  
  const SearchFilter = (value) => {
	  const lowercasedPersons = value.toLowerCase().trim();
	  if (lowercasedPersons === "") setPersons(persons);
	  else {
		  const filteredSearch = persons.filter(item => {
			  return Object.keys(item).some(key =>
				exclude.includes(key) ? false: item[key].toString().toLowerCase().includes(lowercasedPersons)
			);
		  });
		  setPersons(filteredSearch);
	  }
	}
		
  return (
    <div>
      <h2>Phonebook</h2>
	  <Notification message={errorMessage} />
	  <Filter 
		values={filterText}
		change={(e => handleSearchChange(e.target.value))}	
	  />
	  <h2>Add a New</h2>
	  <PersonForm
		submit={addName}
		name={newName}
		changer={handleNameChange}
		number={newNumber}
		changer2={handleNumberChange}
	  />
      <h2>Numbers</h2>
      <ul>
        {persons.map((note, i) => 
          <Note key={note.name} 
				note={note}
				deletenote={() => deleteitem(note.id)}
				/>
        )}
      </ul>
    </div>
  )

}

export default App
