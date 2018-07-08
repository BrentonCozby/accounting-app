const passport = require("passport")
const passportJWT = require("passport-jwt")
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy
const { getUserByUserId } = require('@services/users/queries/index.js')

require('dotenv').config({ path: '../api.env' })

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: new Buffer(process.env.JWT_SECRET, 'base64')
}

const strategy = new JwtStrategy(jwtOptions, async function(jwtPayload, next) {
  const selectFields = ['email', 'first_name', 'last_name', 'roles']
  const result = await getUserByUserId({ userId: jwtPayload.userId, selectFields })

  const userPayload = {
    userId: result.userId,
    email: result.email,
    firstName: result.firstName,
    lastName: result.lastName,
    roles: result.roles
  }

  if (result) {
    next(null, userPayload)
  } else {
    next(null, false)
  }
})

passport.use(strategy)

module.exports.jwtOptions = jwtOptions
module.exports.passport = passport
