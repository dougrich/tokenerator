import {
  Container,
  Title,
  Navigation,
  ActionLink,
  Action
} from './styled'
import Collapsible from './collapsible'
import styled from '@emotion/styled'

const Header = styled.header({
  borderBottom: '2px solid #333',
  margin: '0.5em 2em',
  position: 'relative',
  '@media print': {
    display: 'none'
  }
})

export default class extends React.PureComponent {
  onSignIn = () => {
    const newwindow = window.open('/login', 'Log In', 'height=600,width=800')
    if (window.focus) { newwindow.focus() }
  }
  onSignOut = () => {
    const newwindow = window.open('/api/account/logout', 'Log Out', 'height=600,width=800')
    if (window.focus) { newwindow.focus() }
  }
  render () {
    const {
      user,
      ...rest
    } = this.props
    return (
      <Header {...rest}>
        <Container>
          <Title>
              Token Builder
          </Title>
          <Collapsible enabledWidth={599} label='Menu'>
            <Navigation>
              <ActionLink href='/'>
                  Home
              </ActionLink>
              <ActionLink href='/browse'>
                  Browse
              </ActionLink>
              <ActionLink prefetch href='/editor'>
                  Editor
              </ActionLink>
              <ActionLink href='/site'>
                  Site
              </ActionLink>
              {user
                ? (
                  <Action as='button' onClick={this.onSignOut}>
                    Sign Out
                  </Action>
                )
                : (
                  <Action as='button' onClick={this.onSignIn}>
                    Sign In
                  </Action>
                )}
            </Navigation>
          </Collapsible>
        </Container>
      </Header>
    )
  }
}
