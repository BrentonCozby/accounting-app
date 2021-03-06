import jwt from 'jsonwebtoken'
import HttpService from 'services/http/http-service.js'
import history from '../../history.js'

export function setSession(accessToken) {
  localStorage.setItem('accessToken', accessToken)
}

export function clearSession() {
  localStorage.removeItem('accessToken')
}

export function createToken({ email, password }) {
  const endpoint = '/auth/create-token'
  const body = { email, password }

  return HttpService.post({ endpoint, body })
}

export function login({ email, password }) {
  return createToken({ email, password })
  .then(res => {
    setSession(res.accessToken)
    history.redirect('/dashboard')
  })
}

export function logout() {
  clearSession()

  history.redirect('/')
}

export function getEncodedAccessToken() {
  return localStorage.getItem('accessToken')
}

export function getDecodedAccessToken() {
  const token = getEncodedAccessToken()

  return token ? jwt.verify(token, new Buffer(process.env.REACT_APP_TOKEN_SECRET, 'base64')) : {}
}

export function getTokenExpirationMs() {
  return getDecodedAccessToken().expirationMs
}

export function getAuthenticatedUser() {
  return {
    userId: getDecodedAccessToken().userId || '',
    firstName: getDecodedAccessToken().firstName || '',
    lastName: getDecodedAccessToken().lastName || '',
    roles: getDecodedAccessToken().roles || ''
  }
}

export function isAuthenticated() {
  const tokenExists = Boolean(getEncodedAccessToken())
  const isTokenExpired = new Date().getTime() >= getTokenExpirationMs()

  return tokenExists && !isTokenExpired
}

export default {
  setSession,
  clearSession,
  createToken,
  login,
  logout,
  getEncodedAccessToken,
  getDecodedAccessToken,
  getTokenExpirationMs,
  getAuthenticatedUser,
  isAuthenticated
}
