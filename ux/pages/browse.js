import styled from '@emotion/styled'
import { SelectField } from '../components/field'
import { Grid, Action, ActionLink } from '../components/styled'
import { getCookieProps } from '../src/common'
import api from '../src/api'
import TokenPreview from '../components/token-preview';
import { connect } from 'react-redux'
import createStore, { dispatchers } from '../src/browse-state-machine'
import Page from '../components/page'
import { bindActionCreators } from 'redux';


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

const BrowseMorePanelContainer = styled.div({
  padding: '5vh',
  paddingBottom: '25vh',
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
      ...rest
    } = this.props
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

const ConnectedBrowseGrid = connect(
  state => ({
    pinned: state.pinned,
    tokens: state.tokens.set
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
    onClear: dispatchers.CLEAR
  }, dispatch)
)(({ pinned, onClear }) => (
  <React.Fragment>
    <Pinned>{pinned.length} pinned</Pinned>
    <ActionRow>
      <Action onClick={onClear} disabled={pinned.length === 0}>Clear</Action>
      <ActionLink href={`/batch?ids=${pinned.join('+')}`} disabled={pinned.length === 0}>
        Download
      </ActionLink>
    </ActionRow>
    <ActionRow>
      <SelectField
        label='Filter'
        options={[
          { value: 'all', label: 'All Public Tokens' },
          { value: 'mine', label: 'My Tokens' }
        ]}
      />
    </ActionRow>
  </React.Fragment>
))

const ConnectedBrowseMore = connect(
  state => ({
    disabled: !!state.tokens.isLoading,
    error: state.tokens.error
  }),
  dispatch => bindActionCreators({
    onClick: dispatchers.LOAD_MORE
  }, dispatch)
)(BrowseMorePanel)

export default class Browse extends React.PureComponent {
  static getInitialProps(context) {
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
    this.store = createStore({
      tokens: {
        set: props.tokens,
        next: props.next
      }
    })
  }
  render() {
    const { user } = this.props
    return (
      <Page title='Browse' store={this.store} user={user}>
        <ConnectedActionPanel />
        <ConnectedBrowseGrid />
        <ConnectedBrowseMore>More</ConnectedBrowseMore>
      </Page>
    )
  }
}
