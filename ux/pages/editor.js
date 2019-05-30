import AppHead from '../components/head'
import Header from '../components/header';
import dynamic from 'next/dynamic'

const FullEditor = dynamic(
  () => import('../components/editor'),
  {
    loading: () => <p>Loading</p>
  })


export default class extends React.Component {
  render() {
    return (
      <React.Fragment>
        <AppHead title='Editor'/>
        <Header/>
        <FullEditor/>
      </React.Fragment>
    )
  }
}