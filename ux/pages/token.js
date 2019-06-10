import AppHead from '../components/head'
import Header from '../components/header'
import Link from 'next/link'
import api from '../src/api'
import { DefaultTokenTitle, DefaultTokenDescription } from '../src/constants'
import { Container, TokenTitle, TokenDescription, DefaultText, NavigationLinkStyled, Navigation } from '../components/styled'
import Page from '../components/page'
import HorizontalSlider from '../components/slider-horizontal';
import { RangeField } from '../components/field';

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

  constructor(props, context) {
    super(props, context)
    this.state = {
      size: 140
    }
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
      <div>
        {description}
      </div>
    )
  }

  onSizeChange = newSize => this.setState({ size: newSize })

  render() {
    const { token } = this.props
    const title = token.title || DefaultTokenTitle
    return (
      <Page>
        <AppHead title={title} />
        <Header />
        <Container>
          {this.renderTitle()}
          {this.renderDescription()}
          <img src={`/api/token/${token.id}.svg`}/>
          <RangeField
            label='Size'
            max={1400}
            min={70}
            step={5}
            value={this.state.size}
            onChange={this.onSizeChange}
          />
          <Navigation>
            <NavigationLinkStyled as='a' href={`/api/token/${token.id}.png?size=${this.state.size}`} download target='_blank'>Download</NavigationLinkStyled>
            <Link href={`/editor?fork=${token.id}`} passHref>
              <NavigationLinkStyled as='a'>
                Fork
              </NavigationLinkStyled>
            </Link>
          </Navigation>
        </Container>
      </Page>
    )
  }
}
