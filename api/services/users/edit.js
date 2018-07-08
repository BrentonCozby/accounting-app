const router = require('express-promise-router')()
const { passport } = require('@root/passport.js')
const { verifyOneOfRolesMiddleware, validateRequiredParams } = require('@utils/index.js')
const queries = require('./queries/index.js')

async function routeHandler(req, res) {
  const validation = validateRequiredParams(['userId', 'updateMap'], req.body)

  if (!validation.isValid) {
    return res.status(409).json({
      message: 'Missing parameters',
      messageMap: validation.messageMap
    })
  }

  return queries.updateUser({
    userId: req.body.userId,
    updateMap: req.body.updateMap
  })
  .then(rowCount => {
    if (rowCount === 0) {
      return res.status(409).json({
        message: `Could not find user with given userId: ${req.body.userId}`,
        userId: req.body.userId
      })
    }

    res.json({ message: `User updated with userId ${req.body.userId}` })
  })
  .catch(err => {
    res.status(500).json({ message: JSON.stringify(err) })
  })
}

router.put('*',
  passport.authenticate('jwt', { session: false }),
  verifyOneOfRolesMiddleware(['admin', 'manager']),
  routeHandler)

module.exports = router
