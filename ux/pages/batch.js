import Page from '../components/page'
import AppHead from '../components/head'
import Header from '../components/header'
import { ColorSwatchButton } from '../components/color-swatch'
import { connect, Provider } from 'react-redux'
import styled from '@emotion/styled'
import createStore, { dispatchers, constants } from '../src/batch-state-machine'
import { TextField, SelectField, RadioSetField, PixelField } from '../components/field'
import { Action } from '../components/styled'
import { RadioOption } from '../components/radio'

const ActionRow = styled.div({
  width: '100%',
  display: 'flex',
  justifyContent: 'space-around'
})

const BatchItemContainer = styled.div({
  margin: 'auto',
  padding: '2em',
  maxWidth: '500px'
})

const BatchItemRow = styled.div({
  display: 'flex',
  marginBottom: '1em'
})

const BatchItemPreviewContainer = styled.div({
  flexShrink: '0',
  width: '8em',
  marginRight: '1em',
  textAlign: 'center'
})

const BatchItemPreview = styled.img({
  display: 'block',
  height: '8em',
  marginBottom: '1em'
})

const BatchItemFields = styled.div({
  display: 'block',
  width: '100%'
})

const TrimColors = [
  'D33',
  '3D3',
  '33D',
  '666',
  '999',
  'BBB',
  'E8A410',
  '10E89D',
  'B910E8',
  'CBE810',
  '222'
]

class BatchItem extends React.PureComponent {
  render () {
    const {
      label,
      count,
      id,
      trim,
      placeholder,
      placeholderName,
      disabled,
      onCountChange,
      onPlaceholderChange,
      onPlaceholderNameChange,
      onTrimChange,
      onLabelChange
    } = this.props
    const max = constants.maxCount[label || 'none']
    const isToken = !placeholder
    return (
      <BatchItemRow>
        <BatchItemPreviewContainer>
          <BatchItemPreview src={isToken ? `/api/token/${id}.svg` : `/api/placeholder/${placeholder}.svg?color=${trim || 'FFF'}&label=${encodeURIComponent(placeholderName || '')}`}/>
          
        </BatchItemPreviewContainer>
        <BatchItemFields>
          {isToken && <TextField
            type='number'
            disabled={disabled}
            max={max}
            min='1'
            value={count}
            label='Count'
            name={'count.' + id}
            onChange={onCountChange}
          />}
          {isToken && <SelectField label='Symbol Type' name={'symbol-type.' + id} value={label} onChange={onLabelChange} disabled={disabled} options={[
            { label: 'None', value: constants.LABEL_NONE },
            { label: 'Number', value: constants.LABEL_NUMBER },
            { label: 'Alphabet', value: constants.LABEL_ALPHABET },
          ]}/>}
          {!isToken && <SelectField label='Placeholder Type' name={'placeholder-type.' + id} value={placeholder} onChange={onPlaceholderChange} disabled={disabled} options={[
            { label: 'Hatched', value: 'hatched' },
            { label: 'Flat', value: 'flat' },
            { label: 'Single', value: 'direct' },
          ]}/>}
          {!isToken && <TextField
            disabled={disabled}
            maxLength={10}
            label='Placeholder'
            name={'placeholder.' + id}
            onChange={onPlaceholderNameChange}
          />}
          <RadioSetField
            label='Trim'
            name={'symbol-trim.' + id}
            value={trim}
            disabled={disabled}
            onChange={onTrimChange}
          >
            <RadioOption>
              <ColorSwatchButton style={{ background: '#FFF' }} as='span'/>
            </RadioOption>
            {TrimColors.map(value => (
              <RadioOption value={value}  key={value}>
                <ColorSwatchButton style={{ background: '#' + value }} as='span'/>
              </RadioOption>
            ))}
          </RadioSetField>
        </BatchItemFields>
      </BatchItemRow>
    )
  }
}

class BatchOptionForm extends React.PureComponent {
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
          name='format'
          options={[
            { label: 'File - Zip Archive', value: constants.FORMAT_ZIP },
            { label: 'File - PDF Document', value: constants.FORMAT_PDF },
          ]}
          disabled={disabled}
          value={type}
          onChange={onTypeChange}
        />
        {type === constants.FORMAT_PDF && (
          <TextField
            label='Document Title'
            name='title'
            maxLength={200}
            disabled={disabled}
            value={name}
            onChange={onChange('name')}
          />
        )}
        {type === constants.FORMAT_ZIP && (
          <PixelField
            value={size}
            name='pixels'
            disabled={disabled}
            onChange={onChange('size')}
          />
        )}
        {type === constants.FORMAT_PDF && (
          <SelectField
            label='Page Size'
            name='page-size'
            options={[
              { label: 'Letter', value: constants.PAGE_LETTER },
              { label: 'A4', value: constants.PAGE_A4 }
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

const ConnectedBatchItemList = connect(
  ({ tokens, status }) => ({
    ids: Object.keys(tokens),
    disabled: status != null
  }),
  (dispatch) => ({
    onAddPlaceholder: () => dispatch(dispatchers.ADD(Math.random().toString(), 'hatched'))
  })
)(({ ids, onAddPlaceholder, disabled }) => {
  return (
    <React.Fragment>
      {ids.map(id => <ConnectedBatchItem id={id} key={id} />)}
      <ActionRow>
        <Action disabled={disabled} as='button' onClick={onAddPlaceholder}>Add Placeholder</Action>
      </ActionRow>
    </React.Fragment>
  )
})

const ConnectedBatchItem = connect(
  ({ tokens, status }, { id }) => ({
    id,
    disabled: status != null,
    ...tokens[id]
  }),
  (dispatch, { id }) => ({
    onTrimChange: (v) => dispatch(dispatchers.SET_TRIM(id, v)),
    onCountChange: (v) => dispatch(dispatchers.SET_COUNT(id, v)),
    onLabelChange: (v) => dispatch(dispatchers.SET_LABEL(id, v)),
    onPlaceholderChange: (v) => dispatch(dispatchers.SET_PLACEHOLDER(id, v)),
    onPlaceholderNameChange: (v) => dispatch(dispatchers.SET_PLACEHOLDER_NAME(id, v))
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
)(BatchOptionForm)

const ConnectedDownload = connect(
  ({ status }) => ({ status }),
  (dispatch, { ids }) => ({
    onClick: () => dispatch(dispatchers.DOWNLOAD(ids))
  }),
  ({ status }, { onClick }, { children }) => {
    if (status && status.state === constants.STATE_DONE) {
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

  if (state === constants.STATE_POST) {
    return (
      <StatusRow>
        <SubStatusRow>
          Preparing your download...
        </SubStatusRow>
      </StatusRow>
    )
  }

  if (state === constants.STATE_CHECK) {
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

  if (state === constants.STATE_DONE) {
    return (
      <StatusRow>
        <SubStatusRow>
          Your download is ready and should start. If not, click download above.
        </SubStatusRow>
      </StatusRow>
    )
  }

  if (state === constants.STATE_ERROR) {
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

  return null
})

export default class Batch extends React.PureComponent {
  static getInitialProps(context) {
    return {
      ids: context.query.ids.split(' ')
    }
  }
  constructor(props, context) {
    super(props, context)
    this.store = createStore(props.ids)
  }
  render () {
    const { ids, user } = this.props
    return (
      <Page
        title='Batch'
        store={this.store}
        user={user}
        canonical={'https://tokens.dougrich.net/batch?ids=' + ids.join('+')}
      >
        <BatchItemContainer>
          <ConnectedBatchItemList/>
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