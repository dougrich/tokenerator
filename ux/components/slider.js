import styled from '@emotion/styled'

const PickerContainer = styled.svg({
  display: 'block',
  width: '100%',
  marginBottom: '0.5em',
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
    const { x, y } = this.props
    const step = 0.05
    switch (e.keyCode) {
      case 37:
        this.onChange({ x: x - step, y })
        break;
      case 38:
        this.onChange({ x, y: y - step })
        break;
      case 39:
        this.onChange({ x: x + step, y })
        break;
      case 40:
        this.onChange({ x, y: y + step })
        break;
    }
  }

  render () {
    const {
      x,
      y,
      children,
      thumb: Thumb,
      ...rest
    } = this.props
    return (
      <PickerContainer
        {...rest}
        onMouseDown={this.onMouseDown}
        onKeyDown={this.onKeyDown}
        tabIndex='0'
      >
        {children}
        <Thumb cx={toPercentage(x)} cy={toPercentage(y)} r={10} />
      </PickerContainer>
    )
  }
}