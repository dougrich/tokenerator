import * as axios from 'axios'
import { IS_CLIENT } from './constants'

let apiclient

if (IS_CLIENT) {
  apiclient = axios
} else {
  apiclient = axios.create({
    baseURL: 'http://api/'
  })
}

const fetchData = (url) => (...args) => apiclient
  .get(url(...args))
  .then(response => response.data)

const postData = (url, header) => (body) => apiclient
  .post(url, body)
  .then(response => response.headers[header])

apiclient.browseTokens = fetchData(() => '/api/token/')

apiclient.getToken = fetchData(id => `/api/token/${id}.json`)

apiclient.createToken = postData('/api/token', 'location')

apiclient.createBatch = postData('/api/batch', 'x-batch-id')

apiclient.checkBatch = (id) => apiclient
  .head(apiclient.checkBatch.route(id))
  .then(response => {
    return response.status === 200
  })
apiclient.checkBatch.route = id => `/api/batch/${id}`

export default apiclient
