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

apiclient.browseTokens = () => apiclient
  .get('/api/token/')
  .then(response => response.data)

apiclient.getToken = (id) => apiclient
  .get(`/api/token/${id}.json`)
  .then(response => response.data)

apiclient.createToken = (body) => apiclient
  .post(`/api/token`, body)
  .then(response => response.headers['location'])

apiclient.createBatch = (body) => apiclient
  .post(`/api/batch`, body)
  .then(response => response.headers['x-batch-id'])

apiclient.checkBatch = (id) => apiclient
  .head(apiclient.checkBatch.route(id))
  .then(response => {
    console.log(response)
    return response.status === 200
  })
apiclient.checkBatch.route = id => `/api/batch/${id}`

export default apiclient
