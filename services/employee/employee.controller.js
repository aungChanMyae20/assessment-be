const express = require('express');
const router = express.Router();
const employeeService = require('./employee.service');
const employeeLocalService = require('./employeeLocal.service');

router.post('/', login);
// router.get('/', getAllUsers);
router.get('/', getEmployeesByPage);
router.post('/new', newUser);
// router.get('/user', getUserInfo);
router.post('/update', updateUser);
router.delete('/remove', deleteUser);
router.get('/decade-reports', getDecadeReports);

module.exports = router;

async function login(req, res, next) {
  await employeeLocalService.authenticate(req.body)
    .then(data => {
      if (data) {
        res.json({ ...data })
      } else {
        res.status(400).json({ message: 'bad request' })
      }
    })
    // .then(data => {
    //   if (data) {
    //     data.length === 0 ? res.json({ message: 'user not found' }) :
    //     res.json({ ...data })
    //   } else {
    //     res.status(400).json({ message: 'bad request' })
    //   } 
    // })
    .catch(err => next(err));
}

async function newUser(req, res, next) {
  await employeeLocalService.newEmployee(req.body)
    .then(data => {
      if (data) {
        res.json({ ...data })
      } else {
        res.status(304).json({ message: 'not modified'})
      }
    })
    .catch(err => next(err));
}

// async function getUserInfo(req, res, next) {
//   await employeeService.getUserInfo(req.query.id)
//     .then(data => {
//       if (data) {
//         data.length === 0 ? res.json({ message: 'no user found' }) :
//         res.status(200).json({ ...data })
//       } else {
//         res.status(400).json({ message: 'bad request' })
//       }
//     })
//     .catch(err => next(err));
// }

// async function getAllUsers(req, res, next) {
//   await employeeService.getAllUsers(req.body)
//     .then(data => {
//       data ? res.json({ ...data }) : res.status(500).json({ message: 'server error' })
//     })
//     .catch(err => next(err));
// }

async function updateUser(req, res, next) {
  await employeeLocalService.updateEmployee(req.body)
    .then(data => {
      data ? res.json({ ...data }) : res.status(500).json({ message: 'server error'})
    })
    .catch(err => next(err));
}

async function deleteUser(req, res, next) {
  await employeeLocalService.deleteEmployee(req.query.id)
    .then(response => {
      response ? res.json({ ...response }) : res.status(500).json({ message: 'server error' })
    })
    .catch(err => next(err));
}

async function getEmployeesByPage(req, res, next) {
  await employeeLocalService.getEmployeesByPage(req.query)
    .then(response => {
      response ? res.json({ ...response }) : res.json({ message: 'no user found'})
    })
    .catch(err => next(err));
}

async function getDecadeReports(req, res, next) {
  await employeeLocalService.decadeReport()
    .then(response => {
      response ? res.json({ data: response }) : res.json({ message: 'no report data' })
    })
    .catch(err => next(err))
}