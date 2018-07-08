const router = require('express-promise-router')()
const { passport } = require('@root/passport.js')
const queries = require('./queries/index.js')
const { verifyOneOfRoles, validateRequiredParams } = require('@utils/index.js')

async function routeHandler(req, res) {
  const validation = validateRequiredParams(['userId', 'newPassword'], req.body)

  if (!validation.isValid) {
    return res.status(409).json({
      message: 'Missing parameters',
      messageMap: validation.messageMap
    })
  }

  let isAuthorizedByRole = true
  const userId = req.body.userId

  if (userId !== req.user.userId) {
    const rolesList = (req.user.roles || '').split(' ')

    isAuthorizedByRole = verifyOneOfRoles(['admin', 'manager'], rolesList)
  }

  if (!isAuthorizedByRole) {
    return res.status(403).json({ message: 'Forbidden by role. Cannot change password of another user.', roles: req.user.roles })
  }

  return queries.updateUserPassword({
    userId,
    newPassword: req.body.newPassword
  })
  .then(rowCount => {
    if (rowCount === 0) {
      return res.status(409).json({
        message: `Could not find user with given userId: ${req.body.userId}`,
        userId: req.body.userId
      })
    }

    res.json({ message: `Password updated` })
  })
  .catch(err => {
    res.status(500).json({ message: JSON.stringify(err) })
  })
}

router.post('*',
  passport.authenticate('jwt', { session: false }),
  routeHandler)

module.exports = router
