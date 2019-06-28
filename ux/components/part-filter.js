import { $tags } from '../src/token-parts'
import styled from '@emotion/styled'
import { Label } from './styled'

const friendly = {
  'new': 'New!'
}

const FilterContainer = styled.div({
  margin: 'auto',
  maxWidth: '32em',
  marginBottom: '2em',
  padding: '0em 2em',
  '@media print': {
    display: 'none'
  }
})

const FilterOptionSet = styled.div({
  display: 'flex',
  flexWrap: 'wrap'
})

const FilterOption = styled.div({
  width: '8em'
})

export default class PartFilter extends React.PureComponent {
  onChange = (e) => {
    const filter = e.target.value
    const { value, onChange } = this.props
    const next = {
      ...value,
      [filter]: !value[filter]
    }
    onChange(next)
  }
  render () {
    const tags = new Array($tags.$list.length)
    for (const tag of $tags.$list) {
      const child = (
        <FilterOption key={tag}>
          <input type='checkbox' value={tag} id={'filter.' + tag} onChange={this.onChange} />
          <label htmlFor={'filter.' + tag}>{friendly[tag] || tag}</label>
        </FilterOption>
      )
      if (tag === 'new') {
        tags.unshift(child)
      } else {
        tags.push(child)
      }
    }
    return (
      <FilterContainer>
        <Label>Filter</Label>
        <FilterOptionSet>
          {tags}
        </FilterOptionSet>
      </FilterContainer>
    )
  }
}
