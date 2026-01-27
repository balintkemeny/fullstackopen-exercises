import { useState, useEffect } from "react";
import axios from "axios";

import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [nameFilter, setNameFilter] = useState("");

  useEffect(() => {
    axios.get("http://localhost:3001/persons").then((response) => {
      setPersons(response.data);
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

    const newId = Math.max(...persons.map((person) => person.id)) + 1;
    const newPerson = { name: newName, number: newNumber, id: newId };
    setPersons(persons.concat(newPerson));
    setNewName("");
    setNewNumber("");
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
      <Persons persons={personsShown} />
    </div>
  );
};

export default App;
