import AppHead from '../components/head'
import Header from '../components/header'
import { Grid } from '../components/styled'
import { getCookieProps } from '../src/common'
import api from '../src/api'
import TokenPreview from '../components/tokenpreview';

export default class Browse extends React.PureComponent {
  static getInitialProps(context) {
    return api.browseTokens()
      .then(({ documents, next }) => {
        return {
          ...getCookieProps(context),
          tokens: documents
        }
      })
  }
  render() {
    const { tokens } = this.props
    return (
      <React.Fragment>
        <AppHead title='Browse' />
        <Header />
        <Grid>
          {tokens.map(x => <TokenPreview {...x} key={x.id}/>)}
        </Grid>
      </React.Fragment>
    )
  }
}
