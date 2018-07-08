const router = require('express-promise-router')()
const { validateRequiredParams } = require('@utils/index.js')
const queries = require('./queries/index.js')
const santizeHtml = require('sanitize-html')

async function routeHandler(req, res) {
  const email = req.body.email
  const password = req.body.password
  const firstName = req.body.firstName
  const lastName = req.body.lastName
  const roles = req.body.roles

  const validation = validateRequiredParams(['email', 'password', 'firstName', 'lastName'], req.body)

  if (!validation.isValid) {
    return res.status(409).json({
      message: 'Missing parameters',
      messageMap: validation.messageMap
    })
  }

  let user = await queries.getUserByEmail({ email })

  if (user) {
    return res.status(409).json({
      message: `User already exists with email: ${santizeHtml(email)}.`,
      messageMap: {
        email: 'Email already exists'
      }
    })
  }

  return queries.createUser({ email, password, firstName, lastName, roles })
  .then((rowCount) => {
    if (rowCount === 0) {
      return Promise.reject('User not created')
    }

    return queries.getUserByEmail({ email })
    .then(user => {
      const userPayload = {
        userId: user.userId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roles: user.roles
      }

      res.json({ user: userPayload, message: 'User created' })
    })
  })
  .catch(err => {
    res.status(500).json({ message: JSON.stringify(err) })
  })
}

router.post('*',
  routeHandler
)

module.exports = router
