import { LOGGEDIN } from "../src/const";
import Page from '../components/page'
import { ModalContainer, TextCenter } from '../components/styled'

export default class extends React.PureComponent {
  componentDidMount() {
    window.opener.postMessage(LOGGEDIN, window.location.origin)
    setTimeout(() => {
      window.close()
    }, 1000)
  }
  render () {
    return (
      <Page simple title='Sign in success!'>
        <ModalContainer>
          <TextCenter>
            You have successfully signed in!
          </TextCenter>
        </ModalContainer>
      </Page>
    )
  }
}