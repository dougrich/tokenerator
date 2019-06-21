import { TextInput, TextInputUnderline, TextContainer } from './styled'

export default class Select extends React.PureComponent {
  renderOption = ({ value, label, disabled }, i) => {
    return (
      <option key={i} value={value} disabled={disabled}>
        {label}
      </option>
    )
  }
  render () {
    const {
      options,
      value,
      onChange,
      children
    } = this.props
    return (
      <TextContainer>
        <TextInput as='select' value={value} onChange={onChange}>
          {options.map(this.renderOption)}
          {children}
        </TextInput>
        <TextInputUnderline />
      </TextContainer>
    )
  }
}
