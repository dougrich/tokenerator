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
  backgroundColor: 'transparent',
  backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 90 90'><circle cx='45' cy='45' r='36' fill='%23ddd' /></svg>")`
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
