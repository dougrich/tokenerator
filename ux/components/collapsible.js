import styled from '@emotion/styled'
import { Action } from './styled'

const CollapsibleContainer = styled.div({

})

const CollapsibleActionRow = styled.div(props => ({
  display: 'none',
  marginBottom: '1.5em',
  textAlign: 'center',
  [`@media (max-width: ${props.enabledWidth}px)`]: {
    display:'block'
  }
}))

const CollapsibleContent = styled.div(props => ({
  [`@media (max-width: ${props.enabledWidth}px)`]: {
    display: props.collapsed ? 'none' : 'block'
  }
}))

export default class extends React.PureComponent {
  constructor(props, context) {
    super(props, context)
    this.state = {
      collapsed: true
    }
  }

  onToggle = () => this.setState({ collapsed: !this.state.collapsed })

  render() {
    return (
      <CollapsibleContainer>
        <CollapsibleActionRow
          enabledWidth={this.props.enabledWidth}
        >
          <Action onClick={this.onToggle}>
          {this.state.collapsed ? 'Show' : 'Hide'} {this.props.label}
          </Action>
        </CollapsibleActionRow>
        <CollapsibleContent
          enabledWidth={this.props.enabledWidth}
          collapsed={this.state.collapsed}
        >
          {this.props.children}
        </CollapsibleContent>
      </CollapsibleContainer>
    )
  }
}