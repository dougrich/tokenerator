import Page from '../components/page'

function Home (props) {
  return (
    <Page
      user={props.user}
      canonical='https://tokens.dougrich.net/'
    >
    </Page>
  )
}

export default Home
