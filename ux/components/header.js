import {
  Container,
  Title,
  Header,
  Navigation,
  NavigationLink
} from './styled'

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
  render () {
    return (
      <Header>
        <Container>
          <Title>
              Token Builder
          </Title>
          <Navigation>
            <NavigationLink href='/'>
                Home
            </NavigationLink>
            <NavigationLink href='/browse'>
                Browse
            </NavigationLink>
            <NavigationLink prefetch href='/editor'>
                Editor
            </NavigationLink>
            <NavigationLink href='/site'>
                Site
            </NavigationLink>
          </Navigation>
        </Container>
      </Header>
    )
  }
}
