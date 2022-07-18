<template>
  <div class="tc-recorder">
    <p v-if="recorder">{{ duration }} ms</p>
    <TcButton v-if="!recorder" icon="play_circle" @click="$emit('start-button-clicked')">REC</TcButton>
    <TcButton v-if="recorder" icon="stop_circle" @click="$emit('stop-button-clicked')">STOP</TcButton>
  </div>
</template>

<script>
export default {
  data() {
    return {
      recorder: null,
      intervalId: null,
      startedAt: null,
      duration: 0
    }
  },
  methods: {
    startRecording(canvas, filename) {
      let context = canvas.getContext('2d')
      let stream = canvas.captureStream()
      this.recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=h264' })

      let _this = this
      this.recorder.ondataavailable = function(e) {
        let blob = new Blob([e.data], { type: e.data.type });
        let url  = (window.URL || window.webkitURL).createObjectURL(blob)
        let link = document.createElement('a')
        document.body.appendChild(link)
        link.href = url
        link.download = filename
        link.click();
        (window.URL || window.webkitURL).revokeObjectURL(url)
        document.body.removeChild(link)

        _this.recorder = null
      }
      this.recorder.start()
      this.startedAt = Date.now()
      this.intervalId = setInterval(() => {
        if (this.startedAt) {
          this.duration = Date.now() - this.startedAt
        }
      }, 100)
    },
    stopRecording() {
      if (this.recorder) {
        this.recorder.stop()
      }
      if (this.intervalId) {
        clearInterval(this.intervalId)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.tc-recorder {
  display: flex;
  align-items: center;
  p {
    margin: 0 16px;
  }
}
</style>
