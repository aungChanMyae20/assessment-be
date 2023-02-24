const { v4: uuid4 } = require('uuid');
const jwt = require('jsonwebtoken');
const dayjs = require('dayjs');
const isBetween = require('dayjs/plugin/isBetween')
const config = require('../../config/token.config.json');

let employeeList = require('../../database/employee.json');

employeeList = employeeList.map((item) => ({
  ...item,
  gender: item.gender.toLowerCase(),
  joined_date: dayjs(item.joined_date).valueOf()
}))

module.exports = {
  authenticate,
  newEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeesByPage,
  decadeReport
}

dayjs.extend(isBetween);

async function authenticate({ email, password }) {
  const userIndex = employeeList.findIndex(item => item.email === email && item.password === password);
  if (userIndex > -1) {
    const { password, joined_date, ...rest } = employeeList[userIndex];
    const token = jwt.sign({ user: rest.id, role: rest.role }, config.secret);
    return {
      ...rest,
      token
    };
  } else {
    return null;
  }
}

async function newEmployee(data) {
  const id = uuid4();

  employeeList.push({ id, ...data });

  return ({
    data: { id, ...data },
    total: employeeList.length
  })
}

async function updateEmployee(data) {
  const targetIndex = employeeList.findIndex((item) => item.id === data.id);
  if (targetIndex > -1) {
    employeeList = employeeList.map((item, index) => 
      index === targetIndex ? { ...item, ...data } : item
    )
    return data;
  } 
  return null;
}

async function deleteEmployee(id) {
  const targetIndex = employeeList.findIndex(item => item.id === id);
  if (targetIndex > -1) {
    employeeList.splice(targetIndex, 1);
    return {
      id,
      total: employeeList.length
    };
  }
  return null;
}

async function getEmployeesByPage({ page, size }) {
  let pageNumber = +page;
  const sizeNumber = +size;
  const total = employeeList.length;
  let offset = ((pageNumber - 1)*sizeNumber + sizeNumber) > total ? 
      (employeeList.length + 1)
    : (pageNumber - 1 )*10 + sizeNumber ;

  if (((pageNumber - 1)*sizeNumber) >= total) {
    pageNumber = pageNumber - 1;
  }

  const list = employeeList.slice((pageNumber - 1)*sizeNumber, offset);

  if( list.length > 0 ) {
    const filteredList = list.map((item) => {
      const { password , ...rest } = item;
      return { ...rest }
    })
    return { data: filteredList, pageInfo: { size: sizeNumber, page: pageNumber, total }};
  }
  return {data: [], pageInfo: { size: sizeNumber, page: pageNumber, total }};
}

async function decadeReport() {
  const filteredByDate = employeeList.filter((item) => {
    const formatted = dayjs(+item.joined_date).format('YYYY-MM-DD')
    return dayjs(formatted).isBetween(dayjs().format('YYYY-MM-DD'), dayjs().subtract(10, 'years').format('YYYY-MM-DD'), 'day', '[)')
  })

  let dataset = new Map();
  filteredByDate.forEach(date => {
    const key = dayjs(+date.joined_date).year();
    const data = dataset.get(key) + 1 || 1
    dataset.set(key, data)
  })

  let years = [];
  dataset.forEach((_, key) => years.push(key));
  years.sort((y1, y2) => (y1 < y2) ? 1 : (y1 > y2) ? -1 : 0).reverse()

  let preparedList = null;
  years.forEach(year => preparedList = {
    ...preparedList,
    [year]: dataset.get(year)
  })

  if (preparedList) {
    return preparedList;
  }
  return null;
}