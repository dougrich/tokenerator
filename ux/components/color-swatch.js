import styled from '@emotion/styled'

export const ColorSwatchButton = styled.button(props => ({
  display: 'inline-block',
  width: '2em',
  height: '2em',
  padding: 0,
  margin: '0.5em',
  cursor: 'pointer',
  border: '1px solid gray',
  outline: props.active ? '2px dashed black' : undefined,
  '&:focus': {
    outline: `2px dashed ${props.theme.colors.accent}`
  }
}))

export const ColorSwatchContainer = styled.div({
  display: 'block',
  margin: '0 -0.5em'
})
