import AppHead from '../components/head'
import Header from '../components/header'
import ColorPicker from '../components/color-picker'
import { Flex, HiddenSvg } from '../components/styled'
import Page from '../components/page'
import dynamic from 'next/dynamic'
import * as Color from 'color'
import TokenParts from '../components/token-part-list';
import { TextField, ToggleField } from '../components/field'
import { bindActionCreators } from 'redux'
import { connect, Provider } from 'react-redux'
import store, { dispatchers } from '../src/editor-state-machine'
import PartGrid from '../components/part-grid';
import Toggle from '../components/slider-toggle';

const Display = dynamic(
  () => import('../components/editor'),
  {
    loading: () => <p>Loading</p>
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
)(TextField)

const ConnectedIsPrivate = connect(
  state => ({ value: state.isPrivate }),
  dispatch => bindActionCreators({ onChange: dispatchers.SET_PRIVATE }, dispatch)
)(ToggleField)

const ConnectedSave = connect(
  state => ({}),
  dispatch => bindActionCreators({ onClick: dispatchers.SAVE_TOKEN }, dispatch)
)((props) => <button {...props}>{props.children}</button>)

export default class extends React.Component {

  render() {
    return (
      <Page>
        <AppHead title='Editor' />
        <Header />
        <HiddenSvg>
          <ColorPicker.Defs />
        </HiddenSvg>
        <Provider store={store}>
          <ConnectedTitle label='Title'/>
          <ConnectedDescription label='Description'/>
          <ConnectedIsPrivate label='Private'/>
          <ConnectedSave>
            Save
          </ConnectedSave>
          <Flex>
            <ConnectedDisplay/>
            <ConnectedColorPicker>
              <ConnectedTokenParts />
            </ConnectedColorPicker>
          </Flex>
          <ConnectedPartGrid />
        </Provider>
      </Page>
    )
  }
}
