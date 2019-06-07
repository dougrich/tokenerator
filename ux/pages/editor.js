import AppHead from '../components/head'
import Header from '../components/header'
import ColorPicker from '../components/color-picker'
import dynamic from 'next/dynamic'
import * as Color from 'color'

const FullEditor = dynamic(
  () => import('../components/editor'),
  {
    loading: () => <p>Loading</p>
  })

export default class extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      c: Color('#D00')
    }
  }
  render () {
    return (
      <React.Fragment>
        <AppHead title='Editor'>
          <svg>
            <ColorPicker.Defs />
          </svg>
        </AppHead>
        <Header />
        <ColorPicker current={this.state.c} onChange={(c) => this.setState({ c })} />
      </React.Fragment>
    )
  }
}
