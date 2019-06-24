import Link from 'next/link'
import styled from '@emotion/styled'
import { GridItem } from './styled'

const TokenPreviewContainer = styled.div(props => [
  {
    position: 'relative',
    display: 'inline-block',
    verticalAlign: 'top',
    overflow: 'hidden',
    boxSizing: 'border-box',
    borderRadius: '1em',
    opacity: props.disabled ? 0.5 : 1,
    pointerEvents: props.disabled ? 'none' : undefined,
    transition: '200ms background-color',
    '&:hover, &:focus': {
      backgroundColor: '#efefef'
    },
    '&:focus': {
      outline: '2px dashed #d00'
    },
    '&:hover>div, &:focus>div': {
      transform: 'translate(-50%, 0%)',
      backgroundColor: 'rgba(0,0,0,0.75)'
    },
    '&:hover>img, &:focus>img': {
      transform: 'scale(0.95,0.95)'
    },
    '&:hover>button, &:focus>button': {
      opacity: 1,
      color: 'black',
      backgroundColor: 'white'
    }
  },
  GridItem
])

const TokenPreviewTitle = styled.div(props => [
  props.theme.typography.title,
  {
    position: 'absolute',
    pointerEvents: 'none',
    top: '50%',
    left: 0,
    width: '100%',
    color: 'white',
    backgroundColor: 'transparent',
    paddingLeft: '100%',
    fontSize: '1.25em',
    paddingTop: '0.125em',
    paddingBottom: '0.125em',
    transform: 'translate(0%, 0%)',
    transition: '200ms transform, 200ms background-color',
    display: 'none',
    '@media (min-width: 600px)': {
      display: 'block',
    },
    '@media (min-width: 1200px)': {
      display: 'block',
      fontSize: '2em'
    }
  }
])

const TokenPreviewImage = styled.img({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  transition: '200ms transform',
  transform: 'scale(0.9,0.9)',
  objectFit: 'contain'
})

const TokenPin = styled.button(props => [
  props.theme.typography.body,
  {
    position: 'absolute',
    top: '0em',
    right: '0em',
    padding: '0.5em',
    width: '20%',
    minWidth: '150px',
    maxWidth: '100%',
    textAlign: 'center',
    backgroundColor: props.pinned ? 'black!important' : 'transparent',
    color: props.pinned ? 'white!important' : 'black',
    opacity: props.pinned ? 1 : 0,
    border: '0.25em solid white',
    borderTopRightRadius: '1em',
    borderBottomLeftRadius: '1em',
    cursor: 'pointer',
    transition: '200ms background-color, 200ms color, 200ms opacity',
    display: 'none',
    '&:hover, &:focus': {
      opacity: 1,
      backgroundColor: '#D00!important',
      color: 'white!important'
    },
    '&:focus': {
      outline: '2px dashed #D00'
    },
    '@media (min-width: 600px)': {
      display: 'block',
    }
  }
])

export default class TokenPreview extends React.PureComponent {
  onClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const {
      id,
      isPinned,
      onPin,
      onUnpin
    } = this.props
    const handler = isPinned ? onUnpin : onPin
    handler(id)
  }
  render () {
    const { title, disabled, id, isPinned } = this.props
    return (
      <Link href={`/token?id=${id}`} as={`/token/${id}`} passHref={!disabled}>
        <TokenPreviewContainer as='a' disabled={disabled}>
          <TokenPreviewImage src={`/api/token/${id}.svg`} />
          <TokenPin pinned={isPinned} disabled={disabled} onClick={this.onClick}>
            {isPinned ? 'Pinned' : 'Pin'}
          </TokenPin>
          {title && (
            <TokenPreviewTitle>
              {title}
            </TokenPreviewTitle>
          )}
        </TokenPreviewContainer>
      </Link>
    )
  }
}
