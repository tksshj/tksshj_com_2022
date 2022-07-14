<template>
  <div id="tc-canvas-container" class="tc-canvas-container" />
</template>

<script>
import * as P5 from 'p5'

export default {
  data() {
    return {
      p5: null,
      canvas: null,
      x: 0,
      y: 0,
      direction: true
    }
  },
  methods: {
    setupPage() {
      this.p5 = new P5((p5) => {
        this.p5 = p5
        p5.setup = this.setup
        p5.draw = this.draw
        p5.windowResized = this.windowResized
      }, 'tc-canvas-container')


    },
    setup() {
      let renderer = this.p5.createCanvas(1080, 1920, this.p5.WEBGL)
      this.canvas = renderer.canvas
      this.canvas.style.width = '100%'
      this.canvas.style.height = '100%'
      this.p5.background(255)
    },
    draw() {
      this.p5.push()
      this.p5.translate(-this.p5.width * 0.5, 0)

      if (this.direction) {
        this.x = this.x + Math.PI * 0.75
        this.y = Math.sin(this.x * 0.02 - Math.PI * 0.5) * this.p5.height * 0.5
        if (this.x > 1080 * 1.15) {
          this.direction = false
        }
      } else {
        this.x = this.x - Math.PI * 0.75
        this.y = Math.sin(this.x * 0.02 + Math.PI * 0.5) * this.p5.height * 0.5
        if (this.x < -1080 * 0.15) {
          this.direction = true
        }
      }

      this.p5.strokeWeight(0)
      this.p5.fill(100 + this.p5.random(156), 100 + this.p5.random(30), 100 + this.p5.random(128))

      this.p5.ellipse(this.x + this.p5.random(16), this.y + this.p5.random(16), 256 + this.p5.random(128), 128 + this.p5.random(128))
      this.p5.pop()
    },
    windowResized() {
      this.p5.resizeCanvas(1080, 1920)
      this.canvas.style.width = '100%'
      this.canvas.style.height = '100%'
    }
  },
  mounted() {
    this.setupPage()
  },
  beforeDestroy() {
    this.p5.remove()
  }
}
</script>

<style scoped lang="scss">
.tc-canvas-container {
  width: 100%;
}
</style>
