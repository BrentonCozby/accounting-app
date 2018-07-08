import { getEncodedAccessToken } from 'services/auth/auth-service.js'
import LoadingService from 'services/loading/loading-service.js'

export function baseRequest({
  endpoint,
  method,
  body
}) {
  LoadingService.enqueue([endpoint])

  return fetch(`${process.env.REACT_APP_API_BASE_URI}${endpoint}`, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getEncodedAccessToken()}`
    },
    body: JSON.stringify(body)
  })
  .then(async (res) => {
    if (!res.ok || res.status >= 400) {
      if (res.status === 401) {
        return Promise.reject('User is unauthorized to take this action.')
      }

      return Promise.reject(await res.json())
    }

    LoadingService.dequeue([endpoint])

    return res.json()
  })
  .catch(() => {
    LoadingService.dequeue([endpoint])
  })
}

export function post({
  endpoint,
  body
}) {
  return baseRequest({ endpoint, method: 'POST', body })
}

export function put({
  endpoint,
  body
}) {
  return baseRequest({ endpoint, method: 'PUT', body })
}

export function remove({
  endpoint,
  body
}) {
  return baseRequest({ endpoint, method: 'DELETE', body })
}

export default {
  baseRequest,
  post,
  put,
  remove
}
