import Head from 'next/head'

const defaultLogo = 'http://tokens.dougrich.net/static/logo.svg'
const defaultDescription = 'Create your own tokens for tabletop games using a set of consistent parts and an intuitive editing experience.'

export default class AppHead extends React.PureComponent {
  renderTitle () {
    let { title } = this.props
    if (!title) {
      title = 'Token Builder'
    } else {
      title = title + ' | Token Builder'
    }

    return title
  }

  render () {
    const title = this.renderTitle()
    return (
      <Head>
        <title>{title}</title>
        <link href='https://fonts.googleapis.com/css?family=Open+Sans|Oswald:700&display=swap' rel='stylesheet' />
        {this.props.children}
        <meta name='viewport' content='width=device-width, maximum-scale=1.0' />
        <meta property='og:title' content={title} />
        <meta property='og:url' content={this.props.canonical} />
        <meta property='og:type' content='website' />
        <meta property='og:description' content={this.props.description || defaultDescription} />
        <meta property='og:image' content={this.props.image || defaultLogo} />
        <meta property='twitter:title' content={title} />
        <meta property='twitter:description' content={this.props.description || defaultDescription} />
        <meta property='twitter:image' content={this.props.image || defaultLogo} />
        <meta property='twitter:url' content={this.props.canonical} />
        <link rel='shortcut icon' type='image/png' href='/static/logo@150.png' />
      </Head>
    )
  }
}
