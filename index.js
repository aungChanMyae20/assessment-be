const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const { authenticate, decadeReport } = require('./services/employee/employeeLocal.service');

const PORT = 3002;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors('*'));

app.get('/', (req, res) => {
  res.send({ message: "Employee API"});
});

app.use('/login', require('./services/employee/employee.controller'));

app.use('/users', require('./services/employee/employee.controller'));

app.listen(PORT, () => console.log(`Express server currently running on port ${PORT}`));