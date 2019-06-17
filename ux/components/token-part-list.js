import styled from '@emotion/styled'
import { Label } from './styled'
import { ColorSwatchButton, ColorSwatchContainer } from './color-swatch'

const Container = styled.div({
  width: '100%',
  overflow: 'auto',
  position: 'relative',
  padding: '0.5em'
})

const TokenPartContainer = styled.div({
  padding: '1em 0.5em',
  margin: '0em -0.5em',
  '&+&': {
    borderTop: '1px solid #ccc'
  }
})

class TokenPart extends React.Component {
  render () {
    const {
      index,
      id,
      channels,
      active,
      onClick,
      onRemove
    } = this.props
    const children = []
    for (const fieldname in channels) {
      children.push(
        <ColorSwatchButton
          key={fieldname}
          style={{ background: channels[fieldname].color }}
          active={active && active.index === index && active.channel === fieldname}
          onClick={onClick.bind(null, index, fieldname)}
        />
      )
    }
    return (
      <TokenPartContainer>
        <Label>{id}<button onClick={onRemove.bind(null, index)}>X</button></Label>
        <ColorSwatchContainer>
          {children}
        </ColorSwatchContainer>
      </TokenPartContainer>
    )
  }
}

export default class TokenParts extends React.Component {
  render () {
    const children = []
    for (const part of this.props.parts) {
      children.push(
        <TokenPart
          key={children.length}
          index={children.length}
          active={this.props.active}
          onClick={this.props.onActivate}
          onRemove={this.props.onRemove}
          {...part}
        />
      )
    }
    return (
      <Container>
        <div>
          <button onClick={this.props.onClear}>Clear</button>
        </div>
        {children}
      </Container>
    )
  }
}
