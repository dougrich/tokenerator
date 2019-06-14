import * as SiteDetails from '../src/site-info.md'
import AppHead from '../components/head'
import Header from '../components/header'
import { Container, Article } from '../components/styled'
import { getCookieProps } from '../src/common'
import Page from '../components/page'

export default class Site extends React.PureComponent {
  static getInitialProps(context) {
    return getCookieProps(context)
  }
  render() {
    return (
      <Page>
        <Container>
          <Article dangerouslySetInnerHTML={{ __html: SiteDetails }} />
        </Container>
      </Page>
    )
  }
}
