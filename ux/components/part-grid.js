import * as parts from '../src/token-parts'
import styled from '@emotion/styled'
import { TokenShadow, Grid, GridItem, Label, TextCenter } from './styled'
import React from 'react'
import PartFilter from './part-filter'
import Unique from '../src/filter-unique'
import Union from '../src/filter-union'

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

const PartNewLabel = styled.div({
  position: 'absolute',
  top: '0',
  left: '50%',
  padding: '0.25em 0.75em',
  backgroundColor: '#D00',
  fontSize: '1.15em',
  color: 'white',
  transform: 'translate(-50%,0%)'
})

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

const partIds = Object.keys(parts).filter(x => x[0] !== '$')

const partsFromFilter = (filters) => {
  const filtered = []
  for (const f in filters) {
    if (filters[f]) filtered.push(f)
  }
  if (filtered.length === 0) {
    return partIds
  }
  let partids = partIds
  for (const filter of filtered) {
    const tagged = parts.$tags[filter]
    partids = partids.filter(Union(tagged))
  }
  return partids.filter(Unique)
}

export default class PartGrid extends React.PureComponent {
  constructor (props, context) {
    super(props, context)
    this.state = {
      filter: {},
      parts: partsFromFilter({})
    }
  }

  onFilterChange = (v) => this.setState({
    filter: v,
    parts: partsFromFilter(v)
  })

  render () {
    const { parts: active, disabled, onClick } = this.props
    const isActive = {}
    for (const p of active) {
      isActive[p.id] = true
    }
    const filtered = this.state.parts
    const children = []
    let visibleCount = 0
    const newParts = parts.$tags.new
    for (const part in parts) {
      if (part[0] === '$') continue
      const isVisible = filtered.indexOf(part) >= 0
      if (isVisible) visibleCount++
      const isNew = newParts && newParts.indexOf(part) >= 0
      const child = (
        <PartPreviewContainer
          key={part}
          visible={isVisible}
          disabled={!!isActive[part] || disabled}
          onClick={onClick.bind(null, part, parts.$defaults[part])}
        >
          <TokenShadow />
          <PartPreview
            viewBox='0 0 90 90'
            dangerouslySetInnerHTML={{ __html: parts[part](parts.$defaults[part].channels) }}
          />
          <PartPreviewLabel isVisible={!!isActive[part]}>Selected</PartPreviewLabel>
          {isNew && <PartNewLabel>New!</PartNewLabel>}
        </PartPreviewContainer>
      )

      if (isNew) {
        children.unshift(child)
      } else {
        children.push(child)
      }
    }
    return (
      <React.Fragment>
        <PartFilter value={this.state.filter} onChange={this.onFilterChange} />
        {visibleCount === 0 && (
          <TextCenter>
            <Label as='div'>No parts match the filter</Label>
          </TextCenter>
        )}
        <Grid>
          {children}
        </Grid>
      </React.Fragment>
    )
  }
}
