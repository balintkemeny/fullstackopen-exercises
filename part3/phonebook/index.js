const express = require("express");
const morgan = require("morgan");

const app = express();

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.use(express.json());

morgan.token("requestBody", (req, res) => JSON.stringify(req.body));
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :requestBody",
  ),
);

app.use(express.static("dist"));

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.post("/api/persons", (req, res) => {
  const body = req.body;

  let requestErrors = [];
  if (!body.name) {
    requestErrors = requestErrors.concat('the "name" field must not be empty');
  }

  if (!body.number) {
    requestErrors = requestErrors.concat(
      'the "number" field must not be empty',
    );
  }

  if (persons.find((p) => p.name === body.name)) {
    requestErrors = requestErrors.concat('the "name" field must be unique');
  }

  if (requestErrors.length > 0) {
    res.status(400).json({ errors: requestErrors });
    return;
  }

  const person = {
    id: String(Math.floor(Math.random() * 2e16)),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);

  res.json(person);
});

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const person = persons.find((p) => p.id === id);

  if (!person) {
    res.status(404).end();
    return;
  }

  res.json(person);
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  persons = persons.filter((p) => p.id !== id);

  res.status(204).end();
});

app.get("/info", (req, res) => {
  res.send(
    [
      `<p>Phonebook has info for ${persons.length} people</p>`,
      `<p>${new Date().toString()}</p>`,
    ].join("\n"),
  );
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server started on PORT ${PORT}`);
});
