<template>
  <div id="tc-canvas-container" class="tc-canvas-container" />
</template>

<script>
import * as P5 from 'p5'
import TWEEN from '@tweenjs/tween.js'


export default {
  data() {
    return {
      height: 0,
      p5App: null,
      p5: null,
      squares: [],
      nHorizontalTiles: 0,
      rows: [],
      y: 0,
      canvas: null
    }
  },
  methods: {
    setupPage() {
      this.height = window.innerHeight * 4
      this.p5App = new P5(this.sketch, 'tc-canvas-container')
      this.setTween(0, false)
    },
    setTween(startY, inc) {
      const coords = { y: 0 }
      this.tween = new TWEEN.Tween(coords)
                            .to({ y: this.height }, 8 * 1000)
                            .easing(TWEEN.Easing.Linear.None)
                            .onUpdate(() => {
                              if (inc) {
                                this.y = coords.y
                              } else {
                                this.y = this.height - coords.y
                              }
                            })
                            .onComplete(() => {
                              this.setTween(coords.y, !inc)
                            })
                            .start()
    },
    position() {
      let h = window.innerHeight
      let y = this.y
      return {
        y: y,
        page: Math.floor(y / h),
        progress: (y % h) / h
      }
    },
    sketch(p5) {
      this.p5 = p5
      this.p5.setup = this.setup
      this.p5.draw = this.draw
      this.p5.windowResized = this.windowResized
    },
    setup() {
      let renderer = this.p5.createCanvas(1080, 1920, this.p5.WEBGL)
      this.canvas = renderer.canvas

      let nHorizontalTiles = 5
      let tileWidth = this.p5.windowWidth / nHorizontalTiles
      let nVerticalTiles = parseInt(this.p5.windowHeight / tileWidth) + 2
      this.nHorizontalTiles = nHorizontalTiles + 4

      for (let row = 0; row < nVerticalTiles + 1; row++) {
        for (let col = -1; col < this.nHorizontalTiles; col++) {
          this.squares.push({
            row: row,
            col: col,
            x: tileWidth * (col - this.nHorizontalTiles * 0.5),
            y: tileWidth * row - this.p5.windowHeight * 0.5,
            width: tileWidth,
            initialCol: col
          })
        }
      }
      for (let row = 0; row < nVerticalTiles + 1; row++) {
        this.rows.push({
          speed: this.p5.random(1.0, 10.0)
        })
      }
    },
    draw() {
      TWEEN.update()
      let position = this.position()
      this.p5.stroke(192)
      this.p5.strokeWeight(3)

      this.p5.rotate(Math.PI * -0.25)
      this.p5.translate(this.squares[0].width * - 0.25, this.squares[0].width * -0.25)

      for (let i = 0; i < this.squares.length; i++) {
        let square = this.squares[i]
        this.p5.push()

        let speed = this.rows[square.row].speed
        let x = square.col * square.width + square.width * (position.progress + position.page) * speed - this.p5.windowWidth * 0.5
        if (x < -1.0 * this.p5.windowWidth * 0.5 - square.width) {
          square.col = square.col + this.nHorizontalTiles
        }
        if (this.p5.windowWidth * 0.5 + square.width < x) {
          square.col = square.col - this.nHorizontalTiles
        }

        this.p5.translate(x, square.y - square.width)
        this.p5.fill(255 - square.initialCol * 4)
        this.p5.rotate(Math.PI * 2 * (position.progress + position.page))
        this.p5.circle(square.width, 0, square.width)

        this.p5.pop()
      }
    },
    windowResized() {
      console.log('resized')
      this.p5.resizeCanvas(this.p5.windowWidth, this.p5.windowHeight);
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
