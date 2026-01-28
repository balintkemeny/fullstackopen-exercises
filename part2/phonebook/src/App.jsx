import { useState, useEffect } from "react";

import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import personService from "./services/persons";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [nameFilter, setNameFilter] = useState("");

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

  const handleClickAddPerson = (event) => {
    event.preventDefault();

    if (persons.findIndex((person) => person.name === newName) !== -1) {
      alert(`${newName} is already added to the phonebook`);
      setNewName("");
      return;
    }

    const newPerson = { name: newName, number: newNumber };
    personService.create(newPerson).then((returnedPerson) => {
      setPersons(persons.concat(returnedPerson));
      setNewName("");
      setNewNumber("");
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
      <h2>Phonebook</h2>
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
