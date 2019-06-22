import * as parts from '../src/token-parts'
import styled from '@emotion/styled'
import { TokenShadow, Grid, GridItem } from './styled'
import { SelectField } from './field'
import React from 'react'

const PartPreviewContainer = styled.button(props => [
  GridItem,
  {
    display: props.visible ? 'inline-block' : 'none',
    width: '10em',
    height: '10em',
    border: 0,
    padding: 0,
    cursor: 'pointer',
    position: 'relative',
    backgroundColor: 'transparent',
    transition: '200ms transform',
    '&:hover, &:focus': {
      zIndex: 1,
      transform: 'scale(1.1, 1.1)'
    },
    '&:focus': {
      outline: '2px dashed #D00'
    },
    '&:active': {
      transition: '100ms transform',
      transform: 'scale(0.9, 0.9)'
    },
    ':disabled': {
      pointerEvents: 'none'
    },
    ':disabled svg': {
      opacity: 0.2
    }
  }
])

const PartPreviewLabel = styled.div(props => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  display: props.isVisible ? 'block' : 'none'
}))

const PartPreview = styled.svg({
  display: 'block',
  width: '100%',
  height: '100%',
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0
})

const FilterContainer = styled.div({
  maxWidth: '20em',
  margin: 'auto',
  marginBottom: '2em',
  padding: '0em 2em'
})

const PartFilterOptions = parts.$tags.$list.map(x => ({ value: x, label: x }))

export default class PartGrid extends React.PureComponent {
  constructor (props, context) {
    super(props, context)
    this.state = {
      filter: 'all'
    }
  }

  setFilter = (filter) => this.setState({ filter })

  render () {
    const { parts: active, disabled, onClick } = this.props
    const isActive = {}
    for (const p of active) {
      isActive[p.id] = true
    }
    const filtered = parts.$tags[this.state.filter]
    const children = []
    for (const part in parts) {
      if (part[0] === '$') continue
      children.push(
        <PartPreviewContainer
          key={children.length}
          visible={filtered.indexOf(part) >= 0}
          disabled={!!isActive[part] || disabled}
          onClick={onClick.bind(null, part, parts.$defaults[part])}
        >
          <TokenShadow />
          <PartPreview
            viewBox='0 0 90 90'
            dangerouslySetInnerHTML={{ __html: parts[part](parts.$defaults[part].channels) }}
          />
          <PartPreviewLabel isVisible={!!isActive[part]}>Selected</PartPreviewLabel>
        </PartPreviewContainer>
      )
    }
    return (
      <React.Fragment>
        <FilterContainer>
          <SelectField
            label='Filter Parts'
            disabled={disabled}
            value={this.state.filter}
            onChange={this.setFilter}
            options={PartFilterOptions}
          />
        </FilterContainer>
        <Grid>
          {children}
        </Grid>
      </React.Fragment>
    )
  }
}
