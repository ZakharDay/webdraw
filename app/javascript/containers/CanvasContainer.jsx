import React, { Component } from 'react'
import { ActionCable } from 'react-actioncable-provider'

export default class CanvasContainer extends Component {
  constructor(props) {
    super(props)

    this.state = {
      painting: false,
      // canvas: '',
      points: this.props.points
    }

    this.renderCanvas = this.renderCanvas.bind(this)
    this.randColor = this.randColor.bind(this)

    this.handleMouseMove = this.handleMouseMove.bind(this)
    this.handleMouseDown = this.handleMouseDown.bind(this)
    this.handleMouseUp = this.handleMouseUp.bind(this)
    this.saveCanvas = this.saveCanvas.bind(this)

    this.handleReceivedCanvas = this.handleReceivedCanvas.bind(this)

    this.renderPoints = this.renderPoints.bind(this)
  }

  randColor() {
    var colors = [
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
    var rand = colors[Math.floor(Math.random() * colors.length)]

    document.getElementById('canvas').style.backgroundColor = rand
  }

  componentDidMount() {
    this.renderCanvas()
    this.randColor()
    this.renderPoints()
  }
  //
  // componentWillReceiveProps() {
  //   this.renderPoints()
  // }

  componentDidUpdate() {
    this.renderPoints()
  }

  // generateUUID() {
  //   let array = new Uint32Array(8)
  //   window.crypto.getRandomValues(array)
  //   let str = ''
  //   for (let i = 0; i < array.length; i++) {
  //     str += (i < 2 || i > 5 ? '' : '-') + array[i].toString(16).slice(-4)
  //   }
  //   return str
  // }

  savePointsFromResponce(data) {
    const { points } = this.props
    let syncpoints = []

    // var syncpoints = ([data] = data.push = [])

    syncpoints.forEach((syncpoint) => {
      points.push(data)
    })

    this.setState({
      points
    })
  }

  renderCanvas() {
    const canvas = document.getElementById('canvas')

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    canvas.addEventListener('mousedown', this.handleMouseDown)
    canvas.addEventListener('mouseup', this.handleMouseUp)
    canvas.addEventListener('mousemove', this.handleMouseMove)
    // canvas.addEventListener('mousemove', this.syncDrawing)

    // const id = this.generateUUID()
    //
    // let { canvases } = this.state
    //
    // canvases[id] = canvas
    // console.log(id)
    //
    // this.setState({
    //   canvas
    // })
  }

  renderPoints() {
    const ctx = canvas.getContext('2d')
    const { points } = this.state

    points.forEach((point) => {
      ctx.lineWidth = 3 * 2

      ctx.lineTo(point[0], point[1])
      ctx.stroke()

      ctx.beginPath()
      ctx.arc(point[0], point[1], 3, 0, Math.PI * 2)

      ctx.fill()

      ctx.beginPath()
      ctx.moveTo(point[0], point[1])
    })
  }

  handleMouseDown(e) {
    this.setState({
      painting: true
    })
  }

  handleMouseUp(e) {
    const ctx = canvas.getContext('2d')
    ctx.beginPath()

    this.setState({
      painting: false
    })
  }

  handleMouseMove(e) {
    const ctx = canvas.getContext('2d')

    if (this.state.painting) {
      console.log(e.clientX, e.clientY)
      ctx.lineWidth = 3 * 2

      ctx.lineTo(e.clientX, e.clientY)
      ctx.stroke()

      ctx.beginPath()
      ctx.arc(e.clientX, e.clientY, 3, 0, Math.PI * 2)

      ctx.fill()

      ctx.beginPath()
      ctx.moveTo(e.clientX, e.clientY)
    }

    let { points } = this.state
    points.push([e.clientX, e.clientY])
    // canvases.points.push([data])
    // data.push([e.clientX, e.clientY])

    this.setState({
      points
    })
  }

  saveCanvas() {
    const { points } = this.state

    fetch('http://localhost:3000/api/drawroom/sync', {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ points: points })
    })
      // .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data)
      })
      .catch((error) => {
        console.error('Error:', error)
      })
  }

  // syncDrawing(e, data) {
  //   const ctx = canvas.getContext('2d')
  //   console.log(data)
  //
  //   if (this.state.painting) {
  //     console.log(e.clientX, e.clientY)
  //     ctx.lineWidth = 3 * 2
  //
  //     ctx.lineTo(e.clientX, e.clientY)
  //     ctx.stroke()
  //
  //     ctx.beginPath()
  //     ctx.arc(e.clientX, e.clientY, 3, 0, Math.PI * 2)
  //
  //     let { canvases, points } = this.state
  //     canvases.points.push([data])
  //
  //     this.setState({
  //       canvases
  //     })
  //
  //     ctx.fill()
  //
  //     ctx.beginPath()
  //     ctx.moveTo(e.clientX, e.clientY)
  //   }
  // }

  handleReceivedCanvas(data) {
    console.log('cableisworking', data)

    data = JSON.parse(data)

    this.savePointsFromResponce(data)
  }

  render() {
    return (
      <div className="cover">
        {this.props.points}
        <ActionCable
          channel={{ channel: 'CanvasChannel' }}
          onReceived={this.handleReceivedCanvas}
        />
        <canvas id="canvas"></canvas>
        <button className="saveButn" onClick={this.saveCanvas}>
          Сохранить
        </button>
      </div>
    )
  }
}
