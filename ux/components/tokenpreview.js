import Link from 'next/link'
import { TokenPreviewContainer, TokenPreviewTitle, TokenPreviewImage, DefaultText } from './styled'
import { DefaultTokenTitle } from '../src/constants'

export default class TokenPreview extends React.PureComponent {
  render () {
    const { title, id } = this.props
    return (
      <Link href={`/token?id=${id}`} as={`/token/${id}`} passHref>
        <TokenPreviewContainer as='a'>
          <TokenPreviewImage src={`/api/token/${id}.svg`} />
          {title
            ? (
              <TokenPreviewTitle>
                {title}
              </TokenPreviewTitle>
            )
            : (
              <TokenPreviewTitle>
                <DefaultText>
                  {DefaultTokenTitle}
                </DefaultText>
              </TokenPreviewTitle>
            )
          }
        </TokenPreviewContainer>
      </Link>
    )
  }
}
