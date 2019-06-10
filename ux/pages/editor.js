import AppHead from '../components/head'
import Header from '../components/header'
import ColorPicker from '../components/color-picker'
import { HiddenSvg } from '../components/styled'
import Slider from '../components/slider'
import Page from '../components/page'
import dynamic from 'next/dynamic'
import * as Color from 'color'
import TokenParts from '../components/token-parts';

const FullEditor = dynamic(
  () => import('../components/editor'),
  {
    loading: () => <p>Loading</p>
  })

export default class extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      c: Color('#D00'),
      v: 100
    }
  }
  render() {
    return (
      <Page>
        <AppHead title='Editor' />
        <Header />
        <HiddenSvg>
          <ColorPicker.Defs />
        </HiddenSvg>
        <ColorPicker current={this.state.c} onChange={(c) => this.setState({ c })}>
          <TokenParts
            parts={[
              { "channels": { "body": { "color": "#FFFFFF" } }, "id": "elf" },
              { "channels": { "hair": { "color": "#9e8fa5" } }, "id": "twin-strand-hair" },
              { "channels": { "harp": { "color": "#713514" } }, "id": "harp-left" }
            ]}
          />
        </ColorPicker>
      </Page>
    )
  }
}
