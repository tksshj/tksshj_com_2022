attribute vec2 position;
attribute vec2 uv;
varying vec2 varyUv;

void main(void) {
  gl_Position = vec4(position, 1.0, 1.0);
  varyUv = uv;
}
