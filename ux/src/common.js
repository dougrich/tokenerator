import { IS_CLIENT } from './constants'

function decodeUser (authToken) {
  const parts = authToken.split('.')
  const body = parts[1]
  const decoded =
    IS_CLIENT
      ? window.atob(body)
      : Buffer.from(body, 'base64').toString()
  return JSON.parse(decoded)
}

export function getCookieProps (context) {
  let rawcookie =
    IS_CLIENT
      ? window.document.cookie
      : context.req.headers.cookie

  const cookies = {}
  rawcookie.split(';').forEach(cookie => {
    const [name, value] = cookie.trim().split('=')
    cookies[name] = value
  })

  return {
    user: decodeUser(cookies['auth'])
  }
}
