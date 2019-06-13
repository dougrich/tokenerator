import AppHead from '../components/head'
import Header from '../components/header'
import { Grid } from '../components/styled'
import { getCookieProps } from '../src/common'
import api from '../src/api'
import TokenPreview from '../components/token-preview';
import { connect, Provider } from 'react-redux'
import store, { dispatchers } from '../src/browse-state-machine'
import Page from '../components/page'
import { bindActionCreators } from 'redux';
import Link from 'next/link'


class BrowseGrid extends React.PureComponent {
  render() {
    const { tokens, pinned, onPin, onUnpin } = this.props
    return (
      <Grid>
        {tokens.map(x => (
          <TokenPreview
            {...x}
            key={x.id}
            isPinned={pinned.indexOf(x.id) >= 0}
            onPin={onPin}
            onUnpin={onUnpin}
          />
        ))}
      </Grid>
    )
  }
}

const ConnectedBrowseGrid = connect(
  state => ({
    pinned: state.pinned
  }),
  dispatch => bindActionCreators({
    onPin: dispatchers.PIN_TOKEN,
    onUnpin: dispatchers.UNPIN_TOKEN
  }, dispatch)
)(BrowseGrid)

const ConnectedActionPanel = connect(
  state => ({
    pinned: state.pinned
  }),
  dispatch => bindActionCreators({
    onPin: dispatchers.PIN_TOKEN,
    onUnpin: dispatchers.UNPIN_TOKEN
  }, dispatch)
)(({ pinned }) => (
  <div>
    <Link href={`/batch?ids=${pinned.join('+')}`}>
      <a>Download</a>
    </Link>
  </div>
))

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
        <Provider store={store}>
          <AppHead title='Browse' />
          <Header />
          <ConnectedActionPanel />
          <ConnectedBrowseGrid tokens={tokens} />
        </Provider>
      </Page>
    )
  }
}
