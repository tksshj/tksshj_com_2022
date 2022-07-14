import GlCommon from './GlCommon.js'


export default class GlDraw2022071401 {


  constructor(glContext) {
    this.gl = glContext
    this.program = null
    this.attrPosition = null
    this.attrUv = null
    this.positionBuffer = null
    this.uvBuffer = null

    this.unifResolution = null
  }


  setup() {
    this.setupShaders()
    this.setupBuffers()
  }


  setupShaders() {


    let vertexShaderSource = `
      attribute vec2 position;
      attribute vec2 uv;
      varying vec2 varyUv;

      void main(void) {
        gl_Position = vec4(position, 1.0, 1.0);
        varyUv = uv;
      }
    `


    /* let fragmentShaderSource = `
     *   precision mediump float;
     *   varying vec2 varyUv;

     *   void main(void) {
     *     gl_FragColor = vec4(1.0 - varyUv.x * 0.5, 1.0 - varyUv.x * 0.5, 1.0 - varyUv.x * 0.5, 1.0);
     *   }
     * ` */



    let fragmentShaderSource = `
      #ifdef GL_ES
      precision mediump float;
      #endif

      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      uniform float u_time;

      float random (in vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
      }

      // Based on Morgan McGuire @morgan3d
      // https://www.shadertoy.com/view/4dS3Wd
      float noise (in vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);

        // Four corners in 2D of a tile
        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));

        vec2 u = f * f * (3.0 - 2.0 * f);

        return mix(a, b, u.x) +
               (c - a)* u.y * (1.0 - u.x) +
               (d - b) * u.x * u.y;
      }

      #define OCTAVES 6
      float fbm (in vec2 st) {
        // Initial values
        float value = 0.0;
        float amplitude = .5;
        float frequency = 0.;
        //
        // Loop of octaves
        for (int i = 0; i < OCTAVES; i++) {
          value += amplitude * noise(st);
          st *= 2.;
          amplitude *= .5;
        }
        return value;
      }

      void main() {
        vec2 st = gl_FragCoord.xy/u_resolution.xy;
        st.x *= u_resolution.x/u_resolution.y;

        vec3 color = vec3(0.0);
        color += fbm(st*3.0);

        gl_FragColor = vec4(color,1.0);
      }
    `

    this.program = GlCommon.setupProgram(this.gl, vertexShaderSource, fragmentShaderSource)
    if (!this.program) {
      console.log('Faild to setup shaders')
      return
    }
    this.gl.useProgram(this.program)
    this.attrPosition = this.gl.getAttribLocation(this.program, 'position')
    this.attrUv = this.gl.getAttribLocation(this.program, 'uv')


    this.unifResolution = this.gl.getUniformLocation(this.program, 'u_resolution');
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


  draw(resolution) {
    console.log('draw')
    this.gl.useProgram(this.program)

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer)
    this.gl.vertexAttribPointer(this.attrPosition, 2, this.gl.FLOAT, false, 0, 0)
    this.gl.enableVertexAttribArray(this.attrPosition)

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.uvBuffer)
    this.gl.vertexAttribPointer(this.attrUv, 2, this.gl.FLOAT, false, 0, 0)
    this.gl.enableVertexAttribArray(this.attrUv)

    this.gl.uniform2f(this.unifResolution, resolution.width, resolution.height)

    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4)

    this.gl.useProgram(null)
  }


}
