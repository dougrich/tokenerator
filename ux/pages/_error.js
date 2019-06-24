import Page from '../components/page'

function Error (props) {
  return (
    <Page
      user={props.user}
      title='Oh no, an error!'
      canonical='https://tokens.dougrich.net/error'
    >
      <p>Something went wrong trying to render this page.</p>
    </Page>
  )
}

export default Home
