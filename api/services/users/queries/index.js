const bcrypt = require('bcrypt')
const { query } = require('../../../../database/index.js')
const { sanitize, camelCaseMapKeys, decamelizeList } = require('@utils/index.js')
const decamelize = require('decamelize')

const READABLE_USER_COLUMNS = [
  'email',
  'first_name',
  'last_name',
  'password_hash',
  'roles'
]

const EDITABLE_USER_COLUMNS = [
  'email',
  'first_name',
  'last_name',
  'roles'
]

function getAllUsers({ selectFields = [] }) {
  const fields = decamelizeList(selectFields).filter(field => READABLE_USER_COLUMNS.includes(field))
  const columns = ['user_id'].concat(fields)

  const queryString = `SELECT ${columns.join(', ')} FROM Person`

  return query(queryString)
  .then(result => {
    return result.rows.map(row => camelCaseMapKeys(row))
  })
}

function getUserByUserId({ userId, selectFields = [] }) {
  const fields = decamelizeList(selectFields).filter(field => READABLE_USER_COLUMNS.includes(field))
  const columns = ['user_id'].concat(fields)

  const queryString = `SELECT ${columns.join(', ')} FROM Person WHERE user_id=$1`
  const data = [parseInt(userId)]

  return query(queryString, sanitize(data))
  .then(result => {
    return camelCaseMapKeys(result.rows[0])
  })
}

function getUserByEmail({ email, selectFields = [] }) {
  const fields = decamelizeList(selectFields).filter(field => READABLE_USER_COLUMNS.includes(field))
  const columns = ['user_id'].concat(fields)

  const queryString = `SELECT ${columns.join(', ')} FROM Person WHERE email=$1`
  const data = [email]

  return query(queryString, sanitize(data))
  .then(result => {
    return camelCaseMapKeys(result.rows[0])
  })
}

function createUser({ email, password, firstName, lastName, roles }) {
  const passwordHash = bcrypt.hashSync(password, 10)

  const queryString = 'INSERT INTO Person(email, first_name, last_name, roles, password_hash) VALUES($1, $2, $3, $4, $5)'
  const data = sanitize([email, firstName, lastName]).concat(roles, passwordHash)

  return query(queryString, data)
  .then(result => {
    return result.rowCount
  })
}

function updateUser({ userId, updateMap }) {
  const columns = []
  const data = [parseInt(userId)]
  let placeholderCounter = 2

  Object.entries(updateMap).forEach(([key, value]) => {
    if (EDITABLE_USER_COLUMNS.indexOf(decamelize(key)) === -1) {
      return
    }

    columns.push(`${decamelize(key)}=$${placeholderCounter}`)
    data.push(value)

    placeholderCounter++
  })

  const queryString = `UPDATE Person SET ${columns.join(', ')} WHERE user_id=$1`

  return query(queryString, sanitize(data))
  .then(result => {
    return result.rowCount
  })
}

function updateUserPassword({ userId, newPassword }) {
  return bcrypt.hash(newPassword, 10)
  .then(passwordHash => {
    const queryString = `UPDATE Person SET password_hash=$2 WHERE user_id=$1`
    const data = [parseInt(userId), passwordHash]

    return query(queryString, data)
  })
  .then(result => {
    return result.rowCount
  })
}

function deleteUser({ userId }) {
  const queryString = 'DELETE FROM Person WHERE user_id=$1'
  const data = [parseInt(userId)]

  return query(queryString, data)
  .then(result => {
    return result.rowCount
  })
}

module.exports.getAllUsers = getAllUsers
module.exports.getUserByUserId = getUserByUserId
module.exports.getUserByEmail = getUserByEmail
module.exports.createUser = createUser
module.exports.updateUser = updateUser
module.exports.updateUserPassword = updateUserPassword
module.exports.deleteUser = deleteUser
