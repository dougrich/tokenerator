import { LOGGEDIN } from "../src/const";
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
      <ModalContainer>
        <TextCenter>
          You have successfully logged out!
        </TextCenter>
      </ModalContainer>
    )
  }
}