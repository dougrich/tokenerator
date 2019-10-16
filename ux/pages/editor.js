import AppHead from '../components/head'
import Header from '../components/header'
import ColorPicker from '../components/color-picker'
import { css } from '@emotion/core'
import styled from '@emotion/styled'
import { HiddenSvg, Action, ActionRow } from '../components/styled'
import Page from '../components/page'
import * as Color from 'color'
import TokenParts from '../components/token-part-list';
import { TextInputField, TextAreaField, ToggleField } from '@dougrich/uxlib'
import { bindActionCreators } from 'redux'
import { connect, Provider } from 'react-redux'
import store, { dispatchers } from '../src/editor-state-machine'
import PartGrid from '../components/part-grid';
import Display from '../components/token-editor-display'
import api from '../src/api'
import Collapsible from '../components/collapsible'
import KeyShortcuts from '../components/keyshortcuts'
import * as parts from '../src/token-parts'

const ParagraphNotice = styled.p({
  padding: '1em',
  lineHeight: '2em',
  textAlign: 'center'
})

const EditorTools = styled.div({
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  '@media (max-width: 1100px)': {
    flexDirection: 'column',
    width: '100%'
  }
})

const DisplayColor = styled.div({
  width: '66%',
  display: 'flex',
  justifyContent: 'space-between',
  '@media (max-width: 1100px)': {
    width: '100%'
  },
  '@media (max-width: 750px)': {
    flexDirection: 'column'
  }
})

const BasePanel = css({
  padding: '2em',
  display: 'flex',
  flexDirection: 'column',
  boxSizing: 'border-box',
  height: '100%'
})

const FormPanel = styled.div([
  BasePanel,
  {
    width: '33%',
    '@media (max-width: 1100px)': {
      width: '100%'
    }
  }
])

const DisplayColorPanel = styled.div([
  BasePanel,
  {
    width: '100%'
  }
])

const UserWarning = styled.div(props => ({
  backgroundColor: '#e3e3e3',
  padding: '1em',
  margin: '1em',
  display: props.hasUser ? 'none' : 'block'
}))

const ConnectedColorPicker = connect(
  ({ present: { currentColor, isSaving } }) => ({
    current: currentColor || Color('#000'),
    disabled: !currentColor || isSaving,
  }),
  dispatch => bindActionCreators({
    onChange: dispatchers.SET_COLOR
  }, dispatch)
)(ColorPicker)

const ConnectedTokenParts = connect(
  ({ present: { parts, active, isSaving, isAdvanced }, past, future }) => ({
    parts,
    active,
    isAdvanced,
    disabled: isSaving,
    canClear: parts.length > 0,
    canUndo: past.length > 0,
    canRedo: future.length > 0
  }),
  dispatch => bindActionCreators({
    onActivate: dispatchers.SET_CHANNEL,
    onRemove: dispatchers.REMOVE_PART,
    onClear: dispatchers.CLEAR_PARTS,
    onUndo: dispatchers.UNDO,
    onRedo: dispatchers.REDO,
    onSwap: dispatchers.SWAP_PARTS
  }, dispatch)
)(TokenParts)

const ConnectedDisplay = connect(
  ({ present: { parts, isSaving } }) => ({
    parts,
    disabled: isSaving
  }),
  dispatch => bindActionCreators({
    onActivate: dispatchers.SET_CHANNEL,
  }, dispatch)
)(Display)

const ConnectedPartGrid = connect(
  ({ present: { parts, isSaving } }) => ({
    parts,
    disabled: isSaving
  }),
  dispatch => bindActionCreators({
    onClick: dispatchers.ADD_PART
  }, dispatch)
)(PartGrid)

const ConnectedTitle = connect(
  ({ present: { title, isSaving } }) => ({ value: title, disabled: isSaving }),
  dispatch => bindActionCreators({ onChange: dispatchers.SET_TITLE }, dispatch)
)(TextInputField)

const ConnectedDescription = connect(
  ({ present: { description, isSaving } }) => ({ value: description, disabled: isSaving }),
  dispatch => bindActionCreators({ onChange: dispatchers.SET_DESCRIPTION }, dispatch)
)(TextAreaField)

const ConnectedIsPrivate = connect(
  ({ present: { isPrivate, isSaving } }) => ({ value: isPrivate, disabled: isSaving }),
  dispatch => bindActionCreators({ onChange: dispatchers.SET_PRIVATE }, dispatch)
)(ToggleField)

const ConnectedIsAdvanced = connect(
  ({ present: { isAdvanced, isSaving } }) => ({ value: isAdvanced, disabled: isSaving }),
  dispatch => bindActionCreators({ onChange: dispatchers.SET_ADVANCED }, dispatch)
)(ToggleField)

const ConnectedSave = connect(
  ({ present: { isSaving, parts }}) => ({
    as: 'button',
    disabled: isSaving || parts.length === 0
  }),
  dispatch => bindActionCreators({ onClick: dispatchers.SAVE_TOKEN }, dispatch)
)(Action)

const ConnectedKeyShortcuts = connect(
  () => ({}),
  dispatch => bindActionCreators({
    onUndo: dispatchers.UNDO,
    onRedo: dispatchers.REDO,
    onDelete: dispatchers.DELETE_ACTIVE
  }, dispatch)
)(KeyShortcuts)

const ConnectedError = connect(
  ({ present: { saveError }}) => ({
    saveError
  })
)(({ saveError }) => {
  return (
    <UserWarning hasUser={!saveError}>
      {saveError}
    </UserWarning>
  )
})
const ConnectedWarning = connect(
  ({ present: { isAdvanced }}) => ({
    isAdvanced
  })
)(({ isAdvanced }) => {
  return (
    <UserWarning hasUser={!isAdvanced}>
      Advanced mode turns off part collision and allows re-ordering parts.
    </UserWarning>
  )
})

export default class extends React.Component {
  static getInitialProps(context) {
    const forkedFrom = context.query.fork
    if (!forkedFrom) {
      return { }
    }
    return api.getToken(forkedFrom)
      .then(token => {
        return {
          parts: token.parts.map(({ id, channels }) => {
            const defaults = parts.$defaults[id]
            return {
              ...defaults,
              id,
              channels
            }
          })
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
    const enabledWidth = 600
    return (
      <Page
        title='Editor'
        store={this.store}
        user={user}
        canonical='https://tokens.dougrich.net/editor'
      >
        <ConnectedKeyShortcuts />
        <HiddenSvg>
          <ColorPicker.Defs />
          <Display.Defs />
        </HiddenSvg>
        <EditorTools>
          <FormPanel>
            <Collapsible enabledWidth={enabledWidth} label='Details'>
              <ConnectedTitle maxLength={200} label='Title' name='token-title'/>
              <ConnectedDescription maxLength={2000} label='Description' name='token-description'/>
              <ActionRow>
                <ConnectedIsPrivate label='Private'/>
                <ConnectedIsAdvanced label='Advanced'/>
              </ActionRow>
              <ConnectedWarning/>
              <ConnectedError/>
            </Collapsible>
            <ActionRow>
              <ConnectedSave>
                Save {!user && 'Anonymously'}
              </ConnectedSave>
            </ActionRow>
          </FormPanel>
          <DisplayColor>
            <DisplayColorPanel style={{height: '100%' }}>
              <ConnectedDisplay />
            </DisplayColorPanel>
            <DisplayColorPanel>
              <Collapsible enabledWidth={enabledWidth} label='Colors'>
                <ConnectedColorPicker/>
              </Collapsible>
              <Collapsible enabledWidth={enabledWidth} label='Parts'>
                <ConnectedTokenParts/>
              </Collapsible>
            </DisplayColorPanel>
          </DisplayColor>
        </EditorTools>
        <ConnectedPartGrid />
        <ParagraphNotice>Can't find a part you're looking for? Sugget new parts!<br/><Action as='a' href='https://twitter.com/tokenerator'>twitter</Action></ParagraphNotice>
      </Page>
    )
  }
}
