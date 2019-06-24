import Microsoft from '@dougrich/react-signin-microsoft/dist/dark'
import Google from '@dougrich/react-signin-google/dist/dark'
import styled from '@emotion/styled'
import { ModalContainer } from '../components/styled'
import Page from '../components/page'

const SignInProvider = styled.div({
  display: 'block',
  textAlign: 'center',
  margin: '2em'
})

export default class extends React.PureComponent {
  render () {
    return (
      <Page
        simple
        title='Sign in'
        canonical='https://tokens.dougrich.net/login'
      >
        <ModalContainer>
          <SignInProvider>
            <h3>Heads Up</h3>
            Before signing in, read through the <a href='/site' target='_blank'>privacy policy</a> and make sure you're okay with it.
          </SignInProvider>
          <SignInProvider>
            <Google as='a' href='/api/account/login/google'/>
          </SignInProvider>
          <SignInProvider>
            <Microsoft as='a' href='/api/account/login/microsoft'/>
          </SignInProvider>
        </ModalContainer>
      </Page>
    )
  }
}