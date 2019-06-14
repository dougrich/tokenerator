import App, { Container } from 'next/app'
import * as cookie from 'cookie'
import { LOGGEDIN } from '../src/const';

function getUser(raw) {
  const { auth } = cookie.parse(raw)
  if (!auth) return null
  let body = null
  let bodySegment = auth.split('.')[1]
  if (typeof atob === 'function') {
    body = atob(bodySegment)
  } else {
    body = Buffer.from(bodySegment, 'base64').toString('utf8')
  }
  return JSON.parse(body)
}

export default class extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    let user = null
    if (ctx.req && ctx.req.headers && ctx.req.headers['cookie']) {
      user = getUser(ctx.req.headers['cookie'])
    }

    return { pageProps, user }
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      user: props.user
    }
  }

  componentDidMount() {
    window.addEventListener('message', event => {
      if (event.data === LOGGEDIN) {
        const user = getUser(document.cookie)
        this.setState({ user })
      }
    })
  }

  render () {
    const { Component, pageProps } = this.props
    const { user } = this.state

    return (
      <Container>
        <Component {...pageProps} user={user} />
      </Container>
    )
  }
}