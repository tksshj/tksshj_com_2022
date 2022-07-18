import GlCommon from './GlCommon.js'


export default class GlDraw {


  constructor(glContext, vertexShaderSource, fragmentShaderSource) {
    this.gl = glContext
    this.vertexShaderSource = vertexShaderSource
    this.fragmentShaderSource = fragmentShaderSource

    this.program = null
    this.attrPosition = null
    this.attrUv = null
    this.positionBuffer = null
    this.uvBuffer = null
    this.unifResolution = null
    this.unifTime = null
  }


  setup() {
    this.setupShaders()
    this.setupBuffers()
  }


  setupShaders() {
    this.program = GlCommon.setupProgram(this.gl, this.vertexShaderSource, this.fragmentShaderSource)
    if (!this.program) {
      console.log('Faild to setup shaders')
      return
    }
    this.gl.useProgram(this.program)
    this.attrPosition = this.gl.getAttribLocation(this.program, 'position')
    this.attrUv = this.gl.getAttribLocation(this.program, 'uv')
    this.unifResolution = this.gl.getUniformLocation(this.program, 'u_resolution');
    this.unifTime = this.gl.getUniformLocation(this.program, 'u_time');
  }


  setupBuffers() {
    let vertices = [ -1.0,  1.0,
                      1.0,  1.0,
                     -1.0, -1.0,
                      1.0, -1.0 ]
    this.positionBuffer = this.gl.createBuffer()
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer)
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW)

    let uv = [ 0.0, 1.0,
               1.0, 1.0,
               0.0, 0.0,
               1.0, 0.0 ]
    this.uvBuffer = this.gl.createBuffer()
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.uvBuffer)
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(uv), this.gl.STATIC_DRAW)
  }


  draw(params) {
    this.gl.useProgram(this.program)

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer)
    this.gl.vertexAttribPointer(this.attrPosition, 2, this.gl.FLOAT, false, 0, 0)
    this.gl.enableVertexAttribArray(this.attrPosition)

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.uvBuffer)
    this.gl.vertexAttribPointer(this.attrUv, 2, this.gl.FLOAT, false, 0, 0)
    this.gl.enableVertexAttribArray(this.attrUv)

    this.gl.uniform2f(this.unifResolution, params.width, params.height)
    this.gl.uniform1f(this.unifTime, params.timestamp)

    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4)

    this.gl.useProgram(null)
  }


}
