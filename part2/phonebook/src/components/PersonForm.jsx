const PersonForm = (props) => (
  <form>
    <div>
      name: <input value={props.newName} onChange={props.handleInputNewName} />
    </div>
    <div>
      number:{" "}
      <input value={props.newNumber} onChange={props.handleInputNewNumber} />
    </div>
    <div>
      <button type="submit" onClick={props.handleClickAddPerson}>
        add
      </button>
    </div>
  </form>
);

export default PersonForm;
