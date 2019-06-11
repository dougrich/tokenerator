import { tokenToSvg } from '../src/token'

export default class extends React.Component {
  render () {
    return (
      <div style={{ width: '100%' }} dangerouslySetInnerHTML={{ __html: tokenToSvg({ parts: this.props.parts }) }} />
    )
  }
}
