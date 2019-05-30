import Head from 'next/head'

export default class AppHead extends React.PureComponent {

  renderTitle() {
    let { title } = this.props
    if (!title) {
      title = 'Token Builder'
    } else {
      title = title + ' | Token Builder'
    }

    return (
      <title>{title}</title>
    )
  }

  render() {
    return (
      <Head>
        {this.renderTitle()}
        <link href="https://fonts.googleapis.com/css?family=Open+Sans|Oswald:700&display=swap" rel="stylesheet"></link>
      </Head>
    )
  }
}