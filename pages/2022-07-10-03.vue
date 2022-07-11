<template>
  <div class="tc-page">
    <div class="tc-page-content">
      <TcHeader>
        <h1>tksshj.com / 2022-07-10-03</h1>
        <TcRecorder ref="tcRecorder" @start-button-clicked="startButtonClicked" @stop-button-clicked="stopButtonClicked" />
      </TcHeader>
      <main>
        <TcCanvas2022071003 ref="tcCanvas" />
      </main>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    startButtonClicked() {
      this.$refs.tcRecorder.startRecording(this.$refs.tcCanvas.canvas, '2022-07-10-03.webm')
    },
    stopButtonClicked() {
      this.$refs.tcRecorder.stopRecording()
    }
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
  }
}
</style>
