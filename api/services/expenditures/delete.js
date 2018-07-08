const router = require('express-promise-router')()
const { passport } = require('@root/passport.js')
const { verifyOneOfRoles, validateRequiredParams } = require('@utils/index.js')
const queries = require('./queries/index.js')

async function routeHandler(req, res) {
  const validation = validateRequiredParams(['expenditureId'], req.body)

  if (!validation.isValid) {
    return res.status(409).json({
      message: 'Missing parameters',
      messageMap: validation.messageMap
    })
  }

  let isAuthorizedByRole = true
  const expenditure = await queries.getExpenditureByExpenditureId({ expenditureId: req.body.expenditureId })

  if (!expenditure) {
    return res.status(409).json({
      message: 'Could not find expenditure with given expenditureId',
      messageMap: {
        expenditureId: 'Not found'
      }
    })
  }

  if (expenditure.userId !== req.user.userId) {
    const rolesList = (req.user.roles || '').split(' ')

    isAuthorizedByRole = verifyOneOfRoles(['admin'], rolesList)
  }

  if (!isAuthorizedByRole) {
    return res.status(403).json({ message: 'Invalid user roles', roles: req.user.roles })
  }

  return queries.deleteExpenditure({
    expenditureId: req.body.expenditureId
  })
  .then(rowCount => {
    if (rowCount === 0) {
      return Promise.reject('expenditure not deleted')
    }

    res.json({ message: `Expenditure deleted with expenditureId ${req.body.expenditureId}` })
  })
  .catch(err => {
    res.status(500).json({ message: JSON.stringify(err) })
  })
}

router.delete('*',
  passport.authenticate('jwt', { session: false }),
  routeHandler)

module.exports = router
