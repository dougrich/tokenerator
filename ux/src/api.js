import * as axios from 'axios'
import { IS_CLIENT } from './constants'

let apiclient

if (IS_CLIENT) {
  apiclient = axios
} else {
  apiclient = axios.create({
    baseURL: 'http://tokenerator_api/'
  })
}

const fetchData = (url) => (...args) => apiclient
  .get(url(...args))
  .then(response => response.data)

const postData = (url, headers) => (body) => apiclient
  .post(url, body)
  .then(response => {
    if (Array.isArray(headers)) {
      return headers.map(h => response.headers[h])
    } else {
      return response.headers[headers]
    }
  })

const formatQuery = (params) => {
  const parts = []
  for (const k in params) {
    if (params[k]) {
      parts.push(`${k}=${params[k]}`)
    }
  }
  if (parts.length === 0) return ''
  return '?' + parts.join('&')
}

apiclient.browseTokens = fetchData((filter, next) => '/api/token/' + formatQuery({ filter: filter === 'all' ? null : filter, next }))

apiclient.getToken = fetchData(id => `/api/token/${id}.json`)

apiclient.createToken = postData('/api/token', ['location', 'x-token-id'])

apiclient.createBatch = postData('/api/batch', 'x-batch-id')

apiclient.checkBatch = (id) => apiclient
  .head(apiclient.checkBatch.route(id))
  .then(response => {
    return response.status === 200
  })
apiclient.checkBatch.route = id => `/api/batch/${id}`

export default apiclient
