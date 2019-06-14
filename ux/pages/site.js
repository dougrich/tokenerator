import * as SiteDetails from '../src/site-info.md'
import { Container, Article } from '../components/styled'
import Page from '../components/page'

export default class Site extends React.PureComponent {
  render() {
    return (
      <Page user={this.props.user}>
        <Container>
          <Article dangerouslySetInnerHTML={{ __html: SiteDetails }} />
        </Container>
      </Page>
    )
  }
}
