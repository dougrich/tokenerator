import Microsoft from '@dougrich/react-signin-microsoft/dist/dark'
import Google from '@dougrich/react-signin-google/dist/dark'
import styled from '@emotion/styled'
import { ModalContainer } from '../components/styled'

const SignInProvider = styled.div({
  display: 'block',
  textAlign: 'center',
  margin: '2em'
})

export default class extends React.PureComponent {
  render () {
    return (
      <ModalContainer>
        <SignInProvider>
          <Google as='a' href='/api/account/login/google'/>
        </SignInProvider>
        <SignInProvider>
          <Microsoft as='a' href='/api/account/login/microsoft'/>
        </SignInProvider>
      </ModalContainer>
    )
  }
}