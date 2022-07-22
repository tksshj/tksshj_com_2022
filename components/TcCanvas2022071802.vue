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
    },
    setup() {
      let renderer = this.p5.createCanvas(1080, 1920)
      this.canvas = renderer.canvas
      this.canvas.style.width = '100%'
      this.canvas.style.height = '100%'
      this.p5.background(255)
    },
    draw() {
      this.p5.push()

      this.p5.strokeWeight(5)
      this.p5.stroke(0)


      let a = 30
      let b = 20
      let u = this.p5.width / a
      let o = a < b ? 'vertical' : 'horizontal'
      let rect = { x: 0, y: 0, a: Math.max(a, b), b: Math.min(a, b), o: o }
      let i = 0


      this.p5.rect(rect.x * u, rect.y * u, rect.a * u, rect.b * u)

      while (true) {

        let n = Math.floor(rect.a / rect.b)
        let x = rect.x
        let y = rect.y
        for (let i = 0; i < n; i++) {
          this.p5.rect(x * u, y * u, rect.b * u, rect.b * u)
          if (rect.o === 'vertical') {
            y = y + rect.b
          } else {
            x = x + rect.b
          }
        }

        let remainder = rect.a % rect.b
        if (remainder === 0) {
          console.log(rect.b)
          break
        }

        rect.y = y
        rect.x = x
        rect.a = rect.b
        rect.b = remainder
        if (rect.o === 'vertical') {
          rect.o = 'horizontal'
        } else {
          rect.o = 'vertical'
        }
      }

      this.p5.pop()
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
