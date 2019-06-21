import AppHead from '../components/head'
import Header from '../components/header'
import Link from 'next/link'
import api from '../src/api'
import { DefaultTokenTitle, DefaultTokenDescription } from '../src/constants'
import styled from '@emotion/styled'
import { Container, TokenTitle, TokenDescription, DefaultText, Action, ActionLink } from '../components/styled'
import Page from '../components/page'
import HorizontalSlider from '../components/slider-horizontal';
import { RangeField, PixelField } from '../components/field';

const ActionSet = styled.div({
  textAlign: 'center',
  maxWidth: '20em',
  margin: 'auto',
  marginBottom: '3em'
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
      <div>
        {description}
      </div>
    )
  }

  onSizeChange = newSize => this.setState({ size: newSize })

  render() {
    const { token, user } = this.props
    const title = token.title || DefaultTokenTitle
    return (
      <Page title={title} user={user}>
        <Container>
          {this.renderTitle()}
          {this.renderDescription()}
          <img src={`/api/token/${token.id}.svg`}/>
          <ActionSet>
            <PixelField
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
