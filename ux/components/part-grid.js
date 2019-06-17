import * as parts from '../src/token-parts'
import styled from '@emotion/styled'
import { TokenShadow } from './styled';
import withAttrs from '../src/with-attrs'

const PartGridContainer = styled.div({
  textAlign: 'center'
})

const PartPreviewContainer = styled.button({
  display: 'inline-block',
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
  }
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

export default class PartGrid extends React.PureComponent {
  render () {
    const children = []
    for (const part in parts) {
      if (part[0] === '$') continue
      children.push(
        <PartPreviewContainer
          key={children.length}
          onClick={this.props.onClick.bind(null, part, parts.$defaults[part])}
        >
          <TokenShadow/>
          <PartPreview
            viewBox='0 0 90 90'
            dangerouslySetInnerHTML={{ __html: parts[part](parts.$defaults[part].channels) }}
          />
        </PartPreviewContainer>
      )
    }
    return (
      <PartGridContainer>
        {children}
      </PartGridContainer>
    )
  }
}
