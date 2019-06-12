import { tokenToSvg } from '../src/token'
import styled from '@emotion/styled'

const Container = styled.div({
  width: '100%',
  height: '100%',
  maxWidth: '40em',
  maxHeight: '40em'
})

export default class extends React.Component {
  render () {
    return (
      <Container dangerouslySetInnerHTML={{ __html: tokenToSvg({ parts: this.props.parts }) }} />
    )
  }
}
