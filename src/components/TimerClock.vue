<script setup lang="ts">
  import { ref } from "vue"
  import { onMounted } from "vue"
  import { defineEmits } from "vue"
  import { defineExpose } from "vue"

  const seconds = ref<number>(0)
  let intervalId: number

  const emit = defineEmits(["stopped-timer"])

  function setTimer() {
    setInterval(() => {
      seconds.value++
    }, 1000)
  }
  onMounted(setTimer)

  function stopTimer(): void {
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = 0
      emit("stopped-timer", formatTime())
    }
  }

  function formatTime(): string {
    // Format the time in MM:SS by converting minutes to seconds so that for every 60 seconds add 1 to the minutes column in the timer
    const minutes: number = Math.floor(seconds.value / 60)
    const sec: number = seconds.value % 60
    return `${String(minutes).padStart(2, "0")}:${String(sec).padStart(2, "0")}`
  }

  // Expose the stopTimer and formatTime function to be used in the parent component
  defineExpose({ stopTimer, formatTime })
</script>

<template>
  <p data-cy="timer-string">{{ formatTime() }}</p>
</template>

<style scoped>
  p {
    text-align: center;
  }

  @media (max-width: 685px) {
    p {
      margin: 4px;
    }
  }
</style>
