<template>
  <div id="tc-canvas-container" class="tc-canvas-container" />
</template>

<script>
import * as P5 from 'p5'
import TWEEN from '@tweenjs/tween.js'

export default {
  data() {
    return {
      nPages: 10,
      height: 0,
      p5: null,
      canvas: null,
      tileWidth: 0,
      nHorizontalTiles: 0,
      nVerticalTiles: 0,
      y: 0
    }
  },
  methods: {
    setupPage() {
      console.log('setupPage')
      this.height = window.innerHeight * this.nPages
      this.p5 = new P5((p5) => {
        this.p5 = p5
        p5.setup = this.setup
        p5.draw = this.draw
        p5.windowResized = this.windowResized
      }, 'tc-canvas-container')
      this.setTween(0, true)
    },
    setTween(startY, inc) {
      let coords = { y: 0 }
      this.tween = new TWEEN.Tween(coords)
                            .to({ y: this.height }, 16 * 1000)
                            .easing(TWEEN.Easing.Linear.None)
                            .onUpdate(() => {
                              if (inc) {
                                this.y = startY + coords.y
                              } else {
                                this.y = startY - coords.y
                              }
                            })
                            .onComplete(() => {
                              if (inc) {
                                this.setTween(startY + coords.y, !inc)
                              } else {
                                this.setTween(startY - coords.y, !inc)
                              }
                            })
                            .start()
    },
    position() {
      let h = 1920
      let y = this.y
      return {
        page: Math.floor(y / h),
        progress: (y % h) / h
      }
    },
    setup() {
      let renderer = this.p5.createCanvas(1080, 1920, this.p5.WEBGL)
      this.canvas = renderer.canvas
      this.nHorizontalTiles = 7
      this.tileWidth = this.p5.windowWidth / this.nHorizontalTiles
      this.nHorizontalTiles = this.nHorizontalTiles + 4
      this.nVerticalTiles = parseInt(this.p5.windowHeight / this.tileWidth) + 5

      this.p5.frameRate(20)
      this.p5.background(255)
    },
    translateTile(page, progress, row, col) {
      this.p5.translate(this.tileWidth * (col - 2), this.tileWidth * (row - 2))
      if (row % 2 == page % 2) {
        if (col % 2 == page % 2) {
          this.p5.translate(this.tileWidth * progress, 0)
        } else {
          this.p5.translate(0, this.tileWidth * progress)
        }
      } else {
        if (col % 2 == page % 2) {
          this.p5.translate(0, this.tileWidth * progress * -1.0)
        } else {
          this.p5.translate(this.tileWidth * progress * -1.0, 0)
        }
      }
    },
    fillColor(page, row, col) {
      let pos = 0
      if (row % 2 == 0 && col % 2 == 0) {
        pos = 0
      } else if (row % 2 == 0 && col % 2 == 1) {
        pos = 3
      } else if (row % 2 == 1 && col % 2 == 0) {
        pos = 1
      } else {
        pos = 2
      }
      return 255 - ((pos + page) % 4) * 12
    },
    draw() {
      TWEEN.update()
      let position = this.position()
      let page = position.page
      let progress = position.progress

      this.p5.strokeWeight(2)
      this.p5.stroke(168)

      this.p5.rotate(Math.PI * (page + progress) * 0.01)
      for (let row = 0; row < this.nVerticalTiles; row++) {
        for (let col = 0; col < this.nHorizontalTiles; col++) {
          this.p5.push()
          this.p5.translate(this.p5.windowWidth * -0.5, this.p5.windowHeight * -0.5)
          this.translateTile(page, progress, row, col)
          this.p5.rotate(Math.PI * (page + progress) * 0.5)
          this.p5.fill(this.fillColor(page, row, col))
          this.p5.circle(this.tileWidth * this.p5.random(0.95, 1.05),
                         this.tileWidth * this.p5.random(0.95, 1.05),
                         this.tileWidth * (progress < 0.5 ? 1.0 - progress : progress))
          this.p5.pop()
        }
      }
    },
    windowResized() {
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
