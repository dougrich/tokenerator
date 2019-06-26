import styled from '@emotion/styled'
import Page from '../components/page'
import { Container, Article } from '../components/styled'
import * as HomepageDetails from '../src/homepage.md'

const LogoImage = styled.img({
  display: 'block',
  margin: 'auto',
  width: '20em',
  height: '20em'
})

function Home (props) {
  return (
    <Page
      user={props.user}
      canonical='https://tokens.dougrich.net/'
    >
      <LogoImage
        src='/static/logo.svg'
        alt='Logo of the token builder'
      />
      <Container>
        <Article dangerouslySetInnerHTML={{ __html: HomepageDetails }} />
      </Container>
    </Page>
  )
}

export default Home
