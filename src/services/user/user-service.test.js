jest.mock('services/http/http-service.js')

import HttpService from 'services/http/http-service.js'
import UserService from 'services/user/user-service.js'

describe('UserService', () => {
  beforeEach(() => {
    HttpService.post.mockReset()
    HttpService.put.mockReset()
    HttpService.remove.mockReset()
  })

  describe('getAllUsers', () => {
    it('gets all users', () => {
      const endpoint = '/users/get'
      const body = {
        all: true,
        selectFields: ['amount']
      }
      const response = [{userId: '1', firstName: 'Patrick'}]

      HttpService.post.mockReturnValue(Promise.resolve(response))

      return UserService.getAllUsers({ selectFields: body.selectFields })
      .then(res => {
        expect(res).toEqual(response)
        expect(HttpService.post).toHaveBeenCalledWith({ endpoint, body })
      })
    })
  })

  describe('getUserByUserId', () => {
    it('gets user data for a given userId', () => {
      const endpoint = '/users/get'
      const body = {
        userId: '1',
        selectFields: ['amount']
      }
      const response = [{userId: '1', firstName: 'Patrick'}]

      HttpService.post.mockReturnValue(Promise.resolve(response))

      return UserService.getUserByUserId({ userId: body.userId, selectFields: body.selectFields })
      .then(res => {
        expect(res).toEqual(response)
        expect(HttpService.post).toHaveBeenCalledWith({ endpoint, body })
      })
    })
  })

  describe('createUser', () => {
    it('creates a user for a given user', () => {
      const endpoint = '/users/create'
      const body = {
        userId: '1',
        firstName: 'Patrick',
        lastName: 'Star',
        email: 'patrick.star@gmail.com',
        password: 'patrick',
        roles: 'admin'
      }
      const response = { message: 'User created' }

      HttpService.post.mockReturnValue(Promise.resolve(response))

      return UserService.createUser({
        userId: body.userId,
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        password: body.password,
        roles: body.roles
      })
      .then(res => {
        expect(res).toEqual(response)
        expect(HttpService.post).toHaveBeenCalledWith({ endpoint, body })
      })
    })
  })

  describe('deleteUser', () => {
    it('deletes a user for a given userId', () => {
      const endpoint = '/users/delete'
      const body = {
        userId: '1'
      }
      const response = { message: 'User deleted' }

      HttpService.remove.mockReturnValue(Promise.resolve(response))

      return UserService.deleteUser({ userId: body.userId })
      .then(res => {
        expect(res).toEqual(response)
        expect(HttpService.remove).toHaveBeenCalledWith({ endpoint, body })
      })
    })
  })

  describe('editUser', () => {
    it('deletes an user for a given userId', () => {
      const endpoint = '/users/edit'
      const body = {
        userId: '1',
        updateMap: { amount: '120.00' }
      }
      const response = { message: 'User updated' }

      HttpService.put.mockReturnValue(Promise.resolve(response))

      return UserService.editUser({ userId: body.userId, updateMap: body.updateMap })
      .then(res => {
        expect(res).toEqual(response)
        expect(HttpService.put).toHaveBeenCalledWith({ endpoint, body })
      })
    })
  })
})
