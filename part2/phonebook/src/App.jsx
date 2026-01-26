import { useState } from "react";

const App = () => {
  const [persons, setPersons] = useState([
    { name: "Arto Hellas", number: "040-123456", id: 1 },
    { name: "Ada Lovelace", number: "39-44-5323523", id: 2 },
    { name: "Dan Abramov", number: "12-43-234345", id: 3 },
    { name: "Mary Poppendieck", number: "39-23-6423122", id: 4 },
  ]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [nameFilter, setNameFilter] = useState("");

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
      <div>
        filter shown with:{" "}
        <input value={nameFilter} onChange={handleInputNameFilter} />
      </div>
      <h2>Add New Person</h2>
      <form>
        <div>
          name: <input value={newName} onChange={handleInputNewName} />
        </div>
        <div>
          number: <input value={newNumber} onChange={handleInputNewNumber} />
        </div>
        <div>
          <button type="submit" onClick={handleClickAddPerson}>
            add
          </button>
        </div>
      </form>
      <h2>Numbers</h2>
      <div>
        {personsShown.map((person) => (
          <div key={person.id}>
            {person.name} {person.number}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
