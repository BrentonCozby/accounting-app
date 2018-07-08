const router = require('express-promise-router')()
const { passport } = require('@root/passport.js')
const queries = require('./queries/index.js')
const { verifyOneOfRolesMiddleware, validateRequiredParams } = require('@utils/index.js')

async function getAllUsers(req, res) {
  return queries.getAllUsers({ selectFields: req.body.selectFields })
  .then(usersList => {
    res.json(usersList || [])
  })
  .catch(err => {
    res.status(500).json({ message: JSON.stringify(err) })
  })
}

async function getUserByUserId(req, res) {
  const validation = validateRequiredParams(['userId', 'selectFields'], req.body)

  if (!validation.isValid) {
    return res.status(409).json({
      message: 'Missing parameters',
      messageMap: validation.messageMap
    })
  }

  return queries.getUserByUserId({ userId: req.body.userId, selectFields: req.body.selectFields })
  .then(user => {
    if (!user) {
      return res.status(409).json({
        message: `Could not find user with given userId: ${req.body.userId}`,
        userId: req.body.userId
      })
    }

    res.json(user || {})
  })
  .catch(err => {
    res.status(500).json({ message: JSON.stringify(err) })
  })
}

async function routeHandler(req, res) {
  if (req.body.all) {
    return getAllUsers(req, res)
  }

  if (req.body.userId) {
    return getUserByUserId(req, res)
  }

  res.status(406).json({
    message: 'Parameters for getting users are required',
    params: 'all (boolean), userId (string)'
  })
}

router.post('*',
  passport.authenticate('jwt', { session: false }),
  verifyOneOfRolesMiddleware(['admin', 'manager']),
  routeHandler)

module.exports = router
