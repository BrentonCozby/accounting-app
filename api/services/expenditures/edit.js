const router = require('express-promise-router')()
const { passport } = require('@root/passport.js')
const { verifyOneOfRoles, validateRequiredParams } = require('@utils/index.js')
const queries = require('./queries/index.js')

async function routeHandler(req, res) {
  const validation = validateRequiredParams(['expenditureId', 'updateMap'], req.body)

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
    return res.status(403).json({ message: 'Invalid user roles', roles: req.uesr.roles })
  }

  return queries.updateExpenditure({
    expenditureId: req.body.expenditureId,
    updateMap: req.body.updateMap
  })
  .then(rowCount => {
    if (rowCount === 0) {
      return Promise.reject('expenditure not updated')
    }

    res.json({ message: `Expenditure updated with expenditureId ${req.body.expenditureId}` })
  })
  .catch(err => {
    res.status(500).json({ message: JSON.stringify(err) })
  })
}

router.put('*',
  passport.authenticate('jwt', { session: false }),
  routeHandler)

module.exports = router
