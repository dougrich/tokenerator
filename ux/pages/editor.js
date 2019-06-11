import AppHead from '../components/head'
import Header from '../components/header'
import ColorPicker from '../components/color-picker'
import { Flex, HiddenSvg } from '../components/styled'
import Page from '../components/page'
import dynamic from 'next/dynamic'
import * as Color from 'color'
import TokenParts from '../components/token-part-list';
import { bindActionCreators } from 'redux'
import { connect, Provider } from 'react-redux'
import store, { dispatchers } from '../src/editor-state-machine'

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
          <Flex>
            <ConnectedDisplay/>
            <ConnectedColorPicker>
              <ConnectedTokenParts />
            </ConnectedColorPicker>
          </Flex>
        </Provider>
      </Page>
    )
  }
}
