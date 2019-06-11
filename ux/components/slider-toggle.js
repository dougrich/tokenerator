import React from 'react'
import HorizontalSlider from './slider-horizontal'
import styled from '@emotion/styled'

const Container = styled.div({
  maxWidth: '4em'
})

export default class Toggle extends React.PureComponent {
  onChange = (v) => {
    const {
      onChange,
      value
    } = this.props

    let newValue = Math.round(v) === 1
    if (newValue === value) {
      newValue = !newValue
    }
    onChange(newValue)
  }

  render () {
    const {
      value
    } = this.props
    const numericValue = value ? 1 : 0
    return (
      <Container>
        <HorizontalSlider
          isStatic
          value={numericValue}
          step={1}
          max={1}
          min={0}
          onChange={this.onChange}
        />
      </Container>
    )
  }
}
