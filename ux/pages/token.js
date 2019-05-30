import AppHead from '../components/head'
import Header from '../components/header'

export default class Browse extends React.PureComponent {
  static getInitialProps(context) {
    return {}
  }
  render() {
    return (
      <React.Fragment>
        <AppHead title='Token' />
        <Header />
      </React.Fragment>
    )
  }
}
