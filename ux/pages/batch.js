import Page from '../components/page'
import AppHead from '../components/head'
import Header from '../components/header'
import { connect, Provider } from 'react-redux'
import styled from '@emotion/styled'
import createStore, { dispatchers } from '../src/batch-state-machine'
import { TextField, SelectField, RangeField, PixelField } from '../components/field'
import { NavigationLinkStyled, Action } from '../components/styled'

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
    const {
      label,
      count,
      id,
      disabled,
      onCountChange,
      onLabelChange
    } = this.props
    return (
      <BatchItemRow>
        <BatchItemPreview src={`/api/token/${id}.svg`}/>
        <BatchItemFields>
          <TextField
            type='number'
            disabled={disabled}
            max='9'
            min='1'
            value={count}
            label='Count'
            onChange={onCountChange}
          />
          <SelectField label='Symbol Type' value={label} onChange={onLabelChange} disabled={disabled} options={[
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
      disabled,
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
          disabled={disabled}
          value={type}
          onChange={onTypeChange}
        />
        {type === 'PDF' && (
          <TextField
            label='Document Title'
            disabled={disabled}
            value={name}
            onChange={onChange('name')}
          />
        )}
        {type === 'ZIP' && (
          <PixelField
            value={size}
            disabled={disabled}
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
            disabled={disabled}
            onChange={onChange('page')}
          />
        )}
      </div>
    )
  }
}

const ConnectedBatchItem = connect(
  ({ labels, count, status }, { id }) => ({
    id,
    disabled: status != null,
    label: labels[id] || '',
    count: count[id] || 1
  }),
  (dispatch, { id }) => ({
    onCountChange: (v) => dispatch(dispatchers.SET_COUNT(id, v)),
    onLabelChange: (v) => dispatch(dispatchers.SET_LABEL(id, v))
  })
)(BatchItem)

const ConnectedForm = connect(
  ({ type, options, status}) => ({
    type,
    disabled: status != null,
    ...options
  }),
  dispatch => ({
    onTypeChange: (v) => dispatch(dispatchers.SET_TYPE(v)),
    onChange: (key) => (v) => dispatch(dispatchers.SET_OPTION(key, v))
  })
)(BatchOptionFrom)

const ConnectedDownload = connect(
  ({ status }) => ({ status }),
  (dispatch, { ids }) => ({
    onClick: () => dispatch(dispatchers.DOWNLOAD(ids))
  }),
  ({ status }, { onClick }, { children }) => {
    if (status && status.state === 'done') {
      return {
        as: 'a',
        href: status.meta,
        children
      }
    }

    return {
      disabled: status != null,
      onClick,
      children
    }
  }
)(Action)

const StatusRow = styled.div({
  margin: '5em',
  textAlign: 'center'
})

const SubStatusRow = styled.div({
  margin: '1em'
})

const ConnectedStatus = connect(
  ({ status }) => ({ status })
)(({ status }) => {
  if (!status) return null

  const {
    state,
    meta
  } = status

  if (state === 'post') {
    return (
      <StatusRow>
        <SubStatusRow>
          Preparing your download...
        </SubStatusRow>
      </StatusRow>
    )
  }

  if (state === 'check') {
    return (
      <StatusRow>
        <SubStatusRow>
          Waiting for your download to be ready
        </SubStatusRow>
        <SubStatusRow>
          (check {meta})
        </SubStatusRow>
      </StatusRow>
    )
  }

  if (state === 'done') {
    return (
      <StatusRow>
        <SubStatusRow>
          Your download is ready and should start. If not, click download above.
        </SubStatusRow>
      </StatusRow>
    )
  }

  if (state === 'error') {
    return (
      <StatusRow>
        <SubStatusRow>
          An error has occured trying to get your download ready.
        </SubStatusRow>
        <SubStatusRow>
          {meta}
        </SubStatusRow>
      </StatusRow>
    )
  }
})

export default class Batch extends React.PureComponent {
  static getInitialProps(context) {
    return {
      ids: context.query.ids.split(' ')
    }
  }
  constructor(props, context) {
    super(props, context)
    this.store = createStore()
  }
  render () {
    const { ids, user } = this.props
    return (
      <Page title='Batch' store={this.store} user={user}>
        <BatchItemContainer>
          {ids.map((id) => <ConnectedBatchItem id={id} key={id} />)}
          <ConnectedForm/>
          <ActionRow>
            <ConnectedDownload ids={ids}>Download</ConnectedDownload>
          </ActionRow>
          <ConnectedStatus/>
        </BatchItemContainer>
      </Page>
    )
  }
}