import React from 'react'

const KeyCodes = {
  Z: 90,
  Y: 89
}

export default class extends React.PureComponent {
  componentDidMount () {
    document.addEventListener('keydown', this.onKeyDown)
  }
  componentWillUnmount () {
    document.removeEventListener('keydown', this.onKeyDown)
  }
  executeCommand (e, fn) {
    if (e.ctrlKey && fn) {
      e.preventDefault()
      e.stopPropagation()
      fn()
    }
  }
  onKeyDown = (e) => {
    switch (e.keyCode) {
      case KeyCodes.Z:
        return this.executeCommand(e, this.props.onUndo)
      case KeyCodes.Y:
        return this.executeCommand(e, this.props.onRedo)
    }
  }
  render () {
    return null
  }
}
