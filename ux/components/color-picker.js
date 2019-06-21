import styled from '@emotion/styled'
import * as Color from 'color'
import * as colortest from 'hex-color-regex'
import Slider from './slider'
import { TextField } from './field'
import { Label, Row } from './styled'
import { ColorSwatchButton, ColorSwatchContainer } from './color-swatch'
import withAttr from '../src/with-attrs'
import React from 'react'

const ColorPickerContainer = styled.div({
  width: '100%',
  maxWidth: '300px',
  margin: 'auto'
})

const PickerRect = styled.rect({
  pointerEvents: 'none'
})

const PickerCircleOutline = withAttr({
  r: '0.5em'
})(
  styled.circle({
    pointerEvents: 'none',
    fill: 'transparent',
    stroke: 'white',
    strokeWidth: 5,
    mixBlendMode: 'difference'
  })
)

const PickerCircleFill = withAttr({
  r: '0.5em'
})(
  styled.circle({
    pointerEvents: 'none'
  })
)

const PickerCircle = ({ fill }) => (
  <React.Fragment>
    <PickerCircleOutline />
    <PickerCircleFill fill={fill} />
  </React.Fragment>
)

const step = {
  x: 0.01,
  y: 0.02
}

const generateHSLStop = (_, i, a) => {
  const p = i / (a.length - 1)
  return (
    <stop key={i} offset={`${Math.floor(p * 1000) / 10}%`} stopColor={Color.hsl(p * 360, 100, 50).hex().toString()} />
  )
}

const defIds = {
  h_w_t: {
    id: 'hwt',
    ref: 'url(#hwt)'
  },
  v_t_b: {
    id: 'vtb',
    ref: 'url(#vtb)'
  },
  c: {
    id: 'colors',
    ref: 'url(#colors)'
  }
}

const Swatches = [
  {
    name: 'Hair',
    set: [
      { name: 'Jet black', color: '#11110F' },
      { name: 'Black', color: '#2F272F' },
      { name: 'Brown', color: '#6F635B' }
    ]
  },
  {
    name: 'Skin',
    set: [
      { name: 'Pale', color: '#FCF0F0' },
      { name: 'Light', color: '#FCDEC4' },
      { name: 'Medium', color: '#E1C198' },
      { name: 'Brown', color: '#9F856B' },
      { name: 'Ashen', color: '#999' },
      { name: 'Dark', color: '#555' }
    ]
  }
]

class SaturationLightnessSlider extends React.PureComponent {
  toCoords (saturation, lightness) {
    const x = saturation / 100
    const l = lightness / 100
    return {
      x,
      y: 1 - l * (x * 2 + (1 - x))
    }
  }

  fromCoords (x, y) {
    const l = (1 - y) / (x * 2 + (1 - x))
    return {
      saturation: x * 100,
      lightness: l * 100
    }
  }

  onChange = ({ x, y }) => {
    const { saturation, lightness } = this.fromCoords(x, y)
    this.props.onChange(saturation, lightness)
  }

  render () {
    const {
      hue,
      saturation,
      lightness,
      color
    } = this.props
    const background = Color.hsl(hue, 100, 50).hex()
    //
    const { x, y } = this.toCoords(saturation, lightness)
    return (
      <Slider
        x={x}
        y={y}
        step={step}
        thumb={PickerCircle}
        disabled={this.props.disabled}
        thumbProps={{
          fill: color
        }}
        onChange={this.onChange}
        height='8em'
      >
        <PickerRect width='100%' height='100%' fill={background.toString()} />
        <PickerRect width='100%' height='100%' fill={defIds.h_w_t.ref} />
        <PickerRect width='100%' height='100%' fill={defIds.v_t_b.ref} />
      </Slider>
    )
  }
}

class HueSlider extends React.PureComponent {
  onChange = ({ x }) => {
    this.props.onChange(x * 359.99)
  }

  render () {
    const x = this.props.hue / 359.99
    return (
      <Slider
        x={x}
        y={0.5}
        step={step}
        thumb={PickerCircle}
        disabled={this.props.disabled}
        thumbProps={{
          fill: this.props.color
        }}
        onChange={this.onChange}
        height='1.2em'
      >
        <PickerRect width='100%' height='100%' fill={defIds.c.ref} />
      </Slider>
    )
  }
}

class ColorInput extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      value: null
    }
  }
  onFocus = () => {
    this.setState({ value: this.props.current })
  }
  onBlur = () => {
    this.setState({ value: null })
  }
  onChange = (value) => {
    this.setState({ value })
    if (colortest({ strict: true }).test(value)) {
      this.props.onChange(value)
    }
  }
  render () {
    const { current, disabled } = this.props
    const { value } = this.state
    return (
      <TextField
        type='text'
        value={value == null ? current : value}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        disabled={disabled}
        onChange={this.onChange}
        label='Hex'
      />
    )
  }
}

class ColorSwatch extends React.PureComponent {
  onClick = () => {
    const {
      onChange,
      color
    } = this.props
    onChange(Color(color))
  }

  render () {
    const {
      name,
      color,
      disabled
    } = this.props
    return (
      <ColorSwatchButton
        disabled={disabled}
        title={`${name} | ${color}`}
        style={{ background: color }}
        onClick={this.onClick}
      />
    )
  }
}

export default class ColorPicker extends React.Component {
  onHueChange = hue => {
    const { onChange, current } = this.props
    const next = current.hsl()
    next.color[0] = hue
    onChange(next)
  }
  onSaturationLightnessChange = (saturation, lightness) => {
    const { onChange, current } = this.props
    const next = current.hsl()
    next.color[1] = saturation
    next.color[2] = lightness
    onChange(next)
  }
  onInputChange = (hex) => {
    this.props.onChange(Color(hex))
  }
  render () {
    const { current, children, disabled } = this.props
    const [hue, saturation, lightness] = current.hsl().color
    const currentHex = current.hex().toString()
    return (
      <ColorPickerContainer disabled={disabled}>
        <Row disabled={disabled}>
          <Label>Saturation/Lightness</Label>
          <SaturationLightnessSlider
            hue={hue}
            saturation={saturation}
            color={currentHex}
            disabled={disabled}
            lightness={lightness}
            onChange={this.onSaturationLightnessChange}
          />
        </Row>
        <Row disabled={disabled}>
          <Label>Hue</Label>
          <HueSlider
            hue={hue}
            color={currentHex}
            onChange={this.onHueChange}
            disabled={disabled}
          />
        </Row>
        <ColorInput
          current={currentHex}
          onChange={this.onInputChange}
          disabled={disabled}
        />
        {
          Swatches.map(({ name, set }, i) => {
            return (
              <Row key={i} disabled={disabled}>
                <Label>{name}</Label>
                <ColorSwatchContainer>
                  {
                    set.map((props, i) => {
                      return (
                        <ColorSwatch
                          key={i}
                          disabled={disabled}
                          onChange={this.props.onChange}
                          {...props}
                        />
                      )
                    })
                  }
                </ColorSwatchContainer>
              </Row>
            )
          })
        }
        {children}
      </ColorPickerContainer>
    )
  }
}

ColorPicker.Defs = class extends React.Component {
  shouldComponentUpdate () { return false }
  render () {
    return [
      <linearGradient
        id={defIds.h_w_t.id}
        key={defIds.h_w_t.id}
      >
        <stop offset='0%' stopColor='white' stopOpacity='1' />
        <stop offset='100%' stopColor='white' stopOpacity='0' />
      </linearGradient>,
      <linearGradient
        id={defIds.v_t_b.id}
        key={defIds.v_t_b.id}
        gradientTransform='rotate(90)'
      >
        <stop offset='0%' stopColor='black' stopOpacity='0' />
        <stop offset='100%' stopColor='black' stopOpacity='1' />
      </linearGradient>,
      <linearGradient
        id={defIds.c.id}
        key={defIds.c.id}
      >
        {new Array(50).fill(0).map(generateHSLStop)}
      </linearGradient>
    ]
  }
}
