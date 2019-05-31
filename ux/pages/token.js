import AppHead from '../components/head'
import Header from '../components/header'
import Link from 'next/link'
import api from '../src/api'
import { DefaultTokenTitle, DefaultTokenDescription } from '../src/constants'
import { Container, TokenTitle, TokenDescription, DefaultText, NavigationLinkStyled, Navigation } from '../components/styled'

export default class Browse extends React.PureComponent {
  static getInitialProps(context) {
    const id = context.query.id
    return api.getToken(id)
      .then(token => {
        return {
          token
        }
      })
  }

  renderTitle() {
    let title = this.props.token.title
    if (!title) {
      title = (
        <DefaultText>
          {DefaultTokenTitle}
        </DefaultText>
      )
    }
    return (
      <TokenTitle>
        {title}
      </TokenTitle>
    )
  }

  renderDescription() {
    let description = this.props.token.description
    if (!description) {
      return null
    }
    return (
      <TokenDescription>
        {description}
      </TokenDescription>
    )
  }

  render() {
    const { token } = this.props
    const title = token.title || DefaultTokenTitle
    return (
      <React.Fragment>
        <AppHead title={title} />
        <Header />
        <Container>
          {this.renderTitle()}
          {this.renderDescription()}
          <img src={`/api/token/${token.id}.svg`}/>
          <Navigation>
          <NavigationLinkStyled as='a' href={`/api/token/${token.id}.png?size=50`} download target='_blank'>Download</NavigationLinkStyled>
          <Link href={`/editor?fork=${token.id}`} passHref>
            <NavigationLinkStyled as='a'>
              Fork
            </NavigationLinkStyled>
          </Link>
          </Navigation>
        </Container>
      </React.Fragment>
    )
  }
}
