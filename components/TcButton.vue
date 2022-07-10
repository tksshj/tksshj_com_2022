<template>
  <button @click="$emit('click', $event)">
    <div>
      <TcIcon>{{ icon }}</TcIcon>
    </div>
    <div class="tc-text">
      <slot />
    </div>
  </button>
</template>

<script>
export default {
  props: [
    'icon'
  ]
}
</script>

<style scoped lang="scss">
@import './_common.scss';

button {
  padding: 0 16px;
  background: white;
  border: solid 2px $tc-text-color;
  display: flex;
  justify-content: center;
  align-items: center;
  .tc-text {
    margin: 0 0 0 4px;
    padding: 8px 0;
    font-size: 16px;
  }
}
</style>
