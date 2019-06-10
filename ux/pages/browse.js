import AppHead from '../components/head'
import Header from '../components/header'
import { Grid } from '../components/styled'
import { getCookieProps } from '../src/common'
import api from '../src/api'
import TokenPreview from '../components/tokenpreview';
import Page from '../components/page'


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
      <Page>
        <AppHead title='Browse' />
        <Header />
        <Grid>
          {tokens.map(x => <TokenPreview {...x} key={x.id}/>)}
        </Grid>
      </Page>
    )
  }
}
