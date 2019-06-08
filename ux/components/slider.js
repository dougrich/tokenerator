import styled from '@emotion/styled'

const PickerContainer = styled.svg({
  display: 'block',
  width: 'calc(100% - 1em)',
  padding: '0.5em',
  overflow: 'visible',
  marginBottom: '1em',
  '&:focus': {
    outline: '2px dashed #D00',
  }
})

const toPercentage = (v) => {
  return `${Math.floor(v * 1000) / 10}%`
}

export default class Slider extends React.PureComponent {
  constructor(props, context) {
    super(props, context)
  }

  getd = (page, bound, full) => {
    return (page - bound) / full
  }

  onChange = (d) => {
    this.props.onChange({
      x: Math.min(1, Math.max(0, d.x)),
      y: Math.min(1, Math.max(0, d.y))
    })
  }

  cleanup = () => {
    document.removeEventListener('mouseup', this.onMouseUp)
    document.removeEventListener('mousemove', this.onMouseMove)
    document.removeEventListener('touchend', this.onMouseUp)
    document.removeEventListener('touchmove', this.onTouchMove)
  }

  onTouchStart = (e) => {
    this.bounded = e.target.getBoundingClientRect()
    e.target.focus()
    document.addEventListener('touchend', this.onMouseUp)
    document.addEventListener('touchmove', this.onTouchMove)
    this.onTouchMove(e)
  }

  onTouchMove = (e) => {
    this.onMouseMove(e.touches[0])
  }

  onMouseDown = (e) => {
    this.bounded = e.target.getBoundingClientRect()
    document.addEventListener('mouseup', this.onMouseUp)
    document.addEventListener('mousemove', this.onMouseMove)
    this.onMouseMove(e)
  }

  onMouseMove = (e) => {
    const { pageX, pageY } = e
    const d = {
      x: this.getd(pageX, this.bounded.x, this.bounded.width),
      y: this.getd(pageY, this.bounded.y, this.bounded.height)
    }
    // update position
    this.onChange(d)
  }

  onMouseUp = (e) => {
    this.cleanup()
  }

  onKeyDown = (e) => {
    const { x, y, step } = this.props
    const m = e.shiftKey ? 10 : 1
    switch (e.keyCode) {
      case 37:
        this.onChange({ x: x - step.x * m, y })
        break;
      case 38:
        this.onChange({ x, y: y - step.y * m })
        break;
      case 39:
        this.onChange({ x: x + step.x * m, y })
        break;
      case 40:
        this.onChange({ x, y: y + step.y * m })
        break;
    }
  }

  render () {
    const {
      x,
      y,
      children,
      thumb: Thumb,
      step,
      ...rest
    } = this.props
    return (
      <PickerContainer
        {...rest}
        onMouseDown={this.onMouseDown}
        onTouchStart={this.onTouchStart}
        onKeyDown={this.onKeyDown}
        tabIndex='0'
      >
        {children}
        <Thumb cx={toPercentage(x)} cy={toPercentage(y)} r='0.5em' />
      </PickerContainer>
    )
  }
}

const Circle = styled.circle({
  fill: 'black',
  stroke: 'white',
  strokeWidth: '0.2em',
  pointerEvents: 'none'
})

const Track = styled.rect({
  pointerEvents: 'none',
  height: '0.0001em',
  stroke: 'black',
  strokeWidth: '0.25em'
})

Slider.Simple = class extends React.PureComponent {
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
    return (
      <Slider
        x={(value - min) / (max - min)}
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
      </Slider>
    )
  }
}