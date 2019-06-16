import { LOGGEDIN } from "../src/const";

export default class extends React.PureComponent {
  componentDidMount() {
    window.opener.postMessage(LOGGEDIN, window.location.origin)
    setTimeout(() => {
      window.close()
    }, 1000)
  }
  render () {
    return (
      <div>
        You have successfully logged out!
      </div>
    )
  }
}