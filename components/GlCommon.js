export default {


  setupProgram(glContext, vertexShaderSource, fragmentShaderSource) {
    let vertexShader = this.compileShader(glContext, glContext.VERTEX_SHADER, vertexShaderSource)
    let fragmentShader = this.compileShader(glContext, glContext.FRAGMENT_SHADER, fragmentShaderSource)
    let program = glContext.createProgram()
    glContext.attachShader(program, vertexShader)
    glContext.attachShader(program, fragmentShader)
    glContext.linkProgram(program)
    if (!glContext.getProgramParameter(program, glContext.LINK_STATUS)) {
      return null
    }
    return program
  },


  compileShader(glContext, type, shaderSource) {
    let shader = glContext.createShader(type)
    glContext.shaderSource(shader, shaderSource)
    glContext.compileShader(shader)
    if (!glContext.getShaderParameter(shader, glContext.COMPILE_STATUS)) {
      console.log(glContext.getShaderInfoLog(shader))
      glContext.deleteShader(shader)
      return null
    }
    return shader
  }


}
