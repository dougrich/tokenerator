import * as parts from '../src/token-parts'
import styled from '@emotion/styled'

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
  backgroundColor: 'transparent',
  transition: '200ms transform',
  backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 90 90'><circle cx='45' cy='45' r='36' fill='%23ddd' /></svg>")`,
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
  height: '100%'
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
