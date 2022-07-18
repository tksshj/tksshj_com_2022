<template>
  <div class="tc-page">
    <div class="tc-page-content" :style="contentStyle">
      <TcHeader>
        <h1>2022-07-18-01</h1>
        <TcRecorder ref="tcRecorder" @start-button-clicked="startButtonClicked" @stop-button-clicked="stopButtonClicked" />
      </TcHeader>
      <main>
        <TcGlCanvas ref="tcCanvas" :vertexShader="vertexShader" :fragmentShader="fragmentShader" />
      </main>
    </div>
  </div>
</template>

<script>
import VertexShader from 'raw-loader!../components/common.vert'
import FragmentShader from 'raw-loader!../components/2022071801.frag'

export default {
  data() {
    return {
      vertexShader: VertexShader,
      fragmentShader: FragmentShader,
      w: 0,
      h: 0
    }
  },
  computed: {
    contentStyle() {
      let mainH = this.h - 64
      let scale = Math.min(this.w / 1080.0, mainH / 1920.0)
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
      this.h = window.innerHeight
    },
    startButtonClicked() {
      this.$refs.tcRecorder.startRecording(this.$refs.tcCanvas.canvas, '2022-07-18-01.webm')
      setTimeout(() => {
        this.$refs.tcCanvas.started = true
      }, 1000)
    },
    stopButtonClicked() {
      this.$refs.tcRecorder.stopRecording()
    }
  },
  mounted() {
    window.addEventListener('resize', this.resize)
    this.resize()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resize)
  }
}
</script>

<style scoped lang="scss">
.tc-page {
  width: 100%;
  display: flex;
  justify-content: center;

  .tc-page-content {
    width: calc(100% - 32px);
    max-width: 1080px;

    main {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
