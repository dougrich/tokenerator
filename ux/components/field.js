import HorizontalSlider from './slider-horizontal'
import Toggle from './slider-toggle'
import styled from '@emotion/styled'
import { Label, TextContainer, TextInput, TextInputUnderline, TextAddon, TextMeasure, Row, TextAreaLines } from './styled'

const RangeFieldLabel = styled.div({
  display: 'flex',
  alignItems: 'flex-end',
  marginBottom: '0.5em'
})

export class RangeField extends React.PureComponent {
  constructor (props, context) {
    super(props, context)
    this.state = {
      current: null
    }
  }

  startEdit = () => {
    this.setState({
      current: this.props.value.toString()
    })
  }

  onInput = (e) => {
    let v = e.target.value
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
      label,
      value
    } = this.props
    const {
      current
    } = this.state
    const displayvalue = current == null ? value.toString() : current
    return (
      <Row>
        <RangeFieldLabel>
          <Label>{label}</Label>
          <TextContainer>
            <TextInput
              type='number'
              value={displayvalue}
              onFocus={this.startEdit}
              onBlur={this.doneEdit}
              onChange={this.onInput}
            />
            <TextInputUnderline />
            <TextAddon>
              <TextMeasure>{displayvalue}</TextMeasure> pixels
            </TextAddon>
          </TextContainer>
        </RangeFieldLabel>
        <HorizontalSlider {...this.props} />
      </Row>
    )
  }
}

export class TextField extends React.PureComponent {
  render () {
    const {
      label,
      ...rest
    } = this.props
    return (
      <Row>
        <Label>{label}</Label>
        <TextContainer>
          <TextInput {...rest} />
          <TextInputUnderline />
        </TextContainer>
      </Row>
    )
  }
}

export class TextAreaField extends React.PureComponent {
  render () {
    const {
      label,
      ...rest
    } = this.props
    return (
      <Row>
        <Label>{label}</Label>
        <TextContainer>
          <TextInput as='textarea' {...rest} />
          <TextAreaLines />
        </TextContainer>
      </Row>
    )
  }
}

export class ToggleField extends React.PureComponent {
  render () {
    const {
      label,
      ...rest
    } = this.props
    return (
      <Row>
        <Label>{label}</Label>
        <Toggle {...rest} />
      </Row>
    )
  }
}
