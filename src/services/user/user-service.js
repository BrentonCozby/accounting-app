import HttpService from 'services/http/http-service.js'

export function getAllUsers({ selectFields }) {
  const endpoint = '/users/get'
  const body = {
    all: true,
    selectFields
  }

  return HttpService.post({ endpoint, body })
}

export function getUserByUserId({ userId, selectFields }) {
  const endpoint = '/users/get'
  const body = {
    userId,
    selectFields
  }

  return HttpService.post({ endpoint, body })
}

export function createUser({ userId, email, password, firstName, lastName, roles }) {
  const endpoint = '/users/create'
  const body = {
    userId,
    email,
    password,
    firstName,
    lastName,
    roles
  }

  return HttpService.post({ endpoint, body })
}

export function deleteUser({ userId }) {
  const endpoint = '/users/delete'
  const body = {
    userId,
  }

  return HttpService.remove({ endpoint, body })
}

export function editUser({ userId, updateMap }) {
  const endpoint = '/users/edit'
  const body = {
    userId,
    updateMap
  }

  return HttpService.put({ endpoint, body })
}

export default {
  getAllUsers,
  getUserByUserId,
  createUser,
  deleteUser,
  editUser
}
