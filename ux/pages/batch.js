import Page from '../components/page'
import AppHead from '../components/head'
import Header from '../components/header'
import { connect, Provider } from 'react-redux'
import styled from '@emotion/styled'
import store, { dispatchers } from '../src/batch-state-machine'
import { TextField, SelectField, RangeField, PixelField } from '../components/field'
import { NavigationLinkStyled } from '../components/styled'

const ActionRow = styled.div({
  width: '100%',
  display: 'flex',
  justifyContent: 'space-around'
})

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
          <SelectField label='Symbol Type' value={label} onChange={onLabelChange} options={[
            { label: 'None', value: 'none' },
            { label: 'Number', value: 'number' },
            { label: 'Alphabet', value: 'alphabet' },
          ]}/>
        </BatchItemFields>
      </BatchItemRow>
    )
  }
}

class BatchOptionFrom extends React.PureComponent {
  render () {
    const {
      type,
      name,
      page,
      size,
      onTypeChange,
      onChange
    } = this.props

    return (
      <div>
        <SelectField
          label='Format'
          options={[
            { label: 'File - Zip Archive', value: 'ZIP' },
            { label: 'File - PDF Document', value: 'PDF' },
          ]}
          value={type}
          onChange={onTypeChange}
        />
        {type === 'PDF' && (
          <TextField
            label='Document Title'
            value={name}
            onChange={onChange('name')}
          />
        )}
        {type === 'ZIP' && (
          <PixelField
            value={size}
            onChange={onChange('size')}
          />
        )}
        {type === 'PDF' && (
          <SelectField
            label='Page Size'
            options={[
              { label: 'Letter', value: 'letter' },
              { label: 'A4', value: 'a4' }
            ]}
            value={page}
            onChange={onChange('page')}
          />
        )}
      </div>
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

const ConnectedForm = connect(
  (state) => ({
    type: state.type,
    ...state.options
  }),
  dispatch => ({
    onTypeChange: (e) => dispatch(dispatchers.SET_TYPE(e.target.value)),
    onChange: (key) => (e) => dispatch(dispatchers.SET_OPTION(key, e.target ? e.target.value : e))
  })
)(BatchOptionFrom)

const ConnectedDownload = connect(
  () => ({}),
  (dispatch, { ids }) => ({
    onClick: () => dispatch(dispatchers.DOWNLOAD(ids))
  })
)(NavigationLinkStyled)

export default class Batch extends React.PureComponent {
  static getInitialProps(context) {
    return {
      ids: context.query.ids.split(' ')
    }
  }
  render () {
    const { ids, user } = this.props
    return (
      <Page title='Batch' store={store} user={user}>
        <BatchItemContainer>
          {ids.map((id) => <ConnectedBatchItem id={id} key={id} />)}
          <ConnectedForm/>
          <ActionRow>
            <ConnectedDownload ids={ids}>Download</ConnectedDownload>
          </ActionRow>
        </BatchItemContainer>
      </Page>
    )
  }
}