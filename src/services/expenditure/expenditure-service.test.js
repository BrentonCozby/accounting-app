jest.mock('services/http/http-service.js')

import HttpService from 'services/http/http-service.js'
import expenditureService from 'services/expenditure/expenditure-service.js'

describe('expenditureService', () => {
  beforeEach(() => {
    HttpService.post.mockReset()
    HttpService.put.mockReset()
    HttpService.remove.mockReset()
  })

  describe('getAllexpenditures', () => {
    it('gets all expenditures', () => {
      const endpoint = '/expenditures/get'
      const body = {
        all: true,
        selectFields: ['amount']
      }
      const response = [{expenditureId: '1', amount: '100.00'}]

      HttpService.post.mockReturnValue(Promise.resolve(response))

      return expenditureService.getAllexpenditures({ selectFields: body.selectFields })
      .then(res => {
        expect(res).toEqual(response)
        expect(HttpService.post).toHaveBeenCalledWith({ endpoint, body })
      })
    })
  })

  describe('getexpendituresByUserId', () => {
    it('gets all expenditures for a given userId', () => {
      const endpoint = '/expenditures/get'
      const body = {
        userId: '1',
        selectFields: ['amount']
      }
      const response = [{expenditureId: '1', amount: '100.00'}]

      HttpService.post.mockReturnValue(Promise.resolve(response))

      return expenditureService.getexpendituresByUserId({ userId: body.userId, selectFields: body.selectFields })
      .then(res => {
        expect(res).toEqual(response)
        expect(HttpService.post).toHaveBeenCalledWith({ endpoint, body })
      })
    })
  })

  describe('getexpenditureByexpenditureId', () => {
    it('gets expenditure data for given expenditureId', () => {
      const endpoint = '/expenditures/get'
      const body = {
        expenditureId: '1',
        selectFields: ['amount']
      }
      const response = [{expenditureId: '1', amount: '100.00'}]

      HttpService.post.mockReturnValue(Promise.resolve(response))

      return expenditureService.getexpenditureByexpenditureId({ expenditureId: body.expenditureId, selectFields: body.selectFields })
      .then(res => {
        expect(res).toEqual(response)
        expect(HttpService.post).toHaveBeenCalledWith({ endpoint, body })
      })
    })
  })

  describe('createexpenditure', () => {
    it('creates an expenditure for a given user', () => {
      const endpoint = '/expenditures/create'
      const body = {
        userId: '1',
        expenditureData: { amount: '100.00' }
      }
      const response = { message: 'expenditure created' }

      HttpService.post.mockReturnValue(Promise.resolve(response))

      return expenditureService.createexpenditure({ userId: body.userId, expenditureData: body.expenditureData })
      .then(res => {
        expect(res).toEqual(response)
        expect(HttpService.post).toHaveBeenCalledWith({ endpoint, body })
      })
    })
  })

  describe('deleteexpenditure', () => {
    it('deletes an expenditure for a given expenditureId', () => {
      const endpoint = '/expenditures/delete'
      const body = {
        expenditureId: '1'
      }
      const response = { message: 'expenditure deleted' }

      HttpService.remove.mockReturnValue(Promise.resolve(response))

      return expenditureService.deleteexpenditure({ expenditureId: body.expenditureId })
      .then(res => {
        expect(res).toEqual(response)
        expect(HttpService.remove).toHaveBeenCalledWith({ endpoint, body })
      })
    })
  })

  describe('editexpenditure', () => {
    it('deletes an expenditure for a given expenditureId', () => {
      const endpoint = '/expenditures/edit'
      const body = {
        expenditureId: '1',
        updateMap: { amount: '120.00' }
      }
      const response = { message: 'expenditure updated' }

      HttpService.put.mockReturnValue(Promise.resolve(response))

      return expenditureService.editexpenditure({ expenditureId: body.expenditureId, updateMap: body.updateMap })
      .then(res => {
        expect(res).toEqual(response)
        expect(HttpService.put).toHaveBeenCalledWith({ endpoint, body })
      })
    })
  })
})
