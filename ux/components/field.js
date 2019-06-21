import HorizontalSlider from './slider-horizontal'
import Toggle from './slider-toggle'
import Select from './select'
import styled from '@emotion/styled'
import { Label, TextContainer, TextInput, TextInputUnderline, TextAddon, TextMeasure, Row, TextAreaLines } from './styled'
import withAttrs from '../src/with-attrs'

const RangeFieldLabelContainer = styled.div({
  display: 'flex',
  alignItems: 'flex-end',
  marginBottom: '0.5em'
})

const RangeFieldLabel = withBounds(withEventUnwrap(({
  label,
  value,
  ...rest
}) => (
  <RangeFieldLabelContainer>
    <Label>{label}</Label>
    <TextContainer>
      <TextInput
        type='number'
        value={value}
        {...rest}
      />
      <TextInputUnderline />
      <TextAddon>
        <TextMeasure>{value}</TextMeasure> pixels
      </TextAddon>
    </TextContainer>
  </RangeFieldLabelContainer>
)))

export class RangeField extends React.PureComponent {
  render () {
    const {
      disabled
    } = this.props
    return (
      <Row disabled={disabled}>
        <RangeFieldLabel
          {...this.props}
        />
        <HorizontalSlider {...this.props} />
      </Row>
    )
  }
}

export const PixelField = withAttrs({
  max: 1400,
  min: 70,
  step: 5,
  label: 'Image Size'
})(RangeField)

const FieldDescription = styled.div(props => ({
  position: 'absolute',
  fontSize: '0.8em',
  top: '100%',
  right: '0.2em'
}))

function withBounds (Component) {
  return class extends React.PureComponent {
    constructor (props, context) {
      super(props, context)
      this.state = { current: null }
    }

    startEdit = () => {
      this.setState({
        current: this.props.value.toString()
      })
    }

    onChange = (v) => {
      v = v.replace('-', '').replace('.', '')
      if (/^[1-9][0-9]*$/gi.test(v)) {
        const number = parseInt(v)
        if (number >= this.props.min && number <= this.props.max) {
          this.props.onChange(number)
        }
      }

      this.setState({ current: v })
    }

    doneEdit = () => {
      this.setState({
        current: null
      })
    }
    render () {
      const {
        min,
        max,
        ...rest
      } = this.props
      const {
        current
      } = this.state
      let forced = {}
      if (min != null && max != null) {
        let value = this.props.value
        if (current != null) value = current
        forced = {
          onFocus: this.startEdit,
          onBlur: this.doneEdit,
          onChange: this.onChange,
          value
        }
      }
      return (
        <Component
          {...rest}
          min={min}
          max={max}
          {...forced}
        />
      )
    }
  }
}

function withMaxLength (Component) {
  return class extends React.PureComponent {
    onChange = (v) => {
      const result = v.slice(0, this.props.maxLength)
      this.props.onChange(result)
    }
    renderMaxLength () {
      const {
        value,
        maxLength
      } = this.props
      const length = (value || '').length
      const left = maxLength - length
      if (left > maxLength / 2) return null
      // fade in as we move through 1/8 of the max length
      const leftPercent = left / maxLength
      const opacity = Math.min(1, -8 * (leftPercent - 0.5))
      return (
        <FieldDescription style={{
          opacity
        }}>
          {left} characters left
        </FieldDescription>
      )
    }
    render () {
      const {
        onChange,
        children,
        maxLength,
        ...rest
      } = this.props
      const hasMaxLength = maxLength != null
      return (
        <Component {...rest} maxLength={maxLength} onChange={hasMaxLength ? this.onChange : onChange}>
          {hasMaxLength && this.renderMaxLength()}
          {children}
        </Component>
      )
    }
  }
}

function withEventUnwrap (Component) {
  return class extends React.PureComponent {
    onChange = (e) => {
      if (this.props.onChange) {
        this.props.onChange(e.target.value)
      }
    }

    render () {
      return (
        <Component {...this.props} onChange={this.onChange} />
      )
    }
  }
}

function withLabel (Component) {
  return class extends React.PureComponent {
    render () {
      const {
        label,
        disabled,
        ...rest
      } = this.props
      return (
        <Row disabled={disabled}>
          <Label>{label}</Label>
          <Component {...rest} disabled={disabled} />
        </Row>
      )
    }
  }
}

export const TextField = withBounds(withMaxLength(withEventUnwrap(withLabel(({ children, ...rest }) => (
  <TextContainer>
    <TextInput {...rest} />
    <TextInputUnderline />
    {children}
  </TextContainer>
)))))

export const TextAreaField = withMaxLength(withEventUnwrap(withLabel(({ children, ...rest }) => (
  <TextContainer>
    <TextInput as='textarea' {...rest} />
    <TextAreaLines />
    {children}
  </TextContainer>
))))

export const ToggleField = withLabel(Toggle)

export const SelectField = withEventUnwrap(withLabel(Select))
