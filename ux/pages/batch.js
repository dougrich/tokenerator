import Page from '../components/page'
import AppHead from '../components/head'
import Header from '../components/header'
import { connect, Provider } from 'react-redux'
import styled from '@emotion/styled'
import store, { dispatchers } from '../src/batch-state-machine'
import { TextField } from '../components/field';

const BatchItemContainer = styled.div({
  margin: 'auto',
  maxWidth: '500px'
})

const BatchItemRow = styled.div({
  display: 'flex',
  marginBottom: '1em'
})

const BatchItemPreview = styled.img({
  display: 'block',
  flexShrink: '0',
  width: '8em',
  height: '8em',
  marginRight: '1em'
})

const BatchItemFields = styled.div({
  display: 'block',
  width: '100%'
})

class BatchItem extends React.PureComponent {
  render () {
    const { label, count, id, onCountChange, onLabelChange } = this.props
    return (
      <BatchItemRow>
        <BatchItemPreview src={`/api/token/${id}.svg`}/>
        <BatchItemFields>
          <TextField
            type='number'
            max='9'
            min='1'
            value={count}
            label='Count'
            onChange={onCountChange}
          />
          <select value={label} onChange={onLabelChange}>
            <option value='none'>None</option>
            <option value='number'>Number</option>
            <option value='alphabet'>Alphabet</option>
          </select>
        </BatchItemFields>
      </BatchItemRow>
    )
  }
}

const ConnectedBatchItem = connect(
  (state, { id }) => ({
    id,
    label: state.labels[id] || '',
    count: state.count[id] || 1
  }),
  (dispatch, { id }) => ({
    onCountChange: (e) => dispatch(dispatchers.SET_COUNT(id, e.target.value)),
    onLabelChange: (e) => dispatch(dispatchers.SET_LABEL(id, e.target.value))
  })
)(BatchItem)

const ConnectedType = connect(
  (state) => ({
    value: state.type
  }),
  dispatch => ({
    onChange: (e) => dispatch(dispatchers.SET_TYPE(e.target.value))
  })
)(({ value, onChange}) => (
  <select value={value} onChange={onChange}>
    <option value='ZIP'>ZIP</option>
    <option value='PDF'>PDF</option>
  </select>
))

const ConnectedDownload = connect(
  () => ({}),
  (dispatch, { ids }) => ({
    onClick: () => dispatch(dispatchers.DOWNLOAD(ids))
  })
)(styled.button({}))

export default class Batch extends React.PureComponent {
  static getInitialProps(context) {
    return {
      ids: context.query.ids.split(' ')
    }
  }
  render () {
    const { ids } = this.props
    return (
      <Page>
        <AppHead title='Batch' />
        <Header />
        <Provider store={store}>
          <BatchItemContainer>
            {ids.map((id) => <ConnectedBatchItem id={id} key={id} />)}
            <ConnectedType />
            <div>
              <ConnectedDownload ids={ids}>Download</ConnectedDownload>
            </div>
          </BatchItemContainer>
        </Provider>
      </Page>
    )
  }
}