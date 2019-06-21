import styled from '@emotion/styled'
import React from 'react'
import { Label, Action, ActionRow } from './styled'
import { ColorSwatchButton, ColorSwatchContainer } from './color-swatch'

const Container = styled.div({
  width: '100%',
  position: 'relative',
  padding: '0.5em',
  marginBottom: '2em'
})

const TokenPartContainer = styled.div({
  padding: '1em 0.5em',
  margin: '0em -0.5em',
  display: 'flex',
  '&+&': {
    borderTop: '1px solid #ccc'
  },
  '&>div': {
    width: '100%'
  }
})

class TokenPart extends React.Component {
  render () {
    const {
      index,
      id,
      channels,
      isAdvanced,
      isFirst,
      isLast,
      active,
      onClick,
      disabled,
      onSwap,
      onRemove
    } = this.props
    const children = []
    for (const fieldname in channels) {
      children.push(
        <ColorSwatchButton
          key={fieldname}
          style={{ background: channels[fieldname].color }}
          active={active && active.index === index && active.channel === fieldname}
          onClick={onClick.bind(null, index, fieldname)}
        />
      )
    }
    return (
      <TokenPartContainer>
        <div>
          <Label>{id}</Label>
          <ColorSwatchContainer>
            {children}
          </ColorSwatchContainer>
        </div>
        <ActionRow>
          {isAdvanced && (
            <React.Fragment>
              <Action
                disabled={disabled || isFirst}
                onClick={onSwap.bind(null, index, index + 1)}
              >
                Up
              </Action>
              <Action
                disabled={disabled || isLast}
                onClick={onSwap.bind(null, index, index - 1)}
              >
                Down
              </Action>
            </React.Fragment>
          )}
          <Action
            disabled={disabled}
            onClick={onRemove.bind(null, index)}>
            Remove
          </Action>
        </ActionRow>
      </TokenPartContainer>
    )
  }
}

export default class TokenParts extends React.Component {
  render () {
    const {
      parts,
      active,
      isAdvanced,
      onActivate,
      onRemove,
      onClear,
      onUndo,
      onRedo,
      onSwap,
      disabled,
      canClear,
      canUndo,
      canRedo
    } = this.props
    const children = []
    for (const part of parts) {
      children.push(
        <TokenPart
          key={part.id}
          isAdvanced={isAdvanced}
          isLast={children.length === 0}
          isFirst={children.length === parts.length - 1}
          index={children.length}
          active={active}
          disabled={disabled}
          onClick={onActivate}
          onRemove={onRemove}
          onSwap={onSwap}
          {...part}
        />
      )
    }
    children.reverse()
    return (
      <Container>
        <ActionRow>
          <Action onClick={onClear} disabled={disabled || !canClear}>Clear</Action>
          <Action onClick={onUndo} disabled={disabled || !canUndo}>Undo</Action>
          <Action onClick={onRedo} disabled={disabled || !canRedo}>Redo</Action>
        </ActionRow>
        {children}
      </Container>
    )
  }
}
