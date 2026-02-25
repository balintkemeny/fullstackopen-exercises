const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("Provide MongoDB password as a positional argument!");
  process.exit(1);
}

const password = process.argv[2];

const mongoConnString = `mongodb://root:${password}@mongo:27017/phonebook?authSource=admin`;

mongoose.set("strictQuery", false);
mongoose.connect(mongoConnString);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

const getAllPersons = () => {
  Person.find({}).then((result) => {
    console.log("phonebook:");
    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
};

const insertPerson = (name, number) => {
  const person = new Person({ name, number });
  person.save().then((result) => {
    console.log(`added ${result.name} number ${result.number} to phonebook`);
    mongoose.connection.close();
  });
};

if (process.argv.length === 3) {
  getAllPersons();
} else {
  insertPerson(process.argv[3], process.argv[4]);
}
