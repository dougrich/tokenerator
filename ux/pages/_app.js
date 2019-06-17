import App, { Container } from 'next/app'
import * as cookie from 'cookie'
import styled from '@emotion/styled'
import Router from 'next/router'
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

const Loader = styled.div(props => ({
  opacity: props.loading ? 1 : 0,
  pointerEvents: props.loading ? 'initial' : 'none',
  backgroundColor: 'rgba(1, 1, 1, 0.9)',
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0
}))

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
      user: props.user,
      loading: false
    }
  }

  routeChangeStart() {
    console.log('START LOADING')
    this.setState({ loading: true })
  }

  routeChangeEnd() {
    console.log('DONE LOADING')
    this.setState({ loading: false })
  }

  componentDidMount() {
    window.addEventListener('message', event => {
      if (event.data === LOGGEDIN) {
        const user = getUser(document.cookie)
        this.setState({ user })
      }
    })
    Router.events.on('routeChangeStart', this.routeChangeStart)
    Router.events.on('routeChangeComplete', this.routeChangeEnd)
    Router.events.on('routeChangeError', this.routeChangeEnd)
  }

  render () {
    const { Component, pageProps } = this.props
    const { user } = this.state

    return (
      <React.Fragment>
        <Loader loading={this.state.loading} />
        <Container>
          <Component {...pageProps} user={user} />
        </Container>
      </React.Fragment>
    )
  }
}