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

export default apiclient