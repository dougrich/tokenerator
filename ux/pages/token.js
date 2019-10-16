import AppHead from '../components/head'
import Header from '../components/header'
import Link from 'next/link'
import api from '../src/api'
import { DefaultTokenTitle, DefaultTokenDescription } from '../src/constants'
import styled from '@emotion/styled'
import { Container, TokenTitle, DefaultText, Action, ActionLink } from '../components/styled'
import Page from '../components/page'
import { PixelField } from '../components/field';

const ActionSet = styled.div({
  textAlign: 'center',
  maxWidth: '20em',
  margin: 'auto',
  marginBottom: '3em',
  '@media print': {
    display: 'none'
  }
})

const TokenDescription = styled.div({
  maxWidth: '400px',
  margin: 'auto',
  padding: '2em',
  marginBottom: '2em'
})

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
      <TokenDescription>
        {description}
      </TokenDescription>
    )
  }

  onSizeChange = newSize => this.setState({ size: newSize })

  render() {
    const { token, user } = this.props
    const title = token.title || DefaultTokenTitle
    const imageSrc = `/api/token/${token.id}.svg`
    const previewImageSource = `https://tokens.dougrich.net/api/token/${token.id}.png?size=288`
    const canonical = 'https://tokens.dougrich.net/token/' + token.id
    return (
      <Page
        title={title}
        description={token.description}
        image={previewImageSource}
        imageAlt={title}
        user={user}
        canonical={canonical}
      >
        <Container>
          {this.renderTitle()}
          {this.renderDescription()}
          <img src={imageSrc} alt={title}/>
          <ActionSet>
            <Action as='a' href={"https://twitter.com/intent/tweet?url=" + encodeURIComponent(canonical)}>Tweet</Action>
          </ActionSet>
          <ActionSet>
            <PixelField
              name='pixels'
              value={this.state.size}
              onChange={this.onSizeChange}
            />
            <Action as='a' href={`/api/token/${token.id}.png?size=${this.state.size}`} download target='_blank'>Download</Action>
          </ActionSet>
          <ActionSet>
            <ActionLink href={`/editor?fork=${token.id}`}>Fork</ActionLink>
          </ActionSet>
        </Container>
      </Page>
    )
  }
}
