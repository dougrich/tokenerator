import * as SiteDetails from '../src/site-info.md'
import AppHead from '../components/head'
import Header from '../components/header';
import { Container, Article } from '../components/styled'

function Site() {
  return (
    <React.Fragment>
      <AppHead/>
      <Header/>
      <Container>
        <Article dangerouslySetInnerHTML={{__html: SiteDetails }}/>
      </Container>
    </React.Fragment>
  )
}

export default Site;