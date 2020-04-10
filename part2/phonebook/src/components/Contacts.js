import React from 'react'
import phonebookService from '../services/phonebook'

const Contacts = ({filteredContacts, contacts, setContacts}) => {
  const deleteContact = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      phonebookService.remove(id)
        .then(response => {
          filteredContacts = filteredContacts.filter(contact => contact.id !== id)
          setContacts(contacts.filter(contact => contact.id !== id))
        })
        .catch(error =>
          alert(`unable to delete contact with id ${id}`)
        )
    }
  }

  return (
    <>
      {filteredContacts.map((contact) =>
        <p key={contact.id}>
          {contact.name} {contact.number}
          <button type="button" onClick={() => deleteContact(contact.id, contact.name)}>delete</button>
        </p>
      )}
    </>
  )
}

export default Contacts
