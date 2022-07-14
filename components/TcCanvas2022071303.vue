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

      points: [],
      colW: 0,
      rowH: 0,
      maxR: 0,

      started: true,
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

      let nCols = 2
      let nRows = 4
      this.colW = 1080.0 / nCols
      this.rowH = 1920.0 / nRows
      this.maxR = Math.max(this.colW, this.rowH) * 0.5

      this.points = []
      for (let j = 0; j < nRows; j++) {
        for (let i = 0; i < nCols; i++) {
          this.points.push({
            x: this.colW * i, // + 0.5),
            y: this.rowH * j, // + 0.5)
            r: 0,
            a: 0
          })

        }
      }

      this.p5.frameRate(10)
    },
    setup() {
      let renderer = this.p5.createCanvas(1080, 1920, this.p5.WEBGL)
      this.canvas = renderer.canvas
      this.canvas.style.width = '100%'
      this.canvas.style.height = '100%'
      this.p5.background(255)
    },
    draw() {
      if (!this.started) {
        this.p5.clear()
        this.p5.background(255)
        return
      }
      for (let i = 0; i < this.points.length; i++) {

        let point = this.points[i]
        point.a = point.a + this.p5.random(20) * 0.001
        point.r = this.maxR + this.p5.random(this.maxR * 0.5)

        this.p5.push()
        this.p5.translate(point.x + this.colW * 0.5, point.y + this.rowH * 0.5)

        this.p5.translate(this.p5.width * -0.5, this.p5.height * -0.5)
        this.p5.rotate(point.a)
        this.p5.translate(this.maxR * 0.8 + this.p5.random(this.maxR * 0.2), 0)

        this.p5.strokeWeight(0)
        /* this.p5.point(0, 0) */


        this.p5.fill(100 + this.p5.random(156), 100 + this.p5.random(30), 100 + this.p5.random(128))
        /* this.p5.ellipse(0, 0, point.r, this.p5.random(100)) */
        this.p5.quad(0, 0,
                    -500 - this.p5.random(128), -500 - this.p5.random(128),
                     500 + this.p5.random(100), 5000 + this.p5.random(1000),
                     256 + this.p5.random(100), 256 + this.p5.random(1000))
        this.p5.pop()

      }
    },
    windowResized() {
      this.p5.resizeCanvas(this.p5.windowWidth, this.p5.windowHeight)
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
