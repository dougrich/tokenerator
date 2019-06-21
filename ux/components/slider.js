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

const keyoffset = (keycode, x, y, step, m) => ({
  37: () => ({ x: m * -step.x + x }),
  38: () => ({ y: m * -step.y + y }),
  39: () => ({ x: m * step.x + x }),
  40: () => ({ y: m * step.y + y })
}[keycode])

export default class Slider extends React.PureComponent {
  constructor (props, context) {
    super(props, context)
    this.state = {
      theme: { focused: false }
    }
    this.touchEvents = {
      'touchend': this.cleanup,
      'touchmove': this.onTouchMove
    }
    this.mouseEvents = {
      'mouseup': this.cleanup,
      'mousemove': this.onMouseMove
    }
  }
  getd = (page, bound, full) => {
    return (page - bound) / full
  }

  bound = (d, k) => d[k] === null
    ? this.props[k]
    : Math.min(1, Math.max(0, d[k]))

  onChange = (d) => {
    const { disabled, onChange } = this.props
    if (disabled) return

    onChange({
      x: this.bound(d, 'x'),
      y: this.bound(d, 'y')
    })
  }

  modifyDocumentListeners = (events, method) => {
    if (!this.props.isStatic) {
      for (const key in events) {
        document[method](key, events[key])
      }
    }
  }

  cleanup = () => {
    this.modifyDocumentListeners(this.mouseEvents, 'removeEventListener')
    this.modifyDocumentListeners(this.touchEvents, 'removeEventListener')
  }

  onTouchStart = (e) => {
    this.bounded = e.target.getBoundingClientRect()
    this.onMouseMove(e)
    e.target.focus()
    this.modifyDocumentListeners(this.touchEvents, 'addEventListener')
  }

  onTouchMove = (e) => {
    this.onMouseMove(e.touches[0])
  }

  onMouseDown = (e) => {
    this.bounded = e.target.getBoundingClientRect()
    this.onMouseMove(e)
    this.modifyDocumentListeners(this.mouseEvents, 'addEventListener')
  }

  onMouseMove = (e) => {
    const { clientX, clientY } = e
    const bounds = this.bounded
    const d = {
      x: this.getd(clientX, bounds.left, bounds.width),
      y: this.getd(clientY, bounds.top, bounds.height)
    }
    // update position
    this.onChange(d)
  }

  onKeyDown = (e) => {
    const { x, y, step } = this.props
    const m = e.shiftKey ? 10 : 1
    const offset = keyoffset(e.keyCode, x, y, step, m)
    if (!offset) return
    const d = offset()
    this.onChange(d)
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
      thumbProps,
      step,
      disabled,
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
          tabIndex={disabled ? null : '0'}
        >
          {children}
          <svg x={toPercentage(x)} y={toPercentage(y)} style={{ overflow: 'visible', pointerEvents: 'none' }}>
            <Thumb {...thumbProps} />
          </svg>
        </PickerContainer>
      </ThemeProvider>
    )
  }
}
