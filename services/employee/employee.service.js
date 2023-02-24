const { v4: uuid4 } = require('uuid');
const config = require('../../config/token.config.json');
const jwt = require('jsonwebtoken');
const Role = require('../../helpers/role');
const con = require('../../database/db');

const employeeList = require('../../database/employee.json');

module.exports = {
  authenticate,
  newUser,
  getUserInfo,
  getAllUsers,
  updateUser,
  deleteUser
}

const db = con();

async function authenticate({ email, password }) {
  try {
    const user = await db.query(`SELECT * FROM employee WHERE email='${email}' AND password='${password}';`);
    if (user.length > 0) {
      const token = jwt.sign({ sub: user[0].id, role: user[0].role }, config.secret);
      return {
        token,
        id: user[0].id
      }
    } else {
      return null;
    }
  } catch ( err ) {
    return err;
  }
}

async function newUser({ first_name, last_name, email, phone_number, gender, joined_date}) {
  const id = uuid4();
  try {
    const res = await db.query(`INSERT INTO employee (id, first_name, last_name, email, phone_number, gender, joined_date, role, status)
    VALUES ('${id}','${first_name}', '${last_name}', '${email}', '${phone_number}', '${gender}', '${joined_date}', 'standard', 'active');`);
    if ( res ) {
      return {
        id,
        first_name,
        last_name,
        email,
        phone_number,
        gender,
        joined_date,
        role: 'standard',
        status: 'active'
      }
    }
    return null;
  } catch (err) {
    return err;
  }
}

async function getUserInfo(id) {
  try {
    const user = await db.query(`SELECT * FROM employee WHERE id='${id}';`);
    if (user.length > 0) {
      const { password, ...profile } = user[0];
      return { ...profile };
    } else {
      return null;
    }
  } catch (err) {
    return err;
  }
}

async function getAllUsers() {
  try {
    const users = await db.query(`SELECT id, first_name, last_name, email, phone_number, gender, joined_date, role FROM employee WHERE employee.status='active';`)
    if (users.length > 0) {
      return {
        data: users
      };
    } else {
      return []
    }
  } catch (err) {
    return err;
  }
}

async function updateUser({ id, first_name, last_name, email, phone_number, gender, joined_date }) {
  try {
    const response = await db.query(`UPDATE employee
    SET first_name='${first_name}',
    last_name='${last_name}',
    email='${email}', 
    phone_number='${phone_number}', 
    gender='${gender}', 
    joined_date='${joined_date}'
    WHERE employee.id='${id}';`);
    if (response) {
      const updatedInfo = await db.query(`SELECT id, first_name, last_name, email, phone_number, gender, joined_date, role
      FROM employee
      WHERE id='${id}';`);
      return {
        data: updatedInfo[0]
      }
    } else {
      return null
    }
  } catch (err) {
    return err;
  }
}

async function deleteUser(id) {
  try {
    const response = await db.query(`DELETE FROM employee
    WHERE id='${id}';`);
    if (response) {
      return {
        id,
        message: 'user removed'
      }
    }
  } catch (err) {
    return err;
  }
}