import React from 'react'
import ReactDOM from 'react-dom'
import CanvasContainer from '../containers/CanvasContainer'
import { ActionCableProvider } from 'react-actioncable-provider'

document.addEventListener('DOMContentLoaded', () => {
  let props = document.getElementById('root').dataset.props
  let testContent = JSON.parse(props)
  ReactDOM.render(
    <ActionCableProvider url="ws://localhost:3000/cable">
      <CanvasContainer points={testContent} />
    </ActionCableProvider>,
    document.body.appendChild(document.createElement('div'))
  )
})
