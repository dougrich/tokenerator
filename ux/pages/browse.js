import styled from '@emotion/styled'
import { SelectField } from '@dougrich/uxlib'
import { Grid, Action, ActionLink, NotPrint } from '../components/styled'
import { getCookieProps } from '../src/common'
import api from '../src/api'
import TokenPreview from '../components/token-preview';
import { connect } from 'react-redux'
import createStore, { dispatchers } from '../src/browse-state-machine'
import Page from '../components/page'
import { bindActionCreators } from 'redux';

/**
 * This is used to cache the scrolled position and state of browse between page loads
 */
let BrowseCache = null


class BrowseGrid extends React.PureComponent {
  render() {
    const { tokens, isLoading, pinned, onPin, onUnpin } = this.props
    return (
      <Grid>
        {tokens.map(x => (
          <TokenPreview
            {...x}
            key={x.id}
            disabled={isLoading}
            isPinned={pinned.indexOf(x.id) >= 0}
            onPin={onPin}
            onUnpin={onUnpin}
          />
        ))}
      </Grid>
    )
  }
}

const BrowseMorePanelContainer = styled.div({
  padding: '5vh',
  paddingBottom: '15vh',
  textAlign: 'center'
})
const BrowseMoreError = styled.div({
  padding: '2em',
  borderRadius: '0.25em',
  background: '#ffd0d0',
  maxWidth: '500px',
  margin: '1em auto'
})

class BrowseMorePanel extends React.PureComponent {
  render() {
    const {
      error,
      hasNext,
      ...rest
    } = this.props
    if (!hasNext) {
      return (
        <BrowseMorePanelContainer/>
      )
    } else {
      return (
        <BrowseMorePanelContainer>
          {!!error && (
            <BrowseMoreError>{error}</BrowseMoreError>
          )}
          <Action {...rest}>Load More Tokens</Action>
        </BrowseMorePanelContainer>
      )
    }
  }
}

const ActionRow = styled.div({
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  marginBottom: '2em'
})

const Pinned = styled.div({
  textAlign: 'center',
  marginBottom: '0.75em'
})

const NotMobile = styled.div({
  display: 'none',
  '@media (min-width: 600px)': {
    display: 'block'
  }
})

const ConnectedBrowseGrid = connect(
  state => ({
    pinned: state.pinned,
    isLoading: state.tokens.isLoading,
    tokens: state.tokens.set
  }),
  dispatch => bindActionCreators({
    onPin: dispatchers.PIN_TOKEN,
    onUnpin: dispatchers.UNPIN_TOKEN
  }, dispatch)
)(BrowseGrid)

const ConnectedActionPanel = connect(
  state => ({
    pinned: state.pinned,
    filter: state.filter
  }),
  dispatch => bindActionCreators({
    onClear: dispatchers.CLEAR,
    onFilter: dispatchers.SET_FILTER
  }, dispatch)
)(({ pinned, filter, onFilter, onClear, user }) => (
  <NotPrint>
    <NotMobile>
      <Pinned>{pinned.length} pinned</Pinned>
      <ActionRow>
        <Action onClick={onClear} disabled={pinned.length === 0}>Clear</Action>
        <ActionLink href={`/batch?ids=${pinned.join('+')}`} disabled={pinned.length === 0}>
          Download
        </ActionLink>
      </ActionRow>
    </NotMobile>
    <ActionRow>
      <SelectField
        label='Filter'
        name='filter-tokens'
        value={filter}
        onChange={onFilter}
        options={[
          { value: 'all', label: 'All Public Tokens' },
          { value: 'mine', label: 'My Tokens' + (!user ? ' - sign in required' : ''), disabled: !user }
        ]}
      />
    </ActionRow>
  </NotPrint>
))

const ConnectedBrowseMore = connect(
  state => ({
    disabled: !!state.tokens.isLoading,
    hasNext: !!state.tokens.next,
    error: state.tokens.error
  }),
  dispatch => bindActionCreators({
    onClick: dispatchers.LOAD_MORE
  }, dispatch)
)(BrowseMorePanel)

export default class Browse extends React.PureComponent {
  static getInitialProps(context) {
    if (BrowseCache) return {}
    return api.browseTokens()
      .then(({ documents, next }) => {
        return {
          ...getCookieProps(context),
          tokens: documents,
          next
        }
      })
  }
  constructor(props, context) {
    super(props, context)
    this.store = !!BrowseCache
      ? BrowseCache.store
      : createStore({
        tokens: {
          set: props.tokens,
          next: props.next
        }
      })
  }
  componentDidMount() {
    if (BrowseCache) {
      document.scrollingElement.scrollTop = BrowseCache.scrollTop
    }
  }
  componentWillUnmount() {
    BrowseCache = {
      store: this.store,
      scrollTo: document.scrollingElement.scrollTop
    }
  }
  render() {
    const { user } = this.props
    return (
      <Page
        title='Browse'
        store={this.store}
        user={user}
        canonical='https://tokens.dougrich.net/browse'
      >
        <ConnectedActionPanel user={user} />
        <ConnectedBrowseGrid />
        <ConnectedBrowseMore>More</ConnectedBrowseMore>
      </Page>
    )
  }
}
