const router = require('express-promise-router')()
const { passport } = require('@root/passport.js')
const { verifyAllRolesMiddleware, validateRequiredParams } = require('@utils/index.js')
const queries = require('./queries/index.js')

async function verification(req, res, next) {
  if (req.user.userId !== req.body.userId) {
    return verifyAllRolesMiddleware(['admin'])(req, res, next)
  }

  next()
}

async function routeHandler(req, res, next) {
  const userId = req.body.userId
  const expenditureData = req.body.expenditureData

  const validation = validateRequiredParams(['userId', 'expenditureData'], req.body)

  if (!validation.isValid) {
    return res.status(409).json({
      message: 'Missing parameters',
      messageMap: validation.messageMap
    })
  }

  return queries.createExpenditure({ userId, expenditureData })
  .then(rowCount => {
    if (rowCount === 0) {
      return Promise.reject('Expenditure not created')
    }

    res.json({ message: 'Expenditure created' })
  })
  .catch(err => {
    res.status(500).json({ message: JSON.stringify(err) })
  })
}

router.post('*',
  passport.authenticate('jwt', { session: false }),
  verification,
  routeHandler)

module.exports = router
