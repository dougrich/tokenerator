import { Global } from '@emotion/core'
import { ThemeProvider, withTheme } from 'emotion-theming'
import { Provider } from 'react-redux'
import AppHead from './head'
import Header from './header'

const theme = {
  colors: {
    accent: '#D00',
    background: 'white'
  },
  typography: {
    body: {
      fontFamily: "'Open Sans', sans-serif",
      fontSize: '1em',
      lineHeight: '1.5em'
    },
    subheader: {
      fontFamily: "'Open Sans', sans-serif",
      fontSize: '1em',
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      lineHeight: '1.2em'
    },
    header: {
      fontFamily: "'Oswald', sans-serif",
      textAlign: 'left',
      paddingBottom: '0.5em',
      borderBottom: '2px solid black'
    },
    title: {
      fontFamily: "'Oswald', sans-serif",
      textAlign: 'center',
      fontSize: '3em',
      lineHeight: '1.5em'
    }
  }
}

const GlobalStylesheet = withTheme(
  class extends React.PureComponent {
    render () {
      const theme = this.props.theme
      return (
        <Global styles={{
          body: [
            {
              background: theme.colors.background
            },
            theme.typography.body
          ]
        }} />
      )
    }
  }
)

export default class Page extends React.PureComponent {
  render () {
    let {
      children,
      store,
      title,
      user
    } = this.props

    if (store) {
      children = (
        <Provider store={store}>
          {children}
        </Provider>
      )
    }
    return (
      <ThemeProvider theme={theme}>
        <GlobalStylesheet />
        <AppHead title={title} />
        <Header user={user} />
        {children}
      </ThemeProvider>
    )
  }
}
