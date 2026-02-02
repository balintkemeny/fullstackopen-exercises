import { useState, useEffect } from "react";

import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import personService from "./services/persons";
import Notification from "./components/Notification";
import "./index.css";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [notificationMessage, setNotificationMessage] = useState(null);

  useEffect(() => {
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  const handleInputNewName = (event) => {
    setNewName(event.target.value);
  };

  const handleInputNewNumber = (event) => {
    setNewNumber(event.target.value);
  };

  const handleInputNameFilter = (event) => {
    setNameFilter(event.target.value);
  };

  const showNotification = (message) => {
    setNotificationMessage(message);
    setTimeout(() => {
      setNotificationMessage(null);
    }, 5000);
  };

  const handleClickAddPerson = (event) => {
    event.preventDefault();
    const existingPerson = persons.find((person) => person.name === newName);

    existingPerson === undefined
      ? createPerson()
      : updatePerson(existingPerson);
  };

  const createPerson = () => {
    const newPerson = { name: newName, number: newNumber };
    personService.create(newPerson).then((returnedPerson) => {
      setPersons(persons.concat(returnedPerson));
      setNewName("");
      setNewNumber("");
      showNotification(`Added ${returnedPerson.name}`);
    });
  };

  const updatePerson = (person) => {
    if (
      !window.confirm(
        `${person.name} is already added to the phonebook. Replace the old number with the new one?`,
      )
    ) {
      setNewName("");
      setNewNumber("");
      return;
    }

    personService
      .update(person.id, { ...person, number: newNumber })
      .then((returnedPerson) => {
        setPersons(
          persons.map((p) => (p.id === returnedPerson.id ? returnedPerson : p)),
        );
        setNewName("");
        setNewNumber("");
        showNotification(`Updated ${returnedPerson.name}`);
      });
  };

  const handleDeletePerson = (person) => {
    if (!window.confirm(`Delete ${person.name}?`)) {
      return;
    }

    console.log(`Deleting person: ${person.name}...`);
    personService.removePerson(person.id).then((response) => {
      console.log("Deletion response:", response);
      setPersons(persons.filter((p) => p.id !== person.id));
      showNotification(`Deleted ${person.name}`);
    });
  };

  const personsShown =
    nameFilter === ""
      ? persons
      : persons.filter((person) =>
          person.name.toLowerCase().includes(nameFilter.toLowerCase()),
        );

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={notificationMessage} />
      <Filter value={nameFilter} onChange={handleInputNameFilter} />
      <h2>Add New Person</h2>
      <PersonForm
        newName={newName}
        handleInputNewName={handleInputNewName}
        newNumber={newNumber}
        handleInputNewNumber={handleInputNewNumber}
        handleClickAddPerson={handleClickAddPerson}
      />
      <h2>Numbers</h2>
      <Persons persons={personsShown} handleDeletePerson={handleDeletePerson} />
    </div>
  );
};

export default App;
