import React, { useState, useEffect } from 'react'
import AddContactForm from './components/AddContactForm'
import Contacts from './components/Contacts'
import Error from './components/Error'
import Filter from './components/Filter'
import Notification from './components/Notification'
import phonebookService from './services/phonebook'

const App = () => {
  const [ filter, setFilter] = useState('')
  const [ contacts, setContacts] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ notificationMessage, setNotificationMessage ] = useState(null)
  const [ errorMessage, setErrorMessage ] = useState(null)

  useEffect(() => {
    phonebookService
      .getAll()
      .then(response => {
        setContacts(response)
      })
  }, [])

  const filteredContacts = contacts.filter(contact => contact.name.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notificationMessage} />
      <Error message={errorMessage} />
      <Filter filter={filter} setFilter={setFilter} />
      <h2>Add new contact</h2>
      <AddContactForm contacts={contacts} setContacts={setContacts} newName={newName} setNewName={setNewName} newNumber={newNumber} setNewNumber={setNewNumber} setNotificationMessage={setNotificationMessage} setErrorMessage={setErrorMessage} />
      <h2>Numbers</h2>
      <Contacts filteredContacts={filteredContacts} contacts={contacts} setContacts={setContacts} setErrorMessage={setErrorMessage} />
    </div>
  )
}

export default App
