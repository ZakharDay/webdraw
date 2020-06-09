import React, { Component } from 'react'
import { ActionCableConsumer } from 'react-actioncable-provider'

export default class CanvasContainer extends Component {
  constructor(props) {
    super(props)

    this.state = {
      painting: false,
      paintings: [this.props.points]
    }

    this.canvas = React.createRef()

    this.renderCanvas = this.renderCanvas.bind(this)
    this.randColor = this.randColor.bind(this)

    this.handleMouseMove = this.handleMouseMove.bind(this)
    this.handleMouseDown = this.handleMouseDown.bind(this)
    this.handleMouseUp = this.handleMouseUp.bind(this)
    this.saveCanvas = this.saveCanvas.bind(this)

    this.handleReceivedCanvas = this.handleReceivedCanvas.bind(this)

    this.renderPoints = this.renderPoints.bind(this)
  }

  componentDidMount() {
    this.renderCanvas()
    this.randColor()
    this.renderPoints()
  }

  componentDidUpdate() {
    this.renderPoints()
  }

  randColor() {
    let colors = [
      '#B2FF34',
      '#AB83FA',
      '#FF86C0',
      '#F385F5',
      '#61C6FF',
      '#FFBE35',
      '#FFEB3B',
      '#FF7697',
      '#31D0D8',
      '#78B6FF',
      '#FFFFFF',
      '#E4ABFF'
    ]

    const rand = colors[Math.floor(Math.random() * colors.length)]
    const canvas = this.canvas.current
    canvas.style.backgroundColor = rand
  }

  renderCanvas() {
    const canvas = this.canvas.current

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    canvas.addEventListener('mousedown', this.handleMouseDown)
    canvas.addEventListener('mouseup', this.handleMouseUp)
    canvas.addEventListener('mousemove', this.handleMouseMove)
  }

  renderPoints() {
    const canvas = this.canvas.current
    const ctx = canvas.getContext('2d')
    const { paintings } = this.state

    paintings.forEach((painting) => {
      let prevPoint = false

      painting.forEach((point) => {
        if (prevPoint) {
          ctx.lineWidth = 3 * 2
          ctx.beginPath()
          ctx.moveTo(prevPoint[0], prevPoint[1])
          ctx.lineTo(point[0], point[1])
          ctx.closePath()
          ctx.stroke()
        }

        prevPoint = point
      })
    })
  }

  handleMouseDown(e) {
    const { paintings } = this.state
    paintings.push([])

    this.setState({
      painting: true,
      paintings
    })
  }

  handleMouseUp(e) {
    this.saveCanvas()

    this.setState({
      painting: false
    })
  }

  handleMouseMove(e) {
    let { paintings, painting } = this.state

    if (painting) {
      paintings[paintings.length - 1].push([e.clientX, e.clientY])

      this.setState({
        paintings
      })
    }
  }

  saveCanvas() {
    const { paintings } = this.state

    fetch('http://localhost:3000/api/drawroom/sync', {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ points: paintings[paintings.length - 1] })
    })
      // .then((response) => response.json())
      .then((data) => {
        // console.log('Success:', data)
      })
      .catch((error) => {
        // console.error('Error:', error)
      })
  }

  handleReceivedCanvas(data) {
    // console.log('cableisworking', data)

    const { paintings } = this.state
    paintings.push(data)

    this.setState({
      paintings
    })
  }

  render() {
    return (
      <div className="cover">
        <ActionCableConsumer
          channel={{ channel: 'CanvasChannel' }}
          onReceived={this.handleReceivedCanvas}
        />
        <canvas ref={this.canvas}></canvas>
        <button className="saveButn" onClick={this.saveCanvas}>
          Сохранить
        </button>
      </div>
    )
  }
}
