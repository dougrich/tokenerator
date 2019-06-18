import AppHead from '../components/head'
import Header from '../components/header'
import ColorPicker from '../components/color-picker'
import styled from '@emotion/styled'
import { HiddenSvg, NavigationLinkStyled } from '../components/styled'
import Page from '../components/page'
import * as Color from 'color'
import TokenParts from '../components/token-part-list';
import { TextField, TextAreaField, ToggleField } from '../components/field'
import { bindActionCreators } from 'redux'
import { connect, Provider } from 'react-redux'
import store, { dispatchers } from '../src/editor-state-machine'
import PartGrid from '../components/part-grid';
import Display from '../components/token-editor-display'
import api from '../src/api'
import KeyShortcuts from '../components/keyshortcuts'

const FlexRow = styled.div({
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between'
})
const FlexColumn = styled.div({
  width: '100%',
  display: 'flex',
  flexDirection: 'column'
})

const ActionRow = styled.div({
  width: '100%',
  display: 'flex',
  justifyContent: 'space-around'
})

const UserWarning = styled.div(props => ({
  backgroundColor: '#e3e3e3',
  padding: '1em',
  margin: '1em',
  display: props.hasUser ? 'none' : 'block'
}))

const ConnectedColorPicker = connect(
  ({ present: state }) => ({
    current: state.currentColor || Color('#000'),
    enabled: !!state.currentColor
  }),
  dispatch => bindActionCreators({
    onChange: dispatchers.SET_COLOR
  }, dispatch)
)(ColorPicker)

const ConnectedTokenParts = connect(
  ({ present: state }) => ({
    parts: state.parts,
    active: state.active
  }),
  dispatch => bindActionCreators({
    onActivate: dispatchers.SET_CHANNEL,
    onRemove: dispatchers.REMOVE_PART,
    onClear: dispatchers.CLEAR_PARTS,
    onUndo: dispatchers.UNDO,
    onRedo: dispatchers.REDO
  }, dispatch)
)(TokenParts)

const ConnectedDisplay = connect(
  ({ present: state }) => ({
    parts: state.parts
  }),
  dispatch => bindActionCreators({
    onActivate: dispatchers.SET_CHANNEL,
  }, dispatch)
)(Display)

const ConnectedPartGrid = connect(
  ({ present: state }) => ({
    parts: state.parts
  }),
  dispatch => bindActionCreators({
    onClick: dispatchers.ADD_PART
  }, dispatch)
)(PartGrid)

const ConnectedTitle = connect(
  ({ present: state }) => ({ value: state.title }),
  dispatch => bindActionCreators({ onChange: dispatchers.SET_TITLE }, dispatch)
)(TextField)

const ConnectedDescription = connect(
  ({ present: state }) => ({ value: state.description }),
  dispatch => bindActionCreators({ onChange: dispatchers.SET_DESCRIPTION }, dispatch)
)(TextAreaField)

const ConnectedIsPrivate = connect(
  ({ present: state }) => ({ value: state.isPrivate }),
  dispatch => bindActionCreators({ onChange: dispatchers.SET_PRIVATE }, dispatch)
)(ToggleField)

const ConnectedSave = connect(
  () => ({ as: 'button' }),
  dispatch => bindActionCreators({ onClick: dispatchers.SAVE_TOKEN }, dispatch)
)(NavigationLinkStyled)

const ConnectedKeyShortcuts = connect(
  () => ({}),
  dispatch => bindActionCreators({
    onUndo: dispatchers.UNDO,
    onRedo: dispatchers.REDO
  }, dispatch)
)(KeyShortcuts)

export default class extends React.Component {
  static getInitialProps(context) {
    const forkedFrom = context.query.fork
    if (!forkedFrom) {
      return { }
    }
    return api.getToken(forkedFrom)
      .then(token => {
        return {
          present: { parts: token.parts }
        }
      })
  }

  constructor(props, context) {
    super(props, context)
    this.store = store({
      past: [],
      present: { parts: props.parts },
      future: []
    })
  }
  render() {
    const { user } = this.props
    return (
      <Page title='Editor' store={this.store} user={user}>
        <ConnectedKeyShortcuts />
        <HiddenSvg>
          <ColorPicker.Defs />
          <Display.Defs />
        </HiddenSvg>
        <FlexRow>
          <FlexColumn>
            <ConnectedTitle label='Title'/>
            <ConnectedDescription label='Description'/>
            <ConnectedIsPrivate label='Private'/>
            <UserWarning hasUser={!!user}>
              You are not currently logged in. Make sure to favorite the link to your token if you want to be able to get to it after saving it.<br/>
              You can sign in (without losing your work) at the top of the page.
            </UserWarning>
            <ActionRow>
              <ConnectedSave>
                Save
              </ConnectedSave>
            </ActionRow>
          </FlexColumn>
          <ConnectedDisplay />
          <FlexRow>
            <ConnectedColorPicker/>
            <ConnectedTokenParts/>
          </FlexRow>
        </FlexRow>
        <ConnectedPartGrid />
      </Page>
    )
  }
}
