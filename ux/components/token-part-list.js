import styled from '@emotion/styled'
import { Label } from './styled'
import { ColorSwatchButton, ColorSwatchContainer } from './color-swatch'

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
      onClick
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
        <Label>{id}</Label>
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
          {...part}
        />
      )
    }
    return (
      <div>
        {children}
      </div>
    )
  }
}
