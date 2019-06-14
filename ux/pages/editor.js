import AppHead from '../components/head'
import Header from '../components/header'
import ColorPicker from '../components/color-picker'
import styled from '@emotion/styled'
import { HiddenSvg, NavigationLinkStyled } from '../components/styled'
import Page from '../components/page'
import dynamic from 'next/dynamic'
import * as Color from 'color'
import TokenParts from '../components/token-part-list';
import { TextField, TextAreaField, ToggleField } from '../components/field'
import { bindActionCreators } from 'redux'
import { connect, Provider } from 'react-redux'
import store, { dispatchers } from '../src/editor-state-machine'
import PartGrid from '../components/part-grid';

const Display = dynamic(
  () => import('../components/editor'),
  {
    loading: () => <p>Loading</p>
  })

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

const ConnectedColorPicker = connect(
  state => ({
    current: state.currentColor || Color('#000'),
    enabled: !!state.currentColor
  }),
  dispatch => bindActionCreators({
    onChange: dispatchers.SET_COLOR
  }, dispatch)
)(ColorPicker)

const ConnectedTokenParts = connect(
  state => ({
    parts: state.parts,
    active: state.active
  }),
  dispatch => bindActionCreators({
    onActivate: dispatchers.SET_CHANNEL,
    onRemove: dispatchers.REMOVE_PART
  }, dispatch)
)(TokenParts)

const ConnectedDisplay = connect(
  state => ({
    parts: state.parts
  })
)(Display)

const ConnectedPartGrid = connect(
  state => ({}),
  dispatch => bindActionCreators({
    onClick: dispatchers.ADD_PART
  }, dispatch)
)(PartGrid)

const ConnectedTitle = connect(
  state => ({ value: state.title }),
  dispatch => bindActionCreators({ onChange: dispatchers.SET_TITLE }, dispatch)
)(TextField)

const ConnectedDescription = connect(
  state => ({ value: state.description }),
  dispatch => bindActionCreators({ onChange: dispatchers.SET_DESCRIPTION }, dispatch)
)(TextAreaField)

const ConnectedIsPrivate = connect(
  state => ({ value: state.isPrivate }),
  dispatch => bindActionCreators({ onChange: dispatchers.SET_PRIVATE }, dispatch)
)(ToggleField)

const ConnectedSave = connect(
  state => ({ as: 'button' }),
  dispatch => bindActionCreators({ onClick: dispatchers.SAVE_TOKEN }, dispatch)
)(NavigationLinkStyled)

export default class extends React.Component {

  render() {
    return (
      <Page title='Editor' store={store}>
        <HiddenSvg>
          <ColorPicker.Defs />
        </HiddenSvg>
        <FlexRow>
          <FlexColumn>
            <ConnectedTitle label='Title'/>
            <ConnectedDescription label='Description'/>
            <ConnectedIsPrivate label='Private'/>
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
