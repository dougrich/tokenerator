import { LOGGEDIN } from "../src/const";
import { ModalContainer, TextCenter } from '../components/styled'
import Page from '../components/page'

export default class extends React.PureComponent {
  componentDidMount() {
    window.opener.postMessage(LOGGEDIN, window.location.origin)
    setTimeout(() => {
      window.close()
    }, 1000)
  }
  render () {
    return (
      <Page
        simple
        title='Sign out success!'
        canonical='https://tokens.dougrich.net/logout'
      >
        <ModalContainer>
          <TextCenter>
            You have successfully signed out!
          </TextCenter>
        </ModalContainer>
      </Page>
    )
  }
}