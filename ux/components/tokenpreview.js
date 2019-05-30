import Link from 'next/link'
import { TokenPreviewContainer, TokenPreviewTitle, TokenPreviewImage, DefaultTokenPreviewTitle } from './styled'

export default class TokenPreview extends React.PureComponent {
  render () {
    const { title, id } = this.props
    return (
      <Link href={`/token?id=${id}`} as={`/token/${id}`} passHref>
        <TokenPreviewContainer as='a'>
          <TokenPreviewImage src={`/api/token/${id}.svg`} />
          {title
            ? (<TokenPreviewTitle>{title}</TokenPreviewTitle>)
            : (<TokenPreviewTitle><DefaultTokenPreviewTitle>Nameless Token</DefaultTokenPreviewTitle></TokenPreviewTitle>)
          }
        </TokenPreviewContainer>
      </Link>
    )
  }
}
