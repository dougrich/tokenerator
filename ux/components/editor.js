import { tokenToSvg } from '../src/token'
import styled from '@emotion/styled'
import { TokenShadow } from './styled';

const Container = styled.div({
  width: '100%',
  height: '100%',
  maxWidth: '40em',
  maxHeight: '40em',
  margin: '1em',
  position: 'relative'
})

const Placeholder = styled.div(props => [
  props.theme.typography.subheader,
  {
    position: 'absolute',
    top: '50%',
    left: '50%',
    whiteSpace: 'nowrap',
    transform: 'translate(-50%, -50%)'
  }
])

export default class extends React.Component {
  render () {
    const { parts } = this.props
    if (parts.length === 0) {
      return (
        <Container>
          <TokenShadow/>
          <Placeholder>
            Select some parts to get started
          </Placeholder>
        </Container>
      )
    }
    return (
      <Container dangerouslySetInnerHTML={{ __html: tokenToSvg({ parts }) }} />
    )
  }
}
