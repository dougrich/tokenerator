import * as SiteDetails from '../src/site-info.md'
import { Container, Article } from '../components/styled'
import Page from '../components/page'

export default class Site extends React.PureComponent {
  render() {
    return (
      <Page
        user={this.props.user}
        title='Terms and Policy'
        canonical='https://tokens.dougrich.net/site'
      >
        <Container>
          <Article dangerouslySetInnerHTML={{ __html: SiteDetails }} />
        </Container>
      </Page>
    )
  }
}
