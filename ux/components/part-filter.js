import { $tags } from '../src/token-parts'
import styled from '@emotion/styled'
import { Label } from './styled'

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
    const tags = $tags.$list.map(x => (
      <FilterOption key={x}>
        <input type='checkbox' value={x} id={'filter.' + x} onChange={this.onChange} />
        <label htmlFor={'filter.' + x}>{x}</label>
      </FilterOption>
    ))
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
