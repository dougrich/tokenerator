import {
  Container,
  Title,
  Header,
  Navigation,
  ActionLink,
  Action
} from './styled'
import Collapsible from './collapsible'

/**
 * Header component is the component that covers the top of the page
 * It needs to afford the user:
 * - access to root
 * - access to token browse
 * - access to token build
 * - access to auxiliary pages (legal, privacy)
 * - access to login if not logged in
 * - access to account if logged in
 * - information on if they are logged in or not
 * - information about the current page they are on
 * - information about what site they are on (including branding)
 * - information about what page they are on (consistent naming)
 * - information about in progress batch jobs that the user has kicked off
 * - consistent experience anchor across multiple pages and backgrounds
 */
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
