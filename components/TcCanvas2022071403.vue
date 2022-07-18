<template>
  <div class="tc-canvas-container">
    <canvas ref="tcCanvas" :style="canvasStyle"/>
  </div>
</template>

<script>
import GlDraw from './GlDraw.js'
import VertexShader from 'raw-loader!./common.vert'
import FragmentShader from 'raw-loader!./2022071403.frag'

export default {
  data() {
    return {
      w: 0,
      h: 0,
      canvas: null,
      glContext: null,
      glDraw: null,
      updated: 0
    }
  },
  computed: {
    canvasStyle() {
      let scale = Math.min(this.w / 1080.0, this.h / 1920.0)
      let w = 1080 * scale
      let h = 1920 * scale
      return {
        width: w + 'px',
        height: h + 'px'
      }
    }
  },
  methods: {
    resize() {
      this.w = window.innerWidth
      this.h = window.innerHeight - 64
    },
    setupPage() {
      this.canvas = this.$refs.tcCanvas
      this.canvas.width = 1080
      this.canvas.height = 1920
      this.glContext = this.$refs.tcCanvas.getContext('webgl2')

      this.glDraw = new GlDraw(this.glContext, VertexShader, FragmentShader)
      this.glDraw.setup()

      this.startDrawing()
    },
    startDrawing() {
      requestAnimationFrame(this.draw)
    },
    draw(timestamp) {
      if (timestamp - this.updated > 1000 / 30.0) {
        this.updated = timestamp

        this.glContext.clearColor(1.0, 1.0, 1.0, 1.0)
        this.glContext.clear(this.glContext.COLOR_BUFFER_BIT)

        this.glDraw.draw({ width: this.w, height: this.h })
      }
      requestAnimationFrame(this.draw)
    }
  },
  mounted() {
    window.addEventListener('resize', this.resize)
    this.resize()
    this.setupPage()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resize)
  }
}
</script>

<style scoped lang="scss">
.tc-canvas-container {
  width: 100%;
  max-height: calc(100vh - 64px);
  display: flex;
  justify-content: center;
  canvas {
    width: 100%;
    height: 100%;
    max-width: 100%;
    max-height: 100%;
    display: block;
    background-color: blue;
  }
}
</style>
