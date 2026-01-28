import Person from "./Person";

const Persons = ({ persons, handleDeletePerson }) => (
  <div>
    {persons.map((person) => (
      <Person
        key={person.id}
        person={person}
        handleDelete={() => handleDeletePerson(person)}
      />
    ))}
  </div>
);

export default Persons;
