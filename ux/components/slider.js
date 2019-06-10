import styled from '@emotion/styled'
import { ThemeProvider } from 'emotion-theming'

const PickerContainer = styled.svg({
  display: 'block',
  width: 'calc(100% - 1em)',
  padding: '0.5em',
  overflow: 'visible',
  marginBottom: '1em',
  cursor: 'pointer',
  '&:focus': {
    outline: '2px dashed #D00'
  }
})

export const toPercentage = (v) => {
  return `${Math.floor(v * 1000) / 10}%`
}

export default class Slider extends React.PureComponent {
  constructor (props, context) {
    super(props, context)
    this.state = {
      theme: { focused: false }
    }
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
    document.removeEventListener('mouseup', this.cleanup)
    document.removeEventListener('mousemove', this.onMouseMove)
    document.removeEventListener('touchend', this.cleanup)
    document.removeEventListener('touchmove', this.onTouchMove)
  }

  onTouchStart = (e) => {
    this.bounded = e.target.getBoundingClientRect()
    e.target.focus()
    document.addEventListener('touchend', this.cleanup)
    document.addEventListener('touchmove', this.onTouchMove)
    this.onTouchMove(e)
  }

  onTouchMove = (e) => {
    this.onMouseMove(e.touches[0])
  }

  onMouseDown = (e) => {
    this.bounded = e.target.getBoundingClientRect()
    document.addEventListener('mouseup', this.cleanup)
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

  onKeyDown = (e) => {
    const { x, y, step } = this.props
    const m = e.shiftKey ? 10 : 1
    switch (e.keyCode) {
      case 37:
        this.onChange({ x: x - step.x * m, y })
        break
      case 38:
        this.onChange({ x, y: y - step.y * m })
        break
      case 39:
        this.onChange({ x: x + step.x * m, y })
        break
      case 40:
        this.onChange({ x, y: y + step.y * m })
        break
    }
  }

  updateTheme = (update) => {
    const newtheme = {
      ...this.state.theme,
      ...update
    }
    this.setState({ theme: newtheme })
  }

  onFocus = () => {
    this.updateTheme({ focused: true })
  }

  onBlur = () => {
    this.updateTheme({ focused: false })
  }

  onMouseEnter = () => {
    this.updateTheme({ hover: true })
  }

  onMouseLeave = () => {
    this.updateTheme({ hover: false })
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
      <ThemeProvider theme={this.state.theme}>
        <PickerContainer
          {...rest}
          onMouseDown={this.onMouseDown}
          onTouchStart={this.onTouchStart}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
          onKeyDown={this.onKeyDown}
          tabIndex='0'
        >
          {children}
          <svg x={toPercentage(x)} y={toPercentage(y)} style={{ overflow: 'visible', pointerEvents: 'none' }}>
            <Thumb cx={0} cy={0} r='0.5em' />
          </svg>
        </PickerContainer>
      </ThemeProvider>
    )
  }
}
