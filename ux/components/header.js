import {
  Container,
  Title,
  Navigation,
  ActionLink,
  Action
} from './styled'
import Collapsible from './collapsible'
import styled from '@emotion/styled'

// these are based on the marks stored in the static folder; inlined for performance
const mark = {
  email: `url("data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8' standalone='no'%3F%3E%3Csvg viewBox='0 0 90 90' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='45' cy='45' r='45' fill='%23999'/%3E%3Cpath d='M20,30L70,30L45,45L20,30L20,60L70,60L70,30' stroke='white' stroke-width='4' fill='none' stroke-linejoin='round'/%3E%3C/svg%3E")`,
  github: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' version='1.1' aria-hidden='true'%3E%3Cpath fill-rule='evenodd' d='M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z'%3E%3C/path%3E%3C/svg%3E")`,
  twitter: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Cdefs%3E%3Cstyle%3E.cls-1%7Bfill:%231da1f2;%7D.cls-2%7Bfill:%23fff;%7D.cls-3%7Bfill:none;%7D%3C/style%3E%3C/defs%3E%3Ctitle%3ETwitter_Logo_White-on-Blue%3C/title%3E%3Cg id='Dark_Blue' data-name='Dark Blue'%3E%3Ccircle class='cls-1' cx='200' cy='200' r='200'/%3E%3C/g%3E%3Cg id='Logo_FIXED' data-name='Logo — FIXED'%3E%3Cpath class='cls-2' d='M153.62,301.59c94.34,0,145.94-78.16,145.94-145.94,0-2.22,0-4.43-.15-6.63A104.36,104.36,0,0,0,325,122.47a102.38,102.38,0,0,1-29.46,8.07,51.47,51.47,0,0,0,22.55-28.37,102.79,102.79,0,0,1-32.57,12.45,51.34,51.34,0,0,0-87.41,46.78A145.62,145.62,0,0,1,92.4,107.81a51.33,51.33,0,0,0,15.88,68.47A50.91,50.91,0,0,1,85,169.86c0,.21,0,.43,0,.65a51.31,51.31,0,0,0,41.15,50.28,51.21,51.21,0,0,1-23.16.88,51.35,51.35,0,0,0,47.92,35.62,102.92,102.92,0,0,1-63.7,22A104.41,104.41,0,0,1,75,278.55a145.21,145.21,0,0,0,78.62,23'/%3E%3Ccircle class='cls-3' cx='200' cy='200' r='200'/%3E%3C/g%3E%3C/svg%3E")`
}

const Header = styled.header({
  borderBottom: '2px solid #333',
  margin: '0.5em 2em',
  position: 'relative',
  '@media print': {
    display: 'none'
  }
})

const Notice = styled.div({
  margin: 'auto',
  padding: '2em',
  textAlign: 'center',
  marginBottom: '1em'
})

const SocialLink = styled.a({
  width: '3em',
  height: '3em',
  margin: '0em 1em',
  display: 'inline-block',
  '&:focus': {
    outline: '2px dashed #D00'
  }
})

export default class extends React.PureComponent {
  onSignIn = () => {
    const newwindow = window.open('/login', 'Log In', 'height=600,width=800')
    if (window.focus) { newwindow.focus() }
  }
  onSignOut = () => {
    const newwindow = window.open('/api/account/logout', 'Log Out', 'height=600,width=800')
    if (window.focus) { newwindow.focus() }
  }
  render () {
    const {
      user,
      ...rest
    } = this.props
    return (
      <Header {...rest}>
        <Container>
          <Title>
              Token Builder
          </Title>
          <Collapsible enabledWidth={599} label='Menu'>
            <Navigation>
              <ActionLink href='/'>
                  Home
              </ActionLink>
              <ActionLink href='/browse'>
                  Browse
              </ActionLink>
              <ActionLink prefetch href='/editor'>
                  Editor
              </ActionLink>
              <ActionLink href='/site'>
                  Site
              </ActionLink>
              {user
                ? (
                  <Action as='button' onClick={this.onSignOut}>
                    Sign Out
                  </Action>
                )
                : (
                  <Action as='button' onClick={this.onSignIn}>
                    Sign In
                  </Action>
                )}
            </Navigation>
          </Collapsible>
          <Notice>
            <SocialLink style={{ background: mark.email }} title='Email' href='mailto:contact@dougrich.net' target='_blank' />
            <SocialLink style={{ background: mark.github }} title='Github' href='https://github.com/dougrich/tokenerator' target='_blank' />
            <SocialLink style={{ background: mark.twitter }} title='Twitter' href='https://twitter.com/tokenerator' target='_blank' />
          </Notice>
        </Container>
      </Header>
    )
  }
}
