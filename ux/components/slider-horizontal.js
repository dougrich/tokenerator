import React from 'react'
import Slider, { toPercentage } from './slider'
import styled from '@emotion/styled'

const MainCircle = styled.circle(props => ({
  fill: props.theme.focused ? '#D00' : 'black',
  stroke: 'white',
  strokeWidth: '0.2em',
  pointerEvents: 'none'
}))

const HoverCircle = styled.circle(props => ({
  fill: props.theme.focused ? '#D00' : '#666',
  transform: props.theme.focused ? 'scale(2.5, 2.5)' : props.theme.hover ? 'scale(2, 2)' : 'scale(1, 1)',
  transformOrigin: 'middle',
  transition: '100ms transform ease-in-out',
  opacity: 0.5,
  pointerEvents: 'none'
}))

const Circle = () => {
  const circleProps = {
    cx: 0,
    cy: 0,
    r: '0.5em'
  }
  return (
    <React.Fragment>
      <HoverCircle {...circleProps} />
      <MainCircle {...circleProps} />
    </React.Fragment>
  )
}

const Track = styled.rect({
  pointerEvents: 'none',
  height: '0.0001em',
  stroke: '#d3d3d3',
  strokeWidth: '0.25em'
})

const FilledTrack = styled.rect(props => ({
  pointerEvents: 'none',
  height: '0.0001em',
  stroke: props.theme.focused ? '#D00' : 'black',
  strokeWidth: '0.25em'
}))

export default class HorizontalSlider extends React.PureComponent {
  onChange = ({ x }) => {
    const {
      max,
      min,
      step,
      onChange
    } = this.props

    let value = x * (max - min) + min
    value = Math.round(value / step) * step
    value = Math.min(max, Math.max(min, value))
    onChange(value)
  }

  render () {
    const {
      max,
      min,
      step,
      value
    } = this.props
    const x = (value - min) / (max - min)
    return (
      <Slider
        x={x}
        y={0.5}
        height='1em'
        step={{
          x: step / (max - min),
          y: 0
        }}
        thumb={Circle}
        onChange={this.onChange}
      >
        <Track x='0%' y='50%' width='100%' />
        <FilledTrack x='0%' y='50%' width={toPercentage(x)} />
      </Slider>
    )
  }
}
