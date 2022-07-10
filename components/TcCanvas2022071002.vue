<template>
  <div ref="tcAnimation" id="tc-animation" class="tc-animation" />
</template>

<script>
import * as P5 from 'p5'

export default {
  data() {
    return {
      p5App: null,
      p5: null,
      canvas: null,
      squares: []
    }
  },
  methods: {
    sketch(p5) {
      this.p5 = p5
      this.p5.setup = this.setup
      this.p5.draw = this.draw
      this.p5.windowResized = this.windowResized
    },
    setup() {
      let renderer = this.p5.createCanvas(1080, 1920)
      this.canvas = renderer.canvas
      this.reset()
    },
    reset() {
      let nHorizontalTiles = 5
      let tileWidth = 1080 / nHorizontalTiles
      let nVerticalTiles = parseInt(1920 / tileWidth) + 2
      this.squares.splice(0)
      for (let row = 0; row < nVerticalTiles; row++) {
        for (let col = 0; col < nHorizontalTiles + 2; col++) {
          this.squares.push({
            x: tileWidth * col,
            y: tileWidth * row,
            width: tileWidth,
            color: this.p5.random(32, 64),
            m: this.p5.random(10, 15)
          })
        }
      }
    },
    draw() {
      this.p5.clear()
      this.p5.background(216)
      this.p5.stroke(216)
      this.p5.strokeWeight(1)
      for (let i = 0; i < this.squares.length; i++) {
        let square = this.squares[i]
        let x = square.x
        let y = square.y
        this.p5.push()

        this.p5.translate(x, y)
        let color = square.color // + this.p5.random(-10, 10)
        square.color = Math.max(32, Math.min(64, color))

        let r = this.p5.frameCount / square.m
        let rx = Math.sin(r) * 10
        let ry = Math.cos(r) * 10

        for (let j = 0; j < 8; j++) {
          this.p5.fill(255 - color * 1.0 / 5 * j)
          this.p5.circle(rx, ry, square.width * (2.0 - 0.2 * j))
        }

        this.p5.pop()
      }
    },
    windowResized() {
      this.p5.resizeCanvas(this.$refs.tcAnimation.clientWidth, this.$refs.tcAnimation.clientHeight)
      this.reset()
    }
  },
  mounted() {
    this.p5App = new P5(this.sketch, 'tc-animation')
  },
  beforeDestroy() {
    this.p5.remove()
  }
}
</script>

<style scoped lang="scss">
.tc-animation {
  width: 100%;
}
</style>
