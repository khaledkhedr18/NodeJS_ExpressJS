const express = require('express');
const app = express();
const PORT = 8383;

let data = ['hegazy'];

app.use(express.json());

app.get('/', (req, res) => {
  res.send(`
    <body style="background:pink; color:blue;">
    <h1>DATA:</h1>
    <p>
    ${JSON.stringify(data)}
    </p>
    <a href="/dashboard">Dashboard</a>
    </body>
    `);
  console.log('I am on Homepage');
});

app.get('/dashboard', (req, res) => {
  console.log(`I hit dashboard!, ${req.method}`);
  res.send(`
    <body>
    <h1>Dashboard</h1>
    <a href="/">Homepage</a>
    </body>
    `);
});

app.get('/api/data', (req, res) => {
  console.log(`this one is for data`);
  res.send(data);
});

app.post('/api/data', (req, res) => {
  const newEntry = req.body;
  console.log(newEntry);
  data.push(newEntry.name);
  res.sendStatus(201);
});

app.delete('/api/data', (req, res) => {
  data.pop();
  console.log(`deleted the last element in our array!`);
  res.sendStatus(203);
});

app.listen(PORT, () => {
  console.log(`Server has started on: ${PORT}`);
});
