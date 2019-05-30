import { tokenToSvg } from '../src/token'

export default class extends React.Component {
  render () {
    return (
      <div dangerouslySetInnerHTML={{ __html: tokenToSvg({ 'title': '', 'parts': [{ 'channels': { 'layer1': { 'color': '#f1d2d5' } }, 'id': 'basic-body' }, { 'channels': { 'shirt': { 'color': '#120606' } }, 'id': 'v-shirt' }, { 'channels': { 'hair': { 'color': '#0e0e0e' }, 'stubble': { 'color': '#840182' } }, 'id': 'partially-shaved' }], 'modified': 1558995146588, 'private': false, 'description': '', 'legacyid': 'be0q4sxa', 'user': null, 'id': 'uNsI3e6rw7' }, '') }} />
    )
  }
}
