const bcrypt = require('bcrypt')
const { query } = require('../../../../database/index.js')
const { sanitize, camelCaseMapKeys, decamelizeList } = require('@utils/index.js')
const decamelize = require('decamelize')

const READABLE_EXPENDITURE_COLUMNS = [
  'amount',
  'description',
  'comment',
  'date',
  'time'
]

const EDITABLE_EXPENDITURE_COLUMNS = [
  'amount',
  'description',
  'comment',
  'date',
  'time'
]

const READABLE_USER_COLUMNS = [
  'first_name',
  'last_name',
  'email',
  'roles'
]

async function getAllExpenditures({ selectFields = [] }) {
  const READABLE_COLUMNS = [...READABLE_EXPENDITURE_COLUMNS, ...READABLE_USER_COLUMNS]

  let columns = ['expenditure_id', 'user_id'].concat(decamelizeList(selectFields).filter(field => READABLE_COLUMNS.includes(field)))
  let joinsUserTable = columns.some(field => READABLE_USER_COLUMNS.includes(field))

  if (joinsUserTable) {
    columns = columns.map(column => {
      if (READABLE_USER_COLUMNS.includes(column)) {
        return `person.${column}`
      }

      return `expenditure.${column}`
    })
  }

  let queryString = `SELECT ${columns.join(', ')} FROM Expenditure`

  if (joinsUserTable) {
    queryString += ' INNER JOIN person ON expenditure.user_id = person.user_id'
  }

  if (columns.includes('date') && columns.includes('time')) {
    queryString += ' ORDER BY date DESC, time DESC'
  }

  return query(queryString)
  .then(result => {
    return result.rows.map(row => camelCaseMapKeys(row))
  })
}

async function getExpenditureByExpenditureId({ expenditureId, selectFields = [] }) {
  const READABLE_COLUMNS = [...READABLE_EXPENDITURE_COLUMNS, ...READABLE_USER_COLUMNS]

  let columns = ['expenditure_id', 'user_id'].concat(decamelizeList(selectFields).filter(field => READABLE_COLUMNS.includes(field)))
  const data = [parseInt(expenditureId)]
  let joinsUserTable = columns.some(field => READABLE_USER_COLUMNS.includes(field))

  if (joinsUserTable) {
    columns = columns.map(column => {
      if (READABLE_USER_COLUMNS.includes(column)) {
        return `person.${column}`
      }

      return `expenditure.${column}`
    })
  }

  let queryString = `SELECT ${columns.join(', ')} FROM Expenditure`

  if (joinsUserTable) {
    queryString += ' INNER JOIN person ON expenditure.user_id = person.user_id'
  }

  queryString += ' WHERE expenditure.expenditure_id=$1'

  if (columns.includes('date') && columns.includes('time')) {
    queryString += ' ORDER BY date DESC, time DESC'
  }

  return query(queryString, data)
  .then(result => {
    return result.rows.map(row => camelCaseMapKeys(row))
  })
}

async function getExpendituresByUserId({ userId, selectFields = [] }) {
  const READABLE_COLUMNS = [...READABLE_EXPENDITURE_COLUMNS, ...READABLE_USER_COLUMNS]

  let columns = ['expenditure_id', 'user_id'].concat(decamelizeList(selectFields).filter(field => READABLE_COLUMNS.includes(field)))
  const data = [parseInt(userId)]
  let joinsUserTable = columns.some(field => READABLE_USER_COLUMNS.includes(field))

  if (joinsUserTable) {
    columns = columns.map(column => {
      if (READABLE_USER_COLUMNS.includes(column)) {
        return `person.${column}`
      }

      return `expenditure.${column}`
    })
  }

  let queryString = `SELECT ${columns.join(', ')} FROM Expenditure`

  if (joinsUserTable) {
    queryString += ' INNER JOIN person ON expenditure.user_id = person.user_id'
  }

  queryString += ' WHERE expenditure.user_id=$1'

  if (columns.includes('date') && columns.includes('time')) {
    queryString += ' ORDER BY date DESC, time DESC'
  }

  return query(queryString, data)
  .then(result => {
    return result.rows.map(row => camelCaseMapKeys(row))
  })
}

async function createExpenditure({ userId, expenditureData }) {
  const columns = ['user_id']
  const values = ['$1']
  const data = [parseInt(userId)]
  let placeholderCounter = 2

  Object.entries(expenditureData).forEach(([key, value]) => {
    if (EDITABLE_EXPENDITURE_COLUMNS.indexOf(decamelize(key)) === -1) {
      return
    }

    columns.push(decamelize(key))
    values.push(`$${placeholderCounter}`)
    data.push(value)

    placeholderCounter++
  })

  const queryString = `INSERT INTO Expenditure(${columns.join(', ')}) VALUES(${values.join(', ')})`

  return query(queryString, sanitize(data))
  .then(result => {
    return result.rowCount
  })
}

async function updateExpenditure({ expenditureId, updateMap }) {
  const columns = []
  const data = [parseInt(expenditureId)]
  let placeholderCounter = 2

  Object.entries(updateMap).forEach(([key, value]) => {
    if (EDITABLE_EXPENDITURE_COLUMNS.indexOf(decamelize(key)) === -1) {
      return
    }

    columns.push(`${decamelize(key)}=$${placeholderCounter}`)
    data.push(value)

    placeholderCounter++
  })

  const queryString = `UPDATE Expenditure SET ${columns.join(', ')} WHERE expenditure_id=$1`

  return query(queryString, sanitize(data))
  .then(result => {
    return result.rowCount
  })
}

async function deleteExpenditure({ expenditureId }) {
  const queryString = 'DELETE FROM Expenditure WHERE expenditure_id=$1'
  const data = [parseInt(expenditureId)]

  return query(queryString, data)
  .then(result => {
    return result.rowCount
  })
}

module.exports.getAllExpenditures = getAllExpenditures
module.exports.getExpenditureByExpenditureId = getExpenditureByExpenditureId
module.exports.getExpendituresByUserId = getExpendituresByUserId
module.exports.createExpenditure = createExpenditure
module.exports.updateExpenditure = updateExpenditure
module.exports.deleteExpenditure = deleteExpenditure
