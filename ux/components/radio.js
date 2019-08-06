import styled from '@emotion/styled'
import { ThemeProvider } from 'emotion-theming'
import * as React from 'react'

const HiddenInput = styled.input({
  display: 'none'
})

export default class RadioSet extends React.PureComponent {
  constructor (props, context) {
    super(props, context)
    this.onChange = this.onChange.bind(this)
  }
  onChange (e) {
    this.props.onChange(e.target.value)
  }
  render () {
    const {
      children,
      name,
      disabled,
      value
    } = this.props
    const updatedChildren = React.Children.map(children, (child, idx) => {
      if (child.type !== RadioOption) return child
      const childValue = child.props.value || ''
      const checked = childValue === value
      return (
        <label>
          <HiddenInput type='radio' name={name} value={childValue} checked={checked} onChange={this.onChange} disabled={disabled} />
          <ThemeProvider theme={{ active: checked }}>
            {child}
          </ThemeProvider>
        </label>
      )
    })
    return (
      <div style={{
        pointerEvents: disabled ? 'none' : 'initial'
      }}>
        {updatedChildren}
      </div>
    )
  }
}

export class RadioOption extends React.PureComponent {
  render () {
    return (
      <React.Fragment>
        {this.props.children}
      </React.Fragment>
    )
  }
}
