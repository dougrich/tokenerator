import { tokenToSvg } from '../src/token'
import styled from '@emotion/styled'
import { TokenShadow } from './styled'
import React from 'react'

const Container = styled.div({
  width: '100%',
  height: '100%',
  maxWidth: '40em',
  maxHeight: '40em',
  margin: '1em',
  position: 'relative',
  '[data-layer]:hover': {
    mask: 'url(#display-hover-effect)'
  }
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

export default class Display extends React.Component {
  onClick = (e) => {
    const layername = e.target.getAttribute('data-layer')
    if (!layername) return
    const [partid, layer] = layername.split('/')
    const index = this.props.parts.map(x => x.id).indexOf(partid)
    this.props.onActivate(index, layer)
  }
  render () {
    const { parts } = this.props
    if (parts.length === 0) {
      return (
        <Container>
          <TokenShadow />
          <Placeholder>
            Select some parts to get started
          </Placeholder>
        </Container>
      )
    }
    return (
      <Container onClick={this.onClick} dangerouslySetInnerHTML={{ __html: tokenToSvg({ parts }) }} />
    )
  }
}

Display.Defs = class extends React.PureComponent {
  render () {
    const size = 5
    return (
      <React.Fragment>
        <mask id='display-hover-effect'>
          <rect width='90' height='90' fill='url(#display-hover-pattern' />
        </mask>
        <pattern id='display-hover-pattern' x='0' y='0' width={size} height={size} patternUnits='userSpaceOnUse'>
          <rect x='0' y='0' width={size} height={size} fill='white' />
          <line x1='0' x2={size} y1='0' y2={size} stroke='black' strokeWidth={size / 5} />
          <line x1='0' x2={size} y2='0' y1={size} stroke='black' strokeWidth={size / 5} />
        </pattern>
      </React.Fragment>
    )
  }
}
