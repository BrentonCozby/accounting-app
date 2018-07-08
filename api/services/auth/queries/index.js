const bcrypt = require('bcrypt')
const { query } = require('../../../../database/index.js')
const { sanitize, camelCaseMapKeys } = require('@utils/index.js')

async function getUserByEmail({ email }) {
  const queryString = 'SELECT user_id, first_name, last_name, email, password_hash, roles FROM Person WHERE email=$1'
  const data = sanitize([email])

  const result = await query(queryString, data)

  return camelCaseMapKeys(result.rows[0])
}

module.exports.getUserByEmail = getUserByEmail
