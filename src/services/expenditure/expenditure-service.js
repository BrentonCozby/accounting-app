import HttpService from 'services/http/http-service.js'

export function getAllExpenditures({ selectFields }) {
  const endpoint = '/expenditures/get'
  const body = {
    all: true,
    selectFields
  }

  return HttpService.post({ endpoint, body })
}

export function getExpendituresByUserId({ userId, selectFields }) {
  const endpoint = '/expenditures/get'
  const body = {
    userId,
    selectFields
  }

  return HttpService.post({ endpoint, body })
}

export function getExpenditureByExpenditureId({ expenditureId, selectFields }) {
  const endpoint = '/expenditures/get'
  const body = {
    expenditureId,
    selectFields
  }

  return HttpService.post({ endpoint, body })
}

export function createExpenditure({ userId, expenditureData }) {
  const endpoint = '/expenditures/create'
  const body = {
    userId,
    expenditureData
  }

  return HttpService.post({ endpoint, body })
}

export function deleteExpenditure({ expenditureId }) {
  const endpoint = '/expenditures/delete'
  const body = {
    expenditureId
  }

  return HttpService.remove({ endpoint, body })
}

export function editExpenditure({ expenditureId, updateMap }) {
  const endpoint = '/expenditures/edit'
  const body = {
    expenditureId,
    updateMap
  }

  return HttpService.put({ endpoint, body })
}

export default {
  getAllExpenditures,
  getExpendituresByUserId,
  getExpenditureByExpenditureId,
  createExpenditure,
  deleteExpenditure,
  editExpenditure
}
