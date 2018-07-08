const router = require('express-promise-router')()
const { passport } = require('@root/passport.js')
const queries = require('./queries/index.js')
const { verifyOneOfRoles, validateRequiredParams } = require('@utils/index.js')

async function getAllExpenditures(req, res, next) {
  const rolesList = (req.user.roles || '').split(' ')

  const isAuthorizedByRole = verifyOneOfRoles(['admin'], rolesList)

  if (!isAuthorizedByRole) {
    return res.status(403).json({ message: 'Invalid user roles', roles: req.user.roles })
  }

  return queries.getAllExpenditures({ selectFields: req.body.selectFields })
  .then(expenditureList => {
    res.json(expenditureList || [])
  })
  .catch(err => {
    res.status(500).json({ message: JSON.stringify(err) })
  })
}

async function getExpendituresByUserId(req, res, next) {
  let isAuthorizedByRole = true

  if (req.body.userId !== req.user.userId) {
    const rolesList = (req.user.roles || '').split(' ')

    isAuthorizedByRole = verifyOneOfRoles(['admin'], rolesList)
  }

  if (!isAuthorizedByRole) {
    return res.status(403).json({ message: 'Invalid user roles', roles: req.user.roles })
  }

  const validation = validateRequiredParams(['userId'], req.body)

  if (!validation.isValid) {
    return res.status(409).json({
      message: 'Missing parameters',
      messageMap: validation.messageMap
    })
  }

  return queries.getExpendituresByUserId({ userId: req.body.userId, selectFields: req.body.selectFields })
  .then(expenditureList => {
    res.json(expenditureList || [])
  })
  .catch(err => {
    res.status(500).json({ message: JSON.stringify(err) })
  })
}

async function getExpenditureByExpenditureId(req, res, next) {
  const validation = validateRequiredParams(['expenditureId'], req.body)

  if (!validation.isValid) {
    return res.status(409).json({
      message: 'Missing parameters',
      messageMap: validation.messageMap
    })
  }

  let isAuthorizedByRole = true

  return queries.getExpenditureByExpenditureId({ expenditureId: req.body.expenditureId, selectFields: req.body.selectFields })
  .then(expenditure => {
    if (expenditure.userId !== req.user.userId) {
      const rolesList = (req.user.roles || '').split(' ')

      isAuthorizedByRole = verifyOneOfRoles(['admin'], rolesList)
    }

    return isAuthorizedByRole
      ? res.json(expenditure || {})
      : res.status(403).json({ message: 'Invalid user roles', roles: req.user.roles })
  })
  .catch(err => {
    res.status(500).json({ message: JSON.stringify(err) })
  })
}

async function routeHandler(req, res, next) {
  if (req.body.all) {
    return getAllExpenditures(req, res, next)
  }

  if (req.body.userId) {
    return getExpendituresByUserId(req, res, next)
  }

  if (req.body.expenditureId) {
    return getExpenditureByExpenditureId(req, res, next)
  }

  res.status(406).json({
    message: 'Parameters for getting expenditures are required',
    params: 'all (boolean), userId (integer), expenditureId (integer)'
  })
}

router.post('*',
  passport.authenticate('jwt', { session: false }),
  routeHandler)

module.exports = router
